(function(){
'use strict';
var T=window.THREE,C=window.RAFT_COLORS||[],N=C.length;
var host=document.getElementById('shelf'),stage=document.getElementById('stage'),inner=document.getElementById('shelfInner');
var api=window.RaftGL={ok:false,onState:null};
if(!T||!host||!stage||!inner)return;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var SPEED=reduce?0.25:1;
var renderer;
try{
 var tc=document.createElement('canvas');
 if(!(tc.getContext('webgl2')||tc.getContext('webgl')))return;
 renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 if(!renderer.getContext())return;
}catch(e){return;}
try{init();}catch(err){
 try{console.warn('raft init failed',err);renderer.dispose();}catch(e){}
 var cv=stage.querySelector('canvas');if(cv)cv.remove();
 api.ok=false;
}
function V(x,y){return new T.Vector2(x,y);}
function arc(cx,cy,r,a0,a1,n){var p=[];for(var i=0;i<=n;i++){var a=a0+(a1-a0)*i/n;p.push(V(cx+r*Math.cos(a),cy+r*Math.sin(a)));}return p;}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function init(){
if(T.ColorManagement)T.ColorManagement.legacyMode=false;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=T.sRGBEncoding;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
var cvs=renderer.domElement;cvs.setAttribute('role','img');cvs.setAttribute('aria-label','Raft cu cutii de vopsea din tablă. Atinge o cutie ca să o deschizi.');
stage.appendChild(cvs);
var scene=new T.Scene();
var cam=new T.PerspectiveCamera(30,1,0.1,120);
var TAN=Math.tan(15*Math.PI/180);

/* ---------- environment (studio softboxes) ---------- */
function makeEnv(){
 var es=new T.Scene();
 var gc=document.createElement('canvas');gc.width=4;gc.height=256;var g=gc.getContext('2d');
 var gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#7d848d');gr.addColorStop(.42,'#3a3e45');gr.addColorStop(.5,'#1c1e23');gr.addColorStop(1,'#07080a');
 g.fillStyle=gr;g.fillRect(0,0,4,256);
 var gt=new T.CanvasTexture(gc);gt.encoding=T.sRGBEncoding;es.add(new T.Mesh(new T.SphereGeometry(40,32,16),new T.MeshBasicMaterial({map:gt,side:T.BackSide})));
 function box(w,h,x,y,z,k,col){var m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(col).multiplyScalar(k),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m);}
 box(2.6,22,-14,3,9,7,'#fff3e2');
 box(2.0,22,15,3,7,6,'#e8f0ff');
 box(26,9,0,16,4,2.6,'#ffffff');
 box(6,16,5,3,20,2.2,'#ffffff');
 box(18,5,0,2,-22,3,'#ffffff');
 box(30,3,0,-8,14,1.0,'#ffe6cc');
 var pm=new T.PMREMGenerator(renderer);var rt=pm.fromScene(es,0.015);pm.dispose();return rt.texture;
}
scene.environment=makeEnv();

/* ---------- textures ---------- */
function cv2(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function streakTex(){
 var c=cv2(512,128),g=c.getContext('2d'),i;
 g.fillStyle='#d8d8d8';g.fillRect(0,0,512,128);
 for(i=0;i<512;i++){var v=170+Math.random()*70|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.globalAlpha=.55;g.fillRect(i,0,1+(Math.random()*2|0),128);}
 g.globalAlpha=1;
 for(i=0;i<14;i++){var x=Math.random()*512,w=20+Math.random()*60,gg=g.createLinearGradient(x,0,x+w,0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.5,'rgba(255,255,255,'+(.10+Math.random()*.15)+')');gg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gg;g.fillRect(x,0,w,128);}
 var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
}
function woodTex(){
 var c=cv2(1024,256),g=c.getContext('2d'),i;
 g.fillStyle='#5c4330';g.fillRect(0,0,1024,256);
 for(i=0;i<260;i++){var y=Math.random()*256,a=.05+Math.random()*.16;g.strokeStyle=(Math.random()<.5?'rgba(25,14,8,':'rgba(150,110,70,')+a+')';g.lineWidth=.6+Math.random()*1.6;g.beginPath();g.moveTo(0,y);
  for(var x=0;x<=1024;x+=64){g.lineTo(x,y+Math.sin(x*.012+i)*3+Math.random()*1.5);}g.stroke();}
 var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
}
function blobTex(){
 var c=cv2(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,6,64,64,62);
 gr.addColorStop(0,'rgba(0,0,0,.75)');gr.addColorStop(.55,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
 return new T.CanvasTexture(c);
}
function labelTex(name){
 var c=cv2(1024,512),g=c.getContext('2d');
 g.fillStyle='#000';g.fillRect(0,0,1024,512);
 g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';
 var fs=190;g.font='800 '+fs+'px "Arial Narrow","Helvetica Neue",Arial,sans-serif';
 if('letterSpacing' in g)g.letterSpacing='6px';
 var w=g.measureText(name).width;if(w>760){fs=Math.floor(fs*760/w);g.font='800 '+fs+'px "Arial Narrow","Helvetica Neue",Arial,sans-serif';}
 g.fillText(name,512,238);
 g.fillRect(150,92,724,6);g.fillRect(150,388,724,6);
 g.font='700 46px Arial,sans-serif';if('letterSpacing' in g)g.letterSpacing='18px';
 g.fillText('INTERCHIM',512,446);
 var t=new T.CanvasTexture(c);t.anisotropy=4;return t;
}

/* ---------- materials ---------- */
var streak=streakTex();
function steelMat(){return new T.MeshStandardMaterial({color:0xf1f4f7,metalness:1,roughness:.33,roughnessMap:streak,envMapIntensity:1.05,side:T.DoubleSide});}
var steelA=steelMat(),steelF=steelMat();steelF.envMapIntensity=1.1;
var wood=woodTex();var woodMat=new T.MeshStandardMaterial({map:wood,roughness:.62,metalness:0,envMapIntensity:.35});
var panelBase=new T.Color(0x24272d),panelMat=new T.MeshStandardMaterial({color:panelBase.clone(),roughness:.92,metalness:0,envMapIntensity:.18});
var plinthBase=new T.Color(0x3a3d44),plinthMat=new T.MeshStandardMaterial({color:plinthBase.clone(),roughness:.5,metalness:.35,envMapIntensity:.55});
var blobT=blobTex();

/* ---------- tin geometry ---------- */
var WT=1.16;
var bodyProf=[V(0,.012),V(.30,.012),V(.39,.012)].concat(arc(.43,.042,.03,-Math.PI/2,Math.PI/2,10));
bodyProf.push(V(.45,.088),V(.45,WT-.02),V(.452,WT-.01));
bodyProf=bodyProf.concat(arc(.44,WT+.015,.028,-.9,Math.PI+.2,18));
bodyProf.push(V(.405,WT-.03),V(.405,.08),V(0,.08));
var bodyGeo=new T.LatheGeometry(bodyProf,72);
var lidProf=[V(0,0),V(.20,0),V(.25,.012),V(.28,.04)];
for(var k=0;k<3;k++){var r0=.30+.034*k;lidProf.push(V(r0,.036),V(r0+.012,.056),V(r0+.024,.036));}
lidProf.push(V(.40,.05),V(.41,.063));
lidProf=lidProf.concat(arc(.44,.035,.04,2.27,-1.4,16));
lidProf.push(V(.452,-.012));
var lidGeo=new T.LatheGeometry(lidProf,72);
var labelTheta=2.0,labelGeo=new T.CylinderGeometry(.4515,.4515,.56,40,1,true,-labelTheta/2,labelTheta);
var blobGeo=new T.PlaneGeometry(1.5,1.5);blobGeo.rotateX(-Math.PI/2);
var ringGeo=new T.RingGeometry(.001,.403,56,12);ringGeo.rotateX(-Math.PI/2);
var ringPos=ringGeo.attributes.position,ringR=[];for(var q=0;q<ringPos.count;q++)ringR.push(Math.hypot(ringPos.getX(q),ringPos.getZ(q)));

/* ---------- shelf ---------- */
var COLS=7,ROWS=3,CW=1.5,RH=2.15,SW=COLS*CW+.36,SCENEW=SW+.3;
var shelfG=new T.Group();scene.add(shelfG);
function board(w,h,d,x,y,z){var m=new T.Mesh(new T.BoxGeometry(w,h,d),woodMat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;shelfG.add(m);return m;}
for(var r=0;r<ROWS;r++)board(SW,.14,1.8,0,r*RH-.07,0);
board(SW,.14,1.8,0,ROWS*RH-.07,0);
board(.18,ROWS*RH+.14,1.8,-SW/2+.09,(ROWS*RH-.14)/2,0);board(.18,ROWS*RH+.14,1.8,SW/2-.09,(ROWS*RH-.14)/2,0);
var panel=new T.Mesh(new T.PlaneGeometry(SW-.36,ROWS*RH-.14),panelMat);panel.position.set(0,(ROWS*RH-.14)/2,-.88);panel.receiveShadow=true;shelfG.add(panel);
wood.repeat.set(2,1);

var tins=[];
var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
for(var i=0;i<N;i++){
 var row=Math.floor(i/COLS),col=i%COLS;
 var g=new T.Group();
 var hx=(col-(COLS-1)/2)*CW+(rnd()-.5)*.08,hy=row*RH,hz=.06+(rnd()-.5)*.1,hry=(rnd()-.5)*.16;
 g.position.set(hx,hy,hz);g.rotation.y=hry;
 var body=new T.Mesh(bodyGeo,steelA);body.castShadow=true;body.receiveShadow=true;g.add(body);
 var lm=new T.MeshStandardMaterial({color:0x22252b,metalness:.8,roughness:.58,alphaMap:labelTex(C[i].n),transparent:true,depthWrite:false,envMapIntensity:.9,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 var label=new T.Mesh(labelGeo,lm);label.position.y=.62;g.add(label);
 var lid=new T.Group();lid.position.y=WT-.02;var lidMesh=new T.Mesh(lidGeo,steelA);lidMesh.castShadow=true;lidMesh.receiveShadow=true;lid.add(lidMesh);g.add(lid);
 var pm=new T.MeshPhysicalMaterial({color:new T.Color(C[i].h),roughness:.1,metalness:0,clearcoat:.45,clearcoatRoughness:.06,emissive:new T.Color(C[i].h),emissiveIntensity:.08,envMapIntensity:.38});
 var paint=new T.Mesh(ringGeo.clone(),pm);paint.position.y=WT-.035;paint.visible=false;g.add(paint);
 var blob=new T.Mesh(blobGeo,new T.MeshBasicMaterial({map:blobT,transparent:true,depthWrite:false,opacity:.6}));blob.position.y=.004;g.add(blob);
 g.userData={i:i,home:g.position.clone(),hry:hry};
 shelfG.add(g);
 tins.push({g:g,body:body,lid:lid,lidMesh:lidMesh,paint:paint,pm:pm,blob:blob,hover:0});
}
/* focus plinth */
var plinth=new T.Mesh(new T.CylinderGeometry(2.0,2.1,.14,64),plinthMat);plinth.receiveShadow=true;plinth.castShadow=true;plinth.visible=false;scene.add(plinth);

/* ---------- lights ---------- */
scene.add(new T.HemisphereLight(0xdfe8ff,0x2a2018,.32));
var key=new T.DirectionalLight(0xfff1dd,1.25);key.position.set(-5,10,10);key.target.position.set(0,3,0);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);var sc=key.shadow.camera;sc.left=-8;sc.right=8;sc.top=8;sc.bottom=-2;sc.near=1;sc.far=40;key.shadow.bias=-.0004;key.shadow.normalBias=.03;key.shadow.radius=3;
scene.add(key,key.target);
var sweep=new T.PointLight(0xfff0e0,.55,0,1);sweep.position.set(0,6,7);scene.add(sweep);
var focusL=new T.DirectionalLight(0xffffff,0);focusL.castShadow=true;focusL.shadow.mapSize.set(1024,1024);var fsc=focusL.shadow.camera;fsc.left=-4;fsc.right=4;fsc.top=4;fsc.bottom=-4;fsc.near=1;fsc.far=30;focusL.shadow.bias=-.0005;focusL.shadow.normalBias=.03;focusL.shadow.radius=4;
scene.add(focusL,focusL.target);

/* ---------- focus layout ---------- */
var S=1.6,FX=0,FY=1.0,FZ=4.4,LIDX=1.2;
var st={fp:0,lp:0,dim:0};
var sel=-1,busy=false,rip=0,rippling=false,wash=new T.Color(0x24272d);
var W=1,H=1,D0=14,visW=SCENEW,scrollMode=false,D1=10;

function layout(){
 var w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
 W=w;H=h;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h,false);
 cam.aspect=w/h;cam.updateProjectionMatrix();
 stage.style.width=w+'px';
 var a=w/h,fitH=7.3/(2*TAN),fitW=(SCENEW+.5)/(2*TAN*a);
 if(w<900){D0=fitH;visW=2*D0*TAN*a;scrollMode=visW<SCENEW-.2;}
 else{D0=Math.max(fitH,fitW);visW=2*D0*TAN*a;scrollMode=false;}
 inner.style.width=(scrollMode?Math.round(w*SCENEW/visW):w)+'px';
 var needW=w<900?5.2:5.0;
 D1=Math.max(needW/(2*TAN*a),4.6/(2*TAN));
 host.classList.toggle('scrollable',scrollMode);
}
var ro=window.ResizeObserver?new ResizeObserver(layout):null;if(ro)ro.observe(host);
window.addEventListener('resize',layout);layout();setTimeout(layout,120);setTimeout(layout,700);

/* ---------- tweens ---------- */
var tws=[];
function tween(o,k,to,dur,delay,cb){tws.push({o:o,k:k,a:o[k],b:to,d:Math.max(1,dur*SPEED),t0:performance.now()+delay*SPEED,cb:cb});}
function stepTweens(now){
 for(var i=tws.length-1;i>=0;i--){var w=tws[i];if(now<w.t0)continue;var p=clamp((now-w.t0)/w.d,0,1);w.o[w.k]=w.a+(w.b-w.a)*ease(p);
  if(p>=1){tws.splice(i,1);w.cb&&w.cb();}}
}
function emit(s,i){if(api.onState)api.onState(s,i);}

/* ---------- pick / close ---------- */
function pick(i,bgHex){
 if(busy||sel===i||i<0||i>=N)return false;
 if(sel>=0){close(function(){pick(i,bgHex);});return true;}
 sel=i;busy=true;var t=tins[i];
 t.body.material=steelF;t.lidMesh.material=steelF;
 wash.set(bgHex||'#1a1c21');
 tween(st,'fp',1,1050,0);tween(st,'dim',1,900,0);
 tween(st,'lp',1,1300,800,function(){busy=false;emit('open',i);});
 host.style.overflowX='hidden';rip=0;rippling=true;
 emit('opening',i);return true;
}
function close(cb){
 if(sel<0)return false;
 var i=sel;busy=true;rippling=false;emit('closing',i);tws=tws.filter(function(w){return w.o!==st;});
 tween(st,'lp',0,800,0);
 tween(st,'fp',0,1000,650,function(){
  var t=tins[i];t.body.material=steelA;t.lidMesh.material=steelA;t.paint.visible=false;sel=-1;busy=false;
  host.style.overflowX=scrollMode?'auto':'hidden';emit('closed',i);cb&&cb();});
 tween(st,'dim',0,900,650);
 return true;
}

/* ---------- raycast ---------- */
var ray=new T.Raycaster(),ndc=new T.Vector2();
function hitTin(cx,cy){
 var r=cvs.getBoundingClientRect();ndc.set(((cx-r.left)/r.width)*2-1,-((cy-r.top)/r.height)*2+1);ray.setFromCamera(ndc,cam);
 var objs=[];tins.forEach(function(t){objs.push(t.g);});
 var hs=ray.intersectObjects(objs,true);
 for(var k=0;k<hs.length;k++){var o=hs[k].object;if(o===plinth)continue;while(o&&!(o.userData&&o.userData.i!==undefined))o=o.parent;if(o)return o.userData.i;}
 return -1;
}
var downX=0,downY=0;
cvs.addEventListener('pointerdown',function(e){downX=e.clientX;downY=e.clientY;});
cvs.addEventListener('click',function(e){
 if(Math.abs(e.clientX-downX)>10||Math.abs(e.clientY-downY)>10)return;
 var i=hitTin(e.clientX,e.clientY);
 if(sel>=0){if(i!==sel&&!busy&&api.onBackground)api.onBackground();return;}
 if(i>=0&&api.onPick)api.onPick(i);
});
var hov=-1;
cvs.addEventListener('pointermove',function(e){
 if(e.pointerType!=='mouse'||sel>=0)return;
 var i=hitTin(e.clientX,e.clientY);if(i!==hov){hov=i;cvs.style.cursor=i>=0?'pointer':'default';}
});
cvs.addEventListener('pointerleave',function(){hov=-1;});
['wheel','gesturestart','gesturechange'].forEach(function(n){cvs.addEventListener(n,function(e){if(n==='wheel'){return;}e.preventDefault();},{passive:false});});

/* ---------- visibility ---------- */
var visible=true;if('IntersectionObserver' in window){new IntersectionObserver(function(en){visible=en[0].isIntersecting;},{threshold:0}).observe(host);}

/* ---------- loop ---------- */
var tgt=new T.Vector3(),tmpC=new T.Color(),camPos=new T.Vector3(),t0=performance.now(),lastPaint=0;
function frame(now){
 requestAnimationFrame(frame);
 if(!visible||document.hidden)return;
 stepTweens(now);
 var t=(now-t0)/1000;
 var fp=st.fp,lp=st.lp;
 /* camera */
 var sx=0;
 if(scrollMode){sx=-SCENEW/2+visW/2+host.scrollLeft*(visW/W);sx=clamp(sx,-SCENEW/2+visW/2,SCENEW/2-visW/2);}
 var ty=ROWS*RH/2,pit=.05,dist=D0;
 tgt.set(sx,ty,0);
 var fx=FX,fy=FY+.95,fz=FZ;
 var tx=tgt.x+(fx-tgt.x)*fp,tyy=tgt.y+(fy-tgt.y)*fp,tz=tgt.z+(fz-tgt.z)*fp;
 pit=pit+(.44-pit)*fp;dist=dist+(D1-dist)*fp;
 cam.position.set(tx,tyy+Math.sin(pit)*dist,tz+Math.cos(pit)*dist);cam.lookAt(tx,tyy,tz);
 /* lights */
 key.intensity=1.25*(1-.78*st.dim);sweep.intensity=.55*(1-.8*st.dim);
 if(!reduce)sweep.position.x=Math.sin(t*.35)*5.5;
 steelA.envMapIntensity=1.05*(1-.62*st.dim);woodMat.color.setScalar(1-.62*st.dim);
 tmpC.copy(panelBase).lerp(wash,.42*st.dim);panelMat.color.copy(tmpC).multiplyScalar(1-.3*st.dim);
 tmpC.copy(plinthBase).lerp(wash,.22);plinthMat.color.copy(tmpC);
 focusL.intensity=1.5*fp;
 /* hover */
 for(var i=0;i<N;i++){var tn=tins[i];var want=(i===hov&&sel<0)?.14:0;tn.hover+=(want-tn.hover)*.18;
  if(i!==sel){tn.g.position.y=tn.g.userData.home.y+tn.hover;}}
 /* selected tin */
 if(sel>=0){
  var tn2=tins[sel],hm=tn2.g.userData.home,e=fp;
  var bx=FX-1.0,by=FY,bz=FZ;
  tn2.g.position.set(hm.x+(bx-hm.x)*e,hm.y+(by-hm.y)*e+Math.sin(Math.PI*e)*.9,hm.z+(bz-hm.z)*e);
  tn2.g.scale.setScalar(1+(S-1)*e);
  tn2.g.rotation.y=tn2.g.userData.hry*(1-e);tn2.g.rotation.x=-.12*Math.sin(Math.PI*e);
  plinth.visible=fp>.02;plinth.position.set(FX,FY-.07,FZ);plinth.scale.set(.3+.7*fp,1,.3+.7*fp);
  focusL.position.set(FX-3,FY+7,FZ+5);focusL.target.position.set(FX,FY,FZ);
  /* lid */
  var a=clamp(lp/.35,0,1),b=clamp((lp-.25)/.75,0,1),ea=ease(a),eb=ease(b);
  var lid=tn2.lid;
  var bx2=ease(clamp(b/.75,0,1)),dy=clamp((b-.55)/.45,0,1);
  lid.position.x=LIDX*bx2;
  lid.position.y=Math.max(.03,(WT-.02+.55*ea)*(1-dy*dy)+.03*dy*dy);
  lid.rotation.z=-.55*Math.sin(Math.PI*b)*(1-.25*b)+.07*eb;
  lid.rotation.x=.18*Math.sin(Math.PI*b);
  /* paint */
  var pnt=tn2.paint;pnt.visible=lp>.08;
  pnt.position.y=WT-.30+.265*clamp((lp-.05)/.8,0,1);
  tn2.blob.scale.setScalar(1);
  if(rippling&&pnt.visible){
   rip+=1/60;var pos=pnt.geometry.attributes.position,amp=.022*Math.exp(-rip*.9)*clamp(lp*1.4,0,1);
   for(var q=0;q<pos.count;q++)pos.setY(q,Math.sin(ringR[q]*26-rip*8)*amp*Math.exp(-ringR[q]*2.2)+Math.sin(ringR[q]*9-rip*3)*amp*.4);
   pos.needsUpdate=true;pnt.geometry.computeVertexNormals();
  }
 }
 renderer.render(scene,cam);
}
requestAnimationFrame(frame);

api.ok=true;api.pick=pick;api.close=close;api.layout=layout;
api.isBusy=function(){return busy;};api.selected=function(){return sel;};
}
})();

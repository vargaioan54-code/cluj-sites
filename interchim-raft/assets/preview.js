(function(){
'use strict';
var C=window.RAFT_COLORS||[],sec=document.getElementById('previzualizare');
if(!sec||!C.length)return;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var mobMQ=window.matchMedia('(max-width:899px)');
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s));}
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function rgb2hex(a){return '#'+a.map(function(v){return ('0'+Math.max(0,Math.min(255,Math.round(v))).toString(16)).slice(-2);}).join('');}
function mix(a,b,t){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t]);}
function lum(h){var c=hex2rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function title(n){return n.charAt(0)+n.slice(1).toLowerCase();}
var FINN={gloss:'Lucios',metal:'Metalizat',pearl:'Perlat',matte:'Mat'};
var MODEN={car:'Pe mașină',wall:'Pe perete',wm:'Lemn și metal'};
var S={i:2,mode:'car',fin:{car:'gloss',wall:'matte',wm:'gloss'},fromTin:false,first:true};
var swBox=$('#pvSws'),sws=[];
C.forEach(function(c,i){
 var b=document.createElement('button');b.type='button';b.className='pvs';b.style.setProperty('--c',c.h);
 b.setAttribute('aria-label',title(c.n));b.setAttribute('aria-pressed','false');b.title=title(c.n);b.innerHTML='<i></i>';
 b.addEventListener('click',function(){setColor(i,false);});swBox.appendChild(b);sws.push(b);
});
var finBtns=$$('#pvFin button'),tabs=$$('.pvfig .tab'),mods=$$('.pvm',sec);
var cn=$('#pvCn'),nm=$('#pvNm'),hx=$('#pvHx'),src=$('#pvSrc'),swd=$('#pvSw');
var gl=null;/* set below */

function label(){cn.textContent=MODEN[S.mode]+' · '+title(C[S.i].n)+' · '+FINN[S.fin[S.mode]];}
function setColor(i,fromTin){
 var c=C[i],old=sec.style.getPropertyValue('--pc')||c.h;
 S.fromTin=!!fromTin;
 if(i===S.i&&!S.first){updSrc();return;}
 sec.style.setProperty('--pco',S.first?c.h:old);
 sec.style.setProperty('--pc',c.h);
 var dark=lum(c.h)<.06;sec.classList.toggle('pv-dark',dark);
 S.i=i;
 nm.textContent=title(c.n);hx.textContent=c.h.toUpperCase();swd.style.setProperty('--c',c.h);
 sws.forEach(function(b,k){b.setAttribute('aria-pressed',k===i?'true':'false');});
 updSrc();label();
 if(!S.first){
  var w=$('#pvWall');if(!reduce){w.classList.remove('sweep');void w.offsetWidth;w.classList.add('sweep');}
 }
 if(gl)gl.color(c.h,!S.first);
 S.first=false;
}
function updSrc(){src.textContent=S.fromTin?'Din raft: cutia '+title(C[S.i].n).toLowerCase()+'.':'Din listă. Poți atinge și o cutie de pe raft.';}
function setFinish(f){
 S.fin[S.mode]=f;sec.setAttribute('data-pv-fin',f);
 finBtns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-fin')===f?'true':'false');});
 label();if(gl)gl.finish(f);
}
function setMode(m){
 S.mode=m;sec.setAttribute('data-pv-mode',m);
 tabs.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-m')===m?'true':'false');});
 mods.forEach(function(e){e.classList.toggle('on',e.getAttribute('data-m')===m);});
 setFinish(S.fin[m]);
 if(m==='car'&&gl)gl.show();
}
tabs.forEach(function(b){b.addEventListener('click',function(){setMode(b.getAttribute('data-m'));});});
finBtns.forEach(function(b){b.addEventListener('click',function(){setFinish(b.getAttribute('data-fin'));});});
window.addEventListener('raft:pick',function(e){if(e.detail&&typeof e.detail.i==='number')setColor(e.detail.i,true);});

/* ---------- 3D car ---------- */
function hasGL(){try{var c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'));}catch(e){return false;}}
function initGL(){
 var T=window.THREE,Build=window.RaftCarBuild,box=$('#pvCar');
 if(!T||!Build||!hasGL()){box.classList.add('nogl');return null;}
 var ren;try{ren=new T.WebGLRenderer({antialias:!mobMQ.matches,alpha:true,powerPreference:'high-performance'});}catch(e){box.classList.add('nogl');return null;}
 try{ren.outputEncoding=T.sRGBEncoding;}catch(e){}
 ren.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 var cv=ren.domElement;cv.className='pvgl';cv.setAttribute('role','img');cv.setAttribute('aria-label','Mașină 3D vopsită în culoarea aleasă (model ilustrativ)');box.insertBefore(cv,box.firstChild);
 box.classList.add('gl');
 var IM=Build(T),Paint=IM.Paint;
 var sc=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,200);
 /* environment */
 try{var pm=new T.PMREMGenerator(ren),es=new T.Scene(),R=40,g=new T.SphereGeometry(R,32,20),pos=g.attributes.position,col=new Float32Array(pos.count*3);
  for(var i=0;i<pos.count;i++){var t=(pos.getY(i)/R+1)/2;var top=[.5,.57,.76],hz=[.30,.31,.40],bt=[.10,.10,.14];var a=t>.5?top:bt,k=t>.5?Math.pow((t-.5)*2,1.1):Math.pow(1-t*2,.8);for(var c=0;c<3;c++)col[i*3+c]=hz[c]+(a[c]-hz[c])*k;}
  g.setAttribute('color',new T.BufferAttribute(col,3));es.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
  var bx=function(w,h,x,y,z,k){var m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color().setRGB(k,k,k),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m);};
  bx(44,12,0,34,0,3.6);bx(40,3,0,16,-30,4.2);bx(40,3,0,13,30,3);bx(14,22,-34,10,0,1.8);bx(14,22,34,10,0,1.8);bx(3,26,-32,12,12,2.6);bx(3,26,32,12,-12,2.6);bx(30,2.4,30,5,-6,1.8);bx(30,2.4,-30,5,-6,1.8);
  var rt=pm.fromScene(es,.02);pm.dispose();sc.environment=rt.texture;}catch(e){}
 sc.add(new T.HemisphereLight(0xdfe6ff,0x140f2a,.3));
 var dl=new T.DirectionalLight(0xffffff,.6);dl.position.set(5,8,7);sc.add(dl);
 var rim=new T.PointLight(0xffffff,.9,60);rim.position.set(-8,4,-8);sc.add(rim);
 var acl=new T.PointLight(0xffffff,.5,50);acl.position.set(0,-1,9);sc.add(acl);
 var P=new T.Group(),G=new T.Group();sc.add(G);G.add(P);G.rotation.x=.2;
 var E=IM.car(mobMQ.matches?24:36);E.root.position.y=-.85;P.add(E.root);
 function uiOf(h){return mix(h,'#ffffff',lum(h)<.2?.45:.15);}
 var hex0=C[S.i].h;Paint.set(hex0,uiOf(hex0));Paint.setFinish(S.fin.car);Paint.snap();
 var sp={t:1},asp=1,TK=2*Math.tan(16*Math.PI/180);
 function size(){var r=box.getBoundingClientRect();if(!r.width||!r.height)return;ren.setPixelRatio(Math.min(window.devicePixelRatio||1,2));ren.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;asp=cam.aspect;cam.updateProjectionMatrix();need=true;}
 var need=true,vis=false,t=0,last=performance.now(),mx=0,tx=0,raf=0;
 if(window.ResizeObserver)new ResizeObserver(size).observe(box);else window.addEventListener('resize',size);
 size();setTimeout(size,300);
 window.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')tx=e.clientX/window.innerWidth-.5;},{passive:true});
 function frame(){
  raf=0;if(!vis||document.hidden||S.mode!=='car')return;
  var now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(!reduce)t+=dt;
  mx+=(tx-mx)*.05;
  Paint.step(dt,now);Paint.apply(E.paintMats);Paint.apply(E.glowMats);acl.color.copy(Paint.ui);
  P.rotation.y=-.62+(reduce?0:Math.sin(t*.32)*.5)+mx*.35;
  E.update(t,reduce?0:dt,{splash:sp});
  var W=10.4,H=6.2,dz=Math.max(H/TK,W/(TK*asp))*1.0;cam.position.set(0,0,dz);cam.lookAt(0,0,0);
  ren.render(sc,cam);
  need=false;
  if(!reduce||sp.t<1||!settled())raf=requestAnimationFrame(frame);
 }
 function settled(){var a=Paint.cur,b=Paint.tgt;return Math.abs(a.r-b.r)+Math.abs(a.g-b.g)+Math.abs(a.b-b.b)<.002;}
 function kick(){if(!raf&&vis)raf=requestAnimationFrame(function(){last=performance.now();frame();});}
 new IntersectionObserver(function(en){vis=en[0].isIntersecting;if(vis){last=performance.now();kick();}},{rootMargin:'80px'}).observe(box);
 document.addEventListener('visibilitychange',function(){if(!document.hidden)kick();});
 return{
  color:function(h,anim){Paint.set(h,uiOf(h));if(!anim||S.mode!=='car')Paint.snap();else if(!reduce)sp.t=0;need=true;kick();},
  finish:function(f){if(FINN[f]){Paint.setFinish(f);need=true;kick();}},
  show:function(){need=true;size();kick();}
 };
}
/* lazy: build the 3D car only when the block gets close */
var started=false;
function start(){if(started)return;started=true;gl=initGL();if(gl){gl.color(C[S.i].h,false);gl.finish(S.fin[S.mode]);}}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();start();}},{rootMargin:'400px'});io.observe($('#pvStage'));}else start();
window.RaftPreview={start:start,setColor:setColor,setMode:setMode,setFinish:setFinish,state:S};
setColor(S.i,false);setMode('car');
})();

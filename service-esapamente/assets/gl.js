(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,MOB=matchMedia('(max-width:899px)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let gl=false;try{const t=document.createElement('canvas');gl=!!(t.getContext('webgl')||t.getContext('experimental-webgl'))}catch(e){}
const sec=$('#toba');if(!gl||!window.THREE){sec.classList.add('fallback');return}
const TH=THREE;
(()=>{const host=$('#heat');const r=new TH.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});r.setPixelRatio(MOB?.75:1);r.setSize(host.clientWidth,host.clientHeight);host.appendChild(r.domElement);
 const sc=new TH.Scene(),cam=new TH.OrthographicCamera(-1,1,1,-1,0,1);
 const U={t:{value:0},res:{value:new TH.Vector2(host.clientWidth,host.clientHeight)},m:{value:new TH.Vector2(.75,.4)},rev:{value:0}};
 const mat=new TH.ShaderMaterial({uniforms:U,transparent:true,vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`precision mediump float;varying vec2 v;uniform float t,rev;uniform vec2 res,m;
 float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
 float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
 vec3 tint(float x){x=clamp(x,0.,1.);vec3 a=vec3(.89,.72,.42),b=vec3(.82,.34,.6),c=vec3(.48,.36,1.),d=vec3(.25,.7,1.);return x<.33?mix(a,b,x/.33):x<.66?mix(b,c,(x-.33)/.33):mix(c,d,(x-.66)/.34);}
 void main(){vec2 uv=v;float asp=res.x/res.y;vec2 p=vec2(uv.x*asp,uv.y);
  vec2 q=vec2(fb(p*2.+vec2(0.,-t*.5)),fb(p*2.+vec2(5.2,-t*.6)));
  float f=fb(p*1.6+q*1.8+vec2(0.,-t*.35));
  vec2 mm=vec2(m.x*asp,m.y);float g=exp(-distance(p,mm)*2.2)*(.6+rev*1.4);
  float band=f*.9+g*.8-.25+(1.-uv.y)*.12;
  vec3 col=tint(fract(f*1.3+t*.04+uv.x*.25))*smoothstep(.35,1.,band);
  float smoke=fb(p*3.+q*2.-vec2(0.,t*.8))*.16*(1.-uv.y);
  float a=clamp(smoothstep(.42,1.05,band)*.7+smoke,0.,.8);
  gl_FragColor=vec4(col+smoke*.6,a);}`});
 sc.add(new TH.Mesh(new TH.PlaneGeometry(2,2),mat));
 addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();U.m.value.set((e.clientX-b.left)/b.width,1-(e.clientY-b.top)/b.height)},{passive:true});
 addEventListener('resize',()=>{r.setSize(host.clientWidth,host.clientHeight);U.res.value.set(host.clientWidth,host.clientHeight)});
 let vis=true,run=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!run)loop()}).observe(host);
 const t0=performance.now();function loop(){if(!vis){run=false;return}run=true;U.t.value=RM?3:(performance.now()-t0)/1000;window.__rev=(window.__rev||0)*.96;U.rev.value=window.__rev;r.render(sc,cam);if(!RM)requestAnimationFrame(loop);else run=false}loop();
})();
const stage=$('#stage'),W=()=>stage.clientWidth,H=()=>stage.clientHeight;
const ren=new TH.WebGLRenderer({antialias:!MOB,alpha:true,powerPreference:'low-power'});ren.setPixelRatio(Math.min(devicePixelRatio,MOB?1.25:1.75));ren.setSize(W(),H());stage.appendChild(ren.domElement);
const sc=new TH.Scene();const cam=new TH.PerspectiveCamera(34,W()/H(),.1,100);
sc.add(new TH.HemisphereLight(0xdfe6ff,0x120a1c,.6));const kl=new TH.DirectionalLight(0xffffff,1.4);kl.position.set(3,5,4);sc.add(kl);
const l1=new TH.PointLight(0x7b5cff,2.4,18);l1.position.set(-4,1.5,3);sc.add(l1);const l2=new TH.PointLight(0xe2b86a,1.6,14);l2.position.set(4,-1,3);sc.add(l2);const l3=new TH.PointLight(0x3fb2ff,1.8,14);l3.position.set(0,3,-4);sc.add(l3);
function heatCols(geo,x0,x1,pw){const p=geo.attributes.position,c=[];const A=[[.81,.83,.87],[.89,.72,.42],[.82,.34,.6],[.48,.36,1],[.25,.7,1]];for(let i=0;i<p.count;i++){let x=(p.getX(i)-x0)/(x1-x0);x=Math.min(1,Math.max(0,x));x=Math.pow(x,pw||1)*(A.length-1);const j=Math.min(A.length-2,Math.floor(x)),f=x-j;c.push(...A[j].map((v,k)=>v+(A[j+1][k]-v)*f))}geo.setAttribute('color',new TH.Float32BufferAttribute(c,3))}
const chrome=new TH.MeshStandardMaterial({color:0xd8dde6,metalness:.8,roughness:.25});
const tintM=new TH.MeshStandardMaterial({vertexColors:true,metalness:.7,roughness:.28});
const dark=new TH.MeshStandardMaterial({color:0x34343f,metalness:.6,roughness:.5});
const edge=new TH.LineBasicMaterial({color:0x8f7dff,transparent:true,opacity:.22});
const ex=new TH.Group();sc.add(ex);const parts=[];
function add(mesh,off){const g=new TH.Group();g.add(mesh);const e=new TH.LineSegments(new TH.EdgesGeometry(mesh.geometry,30),edge);e.position.copy(mesh.position);e.rotation.copy(mesh.rotation);e.scale.copy(mesh.scale);g.add(e);g.userData={o:new TH.Vector3(...off),r:Math.random()*.6-.3};ex.add(g);parts.push(g);return g}
const c1=new TH.CatmullRomCurve3([new TH.Vector3(-4.6,1.2,0),new TH.Vector3(-4.1,.4,0),new TH.Vector3(-3.4,0,0),new TH.Vector3(-2.6,0,0)]);
const g1=new TH.TubeGeometry(c1,40,.16,20);heatCols(g1,-4.6,-2.6,1);add(new TH.Mesh(g1,tintM),[-.8,1.2,0]);
const gc=new TH.CylinderGeometry(.42,.42,1.2,32,4);gc.rotateZ(Math.PI/2);const cat=new TH.Mesh(gc,chrome);cat.position.set(-2,0,0);cat.scale.set(1,1,.8);add(cat,[0,1.6,.6]);
for(const s of[-1,1]){const gcc=new TH.CylinderGeometry(s<0?.16:.42,s<0?.42:.16,.3,32,1,true);gcc.rotateZ(Math.PI/2);const cc=new TH.Mesh(gcc,chrome);cc.position.set(-2+s*.75,0,0);add(cc,[s*.4,1.6,.6])}
for(let i=0;i<7;i++){const t=new TH.Mesh(new TH.TorusGeometry(.2,.05,8,24),dark);t.rotation.y=Math.PI/2;t.position.set(-1.25+i*.11,0,0);add(t,[0,-.6-i*.12,1.4])}
const gp=new TH.CylinderGeometry(.16,.16,1.6,20);gp.rotateZ(Math.PI/2);gp.translate(.1,0,0);heatCols(gp,-.7,.9,1);add(new TH.Mesh(gp,tintM),[0,-1.4,0]);
const gm=new TH.CylinderGeometry(.62,.62,2.2,40,6);gm.rotateZ(Math.PI/2);const muf=new TH.Mesh(gm,chrome);muf.position.set(2,0,0);muf.scale.set(1,.72,1.15);add(muf,[0,1.8,-.4]);
for(const s of[-1,1]){const cap=new TH.Mesh(new TH.TorusGeometry(.62,.05,10,40),dark);cap.rotation.y=Math.PI/2;cap.position.set(2+s*1.1,0,0);cap.scale.set(1.15,.72,1);add(cap,[s*.9,1.8,-.4])}
const c2=new TH.CatmullRomCurve3([new TH.Vector3(3.1,0,0),new TH.Vector3(3.6,-.05,0),new TH.Vector3(4.1,-.25,0),new TH.Vector3(4.6,-.3,0)]);
const g2=new TH.TubeGeometry(c2,30,.16,20);heatCols(g2,3.1,4.6,1);add(new TH.Mesh(g2,tintM),[1.2,-.9,0]);
const gt=new TH.CylinderGeometry(.3,.26,.9,40,8,true);gt.rotateZ(Math.PI/2);gt.translate(5.0,-.3,0);heatCols(gt,4.55,5.45,.7);const tipM=new TH.MeshStandardMaterial({vertexColors:true,metalness:.75,roughness:.2,side:TH.DoubleSide});add(new TH.Mesh(gt,tipM),[2.2,-.6,0]);
for(const x of[-3,.1,3.4]){const hm=new TH.Mesh(new TH.CylinderGeometry(.035,.035,.8,8),dark);hm.position.set(x,.5,0);add(hm,[0,2.6,0])}
const N=MOB?120:220,pg=new TH.BufferGeometry(),pa=new Float32Array(N*3),life=new Float32Array(N);for(let i=0;i<N;i++)life[i]=Math.random();
pg.setAttribute('position',new TH.BufferAttribute(pa,3));
const sm=new TH.PointsMaterial({color:0xb9bfd6,size:MOB?.35:.3,transparent:true,opacity:.15,depthWrite:false,blending:TH.AdditiveBlending});ex.add(new TH.Points(pg,sm));
const grid=new TH.GridHelper(30,30,0x4b3fa0,0x1a1a28);grid.position.y=-1.8;grid.material.transparent=true;grid.material.opacity=.35;sc.add(grid);
let uy=0,up=0,zoom=1,drag=null,pin=0,p=0,vis=false,run=false;const el=ren.domElement,ptr=new Map();
el.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);try{el.setPointerCapture(e.pointerId)}catch(_){}drag=[e.clientX,e.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){const [a,b]=[...ptr.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pin)zoom=Math.min(1.8,Math.max(.7,zoom*dd/pin));pin=dd;return}if(drag){uy+=(e.clientX-drag[0])*.01;up=Math.max(-.6,Math.min(.7,up+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}});
const pu=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pin=0;if(!ptr.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
el.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoom=Math.min(1.8,Math.max(.7,zoom*(e.deltaY>0?.93:1.07)))},{passive:false});
const chs=$$('.ch'),st=$$('.steps i'),b3=$('#bar3'),pc=$('#pct3');
function sp(){const r=sec.getBoundingClientRect();p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const i=Math.min(3,Math.floor(p*4));chs.forEach((c,j)=>c.classList.toggle('on',j===i));st.forEach((c,j)=>c.classList.toggle('on',j<=i));b3.style.transform=`scaleX(${p})`;pc.textContent=Math.round(20+p*580)+'°'}
addEventListener('scroll',sp,{passive:true});sp();
addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix()});
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!run)tick()},{rootMargin:'80px'}).observe(sec);
let yaw=.5,cy=0,exs=0;function tick(){if(!vis){run=false;return}run=true;const t=performance.now()/1000;
 const target=Math.sin(Math.min(1,p/.85)*Math.PI);exs+=(target-exs)*.08;const e3=exs*exs*(3-2*exs);
 parts.forEach(g=>{g.position.copy(g.userData.o).multiplyScalar(e3);g.rotation.z=g.userData.r*e3});
 yaw+=((uy+.5+p*Math.PI*1.2+(RM?0:t*.06))-yaw)*.08;ex.rotation.y=yaw;cy+=(up+.25-cy)*.1;ex.rotation.x=cy;
 const heat=Math.max(0,(p-.6)/.4);tintM.emissive.setRGB(.45*heat,.12*heat,.55*heat);tipM.emissive.setRGB(.35*heat,.2*heat,.7*heat);l1.intensity=2+heat*2+Math.sin(t*4)*.3;
 const k=.25+heat*.8;for(let i=0;i<N;i++){life[i]+=.006*(1+k);if(life[i]>1)life[i]=0;const L=life[i];pa[i*3]=5.45+L*3*k+Math.sin(i+t)*.1*L;pa[i*3+1]=-.3+L*L*1.6+Math.sin(i*1.7+t*2)*.25*L;pa[i*3+2]=Math.cos(i*2.3+t)*.4*L}pg.attributes.position.needsUpdate=true;sm.opacity=.08+heat*.22;
 const dist=(MOB?17:12)-Math.sin(p*Math.PI)*1.5;cam.position.set(MOB?0:-2.6,MOB?2.4:1.8,dist/zoom);cam.lookAt(MOB?0:-2.6,MOB?-.6:0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
})();

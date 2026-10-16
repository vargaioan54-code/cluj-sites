(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;

/* ---------- reveal ---------- */
$$('.card').forEach((c,i)=>{c.style.transitionDelay=(i%3)*.1+'s'});
const revEls=$$('.card,.rv');
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.15}):null;
revEls.forEach(el=>io?io.observe(el):el.classList.add('on'));
function showNow(){revEls.forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight*1.05&&r.bottom>0)e.classList.add('on')})}
addEventListener('load',showNow);setTimeout(showNow,1500);

/* ---------- split text ---------- */
$$('h2, .chap h3').forEach(h=>{if(h.dataset.split)return;h.dataset.split=1;let i=0;
 const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const o=document.createElement('span');o.className='sw';const s=document.createElement('span');s.textContent=w;s.style.transitionDelay=(i++*0.07)+'s';o.appendChild(s);f.appendChild(o)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(h);h.classList.add('splt')});
const sio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sin');sio.unobserve(e.target)}}),{threshold:.2}):null;
$$('.splt').forEach(h=>sio?sio.observe(h):h.classList.add('sin'));
setTimeout(()=>$$('.splt').forEach(h=>{const r=h.getBoundingClientRect();if(r.top<innerHeight)h.classList.add('sin')}),2500);

/* ---------- micro ---------- */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height)*2;s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});

/* ---------- scroll: progress, hero lines, chapters ---------- */
const prog=$('#prog'),cap=$('#cap'),ch=$$('.chap'),dots=$$('.dots i'),chl=$('#chline');
$$('.tr').forEach(p=>{const L=p.getTotalLength();p.dataset.l=L;p.style.strokeDasharray=L;p.style.strokeDashoffset=RM?0:L});
let lastC=-1;
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;
 if(prog)prog.style.transform=`scaleX(${H>0?y/H:0})`;
 document.body.classList.toggle('past',y>innerHeight*.7);
 if(RM)return;
 const t=Math.min(1,y/(innerHeight*.8));$$('.tr').forEach(p=>p.style.strokeDashoffset=p.dataset.l*(1-Math.max(t,.0001)));
 if(cap){const r=cap.getBoundingClientRect(),den=r.height-innerHeight,pp=den>0?Math.min(.999,Math.max(0,-r.top/den)):0,idx=Math.floor(pp*ch.length);
  if(chl)chl.style.width=pp*100+'%';
  if(idx!==lastC){lastC=idx;ch.forEach((c,i)=>c.classList.toggle('on',i===idx));dots.forEach((d,i)=>d.classList.toggle('on',i===idx))}}}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();
if(!RM){const st=performance.now();(function a(n){const k=Math.min(1,(n-st)/1600);if(scrollY<5)$$('.tr').forEach(p=>p.style.strokeDashoffset=p.dataset.l*(1-k*.6));if(k<1)requestAnimationFrame(a)})(st)}

/* ---------- fit hero h1 on mobile (long words never clip) ---------- */
function fitH1(){const h=$('h1');if(!h)return;h.style.fontSize='';if(!isMob())return;const wrap=h.parentElement,max=wrap.clientWidth;let fs=parseFloat(getComputedStyle(h).fontSize),n=0;
 const w=()=>Math.max(...[...h.children].map(s=>s.scrollWidth));
 while(w()>max&&fs>22&&n++<40){fs-=2;h.style.fontSize=fs+'px'}}
addEventListener('resize',fitH1);addEventListener('load',fitH1);fitH1();setTimeout(fitH1,600);

/* ---------- GL helpers ---------- */
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();
if(!GL||!window.THREE){const s=$('#model3d');if(s)s.classList.add('fallback');return}
const T=THREE,PI=Math.PI;
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};

/* ---------- materials ---------- */
function mats(){
const ck=[0,1,2,3].map(()=>new T.MeshBasicMaterial({color:0x3a4753,transparent:true,opacity:.45,depthWrite:false}));
return{
metal:new T.MeshStandardMaterial({color:0xcdd5db,metalness:.75,roughness:.3}),
body:new T.MeshStandardMaterial({color:0x2b3844,metalness:.6,roughness:.38}),
dark:new T.MeshStandardMaterial({color:0x0b1015,metalness:.5,roughness:.5}),
slab:new T.MeshStandardMaterial({color:0x172029,metalness:.4,roughness:.6}),
tire:new T.MeshStandardMaterial({color:0x0a0c0e,metalness:.1,roughness:.9}),
red:new T.MeshStandardMaterial({color:0xff3b2f,metalness:.4,roughness:.4,emissive:0x4a0d09}),
white:new T.MeshStandardMaterial({color:0xf4efe6,metalness:.2,roughness:.45,emissive:0x2a2822}),
spring:new T.MeshStandardMaterial({color:0xff3b2f,metalness:.55,roughness:.35,emissive:0x2a0705}),
glass:new T.MeshStandardMaterial({color:0x8fb0c4,metalness:.3,roughness:.25,transparent:true,opacity:.26,side:T.DoubleSide,depthWrite:false}),
edge:new T.LineBasicMaterial({color:0xd7e2ea,transparent:true,opacity:.7}),
lampF:new T.MeshBasicMaterial({color:0x5a5148}),lampR:new T.MeshBasicMaterial({color:0x5a2020}),
scr:new T.MeshBasicMaterial({color:0xffffff}),
ck:ck}}
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}
function scrTex(){const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.fillStyle='#0b1015';x.fillRect(0,0,256,160);
 x.strokeStyle='rgba(244,239,230,.12)';x.lineWidth=1;for(let i=0;i<=8;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32,160);x.stroke()}for(let j=0;j<=5;j++){x.beginPath();x.moveTo(0,j*32);x.lineTo(256,j*32);x.stroke()}
 x.strokeStyle='#ff3b2f';x.lineWidth=4;x.lineJoin='round';x.beginPath();[[8,92],[52,92],[66,40],[84,132],[100,76],[116,92],[170,92],[184,54],[198,112],[210,92],[248,92]].forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
 x.fillStyle='#f4efe6';[[18,14,70],[18,26,44]].forEach(r=>x.fillRect(r[0],r[1],r[2],5));
 [[200,16],[214,16],[228,16]].forEach((r,i)=>{x.fillStyle=i<2?'#f4efe6':'#ff3b2f';x.beginPath();x.arc(r[0],r[1]+3,5,0,7);x.fill()});
 const t=new T.CanvasTexture(c);return t}

/* ---------- the model: a car raised on a two-post lift (x = length, front = +x, y = up) ----------
   Shop floor slab, two lift posts with carriages and four swing arms, car body and glass cabin on the arms,
   4 wheels with tyres, rims, brake discs and calipers, coil-over struts, engine block, battery, alternator and
   A/C compressor in the engine bay, headlights. Four rings mark the verified service areas: brakes, suspension,
   electrical, A/C (freon); a diagnostic tablet pops up at the end. Illustrative, not a specific car or the shop's equipment. */
function car(SEG){
const M=mats(),root=new T.Group(),parts=[],spin=[],V=(x,y,z)=>new T.Vector3(x,y,z);
const L=2.3;
const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat||M.edge));return m};
const mesh=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x||0,y||0,z||0);return m};
const box=(w,h,d,mat,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),mat,x,y,z);
const cylZ=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateX(PI/2);return mesh(g,mat,x,y,z)};
const cylX=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateZ(PI/2);return mesh(g,mat,x,y,z)};
const cylY=(r,h,mat,x,y,z,seg)=>mesh(new T.CylinderGeometry(r,r,h,seg||SEG),mat,x,y,z);
const tor=(R,t,mat,x,y,z,rx,ry)=>{const m=mesh(new T.TorusGeometry(R,t,8,SEG),mat,x,y,z);m.rotation.x=rx||0;m.rotation.y=ry||0;return m};
const add=(o,a,b,r1)=>{o.position.copy(a);root.add(o);parts.push({o:o,a:a,b:b,r0:0,r1:r1||0});return o};
const addC=(o,a,b,r1)=>add(o,V(a.x,a.y+L,a.z),V(b.x,b.y+L,b.z),r1);
const prof=(pts,depth)=>{const s=new T.Shape();pts.forEach((p,i)=>{if(i)s.lineTo(p[0],p[1]);else s.moveTo(p[0],p[1])});s.closePath();
 const g=new T.ExtrudeGeometry(s,{depth:depth-.12,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:1,steps:1});g.translate(0,0,-(depth-.12)/2);return g};
const bar=(p,q,t,mat)=>{const d=q.clone().sub(p),len=d.length(),m=new T.Mesh(new T.BoxGeometry(t,t,len),mat);m.position.copy(p.clone().add(q).multiplyScalar(.5));m.lookAt(q);return m};

// shop floor (anchor 0,0,0): slab, red edge strips, hazard dashes around the lift
const pl=new T.Group();pl.add(edges(box(11.6,.2,8,M.slab,0,-.1,0)));
[-1,1].forEach(s=>pl.add(box(11.6,.03,.14,M.red,0,.015,s*3.8)));
[-1,1].forEach(s=>pl.add(box(.14,.03,8,M.red,s*5.7,.015,0)));
[-4.6,-3.4,3.4,4.6].forEach(x=>pl.add(box(.5,.03,.1,M.white,x,.02,0)));
add(pl,V(0,0,0),V(0,-3.4,0),0);

// two-post lift: each side = base plate, post, carriage and two swing arms with red pads (anchor at the post)
[-1,1].forEach(s=>{const g=new T.Group(),px=-.6,pz=s*3.05;
 g.add(box(1.5,.12,1.2,M.dark,px,.06,pz));
 g.add(edges(box(.62,6.6,.8,M.body,px,3.4,pz),M.edge,20));
 g.add(box(.7,.14,.88,M.red,px,6.77,pz));
 g.add(box(.84,.8,.98,M.metal,px,L-.15,pz));
 [[-1.35,1.2],[1.15,1.2]].forEach(a=>{const p=V(px,L+.05,pz-s*.35),q=V(a[0],L+.05,s*a[1]);g.add(bar(p,q,.2,M.metal));g.add(cylY(.22,.1,M.red,a[0],L+.12,s*a[1],14))});
 add(g,V(0,0,0),V(0,-.6,s*1.6),0)});

// lower body, stripe, bumpers (carried by the lift)
const low=new T.Group();
low.add(edges(mesh(prof([[-3.9,.7],[-3.9,1.55],[-3,1.7],[-1.9,1.75],[1.6,1.75],[3.2,1.65],[3.9,1.45],[3.9,.7]],2.8),M.body,0,0,0),20));
[-1,1].forEach(s=>low.add(box(6.4,.07,.03,M.red,0,1.2,s*1.465)));
[-1,1].forEach(s=>low.add(box(.14,.34,2.5,M.dark,s*3.99,.9,0)));
addC(low,V(0,0,0),V(0,.8,0),0);
// cabin
const cb=new T.Group();
cb.add(edges(mesh(prof([[-2,1.75],[-1.15,2.65],[-.55,2.9],[.85,2.9],[1.9,1.75]],2.5),M.glass,0,0,0),20));
cb.add(box(1.4,.08,2.3,M.body,.15,2.95,0));
[-1,1].forEach(s=>{cb.add(box(.7,.15,.7,M.dark,-.2,1.98,s*.6));const bk=box(.14,.7,.7,M.dark,-.6,2.3,s*.6);bk.rotation.z=.15;cb.add(bk)});
addC(cb,V(0,0,0),V(0,3.6,0),0);
// head and tail lights
const hf=new T.Group();[-1,1].forEach(s=>hf.add(edges(box(.16,.22,.55,M.lampF,3.98,1.38,s*.95))));addC(hf,V(0,0,0),V(1.8,.2,0),0);
const hr=new T.Group();[-1,1].forEach(s=>hr.add(edges(box(.16,.22,.55,M.lampR,-3.98,1.4,s*.95))));addC(hr,V(0,0,0),V(-1.8,.2,0),0);

// wheels (anchor = wheel centre): tyre, recessed rim, spokes, brake disc (spins), caliper, brake ring (static)
[[2.5,1.5],[2.5,-1.5],[-2.5,1.5],[-2.5,-1.5]].forEach(q=>{const sg=q[1]>0?1:-1,wg=new T.Group(),sp=new T.Group();
 sp.add(mesh(new T.TorusGeometry(.5,.16,10,SEG),M.tire,0,0,0));
 sp.add(cylZ(.5,.1,M.dark,0,0,0));sp.add(tor(.42,.04,M.metal,0,0,sg*.09));
 for(let i=0;i<5;i++){const b=box(.09,.84,.05,M.metal,0,0,sg*.07);b.rotation.z=i*PI/5;sp.add(b)}
 sp.add(cylZ(.12,.2,M.red,0,0,sg*.08));
 sp.add(cylZ(.36,.04,M.metal,0,0,-sg*.12));
 wg.add(sp);spin.push({o:sp,k:-1});
 wg.add(box(.2,.34,.14,M.red,.38,.12,-sg*.12));
 wg.add(tor(.82,.035,M.ck[0],0,0,sg*.34));
 addC(wg,V(q[0],1.07,q[1]),V(q[0]*1.1,1.27,q[1]+sg*2.3),0)});

// coil-over struts (front pair): damper, red spring, suspension ring
[-1,1].forEach(s=>{const g=new T.Group(),pts=[];
 for(let i=0;i<=60;i++){const t=i/60,a=t*PI*2*5;pts.push(V(Math.cos(a)*.2,-.5+t*1.1,Math.sin(a)*.2))}
 g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),SEG*3,.032,5,false),M.spring,0,0,0));
 g.add(cylY(.07,1.5,M.metal,0,0,0,10));g.add(cylY(.12,.5,M.dark,0,-.55,0,12));g.add(cylY(.15,.06,M.metal,0,.62,0,12));
 g.add(tor(.5,.03,M.ck[1],0,0,0,PI/2,0));
 addC(g,V(2.5,1.15,s*.9),V(1.2,4.3,s*2.4),0)});

// engine block, with a belt pulley and a timing cover (mechanics)
const en=new T.Group();en.add(edges(box(1.5,.8,1.3,M.body,0,0,0),M.edge,20));en.add(box(1.46,.18,1.26,M.metal,0,.49,0));
for(let i=0;i<4;i++)en.add(cylY(.17,.1,M.dark,-.5+i*.33,.6,0,14));
en.add(box(.12,.72,1.2,M.dark,.8,0,0));en.add(cylX(.2,.1,M.red,.9,-.05,0,16));
addC(en,V(2.55,1.1,0),V(2.6,5.3,0),0);
// battery + alternator (electrical)
const bt=new T.Group();bt.add(edges(box(.9,.5,.5,M.dark,0,0,0),M.edge,20));bt.add(cylY(.07,.1,M.red,-.28,.3,.12,8));bt.add(cylY(.07,.1,M.metal,.28,.3,.12,8));
bt.add(tor(.62,.03,M.ck[2],0,0,0,PI/2,0));
addC(bt,V(3.35,1.28,-.55),V(4.2,5.5,-1.9),0);
const al=new T.Group();al.add(cylX(.3,.55,M.metal,0,0,0,18));al.add(cylX(.22,.16,M.red,.35,0,0,16));al.add(tor(.52,.03,M.ck[2],0,0,0,0,PI/2));
addC(al,V(3.4,.98,-.3),V(3.2,3.8,-2.5),0);
// A/C compressor (freon)
const ac=new T.Group();ac.add(cylX(.32,.7,M.metal,0,0,0,18));ac.add(cylX(.4,.08,M.dark,.4,0,0,18));ac.add(box(.28,.34,.34,M.white,-.2,.38,0));ac.add(tor(.62,.03,M.ck[3],0,0,0,0,PI/2));
addC(ac,V(3.15,1.05,.6),V(3.4,4.6,2.1),0);

// diagnostic tablet, appears at the end (not part of the exploding set)
const dg=new T.Group(),tx=scrTex();
dg.add(edges(box(2.6,1.7,.12,M.dark,0,0,0),M.edge,20));
const sm2=new T.MeshBasicMaterial({map:tx});dg.add(mesh(new T.PlaneGeometry(2.3,1.4),sm2,0,0,.07));
dg.add(box(2.6,.06,.14,M.red,0,-.88,0));
dg.visible=false;dg.position.set(0,7.6,0);root.add(dg);
root.position.y=-3.5;
return{root:root,parts:parts,spin:spin,ck:M.ck,lampF:M.lampF,lampR:M.lampR,dg:dg,M:M}}

function lights(sc,k){sc.add(new T.HemisphereLight(0xeaf2f8,0x0a1016,.95));const dl=new T.DirectionalLight(0xffffff,1.15);dl.position.set(4,6,8);sc.add(dl);
const a=new T.PointLight(0xff3b2f,2.4*k,30);a.position.set(-4,-2,6);sc.add(a);const b=new T.PointLight(0xf4efe6,1.1*k,30);b.position.set(5,3,5);sc.add(b);return a}
// c: 0 -> 1 runs the four service rings in order (brakes, suspension, electrical, A/C), then the diagnostic tablet pops up
function placeParts(E,e,t,c,dt,fy){
 E.parts.forEach(q=>{q.o.position.lerpVectors(q.a,q.b,e);q.o.rotation.y=q.r0+(q.r1-q.r0)*e});
 const s=[0,1,2,3].map(k=>c*4.6-k);
 E.ck.forEach((m,k)=>{const x=s[k];if(x<=0){m.color.setHex(0x3a4753);m.opacity=.45}else if(x<1){m.color.setHex(0xff3b2f);m.opacity=.65+.35*Math.sin(t*9)}else{m.color.setHex(0xfff2dc);m.opacity=1}});
 const l=Math.max(0,Math.min(1,s[1]*2));
 E.lampF.color.setRGB(.35+.65*l,.32+.6*l,.28+.55*l);E.lampR.color.setRGB(.35+.65*l,.12+.1*l,.12+.1*l);
 const w=8*sm(s[0]*4)*(1-sm((s[0]-1)*2.5));E.spin.forEach(q=>{q.o.rotation.z+=dt*w*q.k});
 const k=sm((c-.88)/.12);E.dg.visible=k>.01;E.dg.scale.setScalar(.01+.95*k);E.dg.position.y=7.6+2.6*e+Math.sin(t*2)*.12;E.dg.rotation.y=-fy+Math.sin(t*.8)*.12}
// scanner arch: a red ring that sweeps along the car
function halo(){const g=new T.Group(),m=new T.MeshBasicMaterial({color:0xff8f80,transparent:true,opacity:.7,depthWrite:false}),r=new T.Mesh(new T.TorusGeometry(2.6,.035,8,96),m);r.rotation.y=PI/2;r.position.y=L2();g.add(r);return{g:g,m:m}}
function L2(){return 3.6}
const TK=2*Math.tan(35/2*PI/180);
// camera distance that fits the whole model (assembled ~12 x 8, exploded ~15 x 15; extra width margin for the yaw)
function fitDist(ex,asp){const Hh=8.2+6.2*ex,Ww=14.4+3.4*ex;return Math.max(Hh/TK,Ww/(TK*asp))*1.07}

/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,26);
const pl=lights(sc,1);
const E=car(isMob()?20:32);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);P.rotation.y=-.55;
const H=halo();E.root.add(H.g);
let aspEff=1;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 if(!isMob()){const fw=w*.48;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
 else{cam.aspect=w/h;cam.clearViewOffset()}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);const hx=$('#htx');if(hx)new ResizeObserver(vo).observe(hx);setTimeout(vo,900);setTimeout(vo,2000);
let tx=0,mx=0,uy=0,drag=null;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5)}},{passive:true});
const el=ren.domElement;el.style.touchAction='pan-y';
el.addEventListener('pointerdown',ev=>{drag=[ev.clientX];try{el.setPointerCapture(ev.pointerId)}catch(_){}});
el.addEventListener('pointermove',ev=>{if(!drag)return;uy+=(ev.clientX-drag[0])*.01;drag=[ev.clientX]});
const pu=()=>{drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();let lt=t0;
(function loop(){requestAnimationFrame(loop);if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-lt)/1000);lt=now;const t=(now-t0)/1000;
 mx+=(tx-mx)*.05;if(!drag)uy*=.97;const s=Math.min(1,scrollY/innerHeight);
 const e=RM?.2:Math.max(0,Math.min(.65,.2+.16*Math.sin(t*.7)+s*.5));
 const c=RM?.7:sm(.5-.65*Math.cos(t*.5));
 P.rotation.y=-.55+mx*.6+Math.sin(t*.3)*.15+uy;G.rotation.x=.16;
 placeParts(E,e,t,c,RM?0:dt,P.rotation.y+G.rotation.y);
 H.g.position.x=Math.sin(t*.6)*5.5;H.m.opacity=.45+.3*Math.sin(t*2);
 pl.intensity=2.2+Math.sin(t*3)*.4;
 const dz=fitDist(e,aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D: car on a two-post lift, exploding, service rings lighting up, diagnostic tablet (illustrative model) ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,26);
const pl=lights(sc,1.1);
const SEG=isMob()?20:32;
const E=car(SEG);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);G.rotation.y=-.5;
const HL=halo();E.root.add(HL.g);
let uy=0,up=0,drag=null,prog=0,e=0,c=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-1.6,Math.min(1.6,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
const chs=$$('#model3d .r3ch'),bar=$('#r3bar');
function explode(p){return p<.2?0:p<.55?sm((p-.2)/.35):p<.7?1:p<.95?1-sm((p-.7)/.25):0}
function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?Math.min(1,Math.max(0,-r.top/den)):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c2,j)=>c2.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile: free band below the tallest chapter text and above the bottom bar; desktop: right half
function vo(){const w=W(),h=H();if(!w||!h)return;ren.setSize(w,h);
 if(innerWidth>=900){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
 else{let tb=0;chs.forEach(c2=>{tb=Math.max(tb,c2.offsetHeight)});const top=78+tb+16,bot=h-134,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c2=>new ResizeObserver(vo).observe(c2));setTimeout(vo,800);setTimeout(vo,2000);
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;e+=(explode(p)-e)*.14;c+=(sm((p-.28)/.4)-c)*.12;spin+=RM?0:dt;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*PI*2)*.4+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.2+Math.sin(p*PI)*.1+up)-P.rotation.x)*.12;
 placeParts(E,e,spin,c,RM?0:dt,P.rotation.y+G.rotation.y);
 HL.g.position.x=Math.sin(spin*.5+p*5)*5.5;HL.m.opacity=.45+.3*Math.sin(spin*2);
 pl.intensity=2.4+Math.sin(now/500)*.4;
 const dz=fitDist(e,aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

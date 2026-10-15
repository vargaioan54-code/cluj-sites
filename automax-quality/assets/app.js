(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;

/* ---------- hours ---------- */
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
if(hb)D.forEach((d,i)=>{const t=i<5?'09:00–17:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});

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

/* ---------- GL helpers ---------- */
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();
if(!GL||!window.THREE){const s=$('#roata3d');if(s)s.classList.add('fallback');return}
const T=THREE;

/* ---------- HERO 3D wheel (unchanged) ---------- */
function heroWheel(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,12);
sc.add(new T.HemisphereLight(0xdff4ff,0x070d1c,.9));const dl=new T.DirectionalLight(0xffffff,1.1);dl.position.set(5,6,8);sc.add(dl);
const pl=new T.PointLight(0x19e3ff,2,20);pl.position.set(-4,-2,4);sc.add(pl);const pg=new T.PointLight(0xffc83d,1.2,20);pg.position.set(4,3,3);sc.add(pg);
const steel=new T.MeshStandardMaterial({color:0xc7d3ea,metalness:.9,roughness:.28}),
cyan=new T.MeshStandardMaterial({color:0x19e3ff,metalness:.4,roughness:.35,emissive:0x063b45}),
gold=new T.MeshStandardMaterial({color:0xffc83d,metalness:.7,roughness:.3}),
dark=new T.MeshStandardMaterial({color:0x1f2d57,metalness:.6,roughness:.55});
const G=new T.Group();sc.add(G);
const W=new T.Group();G.add(W);
W.add(new T.Mesh(new T.TorusGeometry(1.55,.5,24,64),dark));
const lip=new T.Mesh(new T.TorusGeometry(1.2,.07,12,64),cyan);lip.position.z=.32;W.add(lip);
const barrel=new T.Mesh(new T.CylinderGeometry(1.2,1.2,.3,48),dark);barrel.rotation.x=Math.PI/2;W.add(barrel);
for(let i=0;i<5;i++){const a=i/5*Math.PI*2,sp=new T.Mesh(new T.BoxGeometry(.3,1.05,.16),steel);sp.position.set(-Math.sin(a)*.72,Math.cos(a)*.72,.15);sp.rotation.z=a;W.add(sp)}
const hub=new T.Mesh(new T.CylinderGeometry(.34,.34,.3,32),gold);hub.rotation.x=Math.PI/2;hub.position.z=.22;W.add(hub);
for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3,n=new T.Mesh(new T.CylinderGeometry(.06,.06,.1,6),dark);n.rotation.x=Math.PI/2;n.position.set(Math.cos(a)*.2,Math.sin(a)*.2,.4);W.add(n)}
const R1=new T.Mesh(new T.TorusGeometry(2.7,.045,10,96),cyan),R2=new T.Mesh(new T.TorusGeometry(2.45,.03,10,96),gold);
R1.rotation.x=1.1;R2.rotation.y=1.0;G.add(R1);G.add(R2);
const bolts=[];for(let i=0;i<7;i++){const b=new T.Mesh(new T.CylinderGeometry(.14,.14,.1,6),i%2?gold:cyan);const an=i/7*Math.PI*2;b.position.set(Math.cos(an)*2.9,Math.sin(an)*1.9,-.8+(i%3)*.5);b.rotation.x=i;bolts.push(b);G.add(b)}
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 if(!isMob()){cam.aspect=w/h;cam.clearViewOffset();G.position.set(2.8,0,0);G.scale.setScalar(1);cam.updateProjectionMatrix();return}
 G.position.set(0,0,0);G.scale.setScalar(.8);cam.aspect=w/h;cam.clearViewOffset();cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);const hx=$('#htx');if(hx)new ResizeObserver(vo).observe(hx);setTimeout(vo,900);setTimeout(vo,2000);
let tx=0,ty=0,mx=0,my=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)}},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
 mx+=(tx-mx)*.05;my+=(ty-my)*.05;
 W.rotation.z=-t*.6;R1.rotation.z=t*.5;R2.rotation.x=t*.4;
 bolts.forEach((b,i)=>{b.rotation.y=t*(.5+i*.1)});
 G.rotation.y=mx*.6+Math.sin(t*.3)*.2;G.rotation.x=my*.3+.15;pl.intensity=1.6+Math.sin(t*3)*.4;
 ren.render(sc,cam)})();
}
try{heroWheel()}catch(e){}

/* ---------- PINNED 3D: exploded automatic gearbox ---------- */
function gearbox(){
const sec=$('#roata3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,14);
sc.add(new T.HemisphereLight(0xdff4ff,0x070d1c,.95));const dl=new T.DirectionalLight(0xffffff,1.2);dl.position.set(4,6,8);sc.add(dl);
const pl=new T.PointLight(0x19e3ff,2.2,24);pl.position.set(-4,-2,5);sc.add(pl);const pg=new T.PointLight(0xffc83d,1.4,24);pg.position.set(5,3,4);sc.add(pg);
const steel=new T.MeshStandardMaterial({color:0xc7d3ea,metalness:.6,roughness:.35}),
cyanM=new T.MeshStandardMaterial({color:0x19e3ff,metalness:.35,roughness:.4,emissive:0x0a5560}),
goldM=new T.MeshStandardMaterial({color:0xffc83d,metalness:.6,roughness:.35,emissive:0x4a3300}),
dark=new T.MeshStandardMaterial({color:0x2a3c70,metalness:.55,roughness:.5}),
glass=new T.MeshStandardMaterial({color:0x1f2d57,metalness:.3,roughness:.6,transparent:true,opacity:.28,side:T.DoubleSide,depthWrite:false}),
edgeM=new T.LineBasicMaterial({color:0x19e3ff,transparent:true,opacity:.85}),
glowC=new T.MeshBasicMaterial({color:0x19e3ff}),glowG=new T.MeshBasicMaterial({color:0xffc83d});
const SEG=isMob()?32:48;
const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.rotation.y=Math.PI/2; /* gearbox axis (local Z) lies along screen X */
// helpers
function circ(r,rev){const p=new T.Path();p.absarc(0,0,r,0,Math.PI*2,!!rev);return p}
function toothPts(N,rt,rr){const a=[],st=Math.PI*2/N;for(let i=0;i<N;i++){const b=i*st;[[rr,0],[rt,.12],[rt,.38],[rr,.5]].forEach(q=>a.push([Math.cos(b+q[1]*st)*q[0],Math.sin(b+q[1]*st)*q[0]]))}return a}
function ext(shape,th){const g=new T.ExtrudeGeometry(shape,{depth:th,bevelEnabled:false,curveSegments:isMob()?20:32});g.translate(0,0,-th/2);return g}
function gearGeo(N,rt,rr,hole,th){const pts=toothPts(N,rt,rr),s=new T.Shape();pts.forEach((q,i)=>i?s.lineTo(q[0],q[1]):s.moveTo(q[0],q[1]));s.closePath();s.holes.push(circ(hole,true));return ext(s,th)}
function ringGearGeo(N,rIn,rRoot,ro,th){const pts=toothPts(N,rIn,rRoot),h=new T.Path();pts.forEach((q,i)=>i?h.lineTo(q[0],q[1]):h.moveTo(q[0],q[1]));h.closePath();const s=new T.Shape();s.absarc(0,0,ro,0,Math.PI*2,false);s.holes.push(h);return ext(s,th)}
function edges(mesh,deg){const l=new T.LineSegments(new T.EdgesGeometry(mesh.geometry,deg||30),edgeM);mesh.add(l);return l}
const cylZ=(rt,rb,h,open,mat)=>{const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,SEG,1,open),mat);m.rotation.x=Math.PI/2;return m};
// parts: [group, assembledZ, explodedZ]
const parts=[];const add=(g,a,b)=>{G.add(g);parts.push([g,a,b]);return g};
// shaft through the centre
const shaft=new T.Group();const sh=cylZ(.16,.16,10.6,false,steel);shaft.add(sh);
[-4.9,-3.1,3.1,4.9].forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(.2,.035,8,24),glowC);r.position.z=z;shaft.add(r)});
G.add(shaft);
// bell housing (front) + torque-converter ring
const bell=new T.Group();const bm=cylZ(1.25,1.95,1.3,true,glass);bell.add(bm);const be=new T.LineSegments(new T.EdgesGeometry(bm.geometry,1),edgeM);be.rotation.x=Math.PI/2;bell.add(be);
[.62,-.62].forEach((z,i)=>{const r=new T.Mesh(new T.TorusGeometry(i?1.25:1.95,.04,8,SEG),glowC);r.position.z=z;bell.add(r)});
add(bell,-2.15,-3.9);
const conv=new T.Group();const ct=new T.Mesh(new T.TorusGeometry(.85,.26,16,SEG),dark);conv.add(ct);const ce=new T.Mesh(new T.TorusGeometry(.85,.275,6,SEG),new T.MeshBasicMaterial({color:0x19e3ff,wireframe:true,transparent:true,opacity:.35}));conv.add(ce);
add(conv,-2.15,-4.0);
// clutch pack: 8 discs, cyan/gold alternating, cyan glowing rims
const discs=[];const dgeo=gearGeo(24,1.19,1.08,.3,.09);
for(let i=0;i<8;i++){const m=new T.Mesh(dgeo,i%2?goldM:cyanM);const rim=new T.Mesh(new T.TorusGeometry(1.09,.016,6,SEG),i%2?glowG:glowC);rim.position.z=.047;m.add(rim);const rim2=rim.clone();rim2.position.z=-.047;m.add(rim2);G.add(m);discs.push(m)}
// planetary set: sun, 3 planets on carrier, ring gear
const sun=new T.Mesh(gearGeo(12,.45,.35,.18,.26),goldM);add(sun,.5,.2);
const carrier=new T.Group();const plate=new T.Mesh(ext((()=>{const s=new T.Shape();s.absarc(0,0,.88,0,Math.PI*2,false);s.holes.push(circ(.19,true));return s})(),.05),dark);plate.position.z=-.2;carrier.add(plate);
const planets=[];const pgeo=gearGeo(9,.35,.25,.07,.26);
for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const pm=new T.Mesh(pgeo,steel);pm.position.set(Math.cos(a)*.7,Math.sin(a)*.7,0);carrier.add(pm);planets.push(pm);const pin=new T.Mesh(new T.CylinderGeometry(.05,.05,.5,10),glowC);pin.rotation.x=Math.PI/2;pin.position.copy(pm.position);pin.position.z=-.04;carrier.add(pin)}
add(carrier,.5,1.0);
const ring=new T.Mesh(ringGearGeo(30,.95,1.05,1.36,.3),dark);const re=edges(ring,30);add(ring,.5,1.9);
// rear case + output flange
const rear=new T.Group();const rm=cylZ(1.95,1.75,1.7,true,glass);rear.add(rm);const rre=new T.LineSegments(new T.EdgesGeometry(rm.geometry,1),edgeM);rre.rotation.x=Math.PI/2;rear.add(rre);
[-.8,0,.8].forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(1.88,.035,8,SEG),glowC);r.position.z=z;rear.add(r)});
add(rear,1.85,3.15);
const flange=new T.Group();const fm=new T.Mesh(gearGeo(8,.62,.5,.17,.2),goldM);flange.add(fm);add(flange,2.95,4.35);
// orbiting rings (cyan + gold)
const R1=new T.Mesh(new T.TorusGeometry(2.55,.04,10,96),glowC),R2=new T.Mesh(new T.TorusGeometry(2.3,.03,10,96),glowG);P.add(R1);P.add(R2);
// state
let uy=0,up=0,drag=null,prog=0,tgtE=0,e=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-.9,Math.min(.9,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
// scroll progress -> explode / chapters
const chs=$$('#roata3d .r3ch'),bar=$('#r3bar');
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
function explode(p){return p<.2?0:p<.55?sm((p-.2)/.35):p<.7?1:p<.95?1-sm((p-.7)/.25):0}
function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?Math.min(1,Math.max(0,-r.top/den)):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c,j)=>c.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile: free band below the tallest chapter text and above the bottom bar; desktop: right half
function vo(){const w=W(),h=H();if(!w||!h)return;ren.setSize(w,h);
 if(innerWidth>=900){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
 else{let tb=0;chs.forEach(c=>{tb=Math.max(tb,c.offsetHeight)});const top=78+tb+16,bot=h-96,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c=>new ResizeObserver(vo).observe(c));setTimeout(vo,800);setTimeout(vo,2000);
// camera distance that fits the whole model (fit factor): height needs ~5.8 units, length 6.8 assembled -> 10.8 exploded
const TK=2*Math.tan(35/2*Math.PI/180);
function fitDist(ex){const objH=5.8,objW=6.8+4*ex;return Math.max(objH/TK,objW/(TK*aspEff))*1.04}
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;tgtE=explode(p);e+=(tgtE-e)*.14;spin+=RM?0:dt;
 const a=spin*.9+p*10;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*Math.PI*2)*.45+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((-.28+Math.sin(p*Math.PI)*.22+up)-P.rotation.x)*.12;
 // explode positions
 parts.forEach(q=>{q[0].position.z=q[1]+(q[2]-q[1])*e});
 const pc=-.9+(-1.85+.9)*e,sp=.16+(.42-.16)*e;discs.forEach((d,i)=>{d.position.z=pc+(i-3.5)*sp;d.rotation.z=(i%2?-1:1)*a*(.5+i*.04)});
 shaft.rotation.z=a*1.2;conv.rotation.z=-a*.5;conv.children[0].rotation.x=0;
 sun.rotation.z=a*1.5;carrier.rotation.z=a*.35;planets.forEach(m=>m.rotation.z=-a*1.1);ring.rotation.z=a*.08;flange.rotation.z=a*.6;
 R1.rotation.set(1.1,spin*.25,spin*.5);R2.rotation.set(spin*.4,1.0,spin*.3);
 pl.intensity=2+Math.sin(now/500)*.5;
 const dz=fitDist(e);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{gearbox()}catch(err){const s=$('#roata3d');if(s)s.classList.add('fallback')}
})();

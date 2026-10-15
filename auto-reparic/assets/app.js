(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;

/* ---------- hours ---------- */
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
if(hb)D.forEach((d,i)=>{const t=i<5?'10:00–18:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});

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


/* ---------- HERO 3D: gears + wrench ---------- */
function heroGears(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,12);
sc.add(new T.HemisphereLight(0xfff1e0,0x0e1311,.9));const dl=new T.DirectionalLight(0xffffff,1.1);dl.position.set(5,6,8);sc.add(dl);
const pl=new T.PointLight(0xff7a2f,2,20);pl.position.set(-4,-2,4);sc.add(pl);const pg=new T.PointLight(0x3ddc97,1,20);pg.position.set(4,3,3);sc.add(pg);
const steel=new T.MeshStandardMaterial({color:0xc9d1cc,metalness:.9,roughness:.28}),
orange=new T.MeshStandardMaterial({color:0xff7a2f,metalness:.4,roughness:.4}),
dark=new T.MeshStandardMaterial({color:0x2a3530,metalness:.7,roughness:.5});
const G=new T.Group();sc.add(G);
function gear(r,teeth,th,mat){const g=new T.Group();const c=new T.Mesh(new T.CylinderGeometry(r,r,th,48),mat);c.rotation.x=Math.PI/2;g.add(c);
const hole=new T.Mesh(new T.CylinderGeometry(r*.35,r*.35,th*1.05,32),dark);hole.rotation.x=Math.PI/2;g.add(hole);
for(let i=0;i<teeth;i++){const a=i/teeth*Math.PI*2,t=new T.Mesh(new T.BoxGeometry(r*.28,r*.3,th),mat);t.position.set(Math.cos(a)*(r+r*.12),Math.sin(a)*(r+r*.12),0);t.rotation.z=a;g.add(t)}return g}
const g1=gear(1.6,14,.5,orange);g1.position.set(-.6,.2,-.6);G.add(g1);
const g2=gear(.95,10,.45,steel);g2.position.set(1.65,-1.35,-.4);G.add(g2);
const W=new T.Group();
const sh=new T.Mesh(new T.BoxGeometry(5,.42,.22),steel);W.add(sh);
function head(x,open){const h=new T.Group();const ring=new T.Mesh(new T.TorusGeometry(.55,.2,16,40,open?Math.PI*1.45:Math.PI*2),steel);
if(open)ring.rotation.z=Math.PI*.78*(x>0?1:-1)+(x>0?0:Math.PI);h.add(ring);h.position.x=x;return h}
W.add(head(2.85,true));W.add(head(-2.85,false));W.rotation.z=-.6;W.position.z=.8;G.add(W);
const bolts=[];for(let i=0;i<7;i++){const b=new T.Mesh(new T.CylinderGeometry(.16,.16,.1,6),i%2?orange:steel);b.position.set((Math.random()-.5)*7,(Math.random()-.5)*4.5,(Math.random()-.5)*2-1);b.rotation.x=Math.random()*3;bolts.push(b);G.add(b)}
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 if(!isMob()){cam.aspect=w/h;cam.clearViewOffset();G.position.set(2.8,0,0);G.scale.setScalar(1);cam.updateProjectionMatrix();return}
 G.position.set(0,0,0);G.scale.setScalar(.82);cam.aspect=w/h;cam.clearViewOffset();cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);const hx=$('#htx');if(hx)new ResizeObserver(vo).observe(hx);setTimeout(vo,900);setTimeout(vo,2000);
let tx=0,ty=0,mx=0,my=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)}},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
 mx+=(tx-mx)*.05;my+=(ty-my)*.05;const s=Math.min(1,scrollY/innerHeight);
 g1.rotation.z=t*.5;g2.rotation.z=-t*.5*1.6;W.rotation.z=-.6+Math.sin(t*.8)*.25-s*.8;W.position.y=Math.sin(t*1.1)*.15;
 bolts.forEach((b,i)=>{b.rotation.y=t*(.5+i*.1);b.position.y+=Math.sin(t+i)*.002});
 G.rotation.y=mx*.6+Math.sin(t*.3)*.2;G.rotation.x=my*.3+.15;pl.intensity=1.6+Math.sin(t*3)*.4;
 ren.render(sc,cam)})();
}
try{heroGears()}catch(e){}

/* ---------- PINNED 3D: exploded car engine (inline-4, illustrative model) ---------- */
function engine(){
const sec=$('#roata3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,18);
sc.add(new T.HemisphereLight(0xfff1e0,0x0e1311,.95));const dl=new T.DirectionalLight(0xffffff,1.2);dl.position.set(4,6,8);sc.add(dl);
const pl=new T.PointLight(0xff7a2f,2.2,30);pl.position.set(-4,-2,6);sc.add(pl);const pg=new T.PointLight(0x3ddc97,1.5,30);pg.position.set(5,3,5);sc.add(pg);
const steel=new T.MeshStandardMaterial({color:0xc9d1cc,metalness:.6,roughness:.35}),
orM=new T.MeshStandardMaterial({color:0xff7a2f,metalness:.4,roughness:.4,emissive:0x4a1d08}),
mintM=new T.MeshStandardMaterial({color:0x3ddc97,metalness:.35,roughness:.4,emissive:0x0f5a3a}),
dark=new T.MeshStandardMaterial({color:0x2a3530,metalness:.55,roughness:.5}),
ceram=new T.MeshStandardMaterial({color:0xeee6d8,metalness:.1,roughness:.55}),
glass=new T.MeshStandardMaterial({color:0x26332d,metalness:.3,roughness:.6,transparent:true,opacity:.26,side:T.DoubleSide,depthWrite:false}),
edgeM=new T.LineBasicMaterial({color:0x3ddc97,transparent:true,opacity:.85}),
glowO=new T.MeshBasicMaterial({color:0xff7a2f}),glowM=new T.MeshBasicMaterial({color:0x3ddc97});
const SEG=isMob()?32:48;
const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);
G.rotation.y=Math.PI/2;G.position.y=-1.7; /* crankshaft axis (local Z) lies along screen X; model centred on P */
// helpers
function circ(r,rev){const p=new T.Path();p.absarc(0,0,r,0,Math.PI*2,!!rev);return p}
function toothPts(N,rt,rr){const a=[],st=Math.PI*2/N;for(let i=0;i<N;i++){const b=i*st;[[rr,0],[rt,.12],[rt,.38],[rr,.5]].forEach(q=>a.push([Math.cos(b+q[1]*st)*q[0],Math.sin(b+q[1]*st)*q[0]]))}return a}
function ext(shape,th){const g=new T.ExtrudeGeometry(shape,{depth:th,bevelEnabled:false,curveSegments:isMob()?20:32});g.translate(0,0,-th/2);return g}
function gearGeo(N,rt,rr,hole,th){const pts=toothPts(N,rt,rr),s=new T.Shape();pts.forEach((q,i)=>i?s.lineTo(q[0],q[1]):s.moveTo(q[0],q[1]));s.closePath();s.holes.push(circ(hole,true));return ext(s,th)}
function edges(mesh,deg){const l=new T.LineSegments(new T.EdgesGeometry(mesh.geometry,deg||30),edgeM);mesh.add(l);return l}
const cylZ=(rt,rb,h,open,mat)=>{const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,SEG,1,open),mat);m.rotation.x=Math.PI/2;return m};
const ZS=[-2.25,-.75,.75,2.25];
// parts: [group, axis, assembled, exploded]
const parts=[];const add=(g,ax,a,b)=>{G.add(g);g.position[ax]=a;parts.push([g,ax,a,b]);return g};
// engine block (static): glass box, 4 cylinder liners, main bearing rings
const block=new T.Group();G.add(block);
const bb=new T.Mesh(new T.BoxGeometry(2.0,4.1,6.5),glass);bb.position.y=1.15;block.add(bb);
const bbe=new T.LineSegments(new T.EdgesGeometry(bb.geometry),edgeM);bbe.position.copy(bb.position);block.add(bbe);
ZS.forEach(z=>{const lm=new T.Mesh(new T.CylinderGeometry(.62,.62,2.4,SEG,1,true),glass);lm.position.set(0,2,z);block.add(lm);
 const le=new T.LineSegments(new T.EdgesGeometry(lm.geometry,1),edgeM);le.position.copy(lm.position);block.add(le);
 const rim=new T.Mesh(new T.TorusGeometry(.62,.03,8,SEG),glowO);rim.rotation.x=Math.PI/2;rim.position.set(0,3.2,z);block.add(rim)});
[-3,-1.5,0,1.5,3].forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(.3,.03,8,24),glowM);r.position.z=z;block.add(r)});
// cylinder head + cam cover
const headG=new T.Group();const hm=new T.Mesh(new T.BoxGeometry(2.0,.56,6.5),glass);headG.add(hm);
const he=new T.LineSegments(new T.EdgesGeometry(hm.geometry),edgeM);headG.add(he);
[-.75,.75].forEach(x=>{const cov=new T.Mesh(new T.BoxGeometry(.25,.14,5.8),dark);cov.position.set(x,.35,0);headG.add(cov);edges(cov,30)});
ZS.forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(.45,.025,8,SEG),glowO);r.rotation.x=Math.PI/2;r.position.set(0,-.28,z);headG.add(r)});
add(headG,'y',3.48,4.68);
// spark plugs with glowing tips (orange) and mint rings
const plugs=new T.Group();const tips=[],halos=[];
ZS.forEach(z=>{const pg1=new T.Group();pg1.position.z=z;
 const hx=new T.Mesh(new T.CylinderGeometry(.2,.2,.22,6),steel);hx.position.y=.11;pg1.add(hx);
 const cr=new T.Mesh(new T.CylinderGeometry(.12,.14,.65,16),ceram);cr.position.y=.545;pg1.add(cr);
 const tm=new T.Mesh(new T.CylinderGeometry(.05,.05,.28,10),orM);tm.position.y=1.0;pg1.add(tm);
 const th=new T.Mesh(new T.CylinderGeometry(.1,.1,.5,12),steel);th.position.y=-.25;pg1.add(th);
 const rg=new T.Mesh(new T.TorusGeometry(.15,.02,8,24),glowM);rg.rotation.x=Math.PI/2;rg.position.y=.3;pg1.add(rg);
 const tip=new T.Mesh(new T.SphereGeometry(.09,12,10),new T.MeshBasicMaterial({color:0x7a3010}));tip.position.y=-.55;pg1.add(tip);tips.push(tip);
 const halo=new T.Mesh(new T.SphereGeometry(.34,14,12),new T.MeshBasicMaterial({color:0xff7a2f,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));halo.position.y=-.55;pg1.add(halo);halos.push(halo);
 plugs.add(pg1)});
add(plugs,'y',3.76,5.96);
// oil pan
const pan=new T.Group();const pm=new T.Mesh(new T.BoxGeometry(2.0,.8,5.9),glass);pan.add(pm);pan.add(new T.LineSegments(new T.EdgesGeometry(pm.geometry),edgeM));
const dr=new T.Mesh(new T.CylinderGeometry(.14,.14,.2,12),orM);dr.position.y=-.5;pan.add(dr);
add(pan,'y',-1.35,-3.15);
// crankshaft (rotates): journal, 4 crank pins, counterweight cheeks
const crank=new T.Group();G.add(crank);crank.add(cylZ(.2,.2,8.2,false,steel));
const PHI=[0,Math.PI,Math.PI,0],RC=.45,LR=1.75;
ZS.forEach((z,i)=>{const th=Math.PI/2+PHI[i],cx=Math.cos(th),cy=Math.sin(th);
 const pin=cylZ(.2,.2,1.1,false,orM);pin.position.set(cx*RC,cy*RC,z);crank.add(pin);
 [-.52,.52].forEach(d=>{const ch=cylZ(.5,.5,.12,false,steel);ch.position.set(-cx*.2,-cy*.2,z+d);crank.add(ch);edges(ch,30)})});
// pistons + connecting rods (move up as one unit when exploded)
const PA=new T.Group();G.add(PA);const pis=[];
ZS.forEach(z=>{const pgp=new T.Group();pgp.position.z=z;PA.add(pgp);
 const body=new T.Mesh(new T.CylinderGeometry(.56,.56,.72,SEG),steel);body.position.y=.3;pgp.add(body);edges(body,30);
 const crown=new T.Mesh(new T.CylinderGeometry(.5,.5,.05,SEG),orM);crown.position.y=.665;pgp.add(crown);
 [.52,.42].forEach(y=>{const r=new T.Mesh(new T.TorusGeometry(.565,.022,6,SEG),glowM);r.rotation.x=Math.PI/2;r.position.y=y;pgp.add(r)});
 pgp.add(cylZ(.1,.1,.62,false,mintM));
 const rod=new T.Mesh(new T.BoxGeometry(.14,LR,.22),steel);PA.add(rod);
 const big=new T.Mesh(new T.TorusGeometry(.27,.06,8,24),orM);PA.add(big);
 pis.push({g:pgp,rod:rod,big:big,z:z})});
// timing gear pair on the front of the crankshaft (crank gear + cam gear, meshing)
const gp=new T.Group();
const N1=14,N2=28,gA=new T.Mesh(gearGeo(N1,.65,.45,.2,.28),orM),gB=new T.Mesh(gearGeo(N2,1.2,.98,.28,.24),steel);
gB.position.y=1.65;gp.add(gA);gp.add(gB);edges(gA,30);edges(gB,30);
[.17,-.17].forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(.5,.02,6,32),glowM);r.position.z=z;gA.add(r);const r2=new T.Mesh(new T.TorusGeometry(1.05,.02,6,SEG),glowO);r2.position.z=z*.9;gB.add(r2)});
const rho1=Math.PI/2-.25*(Math.PI*2/N1),rho2=-Math.PI/2-.75*(Math.PI*2/N2);
add(gp,'z',-3.65,-5.0);
// flywheel (rear)
const fw=new T.Mesh(gearGeo(40,1.0,.92,.25,.3),orM);edges(fw,30);
[.17,-.17].forEach(z=>{const r=new T.Mesh(new T.TorusGeometry(.8,.02,6,SEG),glowM);r.position.z=z;fw.add(r)});
add(fw,'z',3.65,5.0);
// orbiting rings (mint + orange)
const R1=new T.Mesh(new T.TorusGeometry(3.3,.035,10,96),glowM),R2=new T.Mesh(new T.TorusGeometry(3.0,.03,10,96),glowO);P.add(R1);P.add(R2);
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
// camera distance that fits the whole model: height ~6.9 assembled -> 10.8 exploded; length ~9.6 -> 12
const TK=2*Math.tan(35/2*Math.PI/180);
function fitDist(ex){const objH=6.9+3.9*ex,objW=9.6+2.5*ex;return Math.max(objH/TK,objW/(TK*aspEff))*1.05}
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;tgtE=explode(p);e+=(tgtE-e)*.14;spin+=RM?0:dt;
 const a=spin*1.4+p*16;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*Math.PI*2)*.45+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((-.28+Math.sin(p*Math.PI)*.22+up)-P.rotation.x)*.12;
 // explode positions
 parts.forEach(q=>{q[0].position[q[1]]=q[2]+(q[3]-q[2])*e});PA.position.y=1.1*e;
 // crank rotation and piston kinematics
 crank.rotation.z=a;gA.rotation.z=rho1+a;gB.rotation.z=rho2-a*N1/N2;fw.rotation.z=a;
 let fs=0;
 pis.forEach((q,i)=>{const th=Math.PI/2+PHI[i]+a,px=RC*Math.cos(th),py=RC*Math.sin(th),yp=py+Math.sqrt(LR*LR-px*px);
  q.g.position.y=yp;q.rod.position.set(px/2,(py+yp)/2,q.z);q.rod.rotation.z=Math.atan2(px,yp-py);q.big.position.set(px,py,q.z);
  const f=Math.pow(Math.max(0,Math.min(1,(yp-1.3)/.9)),6);fs+=f;
  tips[i].material.color.setRGB(.48+.52*f,.19+.4*f,.06+.14*f);halos[i].material.opacity=f*.55;halos[i].scale.setScalar(.7+f*.7)});
 R1.rotation.set(1.1,spin*.25,spin*.5);R2.rotation.set(spin*.4,1.0,spin*.3);
 pl.intensity=2+Math.sin(now/500)*.4+fs*.6;
 const dz=fitDist(e);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{engine()}catch(err){const s=$('#roata3d');if(s)s.classList.add('fallback')}
})();

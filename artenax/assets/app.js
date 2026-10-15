(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;

/* ---------- hours ---------- */
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
if(hb)D.forEach((d,i)=>{const t=i<5?'09:00–18:00':i===5?'08:00–14:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});

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
if(!GL||!window.THREE){const s=$('#model3d');if(s)s.classList.add('fallback');return}
const T=THREE;

/* ---------- shared builder: wheel + brake (axis = local Z, outboard = +Z) ---------- */
function mats(){return{
steel:new T.MeshStandardMaterial({color:0xd8d0cf,metalness:.7,roughness:.32}),
cu:new T.MeshStandardMaterial({color:0xe8955a,metalness:.55,roughness:.38,emissive:0x3d1c0c}),
ch:new T.MeshStandardMaterial({color:0xf4d9a8,metalness:.4,roughness:.4,emissive:0x4a3a1c}),
dark:new T.MeshStandardMaterial({color:0x2c141b,metalness:.55,roughness:.5,side:T.DoubleSide}),
lin:new T.MeshStandardMaterial({color:0x6a4636,metalness:.2,roughness:.8}),
glass:new T.MeshStandardMaterial({color:0x4a2230,metalness:.3,roughness:.6,transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false}),
edge:new T.LineBasicMaterial({color:0xf4d9a8,transparent:true,opacity:.8}),
glowC:new T.MeshBasicMaterial({color:0xe8955a}),glowH:new T.MeshBasicMaterial({color:0xf4d9a8})}}
function wheel(full,SEG){
const M=mats(),root=new T.Group(),parts=[],spin=[],PI2=Math.PI*2;
const circ=(r,x,y)=>{const p=new T.Path();p.absarc(x||0,y||0,r,0,PI2,true);return p};
const ext=(s,th)=>{const g=new T.ExtrudeGeometry(s,{depth:th,bevelEnabled:false,curveSegments:Math.max(12,SEG/2)});g.translate(0,0,-th/2);return g};
const edges=(m,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),M.edge));return m};
const cylZ=(rt,rb,h,open,mat,seg)=>{const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,seg||SEG,1,open),mat);m.rotation.x=Math.PI/2;return m};
const sector=(r0,r1,a0,a1,th)=>{const s=new T.Shape();s.absarc(0,0,r1,a0,a1,false);s.absarc(0,0,r0,a1,a0,true);s.closePath();return ext(s,th)};
const add=(par,g,ax,a,b,sp)=>{par.add(g);g.position[ax]=a;parts.push([g,ax,a,b]);if(sp)spin.push(g);return g};
const torus=(R,t,z,mat)=>{const m=new T.Mesh(new T.TorusGeometry(R,t,8,SEG),mat);m.position.z=z;return m};
// brake disc (drilled) with hat
const D=new T.Group();root.add(D);spin.push(D);
const ds=new T.Shape();ds.absarc(0,0,1.6,0,PI2,false);ds.holes.push(circ(.55));
for(let i=0;i<5;i++){const a=i/5*PI2;ds.holes.push(circ(.1,Math.cos(a)*.8,Math.sin(a)*.8))}
for(let i=0;i<14;i++){const a=i/14*PI2;ds.holes.push(circ(.07,Math.cos(a)*1.15,Math.sin(a)*1.15));const b=a+PI2/28;ds.holes.push(circ(.07,Math.cos(b)*1.38,Math.sin(b)*1.38))}
const disc=new T.Mesh(ext(ds,.2),M.cu);edges(disc,40);D.add(disc);
[.11,-.11].forEach(z=>{D.add(torus(1.6,.018,z,M.glowH));D.add(torus(.56,.018,z,M.glowH))});
const hat=cylZ(.92,.92,.32,true,M.dark);hat.position.z=-.2;D.add(hat);const hcap=cylZ(.92,.92,.04,false,M.dark);hcap.position.z=-.36;D.add(hcap);D.add(Object.assign(torus(.92,.02,-.36,M.glowC)));
// hub flange with studs
const H=new T.Group();H.add(cylZ(.95,.95,.14,false,M.steel));edges(H.children[0],30);
for(let i=0;i<5;i++){const a=i/5*PI2,s=cylZ(.06,.06,1.0,false,M.steel,12);s.position.set(Math.cos(a)*.8,Math.sin(a)*.8,.45);H.add(s)}
add(root,H,'z',-.5,-3.2,true);
// caliper + pads (group rotated, sits at the upper right of the disc)
const C=new T.Group();C.rotation.z=.5;root.add(C);
function half(sg){const g=new T.Group(),b=new T.Mesh(sector(1.1,1.95,-.45,.45,.36),M.cu);edges(b,30);g.add(b);
 [-.2,.2].forEach(a=>{const p=cylZ(.2,.2,.12,false,M.dark,20);p.position.set(Math.cos(a)*1.5,Math.sin(a)*1.5,-sg*.2);g.add(p)});
 const nip=new T.Mesh(new T.CylinderGeometry(.07,.07,.3,10),M.steel);nip.position.set(1.95,0,0);nip.rotation.z=Math.PI/2;g.add(nip);return g}
add(C,half(1),'z',.4,2.1);add(C,half(-1),'z',-.4,-2.1);
const br=new T.Mesh(sector(1.97,2.07,-.45,.45,1.16),M.ch);edges(br,30);add(C,br,'x',0,1.4);
function pad(sg){const g=new T.Group(),bk=new T.Mesh(sector(1.25,1.8,-.3,.3,.08),M.dark);bk.position.z=sg*.05;g.add(bk);edges(bk,30);
 const ln=new T.Mesh(sector(1.25,1.8,-.3,.3,.1),M.lin);ln.position.z=-sg*.045;g.add(ln);return g}
add(C,pad(1),'z',.24,1.2);add(C,pad(-1),'z',-.24,-1.2);
if(full){
 // rim: barrel, lips, 5 spokes, centre cap
 const R=new T.Group();R.add(cylZ(2.15,2.15,1.1,true,M.steel));R.add(torus(2.15,.07,.55,M.glowH));R.add(torus(2.15,.07,-.55,M.glowH));
 for(let i=0;i<5;i++){const a=i/5*PI2+.3,sp=new T.Mesh(new T.BoxGeometry(.46,1.55,.14),M.steel);sp.position.set(Math.cos(a)*1.3,Math.sin(a)*1.3,.25);sp.rotation.z=a-Math.PI/2;edges(sp,30);R.add(sp)}
 const cp=cylZ(.55,.55,.2,false,M.cu);cp.position.z=.3;R.add(cp);R.add(torus(.55,.02,.41,M.glowH));
 add(root,R,'z',.5,2.9,true);
 // tyre (glass lathe + tread rings)
 const pr=[[2.15,-.5],[2.5,-.7],[3.05,-.62],[3.3,-.4],[3.3,.4],[3.05,.62],[2.5,.7],[2.15,.5]].map(q=>new T.Vector2(q[0],q[1]));
 const ty=new T.Mesh(new T.LatheGeometry(pr,SEG*2),M.glass);ty.rotation.x=Math.PI/2;
 const tg=new T.Group();tg.add(ty);ty.add(new T.LineSegments(new T.EdgesGeometry(ty.geometry,20),M.edge));
 [-.22,0,.22].forEach(z=>tg.add(torus(3.3,.035,z,z?M.glowH:M.glowC)));
 add(root,tg,'z',.5,4.3,true);
 // lug nuts
 const L=new T.Group();
 for(let i=0;i<5;i++){const a=i/5*PI2,n=new T.Mesh(new T.CylinderGeometry(.17,.17,.24,6),M.steel);n.rotation.x=Math.PI/2;n.position.set(Math.cos(a)*.8,Math.sin(a)*.8,0);edges(n,30);L.add(n)}
 add(root,L,'z',1.1,5.6,true);
}
return{root:root,parts:parts,spin:spin,M:M,torus:torus}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xfff1e8,0x12060a,.95));const dl=new T.DirectionalLight(0xffffff,1.15);dl.position.set(4,6,8);sc.add(dl);
const a=new T.PointLight(0xe8955a,2.2*k,30);a.position.set(-4,-2,6);sc.add(a);const b=new T.PointLight(0xf4d9a8,1.4*k,30);b.position.set(5,3,5);sc.add(b);return a}

/* ---------- HERO 3D: brake disc + caliper, breathing apart ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,13);
const pl=lights(sc,1);
const W=wheel(false,isMob()?28:44);const G=new T.Group(),Y=new T.Group();sc.add(G);G.add(Y);Y.add(W.root);Y.rotation.y=.75;
const R1=new T.Mesh(new T.TorusGeometry(2.9,.03,8,96),W.M.glowH),R2=new T.Mesh(new T.TorusGeometry(2.6,.025,8,96),W.M.glowC);G.add(R1);G.add(R2);
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 cam.aspect=w/h;cam.clearViewOffset();
 if(!isMob()){G.position.set(2.8,0,0);G.scale.setScalar(1.15)}else{G.position.set(0,0,0);G.scale.setScalar(.9)}
 cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);const hx=$('#htx');if(hx)new ResizeObserver(vo).observe(hx);setTimeout(vo,900);setTimeout(vo,2000);
let tx=0,ty=0,mx=0,my=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)}},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
 mx+=(tx-mx)*.05;my+=(ty-my)*.05;const s=Math.min(1,scrollY/innerHeight);
 const e=RM?.2:Math.max(0,Math.min(1,.28+.22*Math.sin(t*.7)+s*.6));
 W.parts.forEach(q=>q[0].position[q[1]]=q[2]+(q[3]-q[2])*e);
 W.root.position.z=-(.1+.55*e);
 const a=t*.9;W.spin.forEach(g=>g.rotation.z=a);
 Y.rotation.y=.75+mx*.6+Math.sin(t*.3)*.15;G.rotation.x=my*.3-.15;
 R1.rotation.set(1.2,t*.25,t*.4);R2.rotation.set(t*.3,1.0,t*.2);
 pl.intensity=2+Math.sin(t*3)*.4;
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D: exploded wheel + brake (illustrative model) ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,18);
const pl=lights(sc,1.1);
const SEG=isMob()?32:48;
const WL=wheel(true,SEG);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(WL.root);G.rotation.y=.95;
const R1=new T.Mesh(new T.TorusGeometry(4.2,.035,10,96),WL.M.glowH),R2=new T.Mesh(new T.TorusGeometry(3.9,.03,10,96),WL.M.glowC);P.add(R1);P.add(R2);
// inspection scanner ring sweeping along the wheel axis
const scM=new T.MeshBasicMaterial({color:0xf4d9a8,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}),scan=new T.Mesh(new T.TorusGeometry(3.55,.04,8,SEG*2),scM);WL.root.add(scan);
let uy=0,up=0,drag=null,prog=0,e=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-1.2,Math.min(1.2,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
const chs=$$('#model3d .r3ch'),bar=$('#r3bar');
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
// camera distance that fits the whole model (tyre diameter 6.6; axial span 1.8 assembled -> 9 exploded)
const TK=2*Math.tan(35/2*Math.PI/180);
function fitDist(ex){const objH=7.4+1.4*ex,objW=5.6+6.4*ex;return Math.max(objH/TK,objW/(TK*aspEff))*1.06}
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;e+=(explode(p)-e)*.14;spin+=RM?0:dt;
 const a=spin*1.2+p*14;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*Math.PI*2)*.4+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((-.22+Math.sin(p*Math.PI)*.2+up)-P.rotation.x)*.12;
 WL.parts.forEach(q=>q[0].position[q[1]]=q[2]+(q[3]-q[2])*e);
 WL.root.position.z=-(.3+.8*e);
 WL.spin.forEach(g=>g.rotation.z=a);
 const u=(spin*.16+p*1.4)%1;scan.position.z=-3.6+u*9.6;scM.opacity=Math.sin(u*Math.PI)*.85;
 R1.rotation.set(1.1,spin*.25,spin*.5);R2.rotation.set(spin*.4,1.0,spin*.3);
 pl.intensity=2.2+Math.sin(now/500)*.4;
 const dz=fitDist(e);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

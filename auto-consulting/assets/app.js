(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;

/* ---------- hours ---------- */
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
if(hb)D.forEach((d,i)=>{const t=i<5?'08:00–16:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});

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

/* ---------- shared builder: a car from primitives + documents + stamp + key (x = forward, y = up, z = width) ---------- */
function mats(){return{
body:new T.MeshStandardMaterial({color:0x2a3338,metalness:.65,roughness:.35}),
lime:new T.MeshStandardMaterial({color:0xb8f23c,metalness:.45,roughness:.4,emissive:0x2a3a0a}),
pale:new T.MeshStandardMaterial({color:0xe6f9b4,metalness:.3,roughness:.45,emissive:0x333c1c}),
steel:new T.MeshStandardMaterial({color:0xcdd5d1,metalness:.7,roughness:.32}),
dark:new T.MeshStandardMaterial({color:0x13181a,metalness:.5,roughness:.55,side:T.DoubleSide}),
paper:new T.MeshStandardMaterial({color:0xeef3e6,metalness:0,roughness:.85,emissive:0x1a1d16}),
glass:new T.MeshStandardMaterial({color:0x3d5a50,metalness:.3,roughness:.3,transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}),
edge:new T.LineBasicMaterial({color:0xe6f9b4,transparent:true,opacity:.7}),
edgeL:new T.LineBasicMaterial({color:0xb8f23c}),
glowL:new T.MeshBasicMaterial({color:0xb8f23c}),glowP:new T.MeshBasicMaterial({color:0xe6f9b4}),
head:new T.MeshBasicMaterial({color:0xfff6c8}),tail:new T.MeshBasicMaterial({color:0xff5a4a})}}
function car(SEG){
const M=mats(),root=new T.Group(),parts=[],spin=[],keys=[],PI=Math.PI,V=(x,y,z)=>new T.Vector3(x,y,z);
const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat||M.edge));return m};
const box=(w,h,d,mat,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x||0,y||0,z||0);return m};
const add=(o,a,b,r0,r1)=>{root.add(o);o.position.copy(a);parts.push({o:o,a:a,b:b,r0:r0||0,r1:r1===undefined?(r0||0):r1});return o};
const ext=(sh,depth)=>{const g=new T.ExtrudeGeometry(sh,{depth:depth,bevelEnabled:false,curveSegments:Math.max(8,SEG/2)});g.translate(0,0,-depth/2);return g};
// lower body: side profile with two wheel arches, extruded across the width
const bs=new T.Shape();bs.moveTo(-3,.3);bs.lineTo(-3,.95);bs.quadraticCurveTo(-3,1.15,-2.75,1.15);bs.lineTo(1.7,1.15);bs.quadraticCurveTo(2.85,1.1,3,.7);bs.lineTo(3,.3);
bs.lineTo(2.5,.3);bs.absarc(1.85,.3,.65,0,PI,false);bs.lineTo(-1.2,.3);bs.absarc(-1.85,.3,.65,0,PI,false);bs.lineTo(-3,.3);
const body=edges(new T.Mesh(ext(bs,2.3),M.body),M.edge,35);add(body,V(0,0,0),V(0,0,0));
// cabin (glass greenhouse) + roof panel
const cb=new T.Shape();cb.moveTo(-1.9,1.15);cb.lineTo(-1.1,1.85);cb.lineTo(.8,1.85);cb.lineTo(1.6,1.15);cb.closePath();
const cabin=new T.Group();const gl=new T.Mesh(ext(cb,2.0),M.glass);edges(gl,M.edgeL,20);cabin.add(gl);
const roof=box(1.9,.07,2.04,M.body,-.15,1.885,0);edges(roof,M.edge);cabin.add(roof);
add(cabin,V(0,0,0),V(0,1.05,0));
// chassis: rails, cross members, axles
const ch=new T.Group();
[-.7,.7].forEach(z=>{const r=box(5.7,.12,.14,M.steel,0,.12,z);edges(r,M.edgeL);ch.add(r)});
[-2.2,-.75,.75,2.2].forEach(x=>{const r=box(.14,.1,1.5,M.steel,x,.12,0);edges(r,M.edgeL);ch.add(r)});
[-1.85,1.85].forEach(x=>{const a=new T.Mesh(new T.CylinderGeometry(.06,.06,2.1,10),M.steel);a.rotation.x=PI/2;a.position.set(x,.3,0);ch.add(a)});
add(ch,V(0,0,0),V(0,-1.5,0));
// wheels: tyre torus, rim lip, 5 spokes, hub (spin around local Z)
[[-1.85,-1],[-1.85,1],[1.85,-1],[1.85,1]].forEach(q=>{
 const w=new T.Group(),sp=new T.Group();w.add(sp);
 sp.add(new T.Mesh(new T.TorusGeometry(.4,.17,12,SEG),M.dark));
 const lip=new T.Mesh(new T.TorusGeometry(.26,.025,6,SEG),M.glowL);sp.add(lip);
 for(let i=0;i<5;i++){const a=i/5*PI*2,s=box(.07,.3,.08,M.steel,Math.cos(a)*.15,Math.sin(a)*.15,0);s.rotation.z=a-PI/2;sp.add(s)}
 const hub=new T.Mesh(new T.CylinderGeometry(.07,.07,.2,10),M.steel);hub.rotation.x=PI/2;sp.add(hub);
 spin.push(sp);add(w,V(q[0],.3,q[1]),V(q[0],.3,q[1]*2.6))});
// lamps
const fr=new T.Group();[-.75,.75].forEach(z=>fr.add(box(.1,.16,.42,M.head,3,.85,z)));add(fr,V(0,0,0),V(1.3,0,0));
const rr=new T.Group();[-.85,.85].forEach(z=>rr.add(box(.1,.16,.4,M.tail,-3,.85,z)));
// licence plate (blank, no characters)
const pl=box(.05,.3,1.1,M.paper,-3.03,.5,0);edges(pl,M.edgeL);rr.add(pl);
for(let i=0;i<6;i++)rr.add(box(.07,.15,.07,M.dark,-3.07,.5,-.4+i*.16));
add(rr,V(0,0,0),V(-1.6,0,0));
// documents: three sheets with text lines and a stamp ring on the top one
for(let i=0;i<3;i++){const d=new T.Group();const sh=box(1.5,.045,1.15,M.paper,0,0,0);edges(sh,M.edgeL,20);d.add(sh);
 [-.3,-.1,.1].forEach((z,k)=>d.add(box(1.0-k*.2,.05,.05,M.lime,-.1,0,z)));
 if(i===2){const r=new T.Mesh(new T.TorusGeometry(.2,.025,6,24),M.glowL);r.rotation.x=PI/2;r.position.set(.45,.03,.3);d.add(r)}
 add(d,V(-.15,1.38+i*.12,0),V(-.15,3.3+i*.65,0),0,(i-1)*.35)}
// stamp
const mk=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x,y,z);return m};
const st=new T.Group();st.add(mk(new T.CylinderGeometry(.4,.4,.12,SEG),M.lime,0,.06,0));
st.add(mk(new T.CylinderGeometry(.11,.13,.55,12),M.pale,0,.4,0));
st.add(mk(new T.SphereGeometry(.2,14,10),M.pale,0,.78,0));
const sg=new T.Mesh(new T.TorusGeometry(.4,.02,6,SEG),M.glowP);sg.rotation.x=PI/2;sg.position.y=.12;st.add(sg);
add(st,V(.3,.8,.3),V(2.4,3.4,0));
// key
const ky=new T.Group();const kr=new T.Mesh(new T.TorusGeometry(.28,.07,10,24),M.pale);ky.add(kr);
ky.add(box(.95,.1,.1,M.pale,.78,0,0));ky.add(box(.1,.24,.1,M.pale,.95,-.15,0));ky.add(box(.1,.18,.1,M.pale,1.2,-.12,0));
ky.position.set(-.45,0,0);const kg=new T.Group();kg.add(ky);keys.push(kg);
add(kg,V(-.6,.8,-.3),V(-2.5,3.5,0));
return{root:root,parts:parts,spin:spin,keys:keys,M:M}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xeaf5e6,0x0c1010,.95));const dl=new T.DirectionalLight(0xffffff,1.15);dl.position.set(4,6,8);sc.add(dl);
const a=new T.PointLight(0xb8f23c,2.2*k,30);a.position.set(-4,-2,6);sc.add(a);const b=new T.PointLight(0xe6f9b4,1.4*k,30);b.position.set(5,3,5);sc.add(b);return a}
function placeParts(C,e,t){C.parts.forEach(q=>{q.o.position.lerpVectors(q.a,q.b,e);q.o.rotation.y=q.r0+(q.r1-q.r0)*e});
 C.keys.forEach(g=>g.rotation.y=t*1.3)}
// floor rings (arcs that turn) and a scanner ring that sweeps up the car
function rings(C){const g=new T.Group(),mk=(R,arc,mat)=>{const h=new T.Group(),m=new T.Mesh(new T.TorusGeometry(R,.03,8,96,arc),mat);m.rotation.x=Math.PI/2;h.add(m);g.add(h);return h};
const r1=mk(4.1,4.2,C.M.glowP),r2=mk(3.7,3,C.M.glowL);C.root.add(g);return{g:g,r1:r1,r2:r2}}

/* ---------- HERO 3D: car + documents, breathing apart ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,13);
const pl=lights(sc,1);
const C=car(isMob()?20:32);const G=new T.Group(),Y=new T.Group();sc.add(G);G.add(Y);Y.add(C.root);Y.rotation.y=.75;
const RG=rings(C);
let hs=1;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 cam.aspect=w/h;cam.clearViewOffset();
 const hw=4.1*cam.aspect;
 if(!isMob()){const rw=hw*.5,s=Math.max(.45,Math.min(1.25,rw/4.2));hs=s;G.position.set(hw*.45,0,0);G.scale.setScalar(s)}
 else{const s=Math.max(.5,Math.min(1,hw*.9/3.8));hs=s;G.position.set(0,0,0);G.scale.setScalar(s)}
 cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);const hx=$('#htx');if(hx)new ResizeObserver(vo).observe(hx);setTimeout(vo,900);setTimeout(vo,2000);
let tx=0,mx=0,uy=0,drag=null;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5)}},{passive:true});
const el=ren.domElement;el.style.touchAction='pan-y';
el.addEventListener('pointerdown',ev=>{drag=[ev.clientX];try{el.setPointerCapture(ev.pointerId)}catch(_){}});
el.addEventListener('pointermove',ev=>{if(!drag)return;uy+=(ev.clientX-drag[0])*.01;drag=[ev.clientX]});
const pu=()=>{drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
 mx+=(tx-mx)*.05;if(!drag)uy*=.97;const s=Math.min(1,scrollY/innerHeight);
 const e=RM?.2:Math.max(0,Math.min(.65,.2+.16*Math.sin(t*.7)+s*.5));
 placeParts(C,e,t);C.root.position.y=-(.8+.75*e);
 C.spin.forEach(g=>g.rotation.z=-t*2.2);
 RG.g.position.y=-.35-1.5*e;RG.r1.rotation.y=t*.3;RG.r2.rotation.y=-t*.5;
 Y.rotation.y=.75+mx*.6+Math.sin(t*.3)*.15+uy;G.rotation.x=.16;
 pl.intensity=2+Math.sin(t*3)*.4;
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D: exploding car with documents, stamp and key (illustrative model) ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,18);
const pl=lights(sc,1.1);
const SEG=isMob()?20:32;
const C=car(SEG);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(C.root);G.rotation.y=.8;
const RG=rings(C);
const scM=new T.MeshBasicMaterial({color:0xb8f23c,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}),scan=new T.Mesh(new T.TorusGeometry(3.4,.04,8,SEG*3),scM);scan.rotation.x=Math.PI/2;C.root.add(scan);
let uy=0,up=0,drag=null,prog=0,e=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-1.6,Math.min(1.6,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
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
// camera distance that fits the whole model (assembled 2.4 x 6.8; exploded 6.8 x 9)
const TK=2*Math.tan(35/2*Math.PI/180);
function fitDist(ex){const objH=2.5+4.5*ex,objW=6.8+2.4*ex;return Math.max(objH/TK,objW/(TK*aspEff))*1.12}
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;e+=(explode(p)-e)*.14;spin+=RM?0:dt;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*Math.PI*2)*.4+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.2+Math.sin(p*Math.PI)*.1+up)-P.rotation.x)*.12;
 placeParts(C,e,spin);
 C.root.position.y=-(.8+.75*e);
 C.spin.forEach(g=>g.rotation.z=-(spin*2.2+p*14));
 RG.g.position.y=-.35-1.5*e;RG.r1.rotation.y=spin*.3;RG.r2.rotation.y=-spin*.5;
 const u=(spin*.16+p*1.4)%1;scan.position.y=-.2+u*(2.4+2.6*e);scM.opacity=Math.sin(u*Math.PI)*.85;
 pl.intensity=2.2+Math.sin(now/500)*.4;
 const dz=fitDist(e);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

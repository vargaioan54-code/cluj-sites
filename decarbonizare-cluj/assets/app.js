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

/* ---------- GL helpers ---------- */
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();
if(!GL||!window.THREE){const s=$('#model3d');if(s)s.classList.add('fallback');return}
const T=THREE,PI=Math.PI;
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};

/* ---------- materials ---------- */
function mats(){return{
metal:new T.MeshStandardMaterial({color:0xc9cde0,metalness:.75,roughness:.3}),
crown:new T.MeshStandardMaterial({color:0xc9cde0,metalness:.75,roughness:.3,emissive:0x000000}),
body:new T.MeshStandardMaterial({color:0x2c2b3a,metalness:.65,roughness:.38}),
bodyDS:new T.MeshStandardMaterial({color:0x2c2b3a,metalness:.6,roughness:.45,side:T.DoubleSide}),
vio:new T.MeshStandardMaterial({color:0x8b6cff,metalness:.45,roughness:.4,emissive:0x1d1245}),
pale:new T.MeshStandardMaterial({color:0xcfc4ff,metalness:.3,roughness:.45,emissive:0x2a2548}),
soot:new T.MeshStandardMaterial({color:0x2a2420,metalness:.1,roughness:.95,emissive:0x24150d}),
glass:new T.MeshStandardMaterial({color:0x6f6aa8,metalness:.3,roughness:.3,transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false}),
edge:new T.LineBasicMaterial({color:0xcfc4ff,transparent:true,opacity:.7}),
edgeV:new T.LineBasicMaterial({color:0x8b6cff}),
glowV:new T.MeshBasicMaterial({color:0x8b6cff}),glowP:new T.MeshBasicMaterial({color:0xcfc4ff}),
ice:new T.MeshBasicMaterial({color:0xbfe9ff}),tip:new T.MeshBasicMaterial({color:0xff6b81})}}
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}

/* ---------- the model: one engine cylinder (y = axis, up = head) ----------
   crankshaft, connecting rod, piston with rings, cylinder liner, head, 2 valves + springs,
   injector, intake and exhaust pipes. Carbon deposits (soot) sit on the piston crown, valves,
   liner wall and exhaust pipe and dissolve as "clean" goes 0 -> 1. Illustrative, not a specific engine. */
function engine(SEG){
const M=mats(),root=new T.Group(),parts=[],V=(x,y,z)=>new T.Vector3(x,y,z);
let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat||M.edge));return m};
const mesh=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x||0,y||0,z||0);return m};
const box=(w,h,d,mat,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),mat,x,y,z);
const cyl=(r,h,mat,x,y,z,seg)=>mesh(new T.CylinderGeometry(r,r,h,seg||SEG),mat,x,y,z);
const cylZ=(r,h,mat,x,y,z)=>{const m=cyl(r,h,mat,x,y,z);m.rotation.x=PI/2;return m};
const tor=(R,t,mat,x,y,z,rx,ry)=>{const m=mesh(new T.TorusGeometry(R,t,8,SEG),mat,x,y,z);m.rotation.x=rx||0;m.rotation.y=ry||0;return m};
const add=(o,a,b,r1)=>{o.position.copy(a);root.add(o);parts.push({o:o,a:a,b:b,r0:0,r1:r1||0});return o};
const soot=[];
const blob=(par,x,y,z,s,d)=>{const m=mesh(new T.IcosahedronGeometry(1,0),M.soot,x,y,z);const sx=s*(1+rnd()*.4),sy=s*(.45+rnd()*.25),sz=s*(.9+rnd()*.3);m.scale.set(sx,sy,sz);m.rotation.set(rnd()*3,rnd()*6,rnd()*3);par.add(m);soot.push({m:m,sx:sx,sy:sy,sz:sz,d:d})};

// crankshaft (anchor y -2.6): journal, two webs, counterweights (below), crank pin (above)
const cr=new T.Group();cr.add(edges(cylZ(.4,1.7,M.metal,0,0,0)));
[-1,1].forEach(s=>{cr.add(edges(cylZ(.6,.14,M.body,0,0,s*.56)));
 const cw=new T.Group(),h=mesh(new T.CylinderGeometry(.95,.95,.2,SEG,1,false,0,PI),M.body,0,0,0);h.rotation.x=PI/2;cw.add(h);cw.rotation.z=-PI/2;cw.position.z=s*.58;cr.add(cw)});
cr.add(cylZ(.3,1.14,M.vio,0,.5,0));
add(cr,V(0,-2.6,0),V(0,-5.4,0),0);
// connecting rod (anchor y -1.1): shank, big end, small end
const rod=new T.Group();rod.add(edges(box(.26,1.6,.4,M.metal,0,-.05,0)));
rod.add(tor(.5,.13,M.metal,0,-1,0,0));rod.add(tor(.28,.1,M.metal,0,.9,0,0));
add(rod,V(0,-1.1,0),V(0,-3.7,0),-.8);
// piston (anchor y -.1): body, 3 ring grooves, wrist pin, crown glow ring, soot on the crown
const pis=new T.Group();pis.add(edges(cyl(.95,1,M.crown,0,0,0)));
[.3,.12,-.06].forEach(y=>pis.add(tor(.955,.035,M.vio,0,y,0,PI/2)));
pis.add(cylZ(.15,1.5,M.pale,0,-.1,0));
const cg=tor(.78,.035,M.ice,0,.51,0,PI/2);pis.add(cg);
for(let i=0;i<10;i++){const an=i*2.4,rd=.12+rnd()*.62;blob(pis,Math.cos(an)*rd,.54,Math.sin(an)*rd,.2+rnd()*.12,rnd()*.9)}
add(pis,V(0,-.1,0),V(0,-1.9,0),1);
// cylinder liner (anchor y .9): glass tube, end rings, cooling fins, vertical guide lines, soot on the wall
const ln=new T.Group();ln.add(mesh(new T.CylinderGeometry(1.05,1.05,3.2,SEG,1,true),M.glass));
[-1.6,1.6].forEach(y=>ln.add(tor(1.05,.05,M.metal,0,y,0,PI/2)));
[-1.15,-.6,-.05,.5,1.05].forEach(y=>ln.add(tor(1.1,.045,M.body,0,y,0,PI/2)));
const lp=[];for(let i=0;i<12;i++){const a=i/12*PI*2,x=Math.cos(a)*1.05,z=Math.sin(a)*1.05;lp.push(x,-1.6,z,x,1.6,z)}
const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));ln.add(new T.LineSegments(lg,M.edge));
for(let i=0;i<7;i++){const a=i*.9,y=.55+rnd()*.9;blob(ln,Math.cos(a)*1,y,Math.sin(a)*1,.13+rnd()*.07,.15+rnd()*.8)}
// particle clouds live inside the liner: grey ash (dirty) and icy bubbles (cleaning)
const tex=dotTex(),NP=64,mk=(col,size,blend)=>{const g=new T.BufferGeometry(),pos=new Float32Array(NP*3),seed=[];
 for(let i=0;i<NP;i++){seed.push({a:rnd()*PI*2,r:Math.sqrt(rnd())*.82,y:-1.5+rnd()*3,v:.25+rnd()*.5});pos[i*3]=Math.cos(seed[i].a)*seed[i].r;pos[i*3+1]=seed[i].y;pos[i*3+2]=Math.sin(seed[i].a)*seed[i].r}
 g.setAttribute('position',new T.BufferAttribute(pos,3));
 const m=new T.PointsMaterial({color:col,size:size,map:tex,transparent:true,depthWrite:false,opacity:0,blending:blend});
 const p=new T.Points(g,m);p.frustumCulled=false;ln.add(p);return{p:p,m:m,pos:pos,seed:seed}};
const ash=mk(0x9a8f86,.26,T.NormalBlending),bub=mk(0xbfe9ff,.22,T.AdditiveBlending);
add(ln,V(0,.9,0),V(0,1.9,0),-.5);
// cylinder head (anchor y 2.85)
const hd=new T.Group();hd.add(edges(box(2.8,.7,2.4,M.body,0,0,0)));hd.add(edges(box(2.4,.14,1.8,M.body,0,.42,0)));
[[-1.1,-.9],[1.1,-.9],[-1.1,.9],[1.1,.9]].forEach(q=>hd.add(cyl(.09,.12,M.metal,q[0],.34,q[1],8)));
hd.add(box(2.4,.05,.1,M.vio,0,.5,0));
add(hd,V(0,2.85,0),V(0,5.2,0),.6);
// injector / plug (anchor y 3.9)
const pg=new T.Group();pg.add(cyl(.14,.8,M.metal,0,.1,0,14));pg.add(cyl(.23,.18,M.metal,0,-.25,0,6));pg.add(cyl(.07,.26,M.pale,0,.62,0,10));pg.add(cyl(.05,.2,M.tip,0,-.5,0,8));
add(pg,V(0,3.9,0),V(0,6.5,0),2.2);
// valves (anchor y 2.35): head, stem, spring, retainer, soot on the head (exhaust valve is the dirtiest)
const valves=[];
[-1,1].forEach(s=>{const v=new T.Group();v.add(mesh(new T.CylinderGeometry(.1,.4,.12,SEG),M.metal,0,.06,0));v.add(cyl(.4,.03,M.pale,0,-.01,0));
 v.add(edges(cyl(.06,1.9,M.metal,0,.95,0,8)));[1,1.12,1.24,1.36,1.48].forEach(y=>v.add(tor(.17,.03,M.vio,0,y,0,PI/2)));v.add(cyl(.22,.05,M.vio,0,1.72,0,12));
 const n=s>0?4:2;for(let i=0;i<n;i++){const a=i*2.2+s,r=.05+rnd()*.2;blob(v,Math.cos(a)*r,.16,Math.sin(a)*r,.11+rnd()*.06,rnd()*.9)}
 valves.push(add(v,V(s*.5,2.35,0),V(s*1.7,3.9,0),s*1.5))});
// intake (left) and exhaust (right) pipes (anchor at the head wall), soot ring in the exhaust
[-1,1].forEach(s=>{const p=new T.Group();
 const body=mesh(new T.CylinderGeometry(.34,.34,1.2,SEG,1,true),M.bodyDS,s*.65,0,0);body.rotation.z=PI/2;p.add(body);
 const fl=cyl(.52,.12,M.body,s*.04,0,0);fl.rotation.z=PI/2;p.add(edges(fl));p.add(tor(.36,.04,M.vio,s*1.22,0,0,0,PI/2));
 if(s>0){const r=tor(.2,.1,M.soot,s*1.05,0,0,0,PI/2);p.add(r);soot.push({m:r,sx:1,sy:1,sz:1,d:.3});
  for(let i=0;i<3;i++)blob(p,s*(.6+i*.17),-.2,(i-1)*.12,.1+rnd()*.05,rnd()*.7)}
 else blob(p,s*.9,-.22,0,.1,.5);
 add(p,V(s*1.4,2.85,0),V(s*2.8,3.4,0),0)});
root.position.y=-.45;
return{root:root,parts:parts,soot:soot,valves:valves,ash:ash,bub:bub,crown:M.crown,glow:cg,M:M}}

function lights(sc,k){sc.add(new T.HemisphereLight(0xece8ff,0x0b0a10,.95));const dl=new T.DirectionalLight(0xffffff,1.15);dl.position.set(4,6,8);sc.add(dl);
const a=new T.PointLight(0x8b6cff,2.4*k,30);a.position.set(-4,-2,6);sc.add(a);const b=new T.PointLight(0xff6b81,1.1*k,30);b.position.set(5,3,5);sc.add(b);return a}
function placeParts(E,e,t,c,dt){
 E.parts.forEach(q=>{q.o.position.lerpVectors(q.a,q.b,e);q.o.rotation.y=q.r0+(q.r1-q.r0)*e});
 E.valves.forEach((v,i)=>{v.position.y-=Math.max(0,Math.sin(t*3+i*PI))*.12*(1-e)});
 E.soot.forEach(s=>{const k=Math.max(0,Math.min(1,(c-s.d*.55)/.45)),f=1-sm(k);s.m.visible=f>.02;s.m.scale.set(s.sx*f,s.sy*f,s.sz*f)});
 E.glow.visible=c>.03;E.glow.scale.setScalar(.2+.8*c);
 E.crown.emissive.setRGB(.06*c,.2*c,.34*c);
 E.ash.m.opacity=.8*(1-sm(c*1.15));E.bub.m.opacity=Math.min(1,Math.max(0,4*c*(1-c)*1.25));
 stepP(E.ash,dt,.55,1);stepP(E.bub,dt,1,1.6)}
function stepP(P,dt,sp,k){const a=P.pos,sdd=P.seed;for(let i=0;i<sdd.length;i++){const s=sdd[i];s.y+=dt*s.v*sp*k;if(s.y>1.5){s.y=-1.5;s.a=Math.random()*PI*2;s.r=Math.sqrt(Math.random())*.82}
 s.a+=dt*.4*sp;a[i*3]=Math.cos(s.a)*s.r;a[i*3+1]=s.y;a[i*3+2]=Math.sin(s.a)*s.r}P.p.geometry.attributes.position.needsUpdate=true}
// orbiting halo rings + a scan ring, perpendicular to the engine axis
function halo(){const g=new T.Group(),mk=(R,arc,mat)=>{const h=new T.Group(),m=new T.Mesh(new T.TorusGeometry(R,.03,8,96,arc),mat);m.rotation.x=PI/2;h.add(m);g.add(h);return h};
 const r1=mk(3.15,4.2,new T.MeshBasicMaterial({color:0xcfc4ff})),r2=mk(2.9,3,new T.MeshBasicMaterial({color:0x8b6cff}));return{g:g,r1:r1,r2:r2}}
const TK=2*Math.tan(35/2*PI/180);
// camera distance that fits the whole model (assembled 8.2 x 6.4, exploded 13.6 x 8.4; horizontal on phones)
function fitDist(ex,asp,horiz){const Hh=8.2+5.4*ex,Ww=6.4+2*ex,oh=horiz?Ww:Hh,ow=horiz?Hh:Ww;return Math.max(oh/TK,ow/(TK*asp))*1.12}

/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,24);
const pl=lights(sc,1);
const E=engine(isMob()?20:32);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);P.rotation.y=.6;
const H=halo();EG.add(H.g);
let aspEff=1;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 EG.rotation.z=isMob()?-PI/2:0;
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
 placeParts(E,e,t,c,RM?0:dt);
 H.g.position.y=Math.sin(t*.5)*2.2*(1-e*.5);H.r1.rotation.y=t*.3;H.r2.rotation.y=-t*.5;
 P.rotation.y=.6+mx*.6+Math.sin(t*.3)*.15+uy;G.rotation.x=.16;
 pl.intensity=2.2+Math.sin(t*3)*.4;
 const dz=fitDist(e,aspEff,isMob());cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D: exploding engine cylinder, soot dissolving (illustrative model) ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,24);
const pl=lights(sc,1.1);
const SEG=isMob()?20:32;
const E=engine(SEG);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);G.rotation.y=.5;
const HL=halo();EG.add(HL.g);
const scM=new T.MeshBasicMaterial({color:0xbfe9ff,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}),scan=new T.Mesh(new T.TorusGeometry(1.3,.04,8,SEG*3),scM);scan.rotation.x=PI/2;EG.add(scan);
let uy=0,up=0,drag=null,prog=0,e=0,c=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-1.6,Math.min(1.6,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
const chs=$$('#model3d .r3ch'),bar=$('#r3bar');
function explode(p){return p<.2?0:p<.55?sm((p-.2)/.35):p<.7?1:p<.95?1-sm((p-.7)/.25):0}
function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?Math.min(1,Math.max(0,-r.top/den)):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c2,j)=>c2.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile: free band below the tallest chapter text and above the bottom bar (engine lies horizontally); desktop: right half (engine upright)
function vo(){const w=W(),h=H();if(!w||!h)return;ren.setSize(w,h);
 EG.rotation.z=innerWidth<900?-PI/2:0;
 if(innerWidth>=900){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
 else{let tb=0;chs.forEach(c2=>{tb=Math.max(tb,c2.offsetHeight)});const top=78+tb+16,bot=h-96,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c2=>new ResizeObserver(vo).observe(c2));setTimeout(vo,800);setTimeout(vo,2000);
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;e+=(explode(p)-e)*.14;c+=(sm((p-.28)/.4)-c)*.12;spin+=RM?0:dt;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*PI*2)*.4+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.2+Math.sin(p*PI)*.1+up)-P.rotation.x)*.12;
 placeParts(E,e,spin,c,RM?0:dt);
 HL.g.position.y=Math.sin(spin*.5+p*4)*2.4;HL.r1.rotation.y=spin*.3;HL.r2.rotation.y=-spin*.5;
 const u=(spin*.16+p*1.4)%1;scan.position.y=-2+u*(6+3*e);scM.opacity=Math.sin(u*PI)*.8;
 pl.intensity=2.4+Math.sin(now/500)*.4;
 const dz=fitDist(e,aspEff,innerWidth<900);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

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
function mats(){
const ck=[0,1,2,3].map(()=>new T.MeshBasicMaterial({color:0x2c5560,transparent:true,opacity:.45,depthWrite:false}));
return{
metal:new T.MeshStandardMaterial({color:0xc3d3d8,metalness:.75,roughness:.3}),
body:new T.MeshStandardMaterial({color:0x1d3b47,metalness:.6,roughness:.38}),
dark:new T.MeshStandardMaterial({color:0x0a1a20,metalness:.5,roughness:.5}),
slab:new T.MeshStandardMaterial({color:0x123039,metalness:.4,roughness:.6}),
tire:new T.MeshStandardMaterial({color:0x0b0f11,metalness:.1,roughness:.9}),
amber:new T.MeshStandardMaterial({color:0xffc400,metalness:.4,roughness:.4,emissive:0x3a2c00}),
green:new T.MeshStandardMaterial({color:0x35e08a,metalness:.3,roughness:.35,emissive:0x0f5a33}),
glass:new T.MeshStandardMaterial({color:0x6fb7c4,metalness:.3,roughness:.25,transparent:true,opacity:.26,side:T.DoubleSide,depthWrite:false}),
edge:new T.LineBasicMaterial({color:0xbfe6ee,transparent:true,opacity:.7}),
lampF:new T.MeshBasicMaterial({color:0x5a4a10}),lampR:new T.MeshBasicMaterial({color:0x5a2020}),
beam:new T.MeshBasicMaterial({color:0xffc400,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),
ck:ck}}
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}

/* ---------- the model: a car on an inspection lane (x = length, front = +x, y = up) ----------
   lane slab with pits, two roller units (roller brake tester look), 4 wheels with brake discs and calipers,
   lower body, glass cabin with seats, steering wheel, head and tail lights with beams, exhaust with a gas probe.
   Four checkpoint rings (brakes, lights, steering, emissions) go amber -> green; a green check mark ("ADMIS") appears at the end.
   Illustrative, not a specific car and not the station's equipment. */
function car(SEG){
const M=mats(),root=new T.Group(),parts=[],spin=[],V=(x,y,z)=>new T.Vector3(x,y,z);
let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat||M.edge));return m};
const mesh=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x||0,y||0,z||0);return m};
const box=(w,h,d,mat,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),mat,x,y,z);
const cylZ=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateX(PI/2);return mesh(g,mat,x,y,z)};
const cylX=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateZ(PI/2);return mesh(g,mat,x,y,z)};
const tor=(R,t,mat,x,y,z,rx,ry)=>{const m=mesh(new T.TorusGeometry(R,t,8,SEG),mat,x,y,z);m.rotation.x=rx||0;m.rotation.y=ry||0;return m};
const add=(o,a,b,r1)=>{o.position.copy(a);root.add(o);parts.push({o:o,a:a,b:b,r0:0,r1:r1||0});return o};
const prof=(pts,depth)=>{const s=new T.Shape();pts.forEach((p,i)=>{if(i)s.lineTo(p[0],p[1]);else s.moveTo(p[0],p[1])});s.closePath();
 const g=new T.ExtrudeGeometry(s,{depth:depth-.12,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:1,steps:1});g.translate(0,0,-(depth-.12)/2);return g};

// lane slab (anchor 0,0,0): pits for the roller units, amber edge strips, dashes
const pl=new T.Group();pl.add(edges(box(11.4,.2,5.4,M.slab,0,-.1,0)));
[-1,1].forEach(s=>pl.add(box(11.4,.03,.14,M.amber,0,.015,s*2.55)));
[-1,1].forEach(sx=>[-1,1].forEach(sz=>pl.add(box(2.1,.03,1.2,M.dark,sx*2.5,.02,sz*1.5))));
[-4.6,-3.6,3.6,4.6].forEach(x=>pl.add(box(.5,.03,.1,M.amber,x,.02,0)));
add(pl,V(0,0,0),V(0,-3.4,0),0);
// roller units: two rollers per wheel, axis across the car; an amber nub shows the rotation
[-1,1].forEach(sx=>{const g=new T.Group();
 [-1,1].forEach(sz=>{[-1,1].forEach(d=>{const r=cylZ(.22,1,M.metal,sx*2.5+d*.42,.3,sz*1.5,SEG);r.add(box(.08,.08,.8,M.amber,0,.22,0));g.add(r);spin.push({o:r,k:2.8})});
  g.add(box(.5,.5,.45,M.dark,sx*2.5,.25,sz*2.35));g.add(box(.3,.08,.3,M.amber,sx*2.5,.52,sz*2.35))});
 add(g,V(0,0,0),V(sx*.8,-1.9,0),0)});
// wheels (anchor at the wheel centre): tyre, recessed rim, spokes, hub, brake disc (spins), caliper + brake checkpoint ring (static)
[[2.5,1.5],[2.5,-1.5],[-2.5,1.5],[-2.5,-1.5]].forEach(q=>{const sg=q[1]>0?1:-1,wg=new T.Group(),sp=new T.Group();
 sp.add(mesh(new T.TorusGeometry(.5,.16,10,SEG),M.tire,0,0,0));
 sp.add(cylZ(.5,.1,M.dark,0,0,0));sp.add(tor(.42,.04,M.metal,0,0,sg*.09));
 for(let i=0;i<5;i++){const b=box(.09,.84,.05,M.metal,0,0,sg*.07);b.rotation.z=i*PI/5;sp.add(b)}
 sp.add(cylZ(.12,.2,M.amber,0,0,sg*.08));
 sp.add(cylZ(.36,.04,M.metal,0,0,-sg*.12));
 wg.add(sp);spin.push({o:sp,k:-1});
 wg.add(box(.2,.34,.14,M.amber,.38,.12,-sg*.12));
 wg.add(tor(.82,.035,M.ck[0],0,0,sg*.34));
 add(wg,V(q[0],1.07,q[1]),V(q[0]*1.1,1.27,q[1]+sg*2.1),0)});
// lower body: side profile extruded across the car, amber stripe, bumpers
const low=new T.Group();
low.add(edges(mesh(prof([[-3.9,.7],[-3.9,1.55],[-3,1.7],[-1.9,1.75],[1.6,1.75],[3.2,1.65],[3.9,1.45],[3.9,.7]],2.8),M.body,0,0,0),20));
[-1,1].forEach(s=>low.add(box(6.4,.07,.03,M.amber,0,1.2,s*1.465)));
[-1,1].forEach(s=>low.add(box(.14,.34,2.5,M.dark,s*3.99,.9,0)));
add(low,V(0,0,0),V(0,.8,0),0);
// cabin: glass greenhouse, roof, two seats
const cb=new T.Group();
cb.add(edges(mesh(prof([[-2,1.75],[-1.15,2.65],[-.55,2.9],[.85,2.9],[1.9,1.75]],2.5),M.glass,0,0,0),20));
cb.add(box(1.4,.08,2.3,M.body,.15,2.95,0));
[-1,1].forEach(s=>{cb.add(box(.7,.15,.7,M.dark,-.2,1.98,s*.6));const bk=box(.14,.7,.7,M.dark,-.6,2.3,s*.6);bk.rotation.z=.15;cb.add(bk)});
add(cb,V(0,0,0),V(0,3,0),0);
// steering wheel (anchor at the column) with its checkpoint ring
const st=new T.Group();st.add(tor(.34,.04,M.dark,0,0,0,0,PI/2));st.add(cylX(.08,.1,M.metal,0,0,0,10));
const col=cylX(.04,.9,M.metal,.45,-.12,0,8);col.rotation.z=-.3;st.add(col);
st.add(tor(.52,.03,M.ck[2],0,0,0,0,PI/2));st.rotation.z=-.45;
add(st,V(1,2.35,-.55),V(1.9,4.2,-.55),0);
// head lights (+ beams) and tail lights, with the lights checkpoint rings
const hf=new T.Group();[-1,1].forEach(s=>{hf.add(edges(box(.16,.22,.55,M.lampF,3.98,1.38,s*.95)));hf.add(tor(.42,.03,M.ck[1],4.06,1.38,s*.95,0,PI/2));
 const bm=mesh(new T.ConeGeometry(.7,2.4,18,1,true),M.beam,5.2,1.38,s*.95);bm.rotation.z=PI/2;hf.add(bm)});
add(hf,V(0,0,0),V(1.8,.2,0),0);
const hr=new T.Group();[-1,1].forEach(s=>{hr.add(edges(box(.16,.22,.55,M.lampR,-3.98,1.4,s*.95)));hr.add(tor(.42,.03,M.ck[1],-4.06,1.4,s*.95,0,PI/2))});
add(hr,V(0,0,0),V(-1.8,.2,0),0);
// exhaust + emissions checkpoint ring + drifting gas puffs
const ex=new T.Group();ex.add(cylX(.12,2,M.metal,-3.1,.62,.85,12));ex.add(edges(cylX(.3,1,M.metal,-2.4,.62,.85,16),M.edge));ex.add(cylX(.17,.15,M.dark,-4.1,.62,.85,12));
ex.add(tor(.32,.03,M.ck[3],-4.2,.62,.85,0,PI/2));
const NP=36,tex=dotTex(),gg=new T.BufferGeometry(),gpos=new Float32Array(NP*3),gs=[];
for(let i=0;i<NP;i++){gs.push({u:rnd(),v:.25+rnd()*.35,j:rnd()-.5,k:rnd()-.5})}
gg.setAttribute('position',new T.BufferAttribute(gpos,3));
const gm=new T.PointsMaterial({color:0xa9c4ca,size:.34,map:tex,transparent:true,depthWrite:false,opacity:0}),gas={p:new T.Points(gg,gm),m:gm,pos:gpos,seed:gs};gas.p.frustumCulled=false;ex.add(gas.p);
add(ex,V(0,0,0),V(-1.5,-.55,0),0);
// gas probe in the tailpipe
const pr=new T.Group();pr.add(cylX(.04,1.2,M.metal,-4.6,.62,.85,8));pr.add(box(.5,.2,.18,M.amber,-5.5,.62,.85));pr.add(edges(box(.5,.45,.5,M.dark,-6,.4,.85)));pr.add(box(.2,.06,.2,M.green,-6,.66,.85));
add(pr,V(0,0,0),V(-1.4,.9,0),0);
// check mark ("ADMIS"): extruded tick above the roof, not part of the exploding set
const ts=new T.Shape();[[-1.15,0],[-.4,-.75],[1.15,.85],[.8,1.2],[-.4,-.04],[-.8,.35]].forEach((p,i)=>{if(i)ts.lineTo(p[0],p[1]);else ts.moveTo(p[0],p[1])});ts.closePath();
const tg=new T.ExtrudeGeometry(ts,{depth:.3,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:1});tg.translate(0,0,-.15);
const chk=new T.Group();chk.add(mesh(tg,M.green,0,0,0));chk.visible=false;chk.position.set(0,4.4,0);root.add(chk);
root.position.y=-2.65;
return{root:root,parts:parts,spin:spin,ck:M.ck,lampF:M.lampF,lampR:M.lampR,beam:M.beam,gas:gas,chk:chk,M:M}}

function lights(sc,k){sc.add(new T.HemisphereLight(0xe6f6f4,0x06141a,.95));const dl=new T.DirectionalLight(0xffffff,1.15);dl.position.set(4,6,8);sc.add(dl);
const a=new T.PointLight(0xffc400,2.4*k,30);a.position.set(-4,-2,6);sc.add(a);const b=new T.PointLight(0x35e08a,1.1*k,30);b.position.set(5,3,5);sc.add(b);return a}
// c: 0 -> 1 runs the four checkpoints in order (brakes, lights, steering, emissions), then the check mark pops up
function placeParts(E,e,t,c,dt,fy){
 E.parts.forEach(q=>{q.o.position.lerpVectors(q.a,q.b,e);q.o.rotation.y=q.r0+(q.r1-q.r0)*e});
 const s=[0,1,2,3].map(k=>c*4.6-k);
 E.ck.forEach((m,k)=>{const x=s[k];if(x<=0){m.color.setHex(0x2c5560);m.opacity=.45}else if(x<1){m.color.setHex(0xffc400);m.opacity=.65+.35*Math.sin(t*9)}else{m.color.setHex(0x35e08a);m.opacity=1}});
 const l=Math.max(0,Math.min(1,s[1]*2));
 E.lampF.color.setRGB(.35+.65*l,.29+.6*l,.06+.5*l);E.lampR.color.setRGB(.35+.65*l,.12+.1*l,.12+.1*l);
 E.beam.opacity=s[1]<=0?0:s[1]<1?.3:.14;
 const w=8*sm(s[0]*4)*(1-sm((s[0]-1)*2.5));E.spin.forEach(q=>{q.o.rotation.z+=dt*w*q.k});
 E.gas.m.opacity=.8*sm(s[3]*3)*(1-sm((s[3]-1.1)*3));stepGas(E.gas,dt);
 const k=sm((c-.88)/.12);E.chk.visible=k>.01;E.chk.scale.setScalar(.01+.95*k);E.chk.position.y=4.4+3.2*e+Math.sin(t*2)*.12;E.chk.rotation.y=-fy+Math.sin(t*.8)*.12}
function stepGas(P,dt){const a=P.pos,sd=P.seed;for(let i=0;i<sd.length;i++){const s=sd[i];s.u+=dt*s.v;if(s.u>1)s.u-=1;
 a[i*3]=-4.3-s.u*2.2;a[i*3+1]=.62+s.u*.55+s.j*.2*s.u;a[i*3+2]=.85+s.k*.5*s.u}P.p.geometry.attributes.position.needsUpdate=true}
// scanner arch: an amber ring that sweeps along the car
function halo(){const g=new T.Group(),m=new T.MeshBasicMaterial({color:0xffe27a,transparent:true,opacity:.7,depthWrite:false}),r=new T.Mesh(new T.TorusGeometry(2.3,.035,8,96),m);r.rotation.y=PI/2;r.position.y=1.5;g.add(r);return{g:g,m:m}}
const TK=2*Math.tan(35/2*PI/180);
// camera distance that fits the whole model (assembled ~12.8 x 5.8, exploded ~15.8 x 12.4; extra width margin for the yaw)
function fitDist(ex,asp){const Hh=5.8+6.6*ex,Ww=14.2+3.2*ex;return Math.max(Hh/TK,Ww/(TK*asp))*1.12}

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

/* ---------- PINNED 3D: car on the inspection lane, exploding, checkpoints lighting up, ADMIS (illustrative model) ---------- */
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
 else{let tb=0;chs.forEach(c2=>{tb=Math.max(tb,c2.offsetHeight)});const top=78+tb+16,bot=h-96,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
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

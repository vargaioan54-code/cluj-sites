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
function canv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
// bump map for the tyre lathe: v runs along the profile (uniform in point index), u around the circumference
function tyreBump(r){
 const W=2048,H=1024,c=canv(W,H),x=c.getContext('2d');x.fillStyle='#7a7a7a';x.fillRect(0,0,W,H);
 const Y=v=>(1-v)*H,y0=Y(r.t1),y1=Y(r.t0);
 // tread: raised blocks, lateral grooves (V-pattern) and fine sipes
 x.fillStyle='#ffffff';x.fillRect(0,y0,W,y1-y0);
 const N=84,bw=W/N,hh=(y1-y0);
 x.lineCap='butt';
 for(let i=0;i<N;i++){const u=i*bw;
  [[0,.5],[.5,1]].forEach((h,k)=>{const ya=y0+h[0]*hh,yb=y0+h[1]*hh,dir=k?-1:1;
   x.strokeStyle='#000';x.lineWidth=7;x.beginPath();x.moveTo(u,ya);x.lineTo(u+dir*bw*.55,yb);x.stroke();
   x.strokeStyle='#3a3a3a';x.lineWidth=2;x.beginPath();x.moveTo(u+bw*.5,ya+hh*.04);x.lineTo(u+bw*.5+dir*bw*.3,yb-hh*.04);x.stroke()})}
 // shoulder blocks
 [[r.t0-.0,0],[0,0]].forEach(()=>{});
 // sidewalls: fine radial ribs near the shoulder + concentric rings
 const bands=[[0,r.t0],[r.t1,1]];
 bands.forEach((b,k)=>{const va=b[0],vb=b[1],ya=Y(vb),yb=Y(va),L=yb-ya;
  x.strokeStyle='#b8b8b8';x.lineWidth=2;for(let u=0;u<W;u+=9){x.beginPath();x.moveTo(u,ya+L*.58);x.lineTo(u,ya+L*.86);x.stroke()}
  x.fillStyle='#e0e0e0';[.18,.5,.9].forEach(f=>x.fillRect(0,ya+L*f,W,3));
  // raised block lettering-like marks (abstract, no text)
  x.fillStyle='#d6d6d6';for(let j=0;j<22;j++){const u=(j*93)%W;x.fillRect(u,ya+L*.3,26,L*.07)}});
 const t=new T.CanvasTexture(c);t.wrapS=T.RepeatWrapping;t.anisotropy=4;return t}
function mats(){
const R={t0:0,t1:1};
return{
 alloy:new T.MeshStandardMaterial({color:0xdfe2e7,metalness:1,roughness:.2,side:T.DoubleSide,envMapIntensity:1.1}),
 alloyD:new T.MeshStandardMaterial({color:0x8d9097,metalness:1,roughness:.38,side:T.DoubleSide,envMapIntensity:.9}),
 steel:new T.MeshStandardMaterial({color:0xc3c7ce,metalness:1,roughness:.28,envMapIntensity:1}),
 gr:new T.MeshStandardMaterial({color:0x0e0f13,metalness:.5,roughness:.55,envMapIntensity:.25}),
 gr2:new T.MeshStandardMaterial({color:0x07080a,metalness:.4,roughness:.6,envMapIntensity:.25}),
 slab:new T.MeshStandardMaterial({color:0x040405,metalness:0,roughness:1,envMapIntensity:.04}),
 blue:new T.MeshStandardMaterial({color:0x2f6bff,metalness:.4,roughness:.35,emissive:0x0b2a8f}),
 white:new T.MeshStandardMaterial({color:0xf1efe8,metalness:.1,roughness:.5,emissive:0x2a2a28}),
 zinc:new T.MeshStandardMaterial({color:0xc9cdd4,metalness:.9,roughness:.3,envMapIntensity:1,emissive:0x1d3f9c,emissiveIntensity:0}),
 brass:new T.MeshStandardMaterial({color:0xcaa24c,metalness:1,roughness:.3,envMapIntensity:1}),
 rubber:new T.MeshStandardMaterial({color:0x0f0f10,metalness:0,roughness:.9,bumpScale:2.2,envMapIntensity:.35}),
 edge:new T.LineBasicMaterial({color:0xcfd6e6,transparent:true,opacity:.55}),
 led:new T.MeshBasicMaterial({color:0x5b8aff}),
 bead:new T.MeshBasicMaterial({color:0x3a3d46,transparent:true,opacity:.5,depthWrite:false}),
 ring:new T.MeshBasicMaterial({color:0x3a3d46,transparent:true,opacity:.5,depthWrite:false}),
 R:R}}
function envMap(ren){
 try{const pm=new T.PMREMGenerator(ren),s=new T.Scene();
  const bg=new T.Mesh(new T.SphereGeometry(20,24,16),new T.MeshBasicMaterial({color:0x2a2e38,side:T.BackSide}));s.add(bg);
  const lamp=(w,h,x,y,z,k)=>{const m=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide});m.color.multiplyScalar(k);const p=new T.Mesh(new T.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.lookAt(0,0,0);s.add(p)};
  lamp(14,4,0,12,4,5);lamp(3,12,-12,2,6,4);lamp(3,12,12,0,5,3);lamp(10,3,0,-6,12,1.6);lamp(6,6,0,2,-14,2.5);
  const t=pm.fromScene(s,.02).texture;pm.dispose();return t}catch(e){return null}}

/* ---------- the model: a wheel (tyre + alloy rim) on a wheel-balancing machine ----------
   Wheel axis = z (front = +z). Tyre: lathe with real tread grooves + bump-mapped tread blocks, sidewalls, beads.
   Rim: dropped-centre barrel with double lip, 5 twin spokes, hub with 5 lug holes, valve, TPMS sensor.
   Balancer: floor slab, cabinet, display, spindle with cone and wing nut. Parts come apart along the axis:
   tyre off the rim, weights appear, balance ring + display light up. Illustrative, not the shop's equipment. */
function wheel(SEG){
const M=mats(),root=new T.Group(),spinG=new T.Group(),parts=[],V=(x,y,z)=>new T.Vector3(x,y,z),weights=[];
root.add(spinG);
const mesh=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x||0,y||0,z||0);return m};
const box=(w,h,d,mat,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),mat,x,y,z);
const cylZ=(r,h,mat,x,y,z,seg,r2)=>{const g=new T.CylinderGeometry(r2==null?r:r2,r,h,seg||SEG);g.rotateX(PI/2);return mesh(g,mat,x,y,z)};
const cylY=(r,h,mat,x,y,z,seg)=>mesh(new T.CylinderGeometry(r,r,h,seg||SEG),mat,x,y,z);
const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat||M.edge));return m};
const sp=(ctrl,n)=>new T.CatmullRomCurve3(ctrl.map(p=>new T.Vector3(p[0],p[1],0))).getPoints(n).map(v=>new T.Vector2(v.x,v.y));
const lathe=(pts,seg)=>{const g=new T.LatheGeometry(pts,seg,0,PI*2);g.rotateX(PI/2);return g};
const mob=SEG<30;

// ---- tyre ----
const side=[[1.70,.58],[1.70,.70],[1.82,.77],[1.97,.83],[2.17,.91],[2.37,.91],[2.50,.86],[2.57,.77]];
let pts=sp(side.map(p=>[p[0],-p[1]]),20);const t0=pts.length;
const NT=mob?56:84;
for(let i=0;i<=NT;i++){const z=-.77+1.54*i/NT,q=z/.77;let g=0;[-.46,-.16,.16,.46].forEach(c=>{g+=.1*Math.exp(-Math.pow((z-c)/.045,2))});
 const r=2.66-.09*q*q-g;if(i===0&&Math.abs(r-2.57)>.001){}pts.push(new T.Vector2(i===0||i===NT?2.57:r,z))}
const t1=pts.length-1;
sp(side.slice().reverse().map(p=>[p[0],p[1]]),20).slice(1).forEach(v=>pts.push(v));
[[1.70,.58],[1.78,.55],[2.0,.6],[2.3,.6],[2.45,.5],[2.48,.3],[2.48,-.3],[2.45,-.5],[2.3,-.6],[2.0,-.6],[1.78,-.55],[1.70,-.58]].forEach((p,i)=>{pts.push(new T.Vector2(p[0],p[1]))});
// remove consecutive duplicates (lathe normals)
const clean=[];pts.forEach((p,i)=>{if(!i||p.distanceTo(clean[clean.length-1])>1e-4)clean.push(p)});
const tv0=t0/(clean.length-1),tv1=t1/(clean.length-1);
M.R.t0=tv0;M.R.t1=tv1;
// closed ring: the last point equals the first
const tg=lathe(clean,mob?72:140);
const rub=M.rubber.clone();rub.bumpMap=tyreBump({t0:tv0,t1:tv1});
const tyre=new T.Group();tyre.add(new T.Mesh(tg,rub));
[-1,1].forEach(s=>{tyre.add(new T.Mesh(new T.TorusGeometry(1.74,.045,8,SEG*2),M.bead).translateZ(s*.6))});
spinG.add(tyre);
parts.push({o:tyre,a:V(0,0,0),b:V(0,0,3.5)});

// ---- rim ----
const rim=new T.Group();
const inn=[[1.90,-.74],[1.80,-.74],[1.74,-.60],[1.68,-.50],[1.54,-.42],[1.50,-.1],[1.54,.30],[1.68,.50],[1.74,.60],[1.80,.74],[1.90,.74]];
const out=[[1.97,.74],[1.88,.76],[1.84,.60],[1.78,.50],[1.60,.44],[1.58,.1],[1.60,-.30],[1.78,-.50],[1.84,-.60],[1.88,-.76],[1.97,-.74]];
const rp=sp(inn,26).concat(sp(out,26));
rim.add(new T.Mesh(lathe(rp,mob?72:140),M.alloy));
// lip edge highlight
[-1,1].forEach(s=>{const t=new T.Mesh(new T.TorusGeometry(1.94,.035,8,SEG*2),M.alloy);t.position.z=s*.75;rim.add(t)});
// twin spokes
const spokeShape=(w0,w1,r0,r1)=>{const s=new T.Shape();s.moveTo(r0,-w0/2);s.lineTo(r1,-w1/2);s.lineTo(r1,w1/2);s.lineTo(r0,w0/2);s.closePath();return s};
const sg=new T.ExtrudeGeometry(spokeShape(.2,.3,.5,1.62),{depth:.2,bevelEnabled:true,bevelThickness:.04,bevelSize:.035,bevelSegments:1,steps:1});sg.translate(0,0,.18);
for(let k=0;k<5;k++)[-1,1].forEach(d=>{const m=new T.Mesh(sg,M.alloy);m.rotation.z=k*PI*2/5+d*.19;rim.add(m)});
// hub, lug holes, lug nuts, cap
rim.add(cylZ(.66,.34,M.alloy,0,0,.28,SEG));
for(let k=0;k<5;k++){const a=k*PI*2/5+PI/10,x=Math.cos(a)*.4,y=Math.sin(a)*.4;rim.add(cylZ(.1,.08,M.gr2,x,y,.46,10));rim.add(cylZ(.075,.17,M.steel,x,y,.5,6))}
rim.add(cylZ(.22,.06,M.gr,0,0,.46,SEG));rim.add(new T.Mesh(new T.TorusGeometry(.22,.018,6,SEG),M.blue).translateZ(.5));
rim.add(new T.Mesh(new T.TorusGeometry(.66,.025,6,SEG),M.alloyD).translateZ(.46));
spinG.add(rim);parts.push({o:rim,a:V(0,0,0),b:V(0,0,-.15)});

// ---- valve + TPMS sensor (illustrative parts) ----
const TV=2.7,ra=(g,r,z)=>{g.position.set(Math.cos(TV)*r,Math.sin(TV)*r,z);g.rotation.z=TV-PI/2;return g};
const valve=new T.Group();valve.add(cylY(.1,.07,M.gr2,0,.0,0,10));valve.add(cylY(.04,.56,M.brass,0,-.3,0,8));valve.add(cylY(.07,.2,M.blue,0,-.58,0,8));
ra(valve,1.52,-.12);spinG.add(valve);
const va=valve.position.clone();parts.push({o:valve,a:va,b:va.clone().add(V(0,0,2.1))});
const tp=new T.Group();tp.add(edges(box(.5,.18,.32,M.gr,0,0,0),M.edge,20));tp.add(box(.18,.03,.1,M.led,.08,.1,0));tp.add(cylY(.045,.12,M.brass,-.08,-.1,0,8));
ra(tp,1.66,-.12);spinG.add(tp);
const ta=tp.position.clone();const rd=V(Math.cos(TV),Math.sin(TV),0);parts.push({o:tp,a:ta,b:ta.clone().add(rd.multiplyScalar(.8)).add(V(0,0,-1.8))});

// ---- balancing weights: clip-on (front lip) and stick-on (inside the barrel); they fly in radially ----
const wl=[[.3,'clip'],[2.0,'clip'],[4.1,'clip'],[1.0,'stick'],[3.4,'stick'],[5.4,'stick']];
wl.forEach((w,i)=>{const g=new T.Group(),clip=w[1]==='clip';
 if(clip){g.add(edges(box(.2,.14,.52,M.zinc,.02,0,0),M.edge,20));g.add(box(.05,.1,.52,M.zinc,.14,0,0))}
 else{g.add(box(.05,.07,.3,M.zinc,0,0,0));g.add(box(.052,.075,.3,M.gr2,0,.04,0))}
 g.children.forEach(c=>{});
 // orient: local x = radial, local z = tangent... build in (radial,axial,tangent) then map
 const o=new T.Group();o.add(g);
 g.rotation.set(0,0,0);
 const r=clip?1.99:1.47,z=clip?.78:-.05;
 // wheel-local: radial along +x rotated by angle a about z
 const holder=new T.Group();holder.rotation.z=w[0];
 // inside holder: radial = x, tangent = y, axial = z
 const body=new T.Group();
 if(clip){body.add(edges(box(.22,.8,.28,M.zinc,r,0,z),M.edge,20));body.add(box(.09,.8,.14,M.zinc,r-.16,0,z-.1))}
 else{body.add(box(.08,.7,.4,M.zinc,r,0,z));body.add(box(.04,.7,.36,M.gr2,r-.06,0,z))}
 holder.add(body);spinG.add(holder);weights.push({o:holder,i:i,ang:w[0]})});

// ---- balancing machine (static) ----
const mc=new T.Group();
mc.add(box(7.6,.22,8.6,M.slab,0,-4.3,-2.0));
[-1,1].forEach(s=>mc.add(box(7.6,.04,.14,M.blue,0,-4.17,-2.0+s*4.2)));
[-1,1].forEach(s=>mc.add(box(.14,.04,8.6,M.blue,s*3.8,-4.17,-2.0)));
[-2.6,-1.2,.2,1.6].forEach(z=>mc.add(box(.5,.03,.1,M.white,0,-4.17,z)));
// cabinet with a tilted display on top; spindle emerges from the front face
mc.add(edges(box(4.6,6.9,2.4,M.gr,0,-.75,-4.9),M.edge,20));
mc.add(box(4.62,.1,2.42,M.blue,0,-2.2,-4.9));
mc.add(box(3.4,.25,.06,M.gr2,0,-3.2,-3.68));
const dsp=new T.Group();dsp.add(edges(box(3.3,1.95,.2,M.gr2,0,0,0),M.edge,20));
const sc=canv(256,152),sx=sc.getContext('2d'),stex=new T.CanvasTexture(sc);
dsp.add(mesh(new T.PlaneGeometry(3.0,1.64),new T.MeshBasicMaterial({map:stex}),0,0,.11));
dsp.add(box(3.3,.07,.22,M.blue,0,-1.0,0));
dsp.position.set(0,3.9,-3.55);dsp.rotation.x=-.28;mc.add(dsp);
mc.add(box(.5,1.1,.5,M.gr,0,3.0,-4.3));
// spindle, boss and cone
mc.add(cylZ(.62,.5,M.gr,0,0,-3.45,SEG));
mc.add(cylZ(.2,5.7,M.steel,0,0,-.85,16));
mc.add(cylZ(.9,1.0,M.steel,0,0,-.4,SEG,.3));
root.add(mc);
// wing nut (slides off along the axis)
const wn=new T.Group();wn.add(cylZ(.2,.5,M.steel,0,0,0,14));wn.add(cylZ(.34,.1,M.gr,0,0,.28,SEG));
[-1,1].forEach(s=>{const w=box(.5,.2,.08,M.gr,s*.34,0,.1);w.rotation.z=s*.3;wn.add(w)});wn.add(cylZ(.1,.08,M.blue,0,0,.36,10));
wn.position.set(0,0,.95);root.add(wn);parts.push({o:wn,a:V(0,0,.95),b:V(0,0,4.6)});
// balance ring around the wheel
const brg=new T.Mesh(new T.TorusGeometry(3.08,.045,8,SEG*3),M.ring);root.add(brg);
const brg2=new T.Mesh(new T.TorusGeometry(3.08,.045,8,SEG*3),M.ring);brg2.rotation.y=PI/2;brg2.visible=false;
root.position.set(0,-.3,1.8);
let lastS=-1;
function screen(c){const k=Math.round(c*40);if(k===lastS)return;lastS=k;const x=sx,f=1-k/40;
 x.fillStyle='#0a0b0d';x.fillRect(0,0,256,152);x.strokeStyle='rgba(241,239,232,.1)';x.lineWidth=1;for(let i=0;i<=8;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32,152);x.stroke()}
 x.strokeStyle='rgba(241,239,232,.35)';x.beginPath();x.moveTo(20,128);x.lineTo(236,128);x.stroke();
 const bars=[[52,.84],[134,.58]];bars.forEach((b,i)=>{const h=Math.max(3,b[1]*f*96);x.fillStyle=f>.06?'#2f6bff':'#8fb0ff';x.fillRect(b[0],128-h,54,h);x.fillStyle='rgba(241,239,232,.7)';x.fillRect(b[0]+16,138,22,4)});
 x.beginPath();x.arc(216,28,12,0,7);x.fillStyle=f<.06?'#2f6bff':'#2a2c32';x.fill();if(f<.06){x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(210,28);x.lineTo(215,34);x.lineTo(224,22);x.stroke()}
 stex.needsUpdate=true}
return{root:root,spinG:spinG,parts:parts,weights:weights,M:M,wn:wn,screen:screen,brg:brg,led:M.led,tpms:tp}}

function lights(sc,k){sc.add(new T.HemisphereLight(0xdfe6f5,0x0a0a0c,.55));const dl=new T.DirectionalLight(0xffffff,1.0);dl.position.set(4,7,9);sc.add(dl);
const a=new T.PointLight(0x2f6bff,1.3*k,34);a.position.set(-5,-2,7);sc.add(a);const b=new T.PointLight(0xf1efe8,.9*k,34);b.position.set(6,3,6);sc.add(b);return a}
const lerp3=(o,a,b,e)=>o.position.lerpVectors(a,b,e);
// e: tyre off the rim (0..1); w: weights fly in (0..1); c: balance (0..1); bd: tyre-bead highlight (0..1); t,dt: time
function placeParts(E,e,w,c,bd,t,dt,spinW){
 E.parts.forEach(q=>lerp3(q.o,q.a,q.b,e));
 E.weights.forEach((q,i)=>{const k=sm(Math.max(0,Math.min(1,w*1.7-i*.13)));q.o.visible=k>.01;const out=(1-k)*1.0;q.o.position.set(Math.cos(q.ang)*out,Math.sin(q.ang)*out,(1-k)*1.4)});
 const M=E.M,pu=.5+.5*Math.sin(t*8);
 M.bead.color.setHex(0x2f6bff);M.zinc.emissiveIntensity=Math.max(0,1-w*1.6)*.45;M.bead.opacity=.22+.78*bd*(.6+.4*pu);
 const cr=sm(c);M.ring.color.setRGB(.23+(.18-.23)*cr,.24+(.42-.24)*cr,.27+(1-.27)*cr);M.ring.opacity=.28+.72*cr;
 M.led.color.setRGB(.36,.54+.2*pu*bd,1);
 E.screen(c);
 E.spinG.rotation.z+=dt*spinW}
const TK=2*Math.tan(35/2*PI/180);
// camera distance that fits the whole model (assembled ~7 x 9.4, exploded wider along the axis)
function fitDist(ex,asp){const Hh=10.8+.8*ex,Ww=9.6+3.2*ex;return Math.max(Hh/TK,Ww/(TK*asp))*1.08}

/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.outputEncoding=T.sRGBEncoding;box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,28);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1);
const E=wheel(isMob()?22:36);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);P.rotation.y=-.6;
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
 const cyc=RM?.15:sm(.5-.5*Math.cos(t*.45));            // 0 assembled .. 1 tyre off
 const e=Math.min(.8,cyc*.8+s*.2),wv=RM?0:sm((cyc-.55)/.4),c=RM?.5:sm((Math.sin(t*.45-1.2)*.5+.5-.3)/.5);
 P.rotation.y=-.6+mx*.5+Math.sin(t*.3)*.12+uy;G.rotation.x=.14;
 placeParts(E,e,wv,c,cyc>.4?sm((cyc-.4)/.3):0,t,RM?0:dt,RM?0:(1.4-1.0*e));
 pl.intensity=1.2+Math.sin(t*3)*.25;
 const dz=fitDist(e,aspEff)*1.04;cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D: wheel on the balancer, tyre off the rim, weights appear, balance ring lights up (illustrative) ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,28);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1.1);
const SEG=isMob()?22:36;
const E=wheel(SEG);const P=new T.Group(),G=new T.Group(),EG=new T.Group();sc.add(P);P.add(G);G.add(EG);EG.add(E.root);G.rotation.y=-.55;
let uy=0,up=0,drag=null,prog=0,e=0,w=0,c=0,bd=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-1.6,Math.min(1.6,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.6,Math.min(.6,up+(ev.clientY-drag[1])*.005));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
const chs=$$('#model3d .r3ch'),bar=$('#r3bar');
// p: 0 assembled; .12-.32 tyre comes off; hold; .4-.55 weights fly in; .55-.75 tyre goes back on; .7-.95 balance ring lights up
function explode(p){return p<.1?0:p<.3?sm((p-.1)/.2):p<.56?1:p<.74?1-sm((p-.56)/.18):0}
function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?Math.min(1,Math.max(0,-r.top/den)):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c2,j)=>c2.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile: free band below the tallest chapter text and above the bottom bar; desktop: right half
function vo(){const w2=W(),h=H();if(!w2||!h)return;ren.setSize(w2,h);
 if(innerWidth>=900){const fw=w2*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w2-fw),0,w2,h)}
 else{let tb=0;chs.forEach(c2=>{tb=Math.max(tb,c2.offsetHeight)});const top=78+tb+16,bot=h-134,rh=Math.max(150,bot-top);cam.aspect=w2/rh;cam.setViewOffset(w2,rh,0,-top,w2,h)}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c2=>new ResizeObserver(vo).observe(c2));setTimeout(vo,800);setTimeout(vo,2000);
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;e+=(explode(p)-e)*.14;w+=(sm((p-.38)/.18)-w)*.14;c+=(sm((p-.72)/.2)-c)*.12;bd+=((p>.12&&p<.6?1:0)-bd)*.12;spin+=RM?0:dt;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*PI*2)*.35+(RM?0:Math.sin(spin*.4)*.08);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.18+Math.sin(p*PI)*.08+up)-P.rotation.x)*.12;
 placeParts(E,e,w,c,bd,spin,RM?0:dt,RM?0:(c>.05&&c<.98?3.4:1.3)*(1-.8*e));
 pl.intensity=1.4+Math.sin(now/500)*.25;
 const dz=fitDist(e,aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

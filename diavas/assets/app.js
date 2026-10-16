(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;
addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});

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

/* ---------- micro: ripple, vibrate, card spotlight, cursor glow (desktop mouse only) ---------- */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height)*2;s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});
const cg=$('#cglow');let cgx=0,cgy=0,cgR=0;
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;
 const c=e.target.closest&&e.target.closest('.card');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}
 if(cg&&!RM&&!isMob()){cgx=e.clientX;cgy=e.clientY;if(!cgR){cgR=requestAnimationFrame(()=>{cgR=0;cg.style.opacity=1;cg.style.transform=`translate(${cgx}px,${cgy}px)`})}}},{passive:true});
document.addEventListener('mouseleave',()=>{if(cg)cg.style.opacity=0});

/* ---------- counters (numbers come from the verified opening hours / RAR limits) ---------- */
const fmt=(v,d)=>d?v.toFixed(d).replace('.',','):String(Math.round(v));
function count(el){const n=parseFloat(el.dataset.n),d=+el.dataset.d||0,tn=el.firstChild;if(RM){tn.nodeValue=fmt(n,d);return}
 const st=performance.now(),D=1400;(function f(t){const k=Math.min(1,(t-st)/D),e=1-Math.pow(1-k,3);tn.nodeValue=fmt(n*e,d);if(k<1)requestAnimationFrame(f)})(st)}
const cio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}}),{threshold:.5}):null;
$$('.st b').forEach(b=>cio?cio.observe(b):(b.firstChild.nodeValue=fmt(parseFloat(b.dataset.n),+b.dataset.d||0)));

/* ---------- open now (Europe/Bucharest, from the published hours) ---------- */
const HRS={0:null,1:[8,20],2:[8,20],3:[8,20],4:[8,20],5:[8,20],6:[8,14]};
const DN=['duminică','luni','marți','miercuri','joi','vineri','sâmbătă'];
function buc(){try{const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()),g=t=>p.find(x=>x.type===t).value;
 const wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[g('weekday')];return{d:wd,m:(+g('hour')%24)*60+(+g('minute'))}}catch(e){const n=new Date();return{d:n.getDay(),m:n.getHours()*60+n.getMinutes()}}}
function nextOpen(d,m){for(let i=0;i<8;i++){const dd=(d+i)%7,h=HRS[dd];if(!h)continue;if(i===0&&m>=h[0]*60)continue;return{i,dd,h:h[0]}}return null}
function live(){const el=$('#live'),tx=$('#livet');if(!el)return;const n=buc(),h=HRS[n.d];
 $$('#hours [data-d]').forEach(x=>x.classList.toggle('now',+x.dataset.d===n.d));
 if(h&&n.m>=h[0]*60&&n.m<h[1]*60){el.classList.add('open');tx.textContent='Deschis acum · până la '+String(h[1]).padStart(2,'0')+':00'}
 else{el.classList.remove('open');const o=nextOpen(n.d,n.m);tx.textContent=o?'Închis acum · deschidem '+(o.i===0?'azi':o.i===1?'mâine':DN[o.dd])+' la '+String(o.h).padStart(2,'0')+':00':'Închis acum'}}
live();setInterval(live,60000);

/* ---------- eligibility (limits from the public RAR list for station CJ139) ---------- */
(()=>{const root=$('#elig');if(!root)return;const ans=[null,null,null,null,null],rg=$('#res'),fg=$('#rfg'),rtx=$('#rtx'),rt=$('#rt'),rp=$('#rp');
 const bad=['Masa vehiculului depășește limita de 3,5 t.','Înălțimea depășește 3 m.','Tractoarele nu pot face ITP la această stație.','Vehiculele fără servofrână nu pot face ITP la această stație.','Remorcile cu frânare inerțială nu pot face ITP la această stație.'];
 function draw(){const n=ans.filter(a=>a!==null).length,fails=ans.map((a,i)=>a===0?i:-1).filter(i=>i>=0);rtx.textContent=n+'/5';fg.style.strokeDashoffset=327*(1-n/5);rg.classList.remove('ok','no');
  if(fails.length){rg.classList.add('no');rt.textContent='Sună înainte să vii';rp.textContent=bad[fails[0]]+' Conform listei RAR, stația nu face ITP în acest caz. Sună pentru detalii.'}
  else if(n===5){rg.classList.add('ok');rt.textContent='Se încadrează';rp.textContent='Vehiculul se încadrează în limitele afișate de RAR pentru stație. Confirmă la telefon când te programezi.'}
  else{rt.textContent=n?'Continuă':'Răspunde la întrebări';rp.textContent=n?'Mai ai '+(5-n)+(5-n===1?' întrebare.':' întrebări.'):'Vei vedea dacă vehiculul se încadrează în limitele stației.'}}
 root.addEventListener('click',e=>{const b=e.target.closest('.yn button');if(!b)return;const q=b.closest('.q'),i=+q.dataset.q;ans[i]=+b.dataset.v;[...q.querySelectorAll('button')].forEach(x=>x.classList.toggle('sel',x===b));draw()});draw()})();

/* ---------- inspection map ---------- */
(()=>{const chips=$('#chips');if(!chips)return;
 const Z=[{c:'Frâne și roți',z:'Zona 01',t:'Frâne și roți',p:'În general se urmărește starea și funcționarea sistemului de frânare, precum și starea roților și a anvelopelor.',x:458,y:190,rx:64,ry:64},
 {c:'Direcție',z:'Zona 02',t:'Direcție',p:'În general se urmăresc jocurile din direcție și starea elementelor sistemului de direcție.',x:352,y:112,rx:62,ry:44},
 {c:'Suspensie',z:'Zona 03',t:'Suspensie',p:'În general se urmărește starea amortizoarelor, a arcurilor și a articulațiilor suspensiei.',x:150,y:150,rx:78,ry:50},
 {c:'Lumini',z:'Zona 04',t:'Lumini și semnalizare',p:'În general se verifică funcționarea farurilor, a stopurilor și a semnalizării.',x:548,y:146,rx:44,ry:36},
 {c:'Emisii',z:'Zona 05',t:'Emisii și eșapament',p:'În general se verifică nivelul emisiilor de gaze de eșapament, în funcție de tipul motorului.',x:46,y:176,rx:40,ry:36},
 {c:'Caroserie',z:'Zona 06',t:'Caroserie și identificare',p:'În general se urmărește starea caroseriei, a geamurilor și a ștergătoarelor, precum și datele de identificare ale vehiculului.',x:300,y:112,rx:150,ry:62}];
 const zn=$('#zone'),ze=$('#zel'),zp=zn.querySelector('.zp'),vz=$('#vz'),vt=$('#vt'),vp=$('#vp');
 Z.forEach((z,i)=>{const b=document.createElement('button');b.type='button';b.textContent=z.c;b.addEventListener('click',()=>sel(i));chips.appendChild(b)});
 function sel(i){const z=Z[i];[...chips.children].forEach((b,j)=>b.classList.toggle('on',i===j));zn.style.transform=`translate(${z.x}px,${z.y}px)`;[ze,zp].forEach(e=>{e.setAttribute('rx',z.rx);e.setAttribute('ry',z.ry)});vz.textContent=z.z;vt.textContent=z.t;vp.textContent=z.p}
 sel(0)})();

/* ---------- checklist ---------- */
(()=>{const cl=$('#cl');if(!cl)return;const bs=[...cl.querySelectorAll('button')],fg=$('#cfg'),tx=$('#ctx'),ct=$('#ct'),cp=$('#cp'),rs=$('#cres');
 function upd(){const n=bs.filter(b=>b.classList.contains('on')).length;tx.textContent=n+'/6';fg.style.strokeDashoffset=327*(1-n/6);rs.classList.toggle('ok',n===6);
  ct.textContent=n===6?'Gata de drum':n?'Mai ai '+(6-n)+(6-n===1?' punct':' puncte'):'Bifează ce ai verificat';cp.textContent=n===6?'Ai bifat tot. Sună și programează-te.':'Atingi fiecare punct pe măsură ce îl verifici.'}
 bs.forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');upd()}));upd()})();

/* ---------- scroll: progress, nav, chapters ---------- */
const prog=$('#prog'),cap=$('#cap'),ch=$$('.chap'),dots=$$('.dots i'),chl=$('#chline');
const secs=['info','servicii','model3d','cap','verifica','contact'].map(i=>$('#'+i)),nl=$$('.navl a');
let lastC=-1;
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;
 if(prog)prog.style.transform=`scaleX(${H>0?y/H:0})`;
 document.body.classList.toggle('past',y>innerHeight*.7);
 document.body.classList.toggle('pinned',([$('#model3d'),cap].some(e=>{if(!e)return false;const r=e.getBoundingClientRect();return r.top<innerHeight*.5&&r.bottom>innerHeight*.5})||(($('#contact')||{getBoundingClientRect:()=>({top:9e9})}).getBoundingClientRect().top<innerHeight*.9)));
 let cur=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});nl.forEach((a,i)=>a.classList.toggle('cur',i===cur));
 if(RM)return;
 if(cap){const r=cap.getBoundingClientRect(),den=r.height-innerHeight,pp=den>0?Math.min(.999,Math.max(0,-r.top/den)):0,idx=Math.floor(pp*ch.length);
  if(chl)chl.style.width=pp*100+'%';
  if(idx!==lastC){lastC=idx;ch.forEach((c,i)=>c.classList.toggle('on',i===idx));dots.forEach((d,i)=>d.classList.toggle('on',i===idx))}}}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();

/* ---------- fit hero h1 on mobile (long words never clip) ---------- */
function fitH1(){const h=$('h1');if(!h)return;h.style.fontSize='';if(!isMob())return;const wrap=h.parentElement,max=wrap.clientWidth;let fs=parseFloat(getComputedStyle(h).fontSize),n=0;
 const w=()=>Math.max(...[...h.children].map(s=>s.scrollWidth));
 while(w()>max&&fs>22&&n++<40){fs-=2;h.style.fontSize=fs+'px'}}
addEventListener('resize',fitH1);addEventListener('load',fitH1);fitH1();setTimeout(fitH1,600);

/* ---------- GL helpers ---------- */
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();
if(!GL||!window.THREE){const s=$('#model3d');if(s)s.classList.add('fallback');document.body.classList.add('nogl');return}
const T=THREE,PI=Math.PI;
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const win=(p,a,b,c,d)=>Math.max(0,sm((p-a)/(b-a))-sm((p-c)/(d-c)));   // rises a..b, falls c..d
function canv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function envMap(ren){
 try{const pm=new T.PMREMGenerator(ren),s=new T.Scene();
  s.add(new T.Mesh(new T.SphereGeometry(20,24,16),new T.MeshBasicMaterial({color:0x232a2b,side:T.BackSide})));
  const lamp=(w,h,x,y,z,k,col)=>{const m=new T.MeshBasicMaterial({color:col||0xffffff,side:T.DoubleSide});m.color.multiplyScalar(k);const p=new T.Mesh(new T.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.lookAt(0,0,0);s.add(p)};
  lamp(16,4,0,12,4,5);lamp(3,12,-12,2,6,4,0xfff0d0);lamp(3,12,12,0,5,3,0xd8f4ea);lamp(10,3,0,-6,12,1.6);lamp(6,6,0,2,-14,2.5);
  const t=pm.fromScene(s,.02).texture;pm.dispose();return t}catch(e){return null}}

/* ---------- the model: a car on an inspection lane ----------
   Car length = x (front +x), width = z, up = y. Illustrative, not the station's equipment.
   Parts: body shell + glass + lamps (lift up), chassis with engine, axles, coil springs, dampers, steering rack, exhaust,
   four wheels (tyre+rim) that slide out sideways, brake discs + calipers (slide out less), a scan plane, lane + result ring. */
function mats(){const S=(o)=>new T.MeshStandardMaterial(o);return{
 paint:S({color:0xc4a86e,metalness:.8,roughness:.3,envMapIntensity:.85}),glass:S({color:0x070d0f,metalness:.85,roughness:.22,envMapIntensity:.7}),
 tyre:S({color:0x0c0d0e,roughness:.88,metalness:.05}),rim:S({color:0xc9cfcd,metalness:1,roughness:.22}),
 disc:S({color:0x9aa3a2,metalness:.95,roughness:.36,emissive:0xff7a2f,emissiveIntensity:0}),cal:S({color:0x34d6a0,metalness:.45,roughness:.4}),
 dark:S({color:0x1a2123,metalness:.5,roughness:.6,envMapIntensity:.4}),eng:S({color:0x2a3335,metalness:.7,roughness:.45,envMapIntensity:.5}),gold:S({color:0xd9bf86,metalness:1,roughness:.3}),
 steel:S({color:0xaab2b1,metalness:1,roughness:.3}),floor:S({color:0x0b1112,metalness:.3,roughness:.85}),
 line:new T.MeshBasicMaterial({color:0xd9bf86}),lampOn:new T.MeshBasicMaterial({color:0x554d3a}),tail:new T.MeshBasicMaterial({color:0x6a1f18}),
 beam:new T.MeshBasicMaterial({color:0xfff0cc,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),
 scan:new T.MeshBasicMaterial({color:0x34d6a0,transparent:true,opacity:.14,side:T.DoubleSide,depthWrite:false}),
 scanL:new T.LineBasicMaterial({color:0x34d6a0,transparent:true,opacity:.9}),
 ring:new T.MeshBasicMaterial({color:0x34d6a0,transparent:true,opacity:0}),
 puff:new T.MeshBasicMaterial({color:0xb9c2c0,transparent:true,opacity:0,depthWrite:false})}}
function car(SEG){
const M=mats(),root=new T.Group(),V=(x,y,z)=>new T.Vector3(x,y,z);
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
const box=(w,h,d,m,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
const cylZ=(r,l,m,x,y,z,s)=>{const g=new T.CylinderGeometry(r,r,l,s||SEG);g.rotateX(PI/2);return mesh(g,m,x,y,z)};
const cylX=(r,l,m,x,y,z,s)=>{const g=new T.CylinderGeometry(r,r,l,s||SEG);g.rotateZ(PI/2);return mesh(g,m,x,y,z)};
const cylY=(r,l,m,x,y,z,s)=>mesh(new T.CylinderGeometry(r,r,l,s||SEG),m,x,y,z);
const XF=2.8,XR=-2.5,WY=.82,WZ=1.5;
// lane / platform: dark disc with soft edge so it never reaches the text
const pc=canv(256,256),px=pc.getContext('2d'),pg2=px.createRadialGradient(128,128,10,128,128,127);pg2.addColorStop(0,'rgba(18,27,28,.96)');pg2.addColorStop(.62,'rgba(13,20,21,.9)');pg2.addColorStop(1,'rgba(7,9,10,0)');px.fillStyle=pg2;px.fillRect(0,0,256,256);
const lane=mesh(new T.PlaneGeometry(15,15),new T.MeshBasicMaterial({map:new T.CanvasTexture(pc),transparent:true,depthWrite:false}),0,.004,0);lane.rotation.x=-PI/2;root.add(lane);
const edge=mesh(new T.TorusGeometry(5.9,.022,6,SEG*5),M.line,0,.015,0);edge.rotation.x=-PI/2;root.add(edge);
const laneLines=[-3.1,3.1].map(z=>{const l=box(8.4,.02,.07,M.line,0,.012,z);root.add(l);return l});
const sc2=canv(128,128),sx=sc2.getContext('2d'),gr=sx.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=gr;sx.fillRect(0,0,128,128);
const blob=mesh(new T.PlaneGeometry(13,7),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc2),transparent:true,depthWrite:false}),0,.02,0);blob.rotation.x=-PI/2;root.add(blob);
// rollers under the wheels (illustrative)
const rollers=[];[XF,XR].forEach(x=>[-1,1].forEach(s=>[-.34,.34].forEach(o=>{const r=cylZ(.15,.6,M.dark,x+o,.0,s*WZ,14);root.add(r);rollers.push(r)})));
// chassis
const chs=new T.Group();root.add(chs);
chs.add(box(8,.12,2.3,M.dark,0,.55,0));
const eng=box(2.2,.8,1.7,M.eng,1.6,1.05,0);chs.add(eng);
[-.7,-.23,.23,.7].forEach(z=>chs.add(cylY(.17,.35,M.gold,1.6,1.62,z,14)));
chs.add(box(2.0,.1,1.5,M.gold,1.6,1.5,0));
[XF,XR].forEach(x=>chs.add(cylZ(.07,3.1,M.steel,x,WY,0,12)));
chs.add(mesh(new T.SphereGeometry(.34,14,10),M.eng,XR,WY,0));
chs.add(cylZ(.05,2.5,M.gold,XF+.55,.9,0,12));
const exh=cylX(.09,6.8,M.steel,-1.0,.42,.82,12);chs.add(exh);chs.add(cylX(.3,1.5,M.steel,-3.0,.45,.82,16));
const springs=[],dampers=[];
[[XF,1],[XF,-1],[XR,1],[XR,-1]].forEach(([x,s])=>{
 const pts=[];for(let i=0;i<=56;i++){const a=i/56*PI*2*5;pts.push(V(Math.cos(a)*.21,i/56*.75,Math.sin(a)*.21))}
 const sp=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),SEG*3,.035,6,false),M.gold,x,.85,s*1.02);chs.add(sp);springs.push(sp);
 const d=new T.Group();d.position.set(x,.85,s*1.02);d.add(cylY(.07,1.0,M.eng,0,.5,0,10));d.add(cylY(.035,.55,M.steel,0,1.0,0,8));chs.add(d);dampers.push(d)});
// body
const bodyG=new T.Group();root.add(bodyG);
const sh=new T.Shape();sh.moveTo(-4.15,.62);sh.lineTo(-4.25,1.0);sh.quadraticCurveTo(-4.3,1.55,-4.05,1.75);sh.lineTo(-2.5,1.92);sh.lineTo(1.4,1.95);sh.lineTo(3.4,1.72);sh.quadraticCurveTo(4.2,1.64,4.3,1.2);sh.lineTo(4.3,.95);sh.quadraticCurveTo(4.28,.62,3.95,.62);
const A=.206;
sh.lineTo(XF+.96,.62);sh.absarc(XF,WY,.98,-A,PI+A,false);sh.lineTo(XR+.96,.62);sh.absarc(XR,WY,.98,-A,PI+A,false);sh.lineTo(-4.15,.62);
const bg=new T.ExtrudeGeometry(sh,{depth:2.9,bevelEnabled:true,bevelThickness:.2,bevelSize:.18,bevelSegments:Math.max(2,SEG>26?4:3),curveSegments:Math.round(SEG/2)});bg.translate(0,0,-1.45);
bodyG.add(mesh(bg,M.paint));
const cs=new T.Shape();cs.moveTo(-2.55,1.9);cs.bezierCurveTo(-2.2,2.35,-1.9,2.95,-1.4,3.08);cs.lineTo(.55,3.08);cs.bezierCurveTo(1.0,3.0,1.5,2.4,2.0,1.9);cs.lineTo(-2.55,1.9);
const cg=new T.ExtrudeGeometry(cs,{depth:2.3,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:3,curveSegments:Math.round(SEG/2)});cg.translate(0,0,-1.15);
bodyG.add(mesh(cg,M.glass));
bodyG.add(box(2.1,.07,2.35,M.paint,-.4,3.2,0));
// door seams, grille, lamps
[-1,1].forEach(s=>{[-.55,1.35].forEach(x=>bodyG.add(box(.03,1.0,.03,M.dark,x,1.35,s*1.66)));
 bodyG.add(box(.14,.18,.3,M.paint,1.7,2.05,s*1.55));   // mirror
 bodyG.add(box(.38,.2,.1,M.lampOn,4.33,1.34,s*1.05));
 bodyG.add(box(.1,.16,.44,M.tail,-4.38,1.42,s*1.05))});
bodyG.add(box(.06,.34,1.2,M.dark,4.46,1.0,0));
const beams=[];[-1,1].forEach(s=>{const g=new T.ConeGeometry(1.1,3.8,22,1,true);g.translate(0,-1.9,0);g.rotateZ(PI/2);const b=mesh(g,M.beam,4.4,1.3,s*1.05);b.rotation.z=-.05;bodyG.add(b);beams.push(b)});
// wheels
const wheels=[];
[[XF,1],[XF,-1],[XR,1],[XR,-1]].forEach(([x,s],i)=>{
 const piv=new T.Group(),flip=new T.Group();piv.position.set(x,WY,s*WZ);flip.rotation.y=s>0?0:PI;piv.add(flip);
 const tg=new T.Group(),tyre=mesh(new T.TorusGeometry(.62,.2,14,SEG*2),M.tyre);tyre.scale.z=1.3;tg.add(tyre);
 tg.add(cylZ(.5,.44,M.rim,0,0,.02,SEG));tg.add(cylZ(.38,.06,M.dark,0,0,.26,SEG));
 for(let k=0;k<5;k++){const a=k/5*PI*2,sp=box(.1,.34,.05,M.rim,Math.cos(a)*.2,Math.sin(a)*.2,.27);sp.rotation.z=a-PI/2;tg.add(sp);const n=cylZ(.035,.06,M.steel,Math.cos(a+.3)*.11,Math.sin(a+.3)*.11,.31,8);tg.add(n)}
 const dg=new T.Group();dg.position.z=-.1;dg.add(cylZ(.42,.07,M.disc,0,0,0,SEG));dg.add(cylZ(.16,.16,M.eng,0,0,-.04,SEG));
 for(let k=0;k<12;k++){const a=k/12*PI*2;const sl=box(.05,.12,.1,M.dark,Math.cos(a)*.3,Math.sin(a)*.3,0);sl.rotation.z=a;dg.add(sl)}
 const cal=box(.26,.38,.22,M.cal,0,.36,-.1);flip.add(cal);
 flip.add(tg);flip.add(dg);root.add(piv);wheels.push({piv:piv,flip:flip,tg:tg,dg:dg,cal:cal,front:i<2,s:s,x:x})});
// scan plane + result ring
const scG=new T.Group();const scp=new T.Mesh(new T.PlaneGeometry(4.2,3.8),M.scan);scp.rotation.y=PI/2;scG.add(scp);
const sce=new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(4.2,3.8)),M.scanL);sce.rotation.y=PI/2;scG.add(sce);scG.position.y=1.9;root.add(scG);
const ring=new T.Mesh(new T.TorusGeometry(5.1,.05,8,SEG*4),M.ring);ring.scale.set(1,.62,1);ring.rotation.x=-PI/2;ring.position.y=.04;root.add(ring);
// exhaust puffs
const puffs=[];for(let i=0;i<7;i++){const p=mesh(new T.SphereGeometry(.2,10,8),M.puff.clone(),-4.5,.5,.82);root.add(p);puffs.push(p)}
root.position.y=-1.3;
// st: lift (body up), wo (wheels out), steer, spr (spring pulse), glow, lights, em (exhaust), res (result), scan (0..1 position or -1 hidden), t, dt, spin
function place(st){
 const lift=st.lift,wo=st.wo,t=st.t;
 bodyG.position.y=lift*3.0;
 wheels.forEach(w=>{w.tg.position.z=wo*2.3;w.dg.position.z=-.1+wo*.8;w.cal.position.z=-.1+wo*.8;
  w.piv.rotation.y=w.front?st.steer*(w.s>0?1:1):0;
  w.tg.rotation.z-=st.dt*st.spin*(1);w.dg.rotation.z=w.tg.rotation.z});
 rollers.forEach(r=>r.rotation.x+=0);
 M.disc.emissiveIntensity=st.glow*(.55+.45*Math.sin(t*6));
 const sp=1-.18*st.spr*(.5+.5*Math.sin(t*5));springs.forEach(s=>s.scale.y=sp);dampers.forEach((d,i)=>d.scale.y=.94+.06*Math.sin(t*5+i)*st.spr+(1-st.spr)*.06);
 M.lampOn.color.setRGB(.33+.67*st.lights,.3+.64*st.lights,.23+.57*st.lights);M.tail.color.setRGB(.42+.5*st.lights,.12,.09);
 M.beam.opacity=.16*st.lights;
 M.ring.opacity=st.res*.9;M.line.color.setRGB(.85-.5*st.res,.75+.1*st.res,.53+.1*st.res);
 if(st.scan>=0){scG.visible=true;scG.position.x=-5.4+st.scan*10.8;M.scan.opacity=.14*Math.sin(st.scan*PI)+.02;M.scanL.opacity=.9*Math.sin(st.scan*PI)}else scG.visible=false;
 puffs.forEach((p,i)=>{const k=((t*.55+i/puffs.length)%1),a=st.em*(1-k)*.5;p.visible=a>.01;p.position.set(-4.6-k*2.4,.5+k*.9,.82+Math.sin(k*5+i)*.08);p.scale.setScalar(.5+k*2.2);p.material.opacity=a})}
return{root:root,place:place,M:M}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xe8efe9,0x0a0c0c,.55));const dl=new T.DirectionalLight(0xfff6e6,1.0);dl.position.set(4,8,9);sc.add(dl);
const a=new T.PointLight(0x34d6a0,.3*k,36);a.position.set(-8,0,6);sc.add(a);const b=new T.PointLight(0xffe2a8,1.1*k,36);b.position.set(7,4,6);sc.add(b);return a}
const TK=2*Math.tan(35/2*PI/180);
function fitDist(lift,wo,asp){const Hh=6.8+3.0*lift,Ww=11.4+2.4*wo;return Math.max(Hh/TK,Ww/(TK*asp))*1.12}

/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.outputEncoding=T.sRGBEncoding;box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,120);cam.position.set(0,0,30);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1);
const E=car(isMob()?22:36);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);
let aspEff=1;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
 if(!isMob()){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
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
const t0=performance.now();let lt=t0,lift=0,wo=0;
(function loop(){requestAnimationFrame(loop);if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-lt)/1000);lt=now;const t=(now-t0)/1000;
 mx+=(tx-mx)*.05;if(!drag)uy*=.97;const s=Math.min(1,scrollY/innerHeight);
 const cyc=RM?.1:sm(.5-.5*Math.cos(t*.4));
 lift=Math.min(.7,cyc*.7+s*.2);wo=cyc>.35?sm((cyc-.35)/.5)*.9:0;
 P.rotation.y=-.62+mx*.45+Math.sin(t*.25)*.2+uy;G.rotation.x=.12;
 const lg=sm((Math.sin(t*.4-1.6)*.5+.5-.5)/.4);
 E.place({lift:lift,wo:wo,steer:Math.sin(t*.9)*.18*(1-cyc),spr:0,glow:cyc>.4?.6:0,lights:isMob()?0:(RM?.5:lg*.55),em:RM?0:.5,res:0,scan:RM?-1:((t*.22)%1),t:t,dt:RM?0:dt,spin:RM?0:2.2});
 pl.intensity=.9+Math.sin(t*2)*.15;
 const dz=fitDist(lift,wo,aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.2;cam.lookAt(0,.4,0);
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D ---------- */
function model(){
const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,120);cam.position.set(0,0,30);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1.1);
const E=car(isMob()?22:34);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);G.rotation.y=-.6;
let uy=0,up=0,drag=null,prog=0,lift=0,wo=0,aspEff=1,spin=0,last=performance.now();
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=Math.max(-2.2,Math.min(2.2,uy+(ev.clientX-drag[0])*.008));up=Math.max(-.5,Math.min(.5,up+(ev.clientY-drag[1])*.004));drag=[ev.clientX,ev.clientY]});
const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
const chs=$$('#model3d .r3ch'),bar=$('#r3bar');
function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?Math.min(1,Math.max(0,-r.top/den)):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c2,j)=>c2.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// mobile: free band below the tallest chapter text and above the bottom bar; desktop: right half
function vo(){const w2=W(),h=H();if(!w2||!h)return;ren.setSize(w2,h);
 if(innerWidth>=900){const fw=w2*.54;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w2-fw),0,w2,h)}
 else{let tb=0;chs.forEach(c2=>{tb=Math.max(tb,c2.offsetHeight)});const top=78+tb+16,bot=h-146,rh=Math.max(150,bot-top);cam.aspect=w2/rh;cam.setViewOffset(w2,rh,0,-top,w2,h)}
 aspEff=cam.aspect;cam.updateProjectionMatrix()}
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c2=>new ResizeObserver(vo).observe(c2));setTimeout(vo,800);setTimeout(vo,2000);
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 const p=prog;spin+=RM?0:dt;
 const tl=win(p,.14,.3,.72,.88),tw=win(p,.24,.42,.62,.8);
 lift+=(tl-lift)*.14;wo+=(tw-wo)*.14;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(p*PI*2)*.3+(RM?0:Math.sin(spin*.4)*.06);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.2+Math.sin(p*PI)*.08+up)-P.rotation.x)*.12;
 const stw=win(p,.46,.52,.7,.76),scan=p<.16?p/.16:(RM?-1:((spin*.18)%1));
 E.place({lift:lift,wo:wo,steer:Math.sin(spin*2.2)*.42*stw,spr:win(p,.46,.52,.72,.78),glow:win(p,.22,.3,.5,.58),lights:sm((p-.78)/.08),em:win(p,.76,.84,1.1,1.2),res:sm((p-.9)/.07),scan:p>.96?-1:scan,t:spin,dt:RM?0:dt,spin:RM?0:(1.2+2.2*(1-lift))});
 pl.intensity=.9+Math.sin(now/600)*.2;
 const dz=fitDist(lift,wo,aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.4;cam.lookAt(0,.5,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

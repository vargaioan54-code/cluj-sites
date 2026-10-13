(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,MOB=matchMedia('(max-width:899px)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* intro */
const intro=$('#intro'),itt=$('#itt');const T='LD MIRCEA';itt.innerHTML=[...T].map((c,i)=>`<span style="animation-delay:${1.3+i*.07}s">${c===' '?'&nbsp;':c}</span>`).join('');
function endIntro(){if(intro.classList.contains('done'))return;intro.classList.add('done');document.body.classList.add('ready');setTimeout(()=>intro.remove(),1000)}
if(RM)endIntro();else{intro.classList.add('play');const t0=performance.now();(function c(){const p=Math.min(100,Math.round((performance.now()-t0-200)/16));const e=$('#ipct');if(e)e.textContent=Math.max(0,p)+'%';if(p<100&&!intro.classList.contains('done'))requestAnimationFrame(c)})();setTimeout(endIntro,3000);intro.addEventListener('click',endIntro)}
/* marquee */
$('#mq').innerHTML=Array(2).fill(['Stație ITP CJ120','Diagnoză','Electricitate auto','Reparații frână','Reparații motor','Schimb ulei','Piese și accesorii','Str. Oașului 174'].map(t=>`<span>${t}</span><span class="d">//</span>`).join('')).join('');
/* reveal + fallback */
const show=el=>el.classList.add('in');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show(e.target);io.unobserve(e.target)}}),{threshold:.12});$$('.rv,.rtr,.stars').forEach(e=>io.observe(e))}
const chkVis=()=>$$('.rv,.rtr,.stars').forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight*1.05)show(e)});addEventListener('scroll',chkVis,{passive:true});setTimeout(chkVis,1200);setTimeout(()=>$$('.rv,.rtr,.stars').forEach(e=>{if(e.getBoundingClientRect().top<innerHeight)show(e)}),3200);
$$('.stars').forEach(s=>[...s.children].forEach((c,i)=>c.style.animationDelay=(i*.1)+'s'));
/* reviews (verbatim) */
const R=[["Fast, efficient, and close-by!","03.02.2026"],["I really like how they work. Really transparent and trustworthy.","17.04.2025"],["Service 10/10 No waiting time. Will use it from now on.","17.03.2025"],["Itp booked, itp done!","26.02.2025"],["Excellent service, fast, responsive and effective. Great communication.","23.01.2025"],["Mircea is very polite and nice l. I.ll come back here again","12.09.2023"],["I recommend this garage for MOT, I go there all the time as they are in my area. It's usually under 1h and the owner is making recommendations during the process on things that might need maintenance, even if these are not covered by the MOT process.","04.07.2019"]];
$('#rtr').innerHTML=R.map((r,i)=>`<article class="rc" style="transition-delay:${i*.08}s"><div class="stars in" aria-label="5 din 5">${'<span>★</span>'.repeat(5)}</div><q>${r[0]}</q><div class="dt">${r[1]}</div></article>`).join('');
$$('#rtr .stars span').forEach((c,i)=>c.style.animationDelay=(.3+(i%5)*.08)+'s');
/* footer today */
const d=new Date().getDay(),k=d===0?'0':d===6?'6':'1';const tr=$(`#prg tr[data-d="${k}"]`);tr&&tr.classList.add('today');
/* gauge */
const tk=$('#ticks');for(let i=0;i<=40;i++){const a=(-225+i*6.75)*Math.PI/180,r1=i%5?166:156;const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',200+r1*Math.cos(a));l.setAttribute('y1',200+r1*Math.sin(a));l.setAttribute('x2',200+174*Math.cos(a));l.setAttribute('y2',200+174*Math.sin(a));tk.appendChild(l)}
let gT=0,gC=0;const gn=$('#gneedle'),ga=$('#garc'),gv=$('#gval');
function gauge(){gC+=(gT-gC)*.08;gn.style.transform=`rotate(${-135+gC*270}deg)`;ga.style.strokeDashoffset=680*(1-gC);gv.textContent=String(Math.round(gC*100)).padStart(3,'0');if(Math.abs(gT-gC)>.002)requestAnimationFrame(gauge)}
const gEl=$('#gauge');setTimeout(()=>{gT=1;gauge()},RM?0:3300);
gEl.addEventListener('pointermove',e=>{const r=gEl.getBoundingClientRect();gT=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));gauge()});gEl.addEventListener('pointerleave',()=>{gT=1;gauge()});
/* scroll stuff */
const prog=$('#prog'),nav=$('#nav'),mc=$('#mcall'),lays=$$('[data-depth]');
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${H>0?y/H:0})`;nav.classList.toggle('s',y>30);mc.classList.toggle('on',y>innerHeight*.6);
 if(!RM)lays.forEach(l=>{const p=l.parentElement.getBoundingClientRect();if(p.bottom<-100||p.top>innerHeight+100)return;const c=p.top+p.height/2-innerHeight/2;const base=l.classList.contains('grid3')?'perspective(500px) rotateX(60deg) ':'';l.style.transform=base+`translate3d(${l.dataset.x?c*l.dataset.x:0}px,${c*-l.dataset.depth}px,0)`})}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();
/* services spotlight + tap */
$$('.sv').forEach(s=>{s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();s.style.setProperty('--mx',e.clientX-r.left+'px');s.style.setProperty('--my',e.clientY-r.top+'px')});s.addEventListener('click',e=>{if(e.target.closest('a'))return;$$('.sv').forEach(x=>x.classList.toggle('act',x===s&&!s.classList.contains('act')))})});
/* checklist */
const cis=$$('.ci');cis.forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('on');const n=$$('.ci.on').length;$('#chkb').style.width=n/4*100+'%';const m=$('#chkm');m.textContent=n===4?'✓ Ai toate actele. Te așteptăm!':n+' / 4 acte';m.classList.toggle('ok',n===4);if(n===4&&navigator.vibrate)try{navigator.vibrate([20,40,20])}catch(_){}}));
/* micro */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.ci,.copyb');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const dd=Math.max(r.width,r.height)*2;s.style.cssText=`width:${dd}px;height:${dd}px;left:${e.clientX-r.left-dd/2}px;top:${e.clientY-r.top-dd/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});
const toast=t=>{const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)};
const cp=$('#copyph');cp.addEventListener('click',async()=>{const n='0742 151 132';let ok=false;try{await navigator.clipboard.writeText(n);ok=true}catch(e){try{const t=document.createElement('textarea');t.value=n;document.body.appendChild(t);t.select();ok=document.execCommand('copy');t.remove()}catch(_){}}cp.classList.add('ok');cp.querySelector('span').textContent=ok?'Copiat ✓':n;toast(ok?'Numărul a fost copiat: '+n:'Număr: '+n);setTimeout(()=>{cp.classList.remove('ok');cp.querySelector('span').textContent='Copiază numărul'},2400)});
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
 const c=$('#cur');let x=-99,y=-99,cx=-99,cy=-99;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;c.classList.toggle('big',!!e.target.closest('a,button,.sv,canvas'))});(function l(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(l)})()}
/* 3D */
const sec=$('#scan3d'),stage=$('#stage');let gl=false;try{const t=document.createElement('canvas');gl=!!(t.getContext('webgl')||t.getContext('experimental-webgl'))}catch(e){}
if(!gl||!window.THREE){sec.classList.add('fallback');return}
const TH=THREE,W=()=>stage.clientWidth,H=()=>stage.clientHeight;
const ren=new TH.WebGLRenderer({antialias:!MOB,alpha:true,powerPreference:'low-power'});ren.setPixelRatio(Math.min(devicePixelRatio,MOB?1.25:1.75));ren.setSize(W(),H());stage.appendChild(ren.domElement);
const sc=new TH.Scene();sc.fog=new TH.Fog(0x050d1c,10,26);const cam=new TH.PerspectiveCamera(35,W()/H(),.1,100);
sc.add(new TH.HemisphereLight(0xbfe9ff,0x050d1c,.55));const kl=new TH.DirectionalLight(0xffffff,1.2);kl.position.set(4,6,5);sc.add(kl);const cl=new TH.PointLight(0x22e3ff,2,14);cl.position.set(-3,2,3);sc.add(cl);
const car=new TH.Group();sc.add(car);
const paint=new TH.MeshStandardMaterial({color:0x1b4a8a,metalness:.6,roughness:.35});const glass=new TH.MeshStandardMaterial({color:0x061224,metalness:.9,roughness:.1,transparent:true,opacity:.85});const tyreM=new TH.MeshStandardMaterial({color:0x0a0d12,roughness:.9});const rimM=new TH.MeshStandardMaterial({color:0x9fb3cc,metalness:.8,roughness:.3});
const wire=new TH.LineBasicMaterial({color:0x22e3ff,transparent:true,opacity:.55});
function part(geo,mat,x,y,z){const m=new TH.Mesh(geo,mat);m.position.set(x,y,z);car.add(m);const e=new TH.LineSegments(new TH.EdgesGeometry(geo,20),wire);e.position.copy(m.position);car.add(e);return m}
part(new TH.BoxGeometry(4.2,.62,1.8),paint,0,.62,0);
// cabin: trapezoid via shape extrude
const s=new TH.Shape();s.moveTo(-1.35,0);s.lineTo(1.25,0);s.lineTo(.75,.62);s.lineTo(-.85,.62);s.closePath();
const cg=new TH.ExtrudeGeometry(s,{depth:1.6,bevelEnabled:false});cg.translate(0,0,-.8);part(cg,glass,-.1,.93,0);
part(new TH.BoxGeometry(.5,.22,1.82),paint,1.95,.55,0);part(new TH.BoxGeometry(.4,.22,1.82),paint,-2.0,.55,0);
const wheels=[];for(const [x,z] of [[1.35,.92],[1.35,-.92],[-1.35,.92],[-1.35,-.92]]){const g=new TH.Group();const t=new TH.Mesh(new TH.CylinderGeometry(.42,.42,.32,28),tyreM);t.rotation.x=Math.PI/2;g.add(t);const r=new TH.Mesh(new TH.CylinderGeometry(.24,.24,.34,6),rimM);r.rotation.x=Math.PI/2;g.add(r);const e=new TH.LineSegments(new TH.EdgesGeometry(new TH.CylinderGeometry(.42,.42,.32,14)),wire);e.rotation.x=Math.PI/2;g.add(e);g.position.set(x,.42,z);car.add(g);wheels.push(g)}
for(const z of[.6,-.6]){const hl=new TH.Mesh(new TH.BoxGeometry(.05,.1,.3),new TH.MeshBasicMaterial({color:0xbff6ff}));hl.position.set(2.11,.7,z);car.add(hl)}
const grid=new TH.GridHelper(30,40,0x22e3ff,0x16304f);grid.material.transparent=true;grid.material.opacity=.35;sc.add(grid);
// scan plane
const scanG=new TH.Group();const pl=new TH.Mesh(new TH.PlaneGeometry(2.6,2),new TH.MeshBasicMaterial({color:0x22e3ff,transparent:true,opacity:.12,side:TH.DoubleSide,depthWrite:false}));pl.rotation.y=Math.PI/2;pl.position.y=1;scanG.add(pl);
const ed=new TH.LineSegments(new TH.EdgesGeometry(new TH.PlaneGeometry(2.6,2)),new TH.LineBasicMaterial({color:0x22e3ff}));ed.rotation.y=Math.PI/2;ed.position.y=1;scanG.add(ed);sc.add(scanG);
// lift ring
const ring=new TH.Mesh(new TH.RingGeometry(2.7,2.78,96),new TH.MeshBasicMaterial({color:0x22e3ff,transparent:true,opacity:.5,side:TH.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.01;sc.add(ring);
let uy=0,up=0,zoom=1,drag=null,pin=0,p=0,yaw=.6,vis=false;const el=ren.domElement,ptr=new Map();
el.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);try{el.setPointerCapture(e.pointerId)}catch(_){}drag=[e.clientX,e.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){const [a,b]=[...ptr.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pin)zoom=Math.min(1.7,Math.max(.7,zoom*dd/pin));pin=dd;return}if(drag){uy+=(e.clientX-drag[0])*.01;up=Math.max(-.4,Math.min(.6,up+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}});
const pu=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pin=0;if(!ptr.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
el.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoom=Math.min(1.7,Math.max(.7,zoom*(e.deltaY>0?.93:1.07)))},{passive:false});
const chs=$$('.ch'),st=$$('.steps i'),b3=$('#bar3'),pc=$('#pct3');
function sp(){const r=sec.getBoundingClientRect();p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const i=Math.min(3,Math.floor(p*4));chs.forEach((c,j)=>c.classList.toggle('on',j===i));st.forEach((c,j)=>c.classList.toggle('on',j<=i));b3.style.transform=`scaleX(${p})`;pc.textContent=String(Math.round(p*100)).padStart(2,'0')+'%'}
addEventListener('scroll',sp,{passive:true});sp();
addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix()});
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)tick()},{rootMargin:'80px'}).observe(sec);
let cy=0;function tick(){if(!vis)return;const t=performance.now()/1000;
 const ty=uy+.6+p*Math.PI*2;yaw+=(ty-yaw)*.08;car.rotation.y=yaw;
 const lift=(p>.5&&p<.75)?Math.sin((p-.5)/.25*Math.PI)*.35:0;car.position.y+=(lift-car.position.y)*.1;
 scanG.position.x=car.position.x+Math.sin(t*(RM?0:1.4))*2.3;ring.position.x=car.position.x;scanG.rotation.y=0;scanG.visible=p<.9;
 ring.scale.setScalar(1+Math.sin(t*2)*.02);wheels.forEach(w=>w.children[0].rotation.y=0);
 const dist=(MOB?20:10)-Math.sin(p*Math.PI)*2.4;cy+=(up-cy)*.1;const R=dist/zoom;
 cam.position.set(MOB?0:1.4,(MOB?4.2:2.4)+cy*6+p*1.2,R);cam.lookAt(MOB?0:1.4,MOB?.2:.7,0);
 if(!MOB){car.position.x=1.4}else{car.position.x=0}
 cl.intensity=1.6+Math.sin(t*3)*.4;ren.render(sc,cam);requestAnimationFrame(tick)}
window.__ld3d=true;
})();

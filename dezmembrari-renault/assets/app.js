(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,MOB=matchMedia('(max-width:899px)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* intro */
const intro=$('#intro');function endIntro(){if(!intro||intro.classList.contains('done'))return;intro.classList.add('done');document.body.classList.add('ready');setTimeout(()=>intro.remove(),1000)}
if(RM)endIntro();else{intro.classList.add('play');setTimeout(endIntro,3000);intro.addEventListener('click',endIntro)}
/* marquee */
$('#mq').innerHTML=Array(2).fill(['Piese Dacia','Piese Renault','Din dezmembrări','Str. Donath 211D','0745 997 168','0748 707 915','Cluj-Napoca'].map(t=>`<span>${t}</span><span class="d">✕</span>`).join('')).join('');
/* reveal + fallback */
const show=e=>e.classList.add('in'),T='.rv,.rtr,.stars';
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show(e.target);io.unobserve(e.target)}}),{threshold:.12});$$(T).forEach(e=>io.observe(e))}
const chk=()=>$$(T).forEach(e=>{if(e.getBoundingClientRect().top<innerHeight*1.05)show(e)});addEventListener('scroll',chk,{passive:true});setTimeout(chk,1200);setTimeout(chk,3200);
$$('.score .stars span').forEach((c,i)=>c.style.animationDelay=(i*.1)+'s');
/* reviews verbatim (4-5★) */
const R=[["Un om corect si serios. Recomand",5,"03.09.2025"],["Super ok.",5,"24.03.2024"],["Preț corect , comunicare foarte bună , piesă în stare bună , fără probleme . Dacă mai am nevoie am să revin .",5,"30.04.2023"],["Ofertă bună din dezmembrări pe marca Renault și nu numai, de asemenea Ionuț (șefu) și colegul de la depozit sunt înțelegători din toate punctele de vedere👌",5,"13.01.2023"],["Am găsit piesa pe care o cautam și am fost servit cu placere. Singurul inconvenient a fost faptul ca prețul a fost ceva mai mare decât în alta parte, dar asta e.",4,"30.10.2022"],["Good prices ! What they advertise is accurate!",5,"23.01.2022"]];
$('#rtr').innerHTML=R.map((r,i)=>`<article class="rc" style="transition-delay:${i*.08}s"><div class="stars in" aria-label="${r[1]} din 5">${'<span>★</span>'.repeat(r[1])}${r[1]<5?'<span style="color:#4a3a2e">★</span>':''}</div><q>${r[0]}</q><div class="dt">${r[2]}</div></article>`).join('');
$$('#rtr .stars span').forEach((c,i)=>c.style.animationDelay=(.3+(i%5)*.08)+'s');
/* drag reviews on desktop */
const rt=$('#rtr');let dn=0,sx=0,sl=0;rt.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dn=1;sx=e.clientX;sl=rt.scrollLeft});addEventListener('pointermove',e=>{if(dn)rt.scrollLeft=sl-(e.clientX-sx)});addEventListener('pointerup',()=>dn=0);
/* today */
const d=new Date().getDay(),k=d===0?'0':d===6?'6':'1';const tr=$(`#prg tr[data-d="${k}"]`);tr&&tr.classList.add('today');
/* exploded svg */
const ex=$('#exv');let auto=setTimeout(()=>ex.classList.add('ex'),RM?0:3800);setTimeout(()=>ex.classList.remove('ex'),RM?0:5600);
ex.addEventListener('mouseenter',()=>{clearTimeout(auto);ex.classList.add('ex')});ex.addEventListener('mouseleave',()=>ex.classList.remove('ex'));ex.addEventListener('click',()=>{clearTimeout(auto);ex.classList.toggle('ex')});ex.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ex.click()}});
/* scroll */
const prog=$('#prog'),nav=$('#nav'),mb=$('#mbar'),lays=$$('[data-depth]');
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${H>0?y/H:0})`;nav.classList.toggle('s',y>30);mb.classList.toggle('on',y>innerHeight*.5);
 if(!RM)lays.forEach(l=>{const p=l.parentElement.getBoundingClientRect();if(p.bottom<-100||p.top>innerHeight+100)return;const c=p.top+p.height/2-innerHeight/2;l.style.transform=`translate3d(${l.dataset.x?c*l.dataset.x:0}px,${c*-l.dataset.depth}px,0)`})}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();
/* offer cards tap */
$$('.oc').forEach(c=>c.addEventListener('click',()=>$$('.oc').forEach(x=>x.classList.toggle('act',x===c&&!c.classList.contains('act')))));
/* finder */
const M={Dacia:['Logan','Duster','Dokker','Lodgy'],Renault:['Megane','Scenic','Fluence','Kadjar']};const P=['Motor','Cutie de viteze','Caroserie','Faruri / stopuri','Suspensie','Interior','Instalație electrică','Altă piesă'];
let sel={b:null,m:null,p:null};const fm=$('#fm'),fp=$('#fp'),out=$('#out');
const chip=(t,a)=>`<button class="chip" data-${a}="${t}">${t}</button>`;
function upd(){if(!sel.b){return}const txt=`Bună ziua, caut ${sel.p?sel.p.toLowerCase():'o piesă'} pentru ${sel.b}${sel.m?' '+sel.m:''}.`;
 out.classList.add('on');out.classList.remove('pop');void out.offsetWidth;out.classList.add('pop');
 out.innerHTML=`<div class="q">${sel.p?`<em>${sel.p}</em> pentru `:''}${sel.b} <em>${sel.m||''}</em></div><p>Spune la telefon anul și motorizarea. Disponibilitatea piesei se confirmă telefonic.</p><div class="row"><a class="btn" href="tel:+40745997168">☎ 0745 997 168</a><a class="btn gh" href="tel:+40748707915">☎ 0748 707 915</a><button class="copyb" data-copy="${txt}">⧉ <span>Copiază mesajul</span></button></div>`}
$('#fb').addEventListener('click',e=>{const b=e.target.closest('[data-b]');if(!b)return;sel={b:b.dataset.b,m:null,p:sel.p};$$('#fb .chip').forEach(x=>x.classList.toggle('on',x===b));fm.innerHTML=M[sel.b].map(m=>chip(m,'m')).join('')+chip('Alt model','m');if(!fp.innerHTML)fp.innerHTML=P.map(p=>chip(p,'p')).join('');upd()});
fm.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;sel.m=b.dataset.m==='Alt model'?'(alt model)':b.dataset.m;$$('#fm .chip').forEach(x=>x.classList.toggle('on',x===b));upd()});
fp.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;sel.p=b.dataset.p;$$('#fp .chip').forEach(x=>x.classList.toggle('on',x===b));upd()});
fp.innerHTML=P.map(p=>chip(p,'p')).join('');
/* micro */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.chip,.copyb');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const dd=Math.max(r.width,r.height)*2;s.style.cssText=`width:${dd}px;height:${dd}px;left:${e.clientX-r.left-dd/2}px;top:${e.clientY-r.top-dd/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});
const toast=t=>{const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)};
document.addEventListener('click',async e=>{const cp=e.target.closest('.copyb');if(!cp)return;const n=cp.dataset.copy;let ok=false;try{await navigator.clipboard.writeText(n);ok=true}catch(_){try{const t=document.createElement('textarea');t.value=n;document.body.appendChild(t);t.select();ok=document.execCommand('copy');t.remove()}catch(__){}}
 const sp=cp.querySelector('span'),old=sp.textContent;cp.classList.add('ok');sp.textContent=ok?'Copiat ✓':'Selectează manual';toast(ok?'Copiat: '+n:n);setTimeout(()=>{cp.classList.remove('ok');sp.textContent=old},2200)});
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
 const c=$('#cur');let x=-99,y=-99,cx=-99,cy=-99;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;c.classList.toggle('big',!!e.target.closest('a,button,.oc,canvas,.exv'))});(function l(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(l)})()}
/* 3D exploded engine */
const sec=$('#motor'),stage=$('#stage');let gl=false;try{const t=document.createElement('canvas');gl=!!(t.getContext('webgl')||t.getContext('experimental-webgl'))}catch(e){}
if(!gl||!window.THREE){sec.classList.add('fallback');return}
const TH=THREE,W=()=>stage.clientWidth,H=()=>stage.clientHeight;
const ren=new TH.WebGLRenderer({antialias:!MOB,alpha:true,powerPreference:'low-power'});ren.setPixelRatio(Math.min(devicePixelRatio,MOB?1.25:1.75));ren.setSize(W(),H());stage.appendChild(ren.domElement);
const sc=new TH.Scene();const cam=new TH.PerspectiveCamera(35,W()/H(),.1,100);
sc.add(new TH.HemisphereLight(0xffe2c8,0x140c06,.6));const kl=new TH.DirectionalLight(0xffffff,1.3);kl.position.set(4,6,5);sc.add(kl);const ol=new TH.PointLight(0xe0601f,2.2,16);ol.position.set(-3,1,3);sc.add(ol);
const eng=new TH.Group();sc.add(eng);
const iron=new TH.MeshStandardMaterial({color:0x4a4440,metalness:.7,roughness:.45}),alu=new TH.MeshStandardMaterial({color:0xb9b2aa,metalness:.85,roughness:.28}),rust=new TH.MeshStandardMaterial({color:0xe0601f,metalness:.4,roughness:.4}),dark=new TH.MeshStandardMaterial({color:0x1a1512,metalness:.5,roughness:.6});
const edge=new TH.LineBasicMaterial({color:0xe0601f,transparent:true,opacity:.35});
const parts=[];function add(geo,mat,pos,off,rot){const m=new TH.Mesh(geo,mat);const g=new TH.Group();g.add(m);const e=new TH.LineSegments(new TH.EdgesGeometry(geo,25),edge);g.add(e);if(rot)m.rotation.set(...rot),e.rotation.set(...rot);g.userData={p:new TH.Vector3(...pos),o:new TH.Vector3(...off),r:Math.random()*.8-.4};g.position.copy(g.userData.p);eng.add(g);parts.push(g);return g}
add(new TH.BoxGeometry(2.4,1.3,1.2),iron,[0,0,0],[0,0,0]);
add(new TH.BoxGeometry(2.4,.4,1.15),alu,[0,.86,0],[0,1.6,0]);
add(new TH.BoxGeometry(2.2,.28,.9),rust,[0,1.2,0],[0,3.0,0]);
add(new TH.BoxGeometry(2.2,.45,1.0),dark,[0,-.88,0],[0,-2.0,0]);
for(let i=0;i<4;i++){const x=-.84+i*.56;add(new TH.CylinderGeometry(.2,.2,.42,20),alu,[x,.3,0],[x*1.6,2.2+i*.15,1.6]);}
add(new TH.CylinderGeometry(.09,.09,2.8,14),alu,[0,-.4,0],[0,-1.2,2.2],[0,0,Math.PI/2]);
add(new TH.CylinderGeometry(.42,.42,.12,32),rust,[-1.28,-.35,0],[-3.2,-.3,0],[0,0,Math.PI/2]);
add(new TH.TorusGeometry(.32,.06,10,32),dark,[1.3,.1,0],[3.0,.4,.6],[0,Math.PI/2,0]);
add(new TH.BoxGeometry(.18,.9,.7),dark,[0,.1,.72],[0,.2,2.8]);
for(let i=0;i<4;i++){const x=-.84+i*.56;add(new TH.CylinderGeometry(.05,.05,.3,8),rust,[x,1.43,.2],[x*2.2,4.0,.8])}
const grid=new TH.GridHelper(30,30,0xe0601f,0x2f251d);grid.position.y=-1.6;grid.material.transparent=true;grid.material.opacity=.3;sc.add(grid);
let uy=0,up=0,zoom=1,drag=null,pin=0,p=0,vis=false,yaw=.7;const el=ren.domElement,ptr=new Map();
el.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);try{el.setPointerCapture(e.pointerId)}catch(_){}drag=[e.clientX,e.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){const [a,b]=[...ptr.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pin)zoom=Math.min(1.7,Math.max(.7,zoom*dd/pin));pin=dd;return}if(drag){uy+=(e.clientX-drag[0])*.01;up=Math.max(-.5,Math.min(.6,up+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}});
const pu=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pin=0;if(!ptr.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
el.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoom=Math.min(1.7,Math.max(.7,zoom*(e.deltaY>0?.93:1.07)))},{passive:false});
const chs=$$('.ch'),st=$$('.steps i'),b3=$('#bar3'),pc=$('#pct3');
function sp(){const r=sec.getBoundingClientRect();p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const i=Math.min(3,Math.floor(p*4));chs.forEach((c,j)=>c.classList.toggle('on',j===i));st.forEach((c,j)=>c.classList.toggle('on',j<=i));b3.style.transform=`scaleX(${p})`;pc.textContent=String(Math.round(Math.min(1,p/.85)*100)).padStart(2,'0')+'%'}
addEventListener('scroll',sp,{passive:true});sp();
addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix()});
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)tick()},{rootMargin:'80px'}).observe(sec);
let cy=0,exs=1;function tick(){if(!vis)return;const t=performance.now()/1000;
 const target=1-Math.min(1,p/.85);exs+=(target-exs)*.1;const e3=exs*exs*(3-2*exs);
 parts.forEach(g=>{g.position.copy(g.userData.p).addScaledVector(g.userData.o,e3);g.rotation.z=g.userData.r*e3;g.rotation.x=g.userData.r*.6*e3});
 yaw+=((uy+.7+p*Math.PI*1.5+(RM?0:t*.05))-yaw)*.08;eng.rotation.y=yaw;cy+=(up-cy)*.1;eng.rotation.x=cy;
 const dist=(MOB?15:11)-Math.sin(p*Math.PI)*2;cam.position.set(MOB?0:-2.2,(MOB?1.2:1.6),dist/zoom);cam.lookAt(MOB?0:-2.2,MOB?-.3:.2,0);eng.position.x=0;
 ol.intensity=1.8+Math.sin(t*3)*.5;ren.render(sc,cam);requestAnimationFrame(tick)}
window.__dr3d=true;
})();

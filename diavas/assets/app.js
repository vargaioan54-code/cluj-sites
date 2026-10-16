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

/* ---------- foam bubbles in the hero (2D canvas, tap to pop) ---------- */
(()=>{const hero=$('#hero'),gl=$('#gl'),hint=$('#bhint'),cnt=$('#bcnt');if(!hero||!gl)return;
 if(RM){if(hint)hint.style.display='none';return}
 const c=document.createElement('canvas');c.id='bub';gl.appendChild(c);const x=c.getContext('2d');let W=0,H=0,dpr=1,pops=0;
 function size(){dpr=Math.min(devicePixelRatio||1,2);W=gl.clientWidth;H=gl.clientHeight;if(!W||!H)return;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
 size();addEventListener('resize',size);new ResizeObserver(size).observe(gl);
 const B=[],P=[];let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis)loop(performance.now())}).observe(hero);
 const rnd=(a,b)=>a+Math.random()*(b-a);
 function add(px,py,r){if(B.length>70)B.shift();B.push({x:px,y:py,r:r||rnd(5,20),vy:rnd(.15,.55),ph:rnd(0,6.28),w:rnd(.4,1.1)})}
 for(let i=0;i<14;i++)add(rnd(0,W||300),rnd(0,H||300));
 function pt(e){const r=gl.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,in:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}}
 let lastMv=0;
 hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p=pt(e),n=performance.now();if(!p.in||n-lastMv<70)return;lastMv=n;add(p.x+rnd(-8,8),p.y+rnd(-6,6),rnd(4,11))},{passive:true});
 hero.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;const p=pt(e);if(!p.in)return;let hit=0;
  for(let i=B.length-1;i>=0;i--){const b=B[i];if(Math.hypot(b.x-p.x,b.y-p.y)<b.r+12){pop(b);B.splice(i,1);hit++}}
  if(hit){pops+=hit;if(cnt)cnt.textContent=pops}else for(let k=0;k<6;k++)add(p.x+rnd(-18,18),p.y+rnd(-10,10),rnd(5,16))});
 function pop(b){P.push({x:b.x,y:b.y,r:b.r,t:0});for(let k=0;k<6;k++){const a=k/6*6.28+rnd(0,.5);P.push({x:b.x,y:b.y,vx:Math.cos(a)*rnd(40,90),vy:Math.sin(a)*rnd(40,90),t:0,d:1})}}
 let lt=performance.now();
 function loop(now){if(!vis)return;requestAnimationFrame(loop);const dt=Math.min(.05,(now-lt)/1000);lt=now;if(!W||!H)return;
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  if(B.length<14&&Math.random()<.06)add(rnd(0,W),H+10);
  for(let i=B.length-1;i>=0;i--){const b=B[i];b.y-=b.vy*60*dt;b.ph+=dt*b.w;b.x+=Math.sin(b.ph)*.35;if(b.y<-30)B.splice(i,1)}
  B.forEach(b=>{x.beginPath();x.arc(b.x,b.y,b.r,0,6.283);x.fillStyle='rgba(150,220,255,.07)';x.fill();x.lineWidth=1.3;x.strokeStyle='rgba(200,243,255,.55)';x.stroke();x.beginPath();x.arc(b.x,b.y,b.r*.68,3.5,4.6);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.5;x.stroke()});
  for(let i=P.length-1;i>=0;i--){const q=P[i];q.t+=dt*2.2;if(q.t>1){P.splice(i,1);continue}
   if(q.d){q.x+=q.vx*dt;q.y+=q.vy*dt;x.beginPath();x.arc(q.x,q.y,2*(1-q.t)+.5,0,6.283);x.fillStyle=`rgba(220,246,255,${1-q.t})`;x.fill()}
   else{x.beginPath();x.arc(q.x,q.y,q.r*(1+q.t*.8),0,6.283);x.strokeStyle=`rgba(220,246,255,${.8*(1-q.t)})`;x.lineWidth=2;x.stroke()}}}
 loop(performance.now())})();

/* ---------- service picker ---------- */
(()=>{const chips=$('#pkchips'),svg=$('#pkc');if(!chips||!svg)return;
 const S=[{k:'ext',c:'Spălare exterior',z:'Serviciu 01',t:'Spălare exterior',p:'În general: caroseria, geamurile și roțile spălate de praf și noroi.'},
 {k:'foam',c:'Spumă activă',z:'Serviciu 02',t:'Spumă activă',p:'În general: un strat de spumă care se lasă să acționeze înainte de spălare, ca murdăria să se desprindă mai ușor.'},
 {k:'int',c:'Curățare interior',z:'Serviciu 03',t:'Curățare interior',p:'În general: aspirat și curățarea suprafețelor din habitaclu. Întreabă la telefon ce include.'},
 {k:'dry',c:'Clătire și uscare',z:'Serviciu 04',t:'Clătire și uscare',p:'În general: clătire cu apă curată și uscare, ca să nu rămână urme de apă.'},
 {k:'wax',c:'Lustruire / ceară',q:'întreabă',z:'Opțional',t:'Lustruire / ceară',p:'Serviciu opțional. Nu putem afirma dacă și în ce formă se oferă: întreabă la telefon.'}];
 const on=new Set(['ext']),vz=$('#pkz'),vt=$('#pkt'),vp=$('#pkp'),sm=$('#pks');let last=0;
 S.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=s.c+(s.q?'<span class="q2">('+s.q+')</span>':'');b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(on.has(s.k))on.delete(s.k);else on.add(s.k);last=i;draw()});chips.appendChild(b)});
 function draw(){[...chips.children].forEach((b,i)=>{const o=on.has(S[i].k);b.classList.toggle('on',o);b.setAttribute('aria-pressed',o)});
  S.forEach(s=>svg.classList.toggle('s-'+s.k,on.has(s.k)));const s=S[last];vz.textContent=s.z;vt.textContent=s.t;vp.textContent=s.p;
  const l=S.filter(s=>on.has(s.k)).map(s=>s.c.toLowerCase());sm.textContent=l.length?'Aș vrea: '+l.join(', ')+'.':'Alege cel puțin un serviciu.'}
 draw()})();

/* ---------- before / after ---------- */
(()=>{const w=$('#baw'),r=$('#bar');if(!w||!r)return;const set=v=>w.style.setProperty('--p',v+'%');r.addEventListener('input',()=>set(r.value));
 let done=false;function demo(){if(done||RM)return;done=true;const t0=performance.now(),D=2600;(function f(n){if(r.matches(':active')){return}const k=Math.min(1,(n-t0)/D),v=50+38*Math.sin(k*Math.PI*2)*(1-k*.3);r.value=v;set(v);if(k<1)requestAnimationFrame(f);else{r.value=50;set(50)}})(t0)}
 ('IntersectionObserver' in window)?new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){demo();o.disconnect()}},{threshold:.5}).observe(w):0})();

/* ---------- checklist ---------- */
(()=>{const cl=$('#cl');if(!cl)return;const bs=[...cl.querySelectorAll('button')],fg=$('#cfg'),tx=$('#ctx'),ct=$('#ct'),cp=$('#cp'),rs=$('#cres');
 function upd(){const n=bs.filter(b=>b.classList.contains('on')).length;tx.textContent=n+'/6';fg.style.strokeDashoffset=327*(1-n/6);rs.classList.toggle('ok',n===6);
  ct.textContent=n===6?'Gata de spălat':n?'Mai ai '+(6-n)+(6-n===1?' punct':' puncte'):'Bifează ce ai verificat';cp.textContent=n===6?'Ai bifat tot. Sună și întreabă când poți veni.':'Atingi fiecare punct pe măsură ce îl verifici.'}
 bs.forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');upd()}));upd()})();

/* ---------- scroll: progress, nav, chapters ---------- */
const prog=$('#prog'),cap=$('#cap'),ch=$$('.chap'),dots=$$('.dots i'),chl=$('#chline');
const secs=['info','servicii','ba','model3d','cap','contact'].map(i=>$('#'+i)),nl=$$('.navl a');
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
const win=(p,a,b,c,d)=>Math.max(0,sm((p-a)/(b-a))-sm((p-c)/(d-c)));
const cl01=x=>Math.max(0,Math.min(1,x));
function canv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function envMap(ren){
 try{const pm=new T.PMREMGenerator(ren),s=new T.Scene();
  s.add(new T.Mesh(new T.SphereGeometry(20,24,16),new T.MeshBasicMaterial({color:0x1a3a55,side:T.BackSide})));
  const lamp=(w,h,x,y,z,k,col)=>{const m=new T.MeshBasicMaterial({color:col||0xffffff,side:T.DoubleSide});m.color.multiplyScalar(k);const p=new T.Mesh(new T.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.lookAt(0,0,0);s.add(p)};
  lamp(16,4,0,12,4,5);lamp(3,12,-12,2,6,4,0xd8f0ff);lamp(3,12,12,0,5,3,0xd8fff0);lamp(10,3,0,-6,12,1.6);lamp(6,6,0,2,-14,2.5);
  const t=pm.fromScene(s,.02).texture;pm.dispose();return t}catch(e){return null}}

/* ---------- the model: a car in a wash bay ----------
   Car length = x (front +x), width = z, up = y. Illustrative, not the real equipment of the car wash.
   Stages (p 0..1): pre-rinse arch, foam, brushes, final rinse, dryer, shine sweep. */
function brushTex(){const c=canv(64,64),x=c.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?'#7cf0b6':'#2fa8e8';x.fillRect(i*8,0,8,64)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(2,1);return t}
function dotTex(){const c=canv(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}
function starTex(){const c=canv(64,64),x=c.getContext('2d');x.translate(32,32);const g=x.createRadialGradient(0,0,1,0,0,30);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;[0,PI/2].forEach(a=>{x.save();x.rotate(a);x.beginPath();x.ellipse(0,0,30,2.6,0,0,PI*2);x.fill();x.restore()});x.beginPath();x.arc(0,0,6,0,PI*2);x.fill();return new T.CanvasTexture(c)}
function mats(){const S=o=>new T.MeshStandardMaterial(o);return{
 paint:S({color:0x2f7fe0,metalness:.85,roughness:.25,envMapIntensity:.95}),glass:S({color:0x050d16,metalness:.85,roughness:.2,envMapIntensity:.8}),
 tyre:S({color:0x0b0d10,roughness:.9,metalness:.05}),rim:S({color:0xd5e3ec,metalness:1,roughness:.2}),
 dark:S({color:0x14202b,metalness:.5,roughness:.6,envMapIntensity:.4}),steel:S({color:0xb7c4cc,metalness:1,roughness:.3}),
 arch:S({color:0xe4eef5,metalness:.8,roughness:.3,envMapIntensity:.8}),acc:S({color:0x3fc8ff,metalness:.3,roughness:.4,emissive:0x0a5a86,emissiveIntensity:.8}),
 brush:S({color:0xffffff,map:brushTex(),roughness:.9,metalness:0}),
 foam:S({color:0xffffff,roughness:.95,metalness:0,envMapIntensity:.6}),mud:S({color:0x5a4a38,roughness:1,metalness:0,transparent:true}),
 bub:S({color:0xcfefff,roughness:.05,metalness:0,transparent:true,opacity:.32,envMapIntensity:1.4,depthWrite:false}),
 line:new T.MeshBasicMaterial({color:0x3fc8ff}),lampOn:new T.MeshBasicMaterial({color:0x7a8c9a}),tail:new T.MeshBasicMaterial({color:0x6a1f18}),
 ring:new T.MeshBasicMaterial({color:0x7cf0b6,transparent:true,opacity:0}),
 slab:new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false})}}
function spray(N,col,size,op,tex){const g=new T.BufferGeometry(),pos=new Float32Array(N*3);for(let i=0;i<N;i++)pos[i*3+1]=-100;g.setAttribute('position',new T.BufferAttribute(pos,3));
 const m=new T.PointsMaterial({color:col,size:size,map:tex,transparent:true,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true,opacity:op});
 const pts=new T.Points(g,m);pts.frustumCulled=false;const P=[];for(let i=0;i<N;i++)P.push({t:2,l:1,a:new T.Vector3(),b:new T.Vector3()});let acc=0;
 function update(dt,em,rate,grav){if(dt<=0)return;acc+=em.length?rate*dt:0;
  for(let i=0;i<N;i++){const q=P[i];if(q.t>=1){if(acc>=1&&em.length){acc-=1;const e=em[(Math.random()*em.length)|0];q.a.copy(e.a);q.b.copy(e.b);q.a.x+=(Math.random()-.5)*.1;q.b.x+=(Math.random()-.5)*.8;q.b.y+=(Math.random()-.5)*.6;q.b.z+=(Math.random()-.5)*.4;q.l=.45+Math.random()*.3;q.t=0}else{pos[i*3+1]=-100;continue}}
   q.t+=dt/q.l;const t=Math.min(1,q.t);pos[i*3]=q.a.x+(q.b.x-q.a.x)*t;pos[i*3+1]=q.a.y+(q.b.y-q.a.y)*t-grav*t*t;pos[i*3+2]=q.a.z+(q.b.z-q.a.z)*t}
  if(acc>3)acc=3;g.attributes.position.needsUpdate=true}
 return{pts:pts,update:update}}
function stage(p){
 const seg=(a,b,x0,x1)=>p<a?null:x0+(x1-x0)*sm((p-a)/(b-a)),L=5.6;
 let ax=-L;const s1=seg(.02,.22,-L,L),s2=seg(.27,.41,L,-L),s3=seg(.76,.9,-L,L);if(s1!==null)ax=s1;if(s2!==null)ax=s2;if(s3!==null)ax=s3;
 const jw=Math.max(win(p,.02,.04,.22,.235),win(p,.76,.78,.9,.915)),jf=win(p,.27,.29,.41,.425);
 const dirt=1-.25*sm((p-.02)/.2)-.75*sm((p-.54)/.18),wrap=p>.985?sm((p-.985)/.015):0;
 return{ap:p<.02?sm(p/.02):(1-sm((p-.9)/.04)),ax:ax,jw:jw,jf:jf,
  fgx:p<.27?99:p>.41?-99:L-2*L*sm((p-.27)/.14),frx:p<.76?-99:p>.9?99:-L+2*L*sm((p-.76)/.14),
  fm:win(p,.27,.4,.74,.82),bp:win(p,.5,.55,.7,.74),bx:Math.sin(cl01((p-.52)/.18)*PI*2)*3.2,
  dp:win(p,.88,.9,.96,.975),dx:-L+2*L*sm((p-.89)/.08),
  dirt:Math.max(dirt,wrap),shx:p<.93?-99:-6+12*sm((p-.93)/.07),shk:win(p,.93,.945,.985,1.0),sp:win(p,.95,.97,1.02,1.1),res:sm((p-.95)/.05)}}
function car(SEG){
const M=mats(),root=new T.Group(),V=(x,y,z)=>new T.Vector3(x,y,z),tdot=dotTex();
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
const box=(w,h,d,m,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
const cylZ=(r,l,m,x,y,z,s)=>{const g=new T.CylinderGeometry(r,r,l,s||SEG);g.rotateX(PI/2);return mesh(g,m,x,y,z)};
const cylY=(r,l,m,x,y,z,s)=>mesh(new T.CylinderGeometry(r,r,l,s||SEG),m,x,y,z);
const XF=2.8,XR=-2.5,WY=.82,WZ=1.5;
// bay floor: soft disc + rim ring + bay lines
const pc=canv(256,256),px=pc.getContext('2d'),pg2=px.createRadialGradient(128,128,10,128,128,127);pg2.addColorStop(0,'rgba(14,52,86,.96)');pg2.addColorStop(.62,'rgba(10,38,66,.9)');pg2.addColorStop(1,'rgba(4,19,34,0)');px.fillStyle=pg2;px.fillRect(0,0,256,256);
const lane=mesh(new T.PlaneGeometry(17,17),new T.MeshBasicMaterial({map:new T.CanvasTexture(pc),transparent:true,depthWrite:false}),0,.004,0);lane.rotation.x=-PI/2;root.add(lane);
const edge=mesh(new T.TorusGeometry(6.4,.022,6,SEG*5),M.line,0,.015,0);edge.rotation.x=-PI/2;root.add(edge);
[-3.1,3.1].forEach(z=>root.add(box(8.4,.02,.07,M.line,0,.012,z)));
const sc2=canv(128,128),sx=sc2.getContext('2d'),gr=sx.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=gr;sx.fillRect(0,0,128,128);
const blob=mesh(new T.PlaneGeometry(13,7),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc2),transparent:true,depthWrite:false}),0,.02,0);blob.rotation.x=-PI/2;root.add(blob);
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
[-1,1].forEach(s=>{[-.55,1.35].forEach(x=>bodyG.add(box(.03,1.0,.03,M.dark,x,1.35,s*1.66)));
 bodyG.add(box(.14,.18,.3,M.paint,1.7,2.05,s*1.55));bodyG.add(box(.38,.2,.1,M.lampOn,4.33,1.34,s*1.05));bodyG.add(box(.1,.16,.44,M.tail,-4.38,1.42,s*1.05))});
bodyG.add(box(.06,.34,1.2,M.dark,4.46,1.0,0));
// wheels
[[XF,1],[XF,-1],[XR,1],[XR,-1]].forEach(([x,s])=>{
 const piv=new T.Group(),flip=new T.Group();piv.position.set(x,WY,s*WZ);flip.rotation.y=s>0?0:PI;piv.add(flip);
 const tg=new T.Group(),tyre=mesh(new T.TorusGeometry(.62,.2,14,SEG*2),M.tyre);tyre.scale.z=1.3;tg.add(tyre);
 tg.add(cylZ(.5,.44,M.rim,0,0,.02,SEG));tg.add(cylZ(.38,.06,M.dark,0,0,.26,SEG));
 for(let k=0;k<5;k++){const a=k/5*PI*2,sp=box(.1,.34,.05,M.rim,Math.cos(a)*.2,Math.sin(a)*.2,.27);sp.rotation.z=a-PI/2;tg.add(sp)}
 flip.add(tg);root.add(piv)});
// mud (fades with dirt)
const dummy=new T.Object3D(),rr=(a,b)=>a+Math.random()*(b-a);
const mudN=70,mud=new T.InstancedMesh(new T.SphereGeometry(1,8,6),M.mud,mudN);mud.frustumCulled=false;
for(let i=0;i<mudN;i++){const side=i<52;dummy.rotation.set(0,0,0);
 if(side){const s=i%2?1:-1;dummy.position.set(rr(-3.9,3.9),rr(.78,1.25),s*1.72);dummy.scale.set(rr(.25,.7),rr(.07,.2),.05)}
 else{dummy.position.set(i%2?rr(1.6,3.9):rr(-1.0,.6),0,rr(-.8,.8));dummy.position.y=i%2?2.0-Math.max(0,dummy.position.x-1.4)*.12:3.255;dummy.scale.set(rr(.1,.28),.02,rr(.06,.18))}
 dummy.updateMatrix();mud.setMatrixAt(i,dummy.matrix)}
root.add(mud);
// foam blobs (appear top-down / front to back)
const fN=SEG>26?170:130,foam=new T.InstancedMesh(new T.SphereGeometry(1,SEG>26?12:8,SEG>26?9:6),M.foam,fN);foam.frustumCulled=false;const F=[];
const hy=x=>1.98-Math.max(0,x-1.4)*.12+.1;
for(let i=0;i<fN;i++){const k=i%10;let x,y,z,s;
 if(k<2){x=rr(1.5,4.0);z=rr(-1.2,1.2);y=hy(x)}
 else if(k<4){x=rr(-1.3,.8);z=rr(-1.05,1.05);y=3.3}
 else if(k<5){x=rr(-4.0,-2.6);z=rr(-1.3,1.3);y=1.9+.12}
 else{const sd=i%2?1:-1;x=rr(-1.3,1.6);y=rr(.85,1.8);z=sd*1.72;if(k>7){x=rr(-3.9,3.9);if(Math.abs(x-XF)<1.1||Math.abs(x-XR)<1.1)x=rr(-1.3,1.6);y=rr(.8,1.2)}}
 s=rr(.14,.3);F.push({x:x,y:y,z:z,s:s,ph:rr(0,6.28),side:k>=5})}
root.add(foam);
// floating bubbles
const bN=40,bubs=new T.InstancedMesh(new T.SphereGeometry(1,10,8),M.bub,bN);bubs.frustumCulled=false;const BB=[];for(let i=0;i<bN;i++)BB.push({x:rr(-5,5),z:rr(-3.2,3.2),ph:rr(0,1),s:rr(.08,.24),w:rr(.5,1.5)});root.add(bubs);
// rinse arch
const R=3.7,arch=new T.Group();root.add(arch);
const ag=new T.TorusGeometry(R,.09,8,SEG*2,PI);ag.rotateY(PI/2);const ar=mesh(ag,M.arch,0,.2,0);arch.add(ar);
[-1,1].forEach(s=>{arch.add(box(.6,.2,.6,M.arch,0,.1,s*R))});
const nz=[];for(let i=0;i<11;i++){const th=-1.35+i*.27,y=.2+R*Math.cos(th),z=R*Math.sin(th);arch.add(mesh(new T.SphereGeometry(.13,10,8),M.acc,0,y,z));nz.push({y:y,z:z})}
// dryer frame
const dry=new T.Group();root.add(dry);const dn=[];
[-1,1].forEach(s=>{dry.add(box(.5,.2,.5,M.steel,0,.1,s*2.95));dry.add(cylY(.12,3.8,M.steel,0,1.9,s*2.95,14));[.9,2.0,3.0].forEach(y=>{dry.add(box(.5,.34,.5,M.arch,0,y,s*2.65));dn.push({y:y,z:s*2.45});dry.add(box(.2,.1,.5,M.acc,0,y,s*2.38))})});
dry.add(box(.5,.16,6.1,M.steel,0,3.95,0));dry.add(box(.5,.34,.9,M.arch,0,3.7,0));dn.push({y:3.5,z:0,top:1});
// brushes
const brG=new T.Group();root.add(brG);const sb=[-1,1].map(s=>{const b=cylY(.4,2.5,M.brush,0,1.35,s*2.0,20);brG.add(b);return b});
const rb=cylZ(.4,3.0,M.brush,0,3.75,0,20);brG.add(rb);
// spray systems
const wsp=spray(SEG>26?520:320,0xb4ecff,.5,.95,tdot),fsp=spray(SEG>26?260:170,0xffffff,.8,.95,tdot),asp=spray(SEG>26?160:100,0xdff4ff,.26,.5,tdot);root.add(wsp.pts);root.add(fsp.pts);root.add(asp.pts);
// shine slab + sparkles + result ring
const slc=canv(128,128),slx=slc.getContext('2d'),slg=slx.createRadialGradient(64,64,2,64,64,62);slg.addColorStop(0,'rgba(255,255,255,1)');slg.addColorStop(1,'rgba(255,255,255,0)');slx.fillStyle=slg;slx.fillRect(0,0,128,128);M.slab.map=new T.CanvasTexture(slc);const slab=mesh(new T.PlaneGeometry(5.2,3.6),M.slab,0,1.9,0);slab.rotation.y=PI/2;root.add(slab);
const stT=starTex(),sprites=[[3,2.1,.6],[-.3,3.4,.3],[-3.3,2.1,-.7],[.5,1.7,1.8],[-1,1.6,-1.8],[2.2,2.1,-.8],[.3,3.4,-.5]].map(p=>{const s=new T.Sprite(new T.SpriteMaterial({map:stT,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));s.position.set(p[0],p[1],p[2]);s.scale.setScalar(.01);root.add(s);return s});
const ring=new T.Mesh(new T.TorusGeometry(5.5,.05,8,SEG*4),M.ring);ring.scale.set(1,.62,1);ring.rotation.x=-PI/2;ring.position.y=.04;root.add(ring);
root.position.y=-1.3;
const dirty=new T.Color(0x4d4130),clean=new T.Color(0x2f7fe0),emA=[],emF=[],emD=[];
const tgt=V(0,1.5,0);
function place(st,t,dt){
 // paint
 M.paint.color.copy(dirty).lerp(clean,1-st.dirt);M.paint.roughness=.22+.6*st.dirt;M.paint.metalness=.88-.6*st.dirt;M.paint.envMapIntensity=(.95-.5*st.dirt)+.5*st.shk;
 M.mud.opacity=st.dirt;mud.visible=st.dirt>.02;
 // arch
 arch.visible=st.ap>.02;arch.position.x=st.ax;arch.scale.set(1,.2+.8*st.ap,1);
 emA.length=0;emF.length=0;
 if(arch.visible){nz.forEach(n=>{const a=V(st.ax,.2+n.y*(.2+.8*st.ap),n.z),b=V(st.ax+.2,1.4,n.z*.18);b.x=st.ax;emA.push({a:a,b:b})})}
 wsp.update(dt,st.jw>.05?emA:[],st.jw*(SEG>26?520:320)*1.5,1.3);
 fsp.update(dt,st.jf>.05?emA:[],st.jf*(SEG>26?260:170)*1.5,.9);
 // foam
 for(let i=0;i<F.length;i++){const f=F[i];const g=cl01((f.x-st.fgx+.2)/1.0)*(1-cl01((st.frx-f.x+.2)/1.2));const e=g<=0?0:g*(1+.18*Math.sin(t*2+f.ph)*0)*(1+.08*Math.sin(t*1.7+f.ph));
  dummy.position.set(f.x,f.y-(f.side?(1-g)*.0:0),f.z);dummy.rotation.set(0,0,0);const s=f.s*e;dummy.scale.set(s*(f.side?.6:1),s*.8,s*(f.side?1:1));if(f.side&&Math.abs(f.z)>1)dummy.scale.set(s,s*.9,s*.55);dummy.updateMatrix();foam.setMatrixAt(i,dummy.matrix)}
 foam.instanceMatrix.needsUpdate=true;foam.visible=st.fm>.003||st.fgx<90;
 for(let i=0;i<bN;i++){const b=BB[i],k=(t*.12*b.w+b.ph)%1,s=b.s*st.fm;dummy.position.set(b.x+Math.sin(t*b.w+i)*.3,k*5.2-.1,b.z+Math.cos(t*b.w*.8+i)*.2);dummy.rotation.set(0,0,0);dummy.scale.setScalar(s*(.4+.6*Math.sin(k*PI)));dummy.updateMatrix();bubs.setMatrixAt(i,dummy.matrix)}
 bubs.instanceMatrix.needsUpdate=true;bubs.visible=st.fm>.02;
 // brushes
 brG.visible=st.bp>.02;if(brG.visible){const off=(1-st.bp)*3.4;sb.forEach((b,i)=>{b.position.set(st.bx,1.35,(i?1:-1)*(2.0+off));b.rotation.y=t*7*(i?1:-1)});rb.position.set(st.bx,3.75+off*.9,0);rb.rotation.z=t*7}
 // dryer
 dry.visible=st.dp>.02;if(dry.visible){dry.position.x=st.dx;dry.scale.set(1,1,.6+.4*st.dp)}
 emD.length=0;if(dry.visible)dn.forEach(n=>{const a=V(st.dx+.1,n.y,n.z*(.6+.4*st.dp)),b=n.top?V(st.dx-.8,1.6,0):V(st.dx-1.2,n.y*.9+.2,n.z*.2);emD.push({a:a,b:b})});
 asp.update(dt,st.dp>.1?emD:[],st.dp*(SEG>26?160:100),0);
 // shine
 slab.visible=st.shk>.01;slab.position.x=st.shx;M.slab.opacity=.55*st.shk;
 sprites.forEach((s,i)=>{const k=st.sp*(.5+.5*Math.sin(t*5+i*1.7));s.material.opacity=Math.min(1,k*1.2);s.scale.setScalar(.15+k*1.1)});
 M.ring.opacity=st.res*.85;M.line.color.setRGB(.25+.2*st.res,.78+.1*st.res,1-.2*st.res)}
return{root:root,place:place,M:M}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xdff1ff,0x04101c,.6));const dl=new T.DirectionalLight(0xffffff,1.05);dl.position.set(4,8,9);sc.add(dl);
const a=new T.PointLight(0x3fc8ff,.5*k,36);a.position.set(-8,0,6);sc.add(a);const b=new T.PointLight(0xb6f0ff,1.0*k,36);b.position.set(7,4,6);sc.add(b);return a}
const TK=2*Math.tan(35/2*PI/180);
function fitDist(asp){const Hh=6.6,Ww=11.6;return Math.max(Hh/TK,Ww/(TK*asp))*1.1}

/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.outputEncoding=T.sRGBEncoding;box.insertBefore(ren.domElement,box.firstChild);
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
const t0=performance.now();let lt=t0;
(function loop(){requestAnimationFrame(loop);if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-lt)/1000);lt=now;const t=(now-t0)/1000;
 mx+=(tx-mx)*.05;if(!drag)uy*=.97;
 const p=RM?.97:(.02+t*.042)%1;
 P.rotation.y=-.62+mx*.45+Math.sin(t*.25)*.2+uy;G.rotation.x=.12;
 E.place(stage(p),t,RM?0:dt);
 pl.intensity=.9+Math.sin(t*2)*.15;
 const dz=fitDist(aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.2;cam.lookAt(0,.9,0);
 ren.render(sc,cam)})();
}
try{hero()}catch(e){}

/* ---------- PINNED 3D ---------- */
function model(){
const sec=$('#model3d'),stage_=$('#r3stage');if(!sec||!stage_)return;
const W=()=>stage_.clientWidth,H=()=>stage_.clientHeight;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage_.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,120);cam.position.set(0,0,30);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1.1);
const E=car(isMob()?22:34);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);G.rotation.y=-.6;
let uy=0,up=0,drag=null,prog=0,aspEff=1,spin=0,last=performance.now();
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
vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage_);chs.forEach(c2=>new ResizeObserver(vo).observe(c2));setTimeout(vo,800);setTimeout(vo,2000);
let vis=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();tick()}},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
 spin+=RM?0:dt;
 if(!drag){uy*=.985;up*=.985}
 const yaw=uy+Math.sin(prog*PI*2)*.3+(RM?0:Math.sin(spin*.4)*.06);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.2+Math.sin(prog*PI)*.08+up)-P.rotation.x)*.12;
 E.place(stage(prog),spin,RM?0:dt);
 pl.intensity=.9+Math.sin(now/600)*.2;
 const dz=fitDist(aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.4;cam.lookAt(0,1.0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

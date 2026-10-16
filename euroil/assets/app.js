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

/* ---------- fuel drops in the hero (2D canvas, tap to drip, fills a little tank counter) ---------- */
(()=>{const hero=$('#hero'),gl=$('#gl'),hint=$('#bhint'),cnt=$('#bcnt');if(!hero||!gl)return;
 if(RM){if(hint)hint.style.display='none';return}
 const c=document.createElement('canvas');c.id='bub';gl.appendChild(c);const x=c.getContext('2d');let W=0,H=0,dpr=1,lit=0;
 function size(){dpr=Math.min(devicePixelRatio||1,2);W=gl.clientWidth;H=gl.clientHeight;if(!W||!H)return;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
 size();addEventListener('resize',size);new ResizeObserver(size).observe(gl);
 const D=[],P=[],S=[];let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis){lt=performance.now();loop(lt)}}).observe(hero);
 const rnd=(a,b)=>a+Math.random()*(b-a);
 function drip(px,py,r){if(D.length>90)D.shift();D.push({x:px,y:py,r:r||rnd(2.6,5.5),vy:rnd(40,90),life:0})}
 function pt(e){const r=gl.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,in:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}}
 let lastMv=0;
 hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p=pt(e),n=performance.now();if(!p.in||n-lastMv<60)return;lastMv=n;drip(p.x+rnd(-6,6),p.y+rnd(-4,4),rnd(2,4))},{passive:true});
 hero.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;const p=pt(e);if(!p.in)return;for(let k=0;k<9;k++)drip(p.x+rnd(-14,14),p.y+rnd(-10,6),rnd(3,6))});
 let lt=performance.now();
 function loop(now){if(!vis)return;requestAnimationFrame(loop);const dt=Math.min(.05,(now-lt)/1000);lt=now;if(!W||!H)return;
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
  if(Math.random()<.05)drip(rnd(0,W),-6,rnd(2,4));
  // road light streaks
  if(Math.random()<.04)S.push({x:rnd(0,W),y:H*rnd(.78,.96),l:rnd(30,90),v:rnd(120,260)*(Math.random()<.5?1:-1),t:0,a:rnd(.25,.6)});
  for(let i=S.length-1;i>=0;i--){const s=S[i];s.x+=s.v*dt;s.t+=dt;if(s.x<-120||s.x>W+120||s.t>3){S.splice(i,1);continue}const g=x.createLinearGradient(s.x,0,s.x-Math.sign(s.v)*s.l,0);g.addColorStop(0,'rgba(255,178,61,'+s.a+')');g.addColorStop(1,'rgba(255,178,61,0)');x.fillStyle=g;x.fillRect(Math.min(s.x,s.x-Math.sign(s.v)*s.l),s.y,s.l,2)}
  for(let i=D.length-1;i>=0;i--){const d=D[i];d.vy+=260*dt;d.y+=d.vy*dt;d.life+=dt;
   if(d.y>H-6){P.push({x:d.x,y:H-6,t:0});lit+=d.r*.012;if(cnt)cnt.textContent=lit.toFixed(2);D.splice(i,1);continue}
   x.beginPath();x.ellipse(d.x,d.y,d.r*.7,d.r*1.3,0,0,6.283);x.fillStyle='rgba(255,178,61,.85)';x.fill();x.beginPath();x.arc(d.x-d.r*.2,d.y-d.r*.3,d.r*.25,0,6.283);x.fillStyle='rgba(255,236,190,.9)';x.fill()}
  for(let i=P.length-1;i>=0;i--){const q=P[i];q.t+=dt*2.4;if(q.t>1){P.splice(i,1);continue}x.beginPath();x.ellipse(q.x,q.y,4+q.t*20,1.5+q.t*4,0,0,6.283);x.strokeStyle='rgba(255,200,110,'+(.7*(1-q.t))+')';x.lineWidth=1.5;x.stroke()}}
 loop(performance.now())})();

/* ---------- fuel picker ---------- */
(()=>{const chips=$('#pkchips'),svg=$('#pkc');if(!chips||!svg)return;
 const S=[{k:'ben',c:'Benzină',z:'Carburant 01',t:'Benzină',p:'Pentru motoare pe benzină. Tipul potrivit îl găsești în cartea tehnică sau pe capacul rezervorului. Ce sortimente sunt disponibile la stația din Cluj afli la fața locului.',w:'Nu alimenta benzină într-un motor diesel.'},
 {k:'mot',c:'Motorină',z:'Carburant 02',t:'Motorină',p:'Pentru motoare diesel. Rețeaua EUROIL prezintă pe euroil.ro o motorină Super EUROIL, cu aditivi. Dacă ea se află și la stația din Cluj, confirmi la fața locului.',w:'Nu alimenta motorină într-un motor pe benzină.'},
 {k:'gpl',c:'GPL',z:'Carburant 03',t:'GPL',p:'Listările publice indică GPL la această stație. Mașinile cu instalație GPL au un racord separat de rezervorul obișnuit. Confirmă la stație disponibilitatea.',w:'La GPL, întreabă personalul cum se face alimentarea.'},
 {k:'shop',c:'Magazin',q:'la stație',z:'Facilități',t:'Magazin',p:'Listările publice menționează un magazin la stație. Ce găsești în el și până la ce oră afli la fața locului.',w:'Nu publicăm prețuri sau sortimente: nu avem o sursă verificată.'}];
 let cur=0;const vz=$('#pkz'),vt=$('#pkt'),vp=$('#pkp'),sm2=$('#pks');
 S.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=s.c+(s.q?'<span class="q2">('+s.q+')</span>':'');b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{cur=i;draw()});chips.appendChild(b)});
 function draw(){[...chips.children].forEach((b,i)=>{b.classList.toggle('on',i===cur);b.setAttribute('aria-pressed',i===cur)});S.forEach(s=>svg.classList.toggle('s-'+s.k,S[cur]===s));
  const s=S[cur];vz.textContent=s.z;vt.textContent=s.t;vp.textContent=s.p;sm2.textContent=s.w}
 draw()})();

/* ---------- tank calculator ---------- */
(()=>{const cap=$('#qcap'),lvl=$('#qlvl'),con=$('#qcon');if(!cap||!lvl||!con)return;
 const oc=$('#ocap'),ol=$('#olvl'),ocn=$('#ocon'),r1=$('#r1'),r2=$('#r2'),r3=$('#r3'),nd=$('#needle'),fl=$('#gfill'),st=$('#gst');let cur=0,tg=0,raf=0;
 function calc(){const C=+cap.value,L=+lvl.value,K=+con.value;oc.textContent=C;ol.textContent=L;ocn.textContent=K.toFixed(1).replace('.',',');
  const have=C*L/100,need=C-have;r1.textContent=need.toFixed(0)+' L';r2.textContent=Math.round(have/K*100)+' km';r3.textContent=Math.round(C/K*100)+' km';
  tg=L/100;st.textContent=L<=15?'Rezerva: e timpul să alimentezi':L>=85?'Rezervor aproape plin':'Nivel orientativ';if(!raf)raf=requestAnimationFrame(anim)}
 function anim(){raf=0;cur+=(tg-cur)*(RM?1:.14);if(Math.abs(tg-cur)>.002)raf=requestAnimationFrame(anim);else cur=tg;
  nd.setAttribute('transform','rotate('+(-90+cur*180)+' 150 150)');fl.setAttribute('stroke-dashoffset',(1-cur)*377)}
 [cap,lvl,con].forEach(i=>i.addEventListener('input',calc));calc()})();

/* ---------- checklist ---------- */
(()=>{const cl=$('#cl');if(!cl)return;const bs=[...cl.querySelectorAll('button')],fg=$('#cfg'),tx=$('#ctx'),ct=$('#ct'),cp=$('#cp'),rs=$('#cres'),N=bs.length;
 function upd(){const n=bs.filter(b=>b.classList.contains('on')).length;tx.textContent=n+'/'+N;fg.style.strokeDashoffset=327*(1-n/N);rs.classList.toggle('ok',n===N);
  ct.textContent=n===N?'Gata de alimentat':n?'Mai ai '+(N-n)+(N-n===1?' punct':' puncte'):'Bifează ce ai verificat';cp.textContent=n===N?'Ai bifat tot. Drum bun!':'Atingi fiecare punct pe măsură ce îl verifici.'}
 bs.forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('on');upd()}));upd()})();

/* ---------- scroll: progress, nav, chapters ---------- */
const prog=$('#prog'),cap=$('#cap'),ch=$$('.chap'),dots=$$('.dots i'),chl=$('#chline');
const secs=['info','carburanti','calculator','model3d','cap','contact'].map(i=>$('#'+i)),nl=$$('.navl a');
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
  s.add(new T.Mesh(new T.SphereGeometry(20,24,16),new T.MeshBasicMaterial({color:0x143826,side:T.BackSide})));
  const lamp=(w,h,x,y,z,k,col)=>{const m=new T.MeshBasicMaterial({color:col||0xffffff,side:T.DoubleSide});m.color.multiplyScalar(k);const p=new T.Mesh(new T.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.lookAt(0,0,0);s.add(p)};
  lamp(16,4,0,12,4,5);lamp(3,12,-12,2,6,4,0xd8fff0);lamp(3,12,12,0,5,3,0xffe6c0);lamp(10,3,0,-6,12,1.6);lamp(6,6,0,2,-14,2.5);
  const t=pm.fromScene(s,.02).texture;pm.dispose();return t}catch(e){return null}}
/* ---------- the model: a fuel pump on a forecourt, with the tank below ground and a car at the pump ----------
   Illustrative, not the real equipment of the station. Units are arbitrary. Car length = x, up = y, pump faces +z. */
function dotTex(){const c=canv(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}
function dispTex(){const c=canv(256,112),x=c.getContext('2d'),t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;let lastK='';
 function draw(v,lab){const k=v.toFixed(2)+lab;if(k===lastK)return;lastK=k;x.fillStyle='#04100a';x.fillRect(0,0,256,112);x.strokeStyle='#1b3a2b';x.lineWidth=4;x.strokeRect(2,2,252,108);
  x.fillStyle='#34e08f';x.font='600 15px system-ui,sans-serif';x.textAlign='left';x.fillText(lab,14,26);
  x.fillStyle='#ffb23d';x.font='700 58px "Courier New",monospace';x.textAlign='right';x.fillText(v.toFixed(2),216,88);x.font='600 18px system-ui,sans-serif';x.fillStyle='#34e08f';x.textAlign='left';x.fillText('L',224,88);t.needsUpdate=true}
 draw(0,'LITRI · EXEMPLU');return{tex:t,draw:draw}}
function wordTex(w,h,txt,bg,fg,fs,ls){const c=canv(w,h),x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font='800 '+fs+'px "Avenir Next","Segoe UI",system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
 if('letterSpacing' in x)x.letterSpacing=ls+'px';x.fillText(txt,w/2+ls/2,h/2+2);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function mats(){const S=o=>new T.MeshStandardMaterial(o);return{
 shell:S({color:0xe8efe9,metalness:.35,roughness:.42,envMapIntensity:.9,transparent:true,opacity:1}),
 body:S({color:0xe8efe9,metalness:.35,roughness:.42,envMapIntensity:.9}),
 green:S({color:0x16b374,metalness:.5,roughness:.35,envMapIntensity:.9,emissive:0x053b24,emissiveIntensity:.7}),
 dark:S({color:0x16221b,metalness:.5,roughness:.55,envMapIntensity:.45}),
 steel:S({color:0xb9c6bf,metalness:1,roughness:.3}),
 pipe:S({color:0x9aa9a1,metalness:.9,roughness:.35,transparent:true,opacity:.45,depthWrite:false}),
 hose:S({color:0x0c0f0d,roughness:.6,metalness:.1}),
 glass:S({color:0x07130d,metalness:.8,roughness:.2,envMapIntensity:.8}),
 carpaint:S({color:0xcfd8d4,metalness:.85,roughness:.28,envMapIntensity:1}),
 tyre:S({color:0x0b0d0c,roughness:.9,metalness:.05}),rim:S({color:0xd5e3dc,metalness:1,roughness:.2}),
 ground:S({color:0x0a130e,metalness:0,roughness:1,envMapIntensity:.15,transparent:true,opacity:1}),
 island:S({color:0x16231b,metalness:0,roughness:.95,envMapIntensity:.25,transparent:true,opacity:1}),
 tank:S({color:0x8fb0a0,metalness:.9,roughness:.3,transparent:true,opacity:.28,envMapIntensity:1.1,depthWrite:false}),
 fuel:S({color:0xffb23d,roughness:.25,metalness:.1,emissive:0xb06a10,emissiveIntensity:.8,transparent:true,opacity:.86}),
 canopy:S({color:0xe4ece6,metalness:.6,roughness:.35,envMapIntensity:.9}),
 lamp:new T.MeshBasicMaterial({color:0xdffff0}),
 line:new T.MeshBasicMaterial({color:0x34e08f}),
 tail:new T.MeshBasicMaterial({color:0x7a2018}),headl:new T.MeshBasicMaterial({color:0x8a9a92}),
 ring:new T.MeshBasicMaterial({color:0x34e08f,transparent:true,opacity:0})}}
function flowSys(N,col,size,tex){const g=new T.BufferGeometry(),pos=new Float32Array(N*3),ph=new Float32Array(N);for(let i=0;i<N;i++){pos[i*3+1]=-100;ph[i]=Math.random()}g.setAttribute('position',new T.BufferAttribute(pos,3));
 const m=new T.PointsMaterial({color:col,size:size,map:tex,transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,sizeAttenuation:true,opacity:.95});const pts=new T.Points(g,m);pts.frustumCulled=false;const tmp=new T.Vector3();
 function update(dt,f,amt,speed){const n=Math.floor(N*Math.max(0,Math.min(1,amt)));for(let i=0;i<N;i++){if(i>=n){pos[i*3+1]=-100;continue}ph[i]=(ph[i]+dt*speed)%1;f(ph[i],tmp);pos[i*3]=tmp.x;pos[i*3+1]=tmp.y;pos[i*3+2]=tmp.z}g.attributes.position.needsUpdate=true}
 return{pts:pts,update:update}}
function stage(p){
 const ex=win(p,.2,.33,.46,.57),xr=win(p,.52,.6,.78,.85);
 return{carx:9*(1-sm(p/.16))-14*sm((p-.955)/.045),ex:ex,xr:xr,
  gro:1-.9*win(p,.5,.6,.76,.84),fp:win(p,.55,.62,.8,.87),
  na:sm((p-.8)/.06)-sm((p-.945)/.03),ff:win(p,.865,.885,.935,.95),
  lit:p<.87?0:42*sm((p-.87)/.07),res:win(p,.94,.96,.985,1.0),
  tg:win(p,.5,.6,.78,.86)}}
function station(SEG){
const M=mats(),root=new T.Group(),V=(x,y,z)=>new T.Vector3(x,y,z),tdot=dotTex(),dsp=dispTex();
const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
const box=(w,h,d,m,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
const cylZ=(r,l,m,x,y,z,s)=>{const g=new T.CylinderGeometry(r,r,l,s||SEG);g.rotateX(PI/2);return mesh(g,m,x,y,z)};
const cylY=(r,l,m,x,y,z,s)=>mesh(new T.CylinderGeometry(r,r,l,s||SEG),m,x,y,z);
const PX=-2.3,IY=.22,PS=.8,pl=(x,y,z)=>V(PX+PS*x,IY+PS*y,PS*z);
// ground + island (fade out in the "underground" chapter)
const ground=box(15,.3,11,M.ground,0,-.15,0);root.add(ground);
const isl=box(4.2,.22,2.3,M.island,PX+.2,.11,0);root.add(isl);
[[0,1.15,4.2,.05],[0,-1.15,4.2,.05]].forEach(a=>root.add(box(a[2],.03,a[3],M.line,PX+.2+a[0],.235,a[1])));
// lane marking (soft glow disc on ground)
const pc=canv(256,256),px=pc.getContext('2d'),pg2=px.createRadialGradient(128,128,10,128,128,127);pg2.addColorStop(0,'rgba(20,70,48,.9)');pg2.addColorStop(.62,'rgba(12,44,30,.8)');pg2.addColorStop(1,'rgba(5,15,11,0)');px.fillStyle=pg2;px.fillRect(0,0,256,256);
const lane=mesh(new T.PlaneGeometry(16,12),new T.MeshBasicMaterial({map:new T.CanvasTexture(pc),transparent:true,depthWrite:false}),0,.006,-.5);lane.rotation.x=-PI/2;root.add(lane);
const sc2=canv(128,128),sx=sc2.getContext('2d'),gr=sx.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=gr;sx.fillRect(0,0,128,128);
// underground tank, pipe, fuel
const tankG=new T.Group();root.add(tankG);tankG.position.set(-1.2,-1.75,0);
const capG=new T.CapsuleGeometry(1.0,4.6,6,SEG);capG.rotateZ(PI/2);tankG.add(mesh(capG,M.tank));
const fuelG=new T.CapsuleGeometry(.84,4.5,6,SEG);fuelG.rotateZ(PI/2);const fuel=mesh(fuelG,M.fuel);fuel.scale.set(1,.82,1);fuel.position.y=-.1;tankG.add(fuel);
tankG.add(cylY(.34,.5,M.steel,-1.1,1.05,0));
[-1.6,1.6].forEach(x=>{const r=mesh(new T.TorusGeometry(1.02,.045,8,SEG*2),M.steel,x,0,0);r.rotation.y=PI/2;tankG.add(r)});
const pipeTop=1.55,pipe=cylY(.1,(pipeTop-(-1.0))+.1,M.pipe,PX,(pipeTop+(-1.0))/2,0);root.add(pipe);
// pump
const pump=new T.Group();pump.position.set(PX,IY,0);pump.scale.setScalar(PS);root.add(pump);
pump.add(box(1.8,.16,1.2,M.dark,0,.08,0));
const part=(base,d)=>{const g=new T.Group();g.position.copy(base);pump.add(g);return{g:g,b:base.clone(),d:d}};
const back=part(V(0,1.14,-.47),V(0,0,-1.8)),sL=part(V(-.74,1.14,0),V(-2.0,0,0)),sR=part(V(.74,1.14,0),V(2.0,0,.4)),front=part(V(0,1.14,.47),V(0,0,2.2)),head=part(V(0,0,0),V(0,1.9,0));
back.g.add(box(1.52,1.96,.06,M.shell,0,0,0));sL.g.add(box(.06,1.96,.98,M.shell,0,0,0));sR.g.add(box(.06,1.96,.98,M.shell,0,0,0));
front.g.add(box(1.52,1.96,.06,M.shell,0,0,0));front.g.add(box(1.3,.16,.02,M.green,0,-.55,.04));
front.g.add(box(.7,.62,.03,M.dark,0,.45,.04));[[-.2,0xffd166],[0,0xe8863a],[.2,0x6fd3ff]].forEach(a=>{const b=cylZ(.07,.04,new T.MeshBasicMaterial({color:a[1]}),a[0],.45,.07,16);front.g.add(b)});
// holster + hose anchor on the right panel
sR.g.add(box(.3,.36,.3,M.dark,.2,.38,.12));
// head: display, wordmark text, cap
head.g.add(box(1.64,1.02,1.1,M.body,0,2.7,0));head.g.add(box(1.78,.1,1.24,M.green,0,3.26,0));
const dp=new T.Mesh(new T.PlaneGeometry(1.2,.52),new T.MeshBasicMaterial({map:dsp.tex}));dp.position.set(0,2.84,.555);head.g.add(dp);
const wp=new T.Mesh(new T.PlaneGeometry(1.2,.2),new T.MeshBasicMaterial({map:wordTex(512,86,'EUROIL','#0e1f16','#eef8f2',50,14)}));wp.position.set(0,2.4,.555);head.g.add(wp);
// internals
const meter=box(.7,.55,.5,M.steel,0,1.55,0);pump.add(meter);const motor=cylY(.26,.8,M.dark,-.4,.75,0);pump.add(motor);const filt=cylY(.17,.62,M.green,.4,.78,0);pump.add(filt);
const pin=cylY(.1,1.3,M.pipe,0,.8,0);pump.add(pin);
// canopy (own group, lifts in explode)
const canopy=new T.Group();root.add(canopy);
canopy.add(box(9.4,.32,5.0,M.canopy,-.2,4.9,0));canopy.add(box(9.2,.05,4.8,M.lamp,-.2,4.72,0));
const fas=new T.Mesh(new T.PlaneGeometry(9.4,.4),new T.MeshBasicMaterial({map:wordTex(1024,44,'EUROIL','#16b374','#04140c',30,34)}));fas.position.set(-.2,4.9,2.52);canopy.add(fas);
const edgeG=box(9.4,.05,.05,M.line,-.2,4.72,2.5);canopy.add(edgeG);
[-4.4,3.9].forEach(x=>canopy.add(cylY(.14,4.7,M.canopy,x,2.35,2.2)));
// car
const car=new T.Group();root.add(car);const CS=.6;const carIn=new T.Group();carIn.scale.setScalar(CS);car.add(carIn);car.position.set(1.6,0,-3.5);
{const XF=2.8,XR=-2.5,WY=.82,WZ=1.5;const bodyG=new T.Group();carIn.add(bodyG);
 const sh=new T.Shape();sh.moveTo(-4.15,.62);sh.lineTo(-4.25,1.0);sh.quadraticCurveTo(-4.3,1.55,-4.05,1.75);sh.lineTo(-2.5,1.92);sh.lineTo(1.4,1.95);sh.lineTo(3.4,1.72);sh.quadraticCurveTo(4.2,1.64,4.3,1.2);sh.lineTo(4.3,.95);sh.quadraticCurveTo(4.28,.62,3.95,.62);
 const A=.206;sh.lineTo(XF+.96,.62);sh.absarc(XF,WY,.98,-A,PI+A,false);sh.lineTo(XR+.96,.62);sh.absarc(XR,WY,.98,-A,PI+A,false);sh.lineTo(-4.15,.62);
 const bg=new T.ExtrudeGeometry(sh,{depth:2.9,bevelEnabled:true,bevelThickness:.2,bevelSize:.18,bevelSegments:Math.max(2,SEG>26?4:3),curveSegments:Math.round(SEG/2)});bg.translate(0,0,-1.45);bodyG.add(mesh(bg,M.carpaint));
 const cs=new T.Shape();cs.moveTo(-2.55,1.9);cs.bezierCurveTo(-2.2,2.35,-1.9,2.95,-1.4,3.08);cs.lineTo(.55,3.08);cs.bezierCurveTo(1.0,3.0,1.5,2.4,2.0,1.9);cs.lineTo(-2.55,1.9);
 const cg=new T.ExtrudeGeometry(cs,{depth:2.3,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:3,curveSegments:Math.round(SEG/2)});cg.translate(0,0,-1.15);bodyG.add(mesh(cg,M.glass));
 bodyG.add(box(2.1,.07,2.35,M.carpaint,-.4,3.2,0));
 [-1,1].forEach(s=>{bodyG.add(box(.38,.2,.1,M.headl,4.33,1.34,s*1.05));bodyG.add(box(.1,.16,.44,M.tail,-4.38,1.42,s*1.05))});
 [[XF,1],[XF,-1],[XR,1],[XR,-1]].forEach(([x,s])=>{const piv=new T.Group(),flip=new T.Group();piv.position.set(x,WY,s*WZ);flip.rotation.y=s>0?0:PI;piv.add(flip);
  const tg=new T.Group(),tyre=mesh(new T.TorusGeometry(.62,.2,14,SEG*2),M.tyre);tyre.scale.z=1.3;tg.add(tyre);tg.add(cylZ(.5,.44,M.rim,0,0,.02,SEG));tg.add(cylZ(.38,.06,M.dark,0,0,.26,SEG));
  for(let k=0;k<5;k++){const a=k/5*PI*2,sp=box(.1,.34,.05,M.rim,Math.cos(a)*.2,Math.sin(a)*.2,.27);sp.rotation.z=a-PI/2;tg.add(sp)}flip.add(tg);carIn.add(piv)});
 // filler flap on the pump side (-z)
 const fl=box(.55,.4,.06,M.dark,-3.6,1.35,1.72);carIn.add(fl);carIn.add(cylZ(.1,.12,M.steel,-3.6,1.35,1.8,12));}
// nozzle
const noz=new T.Group();root.add(noz);noz.add(box(.2,.55,.18,M.dark,0,0,0));noz.add(box(.26,.26,.42,M.green,0,.3,.1));noz.add(cylZ(.045,.8,M.steel,0,.33,.7,12));noz.add(box(.08,.2,.04,M.steel,0,.1,.18));
// hose (rebuilt when ends move)
let hose=null,hkey='';const hoseM=M.hose;
function hoseBuild(S,E,pre){const k=[S.x,S.y,S.z,E.x,E.y,E.z,pre].map(v=>v.toFixed(2)).join();if(k===hkey)return;hkey=k;const mid=S.clone().add(E).multiplyScalar(.5);mid.y=Math.max(.6,Math.min(S.y,E.y)-.3);mid.z+=.25;
 const cv=new T.CatmullRomCurve3([S,S.clone().add(V(.4,-.25,.08)),mid,E.clone().add(V(0,.3*(1-pre)+.2*pre,.5*pre)),E]);const g=new T.TubeGeometry(cv,SEG>26?36:24,.055,6,false);
 if(hose){hose.geometry.dispose();hose.geometry=g}else{hose=new T.Mesh(g,hoseM);root.add(hose)}hose.userData.cv=cv}
// flow systems
const fp=flowSys(SEG>26?160:100,0xffb23d,.42,tdot),fh=flowSys(SEG>26?110:70,0xffb23d,.3,tdot);root.add(fp.pts);root.add(fh.pts);
// result ring
const ring=new T.Mesh(new T.TorusGeometry(6.2,.05,8,SEG*4),M.ring);ring.scale.set(1,.6,1);ring.rotation.x=-PI/2;ring.position.set(0,.05,-.5);root.add(ring);
root.position.y=-.4;
let fpA=V(),fpB=V(),hv=null;
const fpf=(s,o)=>{o.set(fpA.x,fpA.y+(fpB.y-fpA.y)*s,fpA.z)};
const hf=(s,o)=>{if(hv)hv.getPointAt(s,o);else o.set(0,-100,0)};
function place(st,t,dt){
 const ex=st.ex;
 [back,sL,sR,front,head].forEach(o=>o.g.position.set(o.b.x+o.d.x*ex,o.b.y+o.d.y*ex,o.b.z+o.d.z*ex));
 M.shell.opacity=1-.8*st.xr;M.shell.depthWrite=st.xr<.1;
 canopy.position.y=2.6*ex;
 M.ground.opacity=st.gro;M.island.opacity=Math.max(.12,st.gro);
 M.tank.opacity=.28+.15*st.tg;
 // car
 car.position.x=1.6+st.carx;carIn.rotation.y=0;
 // nozzle + hose
 const hp=pl(.74+.2,1.14+.38,.12).add(V(PS*sR.d.x*ex,PS*sR.d.y*ex,PS*sR.d.z*ex)).add(V(.16,.12,0)),
  fl=V(car.position.x-3.6*CS,1.35*CS,car.position.z+1.72*CS+.08),
  at=V(fl.x,fl.y-.33,fl.z+1.1);
 const na=st.na,pos=hp.clone().lerp(at,sm(na));pos.y+=Math.sin(sm(na)*PI)*.8;noz.position.copy(pos);noz.rotation.set(PI/2*(1-sm(na)),PI*sm(na),0);
 const S=pl(.78,1.14+.55,.1).add(V(PS*sR.d.x*ex,PS*sR.d.y*ex,PS*sR.d.z*ex)),E=pos.clone().add(V(0,-.3,-.02).applyEuler(noz.rotation));
 hoseBuild(S,E,sm(na));hv=hose.userData.cv;
 // flows
 fpA.set(PX,-1.0,0);fpB.set(PX,1.7,0);
 fp.update(dt,fpf,st.fp,.7);fh.update(dt,hf,st.ff,1.1);
 const lit=st.lit;dsp.draw(lit,'LITRI · EXEMPLU');
 M.ring.opacity=st.res*.85;
}
return{root:root,place:place,M:M}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xe0fff0,0x03100a,.65));const dl=new T.DirectionalLight(0xffffff,1.05);dl.position.set(4,8,9);sc.add(dl);
const a=new T.PointLight(0x34e08f,.55*k,40);a.position.set(-8,2,6);sc.add(a);const b=new T.PointLight(0xffd9a0,.9*k,40);b.position.set(7,5,6);sc.add(b);return a}
const TK=2*Math.tan(35/2*PI/180);
function fitDist(asp){const Hh=10.4,Ww=isMob()?10.6:12.4;return Math.max(Hh/TK,Ww/(TK*asp))*1.06}
/* ---------- HERO 3D ---------- */
function hero(){
const box=$('#gl');if(!box)return;
let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.outputEncoding=T.sRGBEncoding;box.insertBefore(ren.domElement,box.firstChild);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,120);cam.position.set(0,0,30);
const en=envMap(ren);if(en)sc.environment=en;
const pl=lights(sc,1);
const E=station(isMob()?22:36);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);
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
 const p=RM?.88:(.02+t*.038)%1;
 P.rotation.y=-.5+mx*.45+Math.sin(t*.25)*.16+uy;G.rotation.x=.1;
 E.place(stage(p),t,RM?0:dt);
 pl.intensity=.9+Math.sin(t*2)*.15;
 const dz=fitDist(aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.6;cam.lookAt(0,1.6,0);
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
const E=station(isMob()?22:34);const P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);G.rotation.y=-.5;
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
 const yaw=uy+Math.sin(prog*PI*2)*.25+(RM?0:Math.sin(spin*.4)*.05);
 P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((.12+Math.sin(prog*PI)*.06+up)-P.rotation.x)*.12;
 E.place(stage(prog),spin,RM?0:dt);
 pl.intensity=.9+Math.sin(now/600)*.2;
 const dz=fitDist(aspEff);cam.position.z+=(dz-cam.position.z)*.1;cam.position.y=2.8;cam.lookAt(0,1.5,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMob=()=>innerWidth<900;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- reveal ---------- */
$$('.card,.pc').forEach((c,i)=>{c.style.transitionDelay=(i%4)*.09+'s'});
const revEls=$$('.card,.pc,.rv');
function countUp(el){const to=+el.dataset.to,from=to-95,st=performance.now();(function f(n){const k=clamp((n-st)/1400,0,1);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(st)}
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');if(!RM)e.target.querySelectorAll&&e.target.querySelectorAll('.cnt').forEach(countUp);io.unobserve(e.target)}}),{threshold:.15}):null;
revEls.forEach(el=>io?io.observe(el):el.classList.add('on'));
function showNow(){revEls.forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight*1.05&&r.bottom>0)e.classList.add('on')})}
addEventListener('load',showNow);setTimeout(showNow,1500);

/* ---------- text split ---------- */
$$('h2, .chap h3').forEach(h=>{if(h.dataset.split)return;h.dataset.split=1;let i=0;
 const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const o=document.createElement('span');o.className='sw';const s=document.createElement('span');s.textContent=w;s.style.transitionDelay=(i++*0.07)+'s';o.appendChild(s);f.appendChild(o)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(h);h.classList.add('splt')});
const sio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sin');sio.unobserve(e.target)}}),{threshold:.2}):null;
$$('.splt').forEach(h=>sio?sio.observe(h):h.classList.add('sin'));
setTimeout(()=>$$('.splt').forEach(h=>{const r=h.getBoundingClientRect();if(r.top<innerHeight)h.classList.add('sin')}),2500);

/* ---------- micro ---------- */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height)*2;s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});

/* ---------- orar: evidențiază ziua de azi (ora României) ---------- */
(function(){try{const wd=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Bucharest',weekday:'short'}).format(new Date()),m={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6},d=m[wd];$$('#hours [data-d="'+d+'"]').forEach(x=>x.classList.add('now'))}catch(e){}})();

/* ---------- scroll: progres, capitole ---------- */
const prog=$('#prog'),cap=$('#cap'),ch=$$('.chap'),dots=$$('.dots i'),chl=$('#chline');
let lastC=-1;
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;
 if(prog)prog.style.transform=`scaleX(${H>0?y/H:0})`;
 document.body.classList.toggle('past',y>innerHeight*.7);
 if(RM)return;
 if(cap){const r=cap.getBoundingClientRect(),den=r.height-innerHeight,pp=den>0?Math.min(.999,Math.max(0,-r.top/den)):0,idx=Math.floor(pp*ch.length);
  if(chl)chl.style.width=pp*100+'%';
  if(idx!==lastC){lastC=idx;ch.forEach((c,i)=>c.classList.toggle('on',i===idx));dots.forEach((d,i)=>d.classList.toggle('on',i===idx))}}}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();

/* ================= CULOARE: stare, paletă, interfață ================= */
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
const hex2rgb=h=>{h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s*100,l*100]}
function hsl2rgb(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
const lum=(r,g,b)=>(.2126*r+.7152*g+.0722*b)/255;
const HN=[[0,'Roșu'],[22,'Portocaliu'],[45,'Galben'],[80,'Verde crud'],[140,'Verde'],[175,'Turcoaz'],[205,'Azuriu'],[225,'Albastru'],[270,'Violet'],[320,'Roz'],[360,'Roșu']];
function nameFor(h,s,l){if(l>94)return'Alb';if(l<7)return'Negru';
 if(s<10)return l>78?'Gri deschis':l>55?'Argintiu':l>32?'Gri':'Gri antracit';
 if(h>=8&&h<=50&&l<42)return l<22?'Maro închis':'Maro';
 let n='Roșu',b=999;HN.forEach(p=>{const d=Math.min(Math.abs(h-p[0]),360-Math.abs(h-p[0]));if(d<b){b=d;n=p[1]}});
 return n+' '+(l>76?'deschis':l>58?'viu':l>38?'intens':'închis')}
function uiAccent(h,s,l){let r,g,b;if(s<14||l<10||l>94){const v=l>60?232:204;r=v;g=v-4;b=v+14}else{[r,g,b]=hsl2rgb(h,Math.max(s,72),clamp(l,54,68))}
 return{hex:rgb2hex(r,g,b),rgb:[Math.round(r),Math.round(g),Math.round(b)],on:lum(r,g,b)>.52?'#0a0914':'#ffffff'}}
const FINN={gloss:'Lucios',metal:'Metalizat',pearl:'Perlat',matte:'Mat'};
const S={hex:'#c1121f',name:'Roșu',fin:'metal'};
let IM=null;

const CAR=[['Alb','#f2f2ef'],['Negru','#0e0e11'],['Argintiu','#c3c7cc'],['Gri metalizat','#6c7178'],['Roșu','#c1121f'],['Bordo','#6a0f22'],['Albastru','#1e50b5'],['Bleumarin','#14233f'],['Verde','#1f6b45'],['Galben','#f3c40f'],['Portocaliu','#ef7413'],['Șampanie','#c8b596']];
function wallColors(){const o=[['Alb','#ffffff'],['Alb cald','#f7f1e3'],['Crem','#efe3c8'],['Bej','#d9c3a0'],['Gri deschis','#c9ccd4'],['Gri','#8b8f9a'],['Gri antracit','#3b3e48'],['Negru','#0e0e11']];
 [[0,'Roșu'],[22,'Portocaliu'],[45,'Galben'],[80,'Verde crud'],[140,'Verde'],[175,'Turcoaz'],[205,'Azuriu'],[225,'Albastru'],[270,'Violet'],[320,'Roz']].forEach(p=>{
  [[62,80,'deschis'],[88,56,'viu'],[78,42,'intens'],[66,26,'închis']].forEach(t=>{const c=hsl2rgb(p[0],t[0],t[1]);o.push([p[1]+' '+t[2],rgb2hex(c[0],c[1],c[2])])})});return o}

function mkSw(cls,name,hex,sel){const b=document.createElement('button');b.type='button';b.className=cls;b.dataset.hex=hex;b.dataset.name=name;b.setAttribute('aria-label',name+' '+hex.toUpperCase());b.title=name;b.style.background=hex;b.style.setProperty('--c',hex);
 const [r,g,bb]=hex2rgb(hex);b.style.setProperty('--ck',lum(r,g,bb)>.55?'#0a0914':'#fff');if(cls==='ws'){const i=document.createElement('i');b.appendChild(i)}return b}
const heroSw=$('#heroSw'),wallEl=$('#wall');
if(heroSw)CAR.forEach(c=>heroSw.appendChild(mkSw('hs',c[0],c[1])));
if(wallEl)wallColors().forEach(c=>wallEl.appendChild(mkSw('ws',c[0],c[1])));
function pick(e){const b=e.target.closest('.hs,.ws');if(!b)return;const r=b.getBoundingClientRect();setColor(b.dataset.hex,b.dataset.name,{x:r.left+r.width/2,y:r.top+r.height/2});if(b.classList.contains('ws')&&!RM){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}}
if(heroSw)heroSw.addEventListener('click',pick);if(wallEl){wallEl.addEventListener('click',pick);
 wallEl.addEventListener('pointermove',e=>{const b=e.target.closest('.ws');if(!b)return;const r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');b.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%')})}

const sH=$('#sH'),sS=$('#sS'),sL=$('#sL');
function sliderTracks(h,s,l){if(sS)sS.style.setProperty('--sg',`linear-gradient(90deg,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))`);if(sL)sL.style.setProperty('--sg',`linear-gradient(90deg,#000,hsl(${h},${s}%,50%),#fff)`)}
function onSlide(){const c=hsl2rgb(+sH.value,+sS.value,+sL.value);setColor(rgb2hex(c[0],c[1],c[2]),null,{src:'slider'})}
[sH,sS,sL].forEach(x=>x&&x.addEventListener('input',onSlide));

function ripple(x,y){if(RM||x===undefined)return;const r=document.createElement('i');r.className='pring';r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),950);
 const pv=$('#pvbox');if(pv){const b=pv.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight){const f=document.createElement('i');f.className='pfill';f.style.left=b.width*.5+'px';f.style.top=b.height*.55+'px';pv.appendChild(f);setTimeout(()=>f.remove(),900)}}}
function setColor(hex,name,o){o=o||{};hex=hex.toLowerCase();const[r,g,b]=hex2rgb(hex),hsl=rgb2hsl(r,g,b),prev=S.hex;S.hex=hex;S.name=name||nameFor(hsl[0],hsl[1],hsl[2]);
 const u=uiAccent(hsl[0],hsl[1],hsl[2]),st=document.documentElement.style;
 st.setProperty('--paintprev',prev);st.setProperty('--paint',hex);st.setProperty('--ac',u.hex);st.setProperty('--acr',u.rgb.join(','));st.setProperty('--acx',u.on);
 const a2=hsl2rgb(hsl[0]+38,80,64);st.setProperty('--ac2',rgb2hex(a2[0],a2[1],a2[2]));
 $$('.rd-name').forEach(x=>x.textContent=S.name);$$('.rd-hex').forEach(x=>x.textContent=hex.toUpperCase());
 $$('.hs,.ws').forEach(x=>x.classList.toggle('sel',x.dataset.hex===hex));
 if(o.src!=='slider'&&sH){sH.value=Math.round(hsl[0])%360;sS.value=Math.round(hsl[1]);sL.value=Math.round(hsl[2])}
 sliderTracks(Math.round(hsl[0]),Math.round(hsl[1]),Math.round(hsl[2]));
 if(IM)IM.Paint.set(hex,u.hex);
 const pv=$('#pvbox');if(pv&&!RM){pv.classList.remove('rolling');void pv.offsetWidth;pv.classList.add('rolling')}
 ripple(o.x,o.y);
 window.dispatchEvent(new CustomEvent('paintchange'))}
function setFin(k){S.fin=k;document.body.dataset.fin=k;$$('[data-fin]').forEach(x=>x.classList.toggle('on',x.dataset.fin===k));$$('.rd-fin').forEach(x=>x.textContent=FINN[k]);if(IM)IM.Paint.setFinish(k);window.dispatchEvent(new CustomEvent('paintchange'))}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-fin]');if(b){const r=b.getBoundingClientRect();setFin(b.dataset.fin);ripple(r.left+r.width/2,r.top+r.height/2)}
 const t=e.target.closest('button[data-tab]');if(t){$$('[data-tab]').forEach(x=>x.classList.toggle('on',x===t));$$('.scene').forEach(s=>s.classList.toggle('on',s.dataset.scene===t.dataset.tab))}});
setFin('metal');setColor('#c1121f','Roșu',{});

/* ================= 3D ================= */
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();
if(!GL||!window.THREE||!window.IMBuild){const s=$('#model3d');if(s)s.classList.add('fallback');const g=$('#gl');if(g)g.classList.add('nogl');return}
const T=THREE,PI=Math.PI;IM=IMBuild(T);IM.Paint.set(S.hex,'#ff5a64');IM.Paint.setFinish(S.fin);IM.Paint.snap();
{const u=getComputedStyle(document.documentElement).getPropertyValue('--ac').trim();if(u)IM.Paint.ui.set(u)}
const sm=IM.sm;
function makeEnv(ren){try{const pm=new T.PMREMGenerator(ren),s=new T.Scene(),R=40,g=new T.SphereGeometry(R,24,16),pos=g.attributes.position,col=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const t=(pos.getY(i)/R+1)/2;const top=[.62,.68,.85],hz=[.30,.30,.42],bt=[.05,.05,.08];const a=t>.5?top:bt,k=t>.5?(t-.5)*2:1-t*2,m=t>.5?hz:hz;
  for(let c=0;c<3;c++)col[i*3+c]=m[c]+(a[c]-m[c])*Math.pow(k,1.2)}
 g.setAttribute('color',new T.BufferAttribute(col,3));s.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
 const sb=new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide});
 [[0,12,-26,34,9],[-30,6,8,20,8],[30,5,10,20,8],[0,30,0,24,24]].forEach(p=>{const m=new T.Mesh(new T.PlaneGeometry(p[3],p[4]),sb);m.position.set(p[0],p[1],p[2]);m.lookAt(0,0,0);s.add(m)});
 const rt=pm.fromScene(s,.03);pm.dispose();return rt.texture}catch(e){return null}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xdfe6ff,0x140f2a,.5));const d=new T.DirectionalLight(0xffffff,.9);d.position.set(5,8,7);sc.add(d);
 const rim=new T.PointLight(0xffffff,1.0,60);rim.position.set(-8,4,-8);sc.add(rim);const a=new T.PointLight(0xff5a64,1.6*k,50);a.position.set(0,-1,9);sc.add(a);return a}
const TK=2*Math.tan(16*PI/180);
const vis=(box,cb)=>{let v=false;new IntersectionObserver(es=>{v=es[0].isIntersecting;cb(v)},{rootMargin:'120px'}).observe(box);return()=>v};

/* ---------- HERO: mașina vopsită live ---------- */
function hero(){
 const box=$('#gl');if(!box)return;
 let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true})}catch(e){box.classList.add('nogl');return}
 ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
 const sc=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,200);const env=makeEnv(ren);if(env)sc.environment=env;
 const ac=lights(sc,1);
 const E=IM.car(isMob()?24:36),P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);G.add(E.root);E.root.position.y=-1.55;G.rotation.x=.2;
 const sp={t:1};addEventListener('paintchange',()=>{sp.t=0});
 let asp=1;function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);cam.aspect=w/h;asp=cam.aspect;cam.updateProjectionMatrix()}
 vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);setTimeout(vo,600);setTimeout(vo,1800);
 let uy=0,drag=null,mx=0,tx=0;const el=ren.domElement;el.style.touchAction='pan-y';
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse')tx=e.clientX/innerWidth-.5},{passive:true});
 el.addEventListener('pointerdown',ev=>{drag=ev.clientX;try{el.setPointerCapture(ev.pointerId)}catch(_){}});
 el.addEventListener('pointermove',ev=>{if(!drag&&drag!==0)return;uy+=(ev.clientX-drag)*.012;drag=ev.clientX});
 const pu=()=>{drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
 let on=false,t=0,last=performance.now();
 const isv=vis(box,v=>{on=v;if(v){last=performance.now();loop()}});
 function loop(){if(!on)return;requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
  IM.Paint.step(dt,now);IM.Paint.apply(E.paintMats);IM.Paint.apply(E.glowMats);ac.color.copy(IM.Paint.ui);
  mx+=(tx-mx)*.05;if(drag===null)uy*=.985;
  P.rotation.y=-.6+(RM?0:t*.22)+mx*.5+uy;
  E.update(t,RM?0:dt,{splash:sp});
  const W=12.6,H=7.2,dz=Math.max(H/TK,W/(TK*asp))*1.04;cam.position.set(0,0,dz);cam.lookAt(0,0,0);
  ren.render(sc,cam)}
}
try{hero()}catch(e){const g=$('#gl');if(g)g.classList.add('nogl')}

/* ---------- SECȚIUNE FIXATĂ: cutie → spray → straturi → perete ---------- */
function model(){
 const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
 const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
 let ren;try{ren=new T.WebGLRenderer({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
 ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.setSize(W(),H());stage.appendChild(ren.domElement);
 const sc=new T.Scene(),cam=new T.PerspectiveCamera(32,W()/H(),.1,200);const env=makeEnv(ren);if(env)sc.environment=env;
 const ac=lights(sc,1.2);
 const SEG=isMob()?20:32,objs=IM.objects.map(f=>f(SEG)),P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);
 objs.forEach(o=>{G.add(o.root);o.root.visible=false;o.e=0});G.rotation.y=-.45;
 let uy=0,up=0,drag=null,prog=0,aspEff=1,spin=0,last=performance.now(),fi=0;
 const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
 el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY]});
 el.addEventListener('pointermove',ev=>{if(!drag||!ptrs.has(ev.pointerId))return;uy=clamp(uy+(ev.clientX-drag[0])*.01,-2.4,2.4);up=clamp(up+(ev.clientY-drag[1])*.005,-.5,.5);drag=[ev.clientX,ev.clientY]});
 const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
 const chs=$$('#model3d .r3ch'),bar=$('#r3bar'),rd=$$('.r3dots i');
 const explode=u=>u<.14?0:u<.42?sm((u-.14)/.28):u<.68?1:u<.9?1-sm((u-.68)/.22):0;
 function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?clamp(-r.top/den,0,1):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c,j)=>c.classList.toggle('on',j===i));rd.forEach((c,j)=>c.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`}
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 // telefon: 3D doar în banda liberă de sub cel mai înalt text și deasupra barei; desktop: jumătatea dreaptă
 function vo(){const w=W(),h=H();if(!w||!h)return;ren.setSize(w,h);
  if(innerWidth>=900){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
  else{let tb=0;chs.forEach(c=>{tb=Math.max(tb,c.offsetHeight)});const top=78+tb+14,bot=h-96,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
  aspEff=cam.aspect;cam.updateProjectionMatrix()}
 vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c=>new ResizeObserver(vo).observe(c));setTimeout(vo,800);setTimeout(vo,2000);setTimeout(vo,3500);
 let on=false;vis(sec,v=>{on=v;if(v){last=performance.now();tick()}});
 const TILT=[.16,.16,.42,.22];
 function tick(){if(!on)return;requestAnimationFrame(tick);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;spin+=RM?0:dt;
  IM.Paint.step(dt,now);ac.color.copy(IM.Paint.ui);
  const p4=prog*4;fi=Math.min(3,Math.floor(p4));let fe=0;
  objs.forEach((o,i)=>{const d=Math.abs(p4-(i+.5)),w=1-sm((d-.34)/.16);o.root.visible=w>.01;
   const u=clamp(p4-i,0,1);o.e+=(explode(u)-o.e)*.14;
   o.root.scale.setScalar(Math.max(.001,w));o.root.rotation.y=(1-w)*(p4<i+.5?-1:1)*2.4;
   if(o.root.visible){o.parts.forEach(q=>{q.o.position.lerpVectors(q.a,q.b,o.e)});IM.Paint.apply(o.paintMats);o.update(spin,RM?0:dt,o.e)}
   if(i===fi)fe=o.e});
  if(!drag){uy*=.985;up*=.985}
  const yaw=uy+Math.sin(p4*1.3)*.35+(RM?0:Math.sin(spin*.4)*.1);
  P.rotation.y+=(yaw-P.rotation.y)*.12;P.rotation.x+=((TILT[fi]+up)-P.rotation.x)*.1;
  const sz=objs[fi].size,Hh=sz.h0+(sz.h1-sz.h0)*fe,Ww=sz.w0+(sz.w1-sz.w0)*fe,dz=Math.max(Hh/TK,Ww/(TK*aspEff))*1.1;
  cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
  ren.render(sc,cam)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,MOB=matchMedia('(max-width:899px)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* intro: smoke + heat shimmer */
const intro=$('#intro');function endIntro(){if(!intro||intro.classList.contains('done'))return;intro.classList.add('done');document.body.classList.add('ready');setTimeout(()=>intro.remove(),1000)}
if(RM)endIntro();else{intro.classList.add('play');try{document.getElementById('hza').beginElement()}catch(e){}setTimeout(endIntro,3000);intro.addEventListener('click',endIntro)}
/* marquee */
$('#mq').innerHTML=Array(2).fill(['Sudură eșapament','Tobe','Racord flexibil','Catalizatori','Calea Baciului 45','0742 183 209','Multimarcă'].map(t=>`<span>${t}</span><span class="d">◎</span>`).join('')).join('');
/* reveal */
const show=e=>e.classList.add('in'),T='.rv,.rtr,.stars';
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show(e.target);io.unobserve(e.target)}}),{threshold:.12});$$(T).forEach(e=>io.observe(e))}
const chk=()=>$$(T).forEach(e=>{if(e.getBoundingClientRect().top<innerHeight*1.05)show(e)});addEventListener('scroll',chk,{passive:true});setTimeout(chk,1200);setTimeout(chk,3200);
$$('.score .stars span').forEach((c,i)=>c.style.animationDelay=(i*.1)+'s');
/* reviews (Google, verbatim) */
const R=[["Toate respectele domnului Dan si echipei de mecanici cu care lucreaza. Sunt extrem de calificati, amabili si ofera servicii rapide. Desi ocupati, m-au programat in aceeasi zi pentru o constatare la toba de esapament. In nicio ora am plecat de acolo cu toba reparata/schimbata iar pretul a fost foarte corect. Ii recomand cu mare drag, super profesionisti si au servicii de nota 10!",5],
["Am mers pt. o estimare si au rezolvat-o pe loc. Ignorati locatia, baietii isi fac treaba si pleci de acolo cu toba reparata. Costurile au fost cat se poate de rezonabile. Recomand.",5],
["Baieti de treaba, lucrare rapida si bună, am fost de 2 ori au rezolvat problema si nu a trebuit sa astept mult pana sa ma primească, si nici in timpul lucrării. Tarifele sunt accesibile, nu am simtit ca as fi jecmanit ca in multe alte locuri. Recomand!",5],
["Foarte promti, am fost programat imediat după ce i-am sunat și au fost profesioniști. Recomand",5],
["Baieti buni si de treaba, rezolva rapid problemele la esapament.",5],
["Profesioniști și rapizi! De obicei este foarte aglomerat și e nevoie de programare...",5]];
$('#rtr').innerHTML=R.map((r,i)=>`<article class="rc" style="transition-delay:${i*.08}s"><div class="stars in" aria-label="${r[1]} din 5">${'<span>★</span>'.repeat(r[1])}</div><q>${r[0]}</q></article>`).join('');
$$('#rtr .stars span').forEach((c,i)=>c.style.animationDelay=(.3+(i%5)*.08)+'s');
const rt=$('#rtr');let dn=0,sx=0,sl=0;rt.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dn=1;sx=e.clientX;sl=rt.scrollLeft});addEventListener('pointermove',e=>{if(dn)rt.scrollLeft=sl-(e.clientX-sx)});addEventListener('pointerup',()=>dn=0);
/* today */
const d=new Date().getDay(),k=d===0?'0':d===6?'6':'1';const tr=$(`#prg tr[data-d="${k}"]`);tr&&tr.classList.add('today');
/* scroll */
const prog=$('#prog'),nav=$('#nav'),mb=$('#mbar'),lays=$$('[data-depth]');
function onS(){const y=scrollY,H=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${H>0?y/H:0})`;nav.classList.toggle('s',y>30);mb.classList.toggle('on',y>innerHeight*.5);
 if(!RM)lays.forEach(l=>{const p=l.parentElement.getBoundingClientRect();if(p.bottom<-100||p.top>innerHeight+100)return;const c=p.top+p.height/2-innerHeight/2;l.style.transform=`translate3d(${l.dataset.x?c*l.dataset.x:0}px,${c*-l.dataset.depth}px,0)`})}
addEventListener('scroll',()=>requestAnimationFrame(onS),{passive:true});onS();
$$('.oc').forEach(c=>c.addEventListener('click',()=>$$('.oc').forEach(x=>x.classList.toggle('act',x===c&&!c.classList.contains('act')))));
/* tip rev */
let rev=0;const tv=$('#tipv');const hit=()=>{tv.classList.add('hot');rev=1;if(navigator.vibrate)try{navigator.vibrate([20,30,40])}catch(_){}clearTimeout(tv._t);tv._t=setTimeout(()=>tv.classList.remove('hot'),900)};
tv.addEventListener('click',hit);tv.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hit()}});
/* symptom helper */
let S=null,Wn=null;const out=$('#out');
function upd(){if(!S)return;const txt=`Bună ziua, am o problemă la eșapament: ${S.toLowerCase()}. Aș vrea o programare${Wn?', '+Wn:''}.`;
 out.classList.add('on');out.classList.remove('pop');void out.offsetWidth;out.classList.add('pop');
 out.innerHTML=`<div class="q"><em>${S}</em>${Wn?' · '+Wn:''}</div><p>Spune la telefon marca, modelul și anul mașinii. Programarea și prețul se stabilesc telefonic.</p><div class="row"><a class="btn" href="tel:+40742183209">☎ 0742 183 209</a><a class="btn gh" href="tel:+40740016307">☎ 0740 016 307</a><button class="copyb" data-copy="${txt}">⧉ <span>Copiază mesajul</span></button></div>`}
$('#fsm').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;S=b.dataset.s;$$('#fsm .chip').forEach(x=>x.classList.toggle('on',x===b));upd()});
$('#fwh').addEventListener('click',e=>{const b=e.target.closest('[data-w]');if(!b)return;Wn=b.dataset.w;$$('#fwh .chip').forEach(x=>x.classList.toggle('on',x===b));if(!S){S='Altceva la evacuare';$('#fsm [data-s="Altceva la evacuare"]').classList.add('on')}upd()});
/* micro */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.chip,.copyb');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const dd=Math.max(r.width,r.height)*2;s.style.cssText=`width:${dd}px;height:${dd}px;left:${e.clientX-r.left-dd/2}px;top:${e.clientY-r.top-dd/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});
const toast=t=>{const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)};
document.addEventListener('click',async e=>{const cp=e.target.closest('.copyb');if(!cp)return;const n=cp.dataset.copy;let ok=false;try{await navigator.clipboard.writeText(n);ok=true}catch(_){try{const t=document.createElement('textarea');t.value=n;document.body.appendChild(t);t.select();ok=document.execCommand('copy');t.remove()}catch(__){}}
 if(navigator.vibrate)try{navigator.vibrate(20)}catch(_){}const sp=cp.querySelector('span'),old=sp.textContent;cp.classList.add('ok');sp.textContent=ok?'Copiat ✓':'Selectează manual';toast(ok?'Copiat: '+n:n);setTimeout(()=>{cp.classList.remove('ok');sp.textContent=old},2200)});
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){$$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
 const c=$('#cur');let x=-99,y=-99,cx=-99,cy=-99;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;c.classList.toggle('big',!!e.target.closest('a,button,.oc,canvas,.tipv'))});(function l(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(l)})()}
/* WebGL */
let gl=false;try{const t=document.createElement('canvas');gl=!!(t.getContext('webgl')||t.getContext('experimental-webgl'))}catch(e){}
const sec=$('#toba');
if(!gl||!window.THREE){sec.classList.add('fallback');return}
const TH=THREE;
/* hero heat-shimmer shader */
(()=>{const host=$('#heat');const r=new TH.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});r.setPixelRatio(MOB?.75:1);r.setSize(host.clientWidth,host.clientHeight);host.appendChild(r.domElement);
 const sc=new TH.Scene(),cam=new TH.OrthographicCamera(-1,1,1,-1,0,1);
 const U={t:{value:0},res:{value:new TH.Vector2(host.clientWidth,host.clientHeight)},m:{value:new TH.Vector2(.7,.3)},rev:{value:0}};
 const mat=new TH.ShaderMaterial({uniforms:U,transparent:true,vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:`precision mediump float;varying vec2 v;uniform float t,rev;uniform vec2 res,m;
 float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
 float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
 vec3 tint(float x){x=clamp(x,0.,1.);vec3 a=vec3(.89,.72,.42),b=vec3(.82,.34,.6),c=vec3(.48,.36,1.),d=vec3(.25,.7,1.);return x<.33?mix(a,b,x/.33):x<.66?mix(b,c,(x-.33)/.33):mix(c,d,(x-.66)/.34);}
 void main(){vec2 uv=v;float asp=res.x/res.y;vec2 p=vec2(uv.x*asp,uv.y);
  vec2 q=vec2(fb(p*2.+vec2(0.,-t*.5)),fb(p*2.+vec2(5.2,-t*.6)));
  float f=fb(p*1.6+q*1.8+vec2(0.,-t*.35));
  vec2 mm=vec2(m.x*asp,m.y);float g=exp(-distance(p,mm)*2.2)*(.6+rev*1.2);
  float rise=smoothstep(0.,1.,1.-uv.y);
  float band=f*.9+g*.8-.25+rise*.15;
  vec3 col=tint(fract(f*1.3+t*.04+uv.x*.25))*smoothstep(.35,1.,band);
  float smoke=fb(p*3.+q*2.-vec2(0.,t*.8))*.18*(1.-uv.y);
  float a=clamp(smoothstep(.4,1.05,band)*.75+smoke,0.,.85);
  gl_FragColor=vec4(col+smoke*.6,a);}`});
 sc.add(new TH.Mesh(new TH.PlaneGeometry(2,2),mat));
 addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();U.m.value.set((e.clientX-b.left)/b.width,1-(e.clientY-b.top)/b.height)},{passive:true});
 addEventListener('resize',()=>{r.setSize(host.clientWidth,host.clientHeight);U.res.value.set(host.clientWidth,host.clientHeight)});
 let vis=true;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)loop()}).observe(host);
 const t0=performance.now();function loop(){if(!vis)return;U.t.value=RM?3:(performance.now()-t0)/1000;rev*=.96;U.rev.value=rev;r.render(sc,cam);if(!RM)requestAnimationFrame(loop)}loop();
})();
/* 3D exhaust */
const stage=$('#stage'),W=()=>stage.clientWidth,H=()=>stage.clientHeight;
const ren=new TH.WebGLRenderer({antialias:!MOB,alpha:true,powerPreference:'low-power'});ren.setPixelRatio(Math.min(devicePixelRatio,MOB?1.25:1.75));ren.setSize(W(),H());stage.appendChild(ren.domElement);
const sc=new TH.Scene();const cam=new TH.PerspectiveCamera(34,W()/H(),.1,100);
sc.add(new TH.HemisphereLight(0xdfe6ff,0x120a1c,.55));const kl=new TH.DirectionalLight(0xffffff,1.4);kl.position.set(3,5,4);sc.add(kl);
const l1=new TH.PointLight(0x7b5cff,2.4,18);l1.position.set(-4,1.5,3);sc.add(l1);const l2=new TH.PointLight(0xe2b86a,1.6,14);l2.position.set(4,-1,3);sc.add(l2);const l3=new TH.PointLight(0x3fb2ff,1.8,14);l3.position.set(0,3,-4);sc.add(l3);
// heat-tint vertex colours along x
function heatCols(geo,x0,x1,boost){const p=geo.attributes.position,c=[];const A=[[.81,.83,.87],[.89,.72,.42],[.82,.34,.6],[.48,.36,1],[.25,.7,1]];for(let i=0;i<p.count;i++){let x=(p.getX(i)-x0)/(x1-x0);x=Math.min(1,Math.max(0,x));x=Math.pow(x,boost||1)*(A.length-1);const j=Math.min(A.length-2,Math.floor(x)),f=x-j;c.push(...A[j].map((v,k)=>v+(A[j+1][k]-v)*f))}geo.setAttribute('color',new TH.Float32BufferAttribute(c,3))}
const chrome=new TH.MeshStandardMaterial({color:0xd8dde6,metalness:.95,roughness:.22});
const tintM=new TH.MeshStandardMaterial({vertexColors:true,metalness:.85,roughness:.25,emissive:0x000000});
const dark=new TH.MeshStandardMaterial({color:0x26262f,metalness:.6,roughness:.5});
const edge=new TH.LineBasicMaterial({color:0x8f7dff,transparent:true,opacity:.22});
const ex=new TH.Group();sc.add(ex);const parts=[];
function add(mesh,off){const g=new TH.Group();g.add(mesh);const e=new TH.LineSegments(new TH.EdgesGeometry(mesh.geometry,30),edge);e.position.copy(mesh.position);e.rotation.copy(mesh.rotation);e.scale.copy(mesh.scale);g.add(e);g.userData={o:new TH.Vector3(...off),r:Math.random()*.6-.3};ex.add(g);parts.push(g);return g}
// front pipe (curve)
const c1=new TH.CatmullRomCurve3([new TH.Vector3(-4.6,1.2,0),new TH.Vector3(-4.1,.4,0),new TH.Vector3(-3.4,0,0),new TH.Vector3(-2.6,0,0)]);
const g1=new TH.TubeGeometry(c1,40,.16,20);heatCols(g1,-4.6,-2.6,1);add(new TH.Mesh(g1,tintM),[-.8,1.2,0]);
// catalytic converter
const gc=new TH.CylinderGeometry(.42,.42,1.2,32,4);gc.rotateZ(Math.PI/2);const cat=new TH.Mesh(gc,chrome);cat.position.set(-2,0,0);cat.scale.set(1,1,.8);add(cat,[0,1.6,.6]);
const gcc=new TH.ConeGeometry(.42,.3,32,1,true);gcc.rotateZ(Math.PI/2);const cc1=new TH.Mesh(gcc,chrome);cc1.position.set(-2.75,0,0);add(cc1,[-.4,1.6,.6]);
// flex joint rings
for(let i=0;i<7;i++){const t=new TH.Mesh(new TH.TorusGeometry(.2,.05,8,24),dark);t.rotation.y=Math.PI/2;t.position.set(-1.25+i*.11,0,0);add(t,[0,-.6-i*.12,1.4])}
// mid pipe
const gp=new TH.CylinderGeometry(.16,.16,1.6,20);gp.rotateZ(Math.PI/2);gp.translate(.1,0,0);heatCols(gp,-.7,.9,1);add(new TH.Mesh(gp,tintM),[0,-1.4,0]);
// muffler (oval)
const gm=new TH.CylinderGeometry(.62,.62,2.2,40,6);gm.rotateZ(Math.PI/2);const muf=new TH.Mesh(gm,chrome);muf.position.set(2,0,0);muf.scale.set(1,.72,1.15);add(muf,[0,1.8,-.4]);
for(const s of[-1,1]){const cap=new TH.Mesh(new TH.TorusGeometry(.62,.05,10,40),dark);cap.rotation.y=Math.PI/2;cap.position.set(2+s*1.1,0,0);cap.scale.set(1.15,.72,1);add(cap,[s*.9,1.8,-.4])}
// tailpipe + tip (heat tint)
const c2=new TH.CatmullRomCurve3([new TH.Vector3(3.1,0,0),new TH.Vector3(3.6,-.05,0),new TH.Vector3(4.1,-.25,0),new TH.Vector3(4.6,-.3,0)]);
const g2=new TH.TubeGeometry(c2,30,.16,20);heatCols(g2,3.1,4.6,1);add(new TH.Mesh(g2,tintM),[1.2,-.9,0]);
const gt=new TH.CylinderGeometry(.3,.26,.9,40,8,true);gt.rotateZ(Math.PI/2);gt.translate(5.0,-.3,0);heatCols(gt,4.55,5.45,.7);const tip=new TH.Mesh(gt,new TH.MeshStandardMaterial({vertexColors:true,metalness:.9,roughness:.18,side:TH.DoubleSide}));add(tip,[2.2,-.6,0]);
// hangers
for(const x of[-3,.1,3.4]){const hm=new TH.Mesh(new TH.CylinderGeometry(.035,.035,.8,8),dark);hm.position.set(x,.5,0);add(hm,[0,2.6,0])}
ex.position.x=-.2;
// smoke particles
const N=MOB?120:220,pg=new TH.BufferGeometry(),pp=new Float32Array(N*3),life=new Float32Array(N);for(let i=0;i<N;i++){life[i]=Math.random()}
pg.setAttribute('position',new TH.BufferAttribute(pp,3));
const sm=new TH.PointsMaterial({color:0xb9bfd6,size:MOB?.35:.3,transparent:true,opacity:.18,depthWrite:false,blending:TH.AdditiveBlending});const smk=new TH.Points(pg,sm);ex.add(smk);
const grid=new TH.GridHelper(30,30,0x4b3fa0,0x1a1a28);grid.position.y=-1.8;grid.material.transparent=true;grid.material.opacity=.35;sc.add(grid);
let uy=0,up=0,zoom=1,drag=null,pin=0,p=0,vis=false;const el=ren.domElement,ptr=new Map();
el.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);try{el.setPointerCapture(e.pointerId)}catch(_){}drag=[e.clientX,e.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){const [a,b]=[...ptr.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pin)zoom=1,Math.min(1.8,Math.max(.7,zoom*dd/pin));pin=dd;return}if(drag){uy+=(e.clientX-drag[0])*.01;up=Math.max(-.6,Math.min(.7,up+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY]}});
const pu=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pin=0;if(!ptr.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
el.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();zoom=1,Math.min(1.8,Math.max(.7,zoom*(e.deltaY>0?.93:1.07)))},{passive:false});
const chs=$$('.ch'),st=$$('.steps i'),b3=$('#bar3'),pc=$('#pct3');
function sp(){const r=sec.getBoundingClientRect();p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const i=Math.min(3,Math.floor(p*4));chs.forEach((c,j)=>c.classList.toggle('on',j===i));st.forEach((c,j)=>c.classList.toggle('on',j<=i));b3.style.transform=`scaleX(${p})`;pc.textContent=Math.round(20+p*580)+'°'}
addEventListener('scroll',sp,{passive:true});sp();
addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix()});
if(MOB){const vo=()=>{cam.setViewOffset(W(),H(),0,-H()*0.14,W(),H())};vo();addEventListener('resize',vo)}
new ResizeObserver(()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();if(MOB)cam.setViewOffset(W(),H(),0,-H()*0.14,W(),H())}).observe(stage);

new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)tick()},{rootMargin:'80px'}).observe(sec);
let yaw=.5,cy=0,exs=0;const hot=new TH.Color();function tick(){if(!vis)return;const t=performance.now()/1000;
 // chapters: 0 assembled, middle exploded (inspection), end assembled + hot
 const target=Math.sin(Math.min(1,p/.9)*Math.PI)*(p<.75?1:1);exs+=(target-exs)*.08;const e3=exs*exs*(3-2*exs);
 parts.forEach(g=>{g.position.copy(g.userData.o).multiplyScalar(e3);g.rotation.z=g.userData.r*e3});
 yaw+=((uy+.5+p*Math.PI*1.2+(RM?0:t*.06))-yaw)*.08;ex.rotation.y=yaw;cy+=(up+.25-cy)*.1;ex.rotation.x=cy;
 const heat=Math.max(0,(p-.6)/.4);hot.setRGB(.5*heat,.15*heat,.6*heat);tintM.emissive.copy(hot);tip.material.emissive.setRGB(.35*heat,.2*heat,.7*heat);l1.intensity=2+heat*2+Math.sin(t*4)*.3;
 // smoke from tip
 const pa=pg.attributes.position.array,sp2=.25+heat*.8;for(let i=0;i<N;i++){life[i]+=.006*(1+sp2);if(life[i]>1)life[i]=0;const L=life[i];pa[i*3]=5.45+L*3*sp2+Math.sin(i+t)*.1*L;pa[i*3+1]=-.3+L*L*1.6+Math.sin(i*1.7+t*2)*.25*L;pa[i*3+2]=Math.cos(i*2.3+t)*.4*L}pg.attributes.position.needsUpdate=true;sm.opacity=.08+heat*.22;
 const dist=(MOB?17:12)-Math.sin(p*Math.PI)*1.5;cam.position.set(MOB?0:-2.6,MOB?2.4:1.8,dist/zoom);cam.lookAt(MOB?0:-2.6,MOB?-.6:0,0);
 ren.render(sc,cam);requestAnimationFrame(tick)}
})();

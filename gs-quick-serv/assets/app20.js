(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB=matchMedia('(max-width:899px)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function hasGL(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const GL=hasGL();document.documentElement.classList.toggle('nogl',!GL);

/* ---------- 3. INTRO ---------- */
const intro=$('#intro');
function endIntro(){if(!intro||intro.classList.contains('done'))return;intro.classList.add('done');document.body.classList.add('ready');setTimeout(()=>intro.remove(),900)}
if(intro){if(RM)endIntro();else{intro.classList.add('play');setTimeout(endIntro,2900);intro.addEventListener('click',endIntro)}}else document.body.classList.add('ready');

/* ---------- 2. SPLIT TEXT ---------- */
$$('h2, .chap h3').forEach(h=>{if(h.dataset.split)return;h.dataset.split=1;let i=0;
 const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}const o=document.createElement('span');o.className='sw';const s=document.createElement('span');s.textContent=w;s.style.transitionDelay=(i++*0.07)+'s';o.appendChild(s);f.appendChild(o)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(h);h.classList.add('splt')});
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sin');sio.unobserve(e.target)}}),{threshold:.2});$$('.splt').forEach(h=>sio.observe(h));

/* ---------- 8. MICRO ---------- */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.opt,.rbtn');if(!b||RM)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';const d=Math.max(r.width,r.height)*2;s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
document.addEventListener('click',e=>{if(e.target.closest('a[href^="tel:"]')&&navigator.vibrate)try{navigator.vibrate(35)}catch(_){}});
const toast=t=>{let el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)};
const cp=$('#copyph');if(cp)cp.addEventListener('click',async()=>{const n='0759 330 370';let ok=false;try{await navigator.clipboard.writeText(n);ok=true}catch(e){try{const t=document.createElement('textarea');t.value=n;document.body.appendChild(t);t.select();ok=document.execCommand('copy');t.remove()}catch(_){}}
 cp.classList.add('ok');cp.querySelector('span').textContent=ok?'Copiat ✓':'0759 330 370';toast(ok?'Numărul a fost copiat: 0759 330 370':'Număr: 0759 330 370');setTimeout(()=>{cp.classList.remove('ok');cp.querySelector('span').textContent='Copiază numărul'},2400)});
$$('.opt').forEach(o=>o.addEventListener('click',()=>{const r=$('#res');if(!r)return;r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')}));

/* ---------- 5. MULTI-LAYER PARALLAX ---------- */
const lays=$$('[data-depth]');function par(){if(RM)return;const vh=innerHeight;lays.forEach(l=>{const p=l.closest('.px')||l.parentElement;const r=p.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;const c=(r.top+r.height/2-vh/2);l.style.transform=`translate3d(0,${c*-parseFloat(l.dataset.depth)}px,0)`+(l.dataset.x?` translateX(${c*parseFloat(l.dataset.x)}px)`:'')})}
addEventListener('scroll',()=>requestAnimationFrame(par),{passive:true});par();

/* ---------- 7. HERO SHADER ---------- */
function heroShader(){const host=$('#hero .hbg');if(!host||!GL||!window.GS_TEX)return;const cv=document.createElement('canvas');cv.className='hgl';
 const gl=cv.getContext('webgl',{premultipliedAlpha:false,antialias:false});if(!gl)return;
 const vs='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
 const fs=`precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 res,ir,m;uniform float tm,amp;
 void main(){vec2 uv=v;float ca=res.x/res.y,ia=ir.x/ir.y;vec2 s=ca>ia?vec2(1.,ia/ca):vec2(ca/ia,1.);vec2 tuv=(uv-.5)*s+.5;tuv.y=1.-tuv.y;
 vec2 d=uv-m;d.x*=ca;float r=length(d);float w=sin(r*38.-tm*5.)*exp(-r*5.)*amp*.018;tuv+=normalize(d+1e-4)*w;
 tuv+=vec2(sin(uv.y*6.+tm*.6),cos(uv.x*5.+tm*.5))*.002;vec3 c=texture2D(t,tuv).rgb;
 float sw=smoothstep(.35,0.,abs(uv.x-(.5+.6*sin(tm*.45))-(uv.y-.5)*.6));c+=vec3(1.,.9,.6)*sw*.10;c+=vec3(1.,.78,.1)*exp(-r*9.)*amp*.18;gl_FragColor=vec4(c,1.);}`;
 const sh=(ty,src)=>{const s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);return s};const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pr,n);const img=new Image();img.onload=()=>{const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img)}catch(e){return}
  host.appendChild(cv);host.classList.add('gl');gl.uniform2f(U('ir'),img.width,img.height);
  let m=[.6,.5],tm=[.6,.5],amp=0,vis=true,t0=performance.now();
  const rs=()=>{const pr=Math.min(devicePixelRatio,MOB?1:1.5);cv.width=host.clientWidth*pr*(MOB?.6:.8);cv.height=host.clientHeight*pr*(MOB?.6:.8);gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U('res'),cv.width,cv.height)};rs();addEventListener('resize',rs);
  const hero=$('#hero');hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tm=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height];amp=1});
  hero.addEventListener('pointerdown',e=>{const r=hero.getBoundingClientRect();tm=[(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height];m=tm.slice();amp=1.6});
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)loop()}).observe(hero);
  function loop(){if(!vis)return;m[0]+=(tm[0]-m[0])*.08;m[1]+=(tm[1]-m[1])*.08;amp*=.985;gl.uniform2f(U('m'),m[0],m[1]);gl.uniform1f(U('amp'),RM?0:amp);gl.uniform1f(U('tm'),RM?0:(performance.now()-t0)/1000);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!RM)requestAnimationFrame(loop)}loop()};
 img.src=MOB?GS_TEX.m:GS_TEX.d}
heroShader();

/* ---------- 4+6. THREE.JS WHEEL ---------- */
const sec=$('#roata3d'),stage=$('#r3stage');
if(!sec)return;
if(!GL||!window.THREE){sec.classList.add('fallback');return}
const T=THREE,W=()=>stage.clientWidth,H=()=>stage.clientHeight;
const ren=new T.WebGLRenderer({antialias:!MOB,alpha:true,powerPreference:'low-power'});ren.setPixelRatio(Math.min(devicePixelRatio,MOB?1.25:1.75));ren.setSize(W(),H());ren.outputEncoding=T.sRGBEncoding;stage.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,W()/H(),.1,100);cam.position.set(0,0,7);
sc.add(new T.HemisphereLight(0xfff3d0,0x101010,.45));const key=new T.DirectionalLight(0xffffff,1.6);key.position.set(3,4,5);sc.add(key);const rim=new T.PointLight(0xffc400,1.4,20);rim.position.set(-4,-1,2);sc.add(rim);const back=new T.DirectionalLight(0x88aaff,.6);back.position.set(-3,2,-4);sc.add(back);
const wheel=new T.Group();sc.add(wheel);wheel.position.set(MOB?0:1.25,MOB?-.35:-.1,0);
const rubber=new T.MeshStandardMaterial({color:0x0b0b0c,roughness:.85,metalness:.05});
const metal=new T.MeshStandardMaterial({color:0xa7a9ae,roughness:.32,metalness:.55});
const dark=new T.MeshStandardMaterial({color:0x2a2b2f,roughness:.5,metalness:.6});
const yel=new T.MeshStandardMaterial({color:0xffc400,roughness:.35,metalness:.3,emissive:0x332600});
// tyre: lathe of rounded cross-section around Y, then rotate so axis = Z
const R0=1.05,R1=1.62,Wd=.78;const tyre=new T.Mesh(new T.TorusGeometry(1.33,.3,MOB?20:28,MOB?72:120),rubber);tyre.scale.z=1.3;wheel.add(tyre);
// tread blocks (instanced)
const NB=MOB?60:84;const bg=new T.BoxGeometry(.11,.07,.22);const tread=new T.InstancedMesh(bg,rubber,NB*2);const dm=new T.Object3D();
function setTread(depth){let k=0;for(let i=0;i<NB;i++){const a=i/NB*Math.PI*2;for(const z of[-.19,.19]){dm.position.set(Math.cos(a)*(1.57+depth*.5),Math.sin(a)*(1.57+depth*.5),z+(i%2?.04:-.04)*(z>0?1:-1));dm.rotation.set(0,0,a+Math.PI/2);dm.rotateX(z>0?.35:-.35);dm.scale.set(1,Math.max(.05,depth/.07),1);dm.updateMatrix();tread.setMatrixAt(k++,dm.matrix)}}tread.instanceMatrix.needsUpdate=true}
setTread(.07);wheel.add(tread);
// rim barrel
const barrel=new T.Mesh(new T.CylinderGeometry(R0,R0,Wd*.86,MOB?48:80,1,true),dark);barrel.rotation.x=Math.PI/2;wheel.add(barrel);
const lip=new T.Mesh(new T.TorusGeometry(R0,.045,10,MOB?64:100),metal);lip.position.z=Wd*.43;wheel.add(lip);
const lip2=lip.clone();lip2.position.z=-Wd*.43;wheel.add(lip2);
const face=new T.Group();face.position.z=Wd*.3;wheel.add(face);
const hub=new T.Mesh(new T.CylinderGeometry(.26,.3,.16,32),metal);hub.rotation.x=Math.PI/2;
const cap=new T.Mesh(new T.CylinderGeometry(.12,.12,.18,24),yel);cap.rotation.x=Math.PI/2;cap.position.z=.03;
const disc=new T.Mesh(new T.CircleGeometry(R0*.98,64),new T.MeshStandardMaterial({color:0x0e0e10,roughness:.8,metalness:.2}));disc.position.z=-.22;
function buildRim(style){face.clear();face.add(hub,cap,disc);
 const n=style===0?5:style===1?10:7;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2;let g;
  if(style===0){g=new T.BoxGeometry(.2,R0-.3,.1);}else if(style===1){g=new T.BoxGeometry(.08,R0-.3,.08)}else{g=new T.BoxGeometry(.14,R0-.3,.09)}
  const sp=new T.Mesh(g,metal);sp.position.set(Math.cos(a+Math.PI/2)*(R0/2+.1),Math.sin(a+Math.PI/2)*(R0/2+.1),-.02);sp.rotation.z=a;if(style===2){sp.rotation.y=.3;const s2=sp.clone();s2.rotation.y=-.3;s2.position.x+=Math.cos(a)*.12;s2.position.y+=Math.sin(a)*.12;face.add(s2)}face.add(sp)}
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3;const nut=new T.Mesh(new T.CylinderGeometry(.04,.04,.08,6),dark);nut.rotation.x=Math.PI/2;nut.position.set(Math.cos(a)*.19,Math.sin(a)*.19,.08);face.add(nut)}}
buildRim(0);
// pressure ring
const pr=new T.Mesh(new T.TorusGeometry(R1+.28,.02,8,120,Math.PI*2),new T.MeshBasicMaterial({color:0xffc400,transparent:true,opacity:0}));wheel.add(pr);
// interaction
let yaw=0,pitch=-.15,uy=0,up=0,zoom=1,drag=null,pinch=0,prog=0,needs=true;
const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
el.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);el.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY];sec.classList.add('touched')});
el.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)zoom=Math.min(1.8,Math.max(.6,zoom*d/pinch));pinch=d;needs=true;return}
 if(drag){uy+=(e.clientX-drag[0])*.01;up=Math.max(-1.1,Math.min(1.1,up+(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY];needs=true}});
const pu=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(!ptrs.size)drag=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
el.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.altKey)return;e.preventDefault();zoom=Math.min(1.8,Math.max(.6,zoom*(e.deltaY>0?.92:1.08)));needs=true},{passive:false});
$$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{zoom=Math.min(1.8,Math.max(.6,zoom*(b.dataset.zoom==='in'?1.2:.83)));needs=true}));
$$('[data-rim]').forEach(b=>b.addEventListener('click',()=>{$$('[data-rim]').forEach(x=>x.classList.toggle('on',x===b));buildRim(+b.dataset.rim);needs=true}));
const td=$('#tread');if(td)td.addEventListener('input',()=>{const v=+td.value;setTread(.012+v/8*.07);$('#treadv').textContent=v.toFixed(1).replace('.',',')+' mm';$('#treadw').textContent=v<1.6?'Sub limita legală de 1,6 mm':v<3?'Uzură avansată':'Profil bun';$('#treadw').className=v<1.6?'bad':v<3?'mid':'ok';needs=true});
const prs=$('#press');if(prs)prs.addEventListener('input',()=>{$('#pressv').textContent=(+prs.value).toFixed(1).replace('.',',')+' bar';needs=true});
// scroll progress -> rotation/camera/chapters
const chs=$$('#roata3d .r3ch'),bar=$('#r3bar');
function onScroll(){const r=sec.getBoundingClientRect();prog=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c,j)=>c.classList.toggle('on',j===i));if(bar)bar.style.transform=`scaleX(${prog})`;needs=true}
addEventListener('scroll',onScroll,{passive:true});onScroll();
addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();needs=true});
let vis=false,spin=0;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)tick()},{rootMargin:'100px'}).observe(sec);
function tick(){if(!vis)return;spin+=RM?0:.004;
 const p=prog;const ty=uy+p*Math.PI*1.6+spin*(sec.classList.contains('touched')?0:1);yaw+=(ty-yaw)*.12;const tp=up+pitch+Math.sin(p*Math.PI)*.35;wheel.rotation.y=yaw;wheel.rotation.x+=(tp-wheel.rotation.x)*.12;
 const pc=Math.max(0,1-Math.abs(p-.875)*6);pr.material.opacity=pc*.9;pr.rotation.z+=.01;
 const base=(MOB?11.5:7.6)-Math.sin(p*Math.PI)*1.6;cam.position.z+=(base/zoom-cam.position.z)*.1;cam.position.x+=(((p>.25&&p<.5)?.6:0)-cam.position.x)*.05;cam.lookAt(0,0,0);
 rim.intensity=1.2+Math.sin(performance.now()/600)*.3;ren.render(sc,cam);requestAnimationFrame(tick)}
window.__gs3d=true;
})();

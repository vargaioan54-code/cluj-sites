(()=>{
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
// hours
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
D.forEach((d,i)=>{const t=i<5?'10:00–18:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2});
$$('.card').forEach((c,i)=>{c.style.transitionDelay=i*.1+'s';io.observe(c)});
addEventListener('scroll',()=>document.body.classList.toggle('past',scrollY>innerHeight*.7),{passive:true});
// 3D
const box=$('#gl');if(!window.THREE)return;
let ren;try{ren=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,12);
sc.add(new THREE.HemisphereLight(0xfff1e0,0x0e1311,.9));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(5,6,8);sc.add(dl);
const pl=new THREE.PointLight(0xff7a2f,2,20);pl.position.set(-4,-2,4);sc.add(pl);
const steel=new THREE.MeshStandardMaterial({color:0xc9d1cc,metalness:.9,roughness:.28}),
orange=new THREE.MeshStandardMaterial({color:0xff7a2f,metalness:.4,roughness:.4}),
dark=new THREE.MeshStandardMaterial({color:0x2a3530,metalness:.7,roughness:.5});
const G=new THREE.Group();sc.add(G);
// gear
function gear(r,teeth,th,mat){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,th,48),mat);c.rotation.x=Math.PI/2;g.add(c);
const hole=new THREE.Mesh(new THREE.CylinderGeometry(r*.35,r*.35,th*1.05,32),dark);hole.rotation.x=Math.PI/2;g.add(hole);
for(let i=0;i<teeth;i++){const a=i/teeth*Math.PI*2,t=new THREE.Mesh(new THREE.BoxGeometry(r*.28,r*.3,th),mat);t.position.set(Math.cos(a)*(r+r*.12),Math.sin(a)*(r+r*.12),0);t.rotation.z=a;g.add(t)}return g}
const g1=gear(1.6,14,.5,orange);g1.position.set(-.6,.2,-.6);G.add(g1);
const g2=gear(.95,10,.45,steel);g2.position.set(1.65,-1.35,-.4);G.add(g2);
// wrench
const W=new THREE.Group();
const sh=new THREE.Mesh(new THREE.BoxGeometry(5,.42,.22),steel);W.add(sh);
function head(x,open){const h=new THREE.Group();const ring=new THREE.Mesh(new THREE.TorusGeometry(.55,.2,16,40,open?Math.PI*1.45:Math.PI*2),steel);
if(open)ring.rotation.z=Math.PI*.78*(x>0?1:-1)+ (x>0?0:Math.PI);h.add(ring);h.position.x=x;return h}
W.add(head(2.85,true));W.add(head(-2.85,false));W.rotation.z=-.6;W.position.z=.8;G.add(W);
// bolts
const bolts=[];for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.1,6),i%2?orange:steel);b.position.set((Math.random()-.5)*7,(Math.random()-.5)*4.5,(Math.random()-.5)*2-1);b.rotation.x=Math.random()*3;bolts.push(b);G.add(b)}
const MOB=()=>innerWidth<900;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
if(!MOB()){cam.aspect=w/h;cam.clearViewOffset();G.position.set(2.8,0,0);G.scale.setScalar(1);cam.updateProjectionMatrix();return}
G.position.set(0,0,0);const tx=$('#htx'),ct=$('#hcta');const top=tx.querySelector('.hsub').getBoundingClientRect().bottom-box.getBoundingClientRect().top+16;
const bot=ct.getBoundingClientRect().top-box.getBoundingClientRect().top-12;const rh=Math.max(120,bot-top);
G.scale.setScalar(Math.min(1,rh/330));cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h);cam.updateProjectionMatrix()}
// note: setViewOffset with fullHeight=rh keeps scene framed inside the free band [top,bot]
function vo2(){vo()}
vo2();addEventListener('resize',vo2);new ResizeObserver(vo2).observe(box);new ResizeObserver(vo2).observe($('#htx'));setTimeout(vo2,900);setTimeout(vo2,2000);
let tx=0,ty=0,mx=0,my=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)}},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
mx+=(tx-mx)*.05;my+=(ty-my)*.05;const s=Math.min(1,scrollY/innerHeight);
g1.rotation.z=t*.5;g2.rotation.z=-t*.5*1.6;W.rotation.z=-.6+Math.sin(t*.8)*.25-s*.8;W.position.y=Math.sin(t*1.1)*.15;
bolts.forEach((b,i)=>{b.rotation.y=t*(.5+i*.1);b.position.y+=Math.sin(t+i)*.002});
G.rotation.y=mx*.6+Math.sin(t*.3)*.2;G.rotation.x=my*.3+.15;pl.intensity=1.6+Math.sin(t*3)*.4;
ren.render(sc,cam)})();
})();

(()=>{
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
// hours
const D=['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă','Duminică'],td=(new Date().getDay()+6)%7,hb=$('#hours');
D.forEach((d,i)=>{const t=i<5?'09:00–17:00':'Închis';hb.insertAdjacentHTML('beforeend',`<div class="${i===td?'now':''}">${d}</div><div class="${i===td?'now':'c'}">${t}</div>`)});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.2});
$$('.card').forEach((c,i)=>{c.style.transitionDelay=i*.1+'s';io.observe(c)});
addEventListener('scroll',()=>document.body.classList.toggle('past',scrollY>innerHeight*.7),{passive:true});
// 3D
const box=$('#gl');if(!window.THREE)return;
let ren;try{ren=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.set(0,0,12);
sc.add(new THREE.HemisphereLight(0xdff4ff,0x070d1c,.9));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(5,6,8);sc.add(dl);
const pl=new THREE.PointLight(0x19e3ff,2,20);pl.position.set(-4,-2,4);sc.add(pl);const pg=new THREE.PointLight(0xffc83d,1.2,20);pg.position.set(4,3,3);sc.add(pg);
const steel=new THREE.MeshStandardMaterial({color:0xc7d3ea,metalness:.9,roughness:.28}),
cyan=new THREE.MeshStandardMaterial({color:0x19e3ff,metalness:.4,roughness:.35,emissive:0x063b45}),
gold=new THREE.MeshStandardMaterial({color:0xffc83d,metalness:.7,roughness:.3}),
dark=new THREE.MeshStandardMaterial({color:0x1f2d57,metalness:.6,roughness:.55});
const G=new THREE.Group();sc.add(G);
// wheel
const W=new THREE.Group();G.add(W);
const tire=new THREE.Mesh(new THREE.TorusGeometry(1.55,.5,24,64),dark);W.add(tire);
const lip=new THREE.Mesh(new THREE.TorusGeometry(1.2,.07,12,64),cyan);lip.position.z=.32;W.add(lip);
const barrel=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.3,48),dark);barrel.rotation.x=Math.PI/2;W.add(barrel);
for(let i=0;i<5;i++){const a=i/5*Math.PI*2,sp=new THREE.Mesh(new THREE.BoxGeometry(.3,1.05,.16),steel);
 sp.position.set(-Math.sin(a)*.72,Math.cos(a)*.72,.15);sp.rotation.z=a;W.add(sp)}
const hub=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.3,32),gold);hub.rotation.x=Math.PI/2;hub.position.z=.22;W.add(hub);
for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3,n=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.1,6),dark);
 n.rotation.x=Math.PI/2;n.position.set(Math.cos(a)*.2,Math.sin(a)*.2,.4);W.add(n)}
// orbiting clutch rings
const R1=new THREE.Mesh(new THREE.TorusGeometry(2.7,.045,10,96),cyan),R2=new THREE.Mesh(new THREE.TorusGeometry(2.45,.03,10,96),gold);
R1.rotation.x=1.1;R2.rotation.y=1.0;G.add(R1);G.add(R2);
// bolts
const bolts=[];for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.1,6),i%2?gold:cyan);
 const an=i/7*Math.PI*2;b.position.set(Math.cos(an)*2.9,Math.sin(an)*1.9,-.8+(i%3)*.5);b.rotation.x=i;bolts.push(b);G.add(b)}
const MOB=()=>innerWidth<900;
function vo(){const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);
if(!MOB()){cam.aspect=w/h;cam.clearViewOffset();G.position.set(2.8,0,0);G.scale.setScalar(1);cam.updateProjectionMatrix();return}
G.position.set(0,0,0);G.scale.setScalar(.8);cam.aspect=w/h;cam.clearViewOffset();cam.updateProjectionMatrix()}
// note: setViewOffset with fullHeight=rh keeps scene framed inside the free band [top,bot]
function vo2(){vo()}
vo2();addEventListener('resize',vo2);new ResizeObserver(vo2).observe(box);new ResizeObserver(vo2).observe($('#htx'));setTimeout(vo2,900);setTimeout(vo2,2000);
let tx=0,ty=0,mx=0,my=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)}},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);if(!vis)return;const t=(performance.now()-t0)/1000;
mx+=(tx-mx)*.05;my+=(ty-my)*.05;const s=Math.min(1,scrollY/innerHeight);
W.rotation.z=-t*.6;R1.rotation.z=t*.5;R2.rotation.x=t*.4;
bolts.forEach((b,i)=>{b.rotation.y=t*(.5+i*.1)});
G.rotation.y=mx*.6+Math.sin(t*.3)*.2;G.rotation.x=my*.3+.15;pl.intensity=1.6+Math.sin(t*3)*.4;
ren.render(sc,cam)})();
})();

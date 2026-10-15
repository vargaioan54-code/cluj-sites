/* Interchim — modele 3D (primitive three.js r149). Fiecare constructor întoarce un "obiect" cu părți care se separă (a -> b)
   și materiale de vopsea care urmează culoarea aleasă. Modele ilustrative, fără logo-uri. */
(function(root){
function build(T){
const PI=Math.PI,sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
/* ---------- starea vopselei (culoare + finisaj), interpolată lin ---------- */
const FIN={
 gloss:{metalness:.18,roughness:.26,clearcoat:1,clearcoatRoughness:.05,iridescence:.001,envMapIntensity:1},
 metal:{metalness:.85,roughness:.34,clearcoat:1,clearcoatRoughness:.1,iridescence:.001,envMapIntensity:1.25},
 pearl:{metalness:.5,roughness:.22,clearcoat:1,clearcoatRoughness:.03,iridescence:.85,envMapIntensity:1.3},
 matte:{metalness:.04,roughness:.9,clearcoat:0,clearcoatRoughness:.6,iridescence:.001,envMapIntensity:.45}};
const Paint={cur:new T.Color(0xc1121f),tgt:new T.Color(0xc1121f),ui:new T.Color(0xff5a64),fin:'metal',
 v:Object.assign({},FIN.metal),tv:Object.assign({},FIN.metal),list:[]};
Paint.set=function(hex,uiHex){this.tgt.set(hex);if(uiHex)this.ui.set(uiHex)};
Paint.setFinish=function(k){if(!FIN[k])return;this.fin=k;this.tv=Object.assign({},FIN[k])};
Paint.snap=function(){this.cur.copy(this.tgt);Object.assign(this.v,this.tv)};
let lastStep=-1;
Paint.step=function(dt,stamp){if(stamp!==undefined){if(stamp===lastStep)return;lastStep=stamp}
 const a=1-Math.exp(-dt*7);this.cur.lerp(this.tgt,a);for(const k in this.tv)this.v[k]+=(this.tv[k]-this.v[k])*a};
Paint.apply=function(list){for(let i=0;i<list.length;i++){const m=list[i];
 if(m.isPointsMaterial||m.isMeshBasicMaterial||m.userData.plain){m.color.copy(m.userData.ui?this.ui:this.cur);continue}
 m.color.copy(this.cur);const src=m.userData.fin?FIN[m.userData.fin]:this.v;
 m.metalness=src.metalness;m.roughness=src.roughness;m.clearcoat=src.clearcoat;m.clearcoatRoughness=src.clearcoatRoughness;m.iridescence=src.iridescence;m.envMapIntensity=src.envMapIntensity}};
function paintMat(fin){const m=new T.MeshPhysicalMaterial({color:0xc1121f,metalness:.85,roughness:.34,clearcoat:1,clearcoatRoughness:.1,iridescence:0,iridescenceIOR:1.35});if(fin)m.userData.fin=fin;return m}
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}

/* ---------- ajutoare de geometrie ---------- */
function kit(SEG){
 const root=new T.Group(),parts=[],V=(x,y,z)=>new T.Vector3(x,y,z);
 const mesh=(g,mat,x,y,z)=>{const m=new T.Mesh(g,mat);m.position.set(x||0,y||0,z||0);return m};
 const box=(w,h,d,mat,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),mat,x,y,z);
 const cylY=(r,h,mat,x,y,z,seg,open)=>mesh(new T.CylinderGeometry(r,r,h,seg||SEG,1,!!open),mat,x,y,z);
 const cylX=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateZ(PI/2);return mesh(g,mat,x,y,z)};
 const cylZ=(r,h,mat,x,y,z,seg)=>{const g=new T.CylinderGeometry(r,r,h,seg||SEG);g.rotateX(PI/2);return mesh(g,mat,x,y,z)};
 const tor=(R,t,mat,x,y,z,rx,ry,arc)=>{const m=mesh(new T.TorusGeometry(R,t,8,SEG,arc||PI*2),mat,x,y,z);m.rotation.x=rx||0;m.rotation.y=ry||0;return m};
 const edges=(m,mat,d)=>{m.add(new T.LineSegments(new T.EdgesGeometry(m.geometry,d||30),mat));return m};
 const add=(o,a,b)=>{o.position.copy(a);root.add(o);parts.push({o:o,a:a,b:b});return o};
 const prof=(pts,depth,bv)=>{const s=new T.Shape();pts.forEach((p,i)=>{if(i)s.lineTo(p[0],p[1]);else s.moveTo(p[0],p[1])});s.closePath();
  const b=bv===undefined?.06:bv;const g=new T.ExtrudeGeometry(s,{depth:depth-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1});g.translate(0,0,-(depth-2*b)/2);return g};
 return{root,parts,V,mesh,box,cylY,cylX,cylZ,tor,edges,add,prof}}
function stdMats(){return{
 tin:new T.MeshStandardMaterial({color:0xd9dde6,metalness:.8,roughness:.32}),
 steel:new T.MeshStandardMaterial({color:0xaab2c2,metalness:.9,roughness:.35}),
 dark:new T.MeshStandardMaterial({color:0x14121f,metalness:.4,roughness:.55}),
 rubber:new T.MeshStandardMaterial({color:0x0c0c10,metalness:.1,roughness:.92}),
 white:new T.MeshStandardMaterial({color:0xf3f3f6,metalness:.1,roughness:.5}),
 grey:new T.MeshStandardMaterial({color:0x9096a3,metalness:.05,roughness:.9}),
 glass:new T.MeshStandardMaterial({color:0x8fb4ff,metalness:.4,roughness:.12,transparent:true,opacity:.34,side:T.DoubleSide,depthWrite:false}),
 edge:new T.LineBasicMaterial({color:0xcfd6ff,transparent:true,opacity:.5}),
 lampF:new T.MeshBasicMaterial({color:0xfff2b8}),lampR:new T.MeshBasicMaterial({color:0xd01a2a}),
 tape:new T.MeshStandardMaterial({color:0xe6d3a0,metalness:.02,roughness:.85}),
 wall:new T.MeshStandardMaterial({color:0xdcd8d0,metalness:0,roughness:.95}),
 cyan:new T.MeshStandardMaterial({color:0x19b5fe,metalness:.2,roughness:.3,emissive:0x053a52}),
 mag:new T.MeshStandardMaterial({color:0xff2fa0,metalness:.2,roughness:.3,emissive:0x520c35}),
 yel:new T.MeshStandardMaterial({color:0xffd60a,metalness:.2,roughness:.3,emissive:0x524500})}}
function mkGlow(){return new T.MeshBasicMaterial({color:0xff5a64,transparent:true,opacity:.9,depthWrite:false})}

/* ================= MAȘINA (hero) — caroserie vopsită live ================= */
function car(SEG){
 const K=kit(SEG),M=stdMats(),body=paintMat(),paintMats=[body],glowMats=[];
 const{root,V,mesh,box,cylZ,cylX,tor,edges,add,prof}=K;
 // platformă rotitoare cu inel luminos
 const plat=new T.Group();plat.add(mesh(new T.CylinderGeometry(5.6,5.8,.28,SEG*2),M.dark,0,-.14,0));
 const gm=mkGlow();gm.userData.ui=1;glowMats.push(gm);
 const ring=mesh(new T.TorusGeometry(5.5,.06,8,SEG*3),gm,0,.02,0);ring.rotation.x=PI/2;plat.add(ring);
 const gm2=mkGlow();gm2.userData.ui=1;gm2.opacity=.35;glowMats.push(gm2);
 const ring2=mesh(new T.TorusGeometry(4.4,.03,8,SEG*3),gm2,0,.02,0);ring2.rotation.x=PI/2;plat.add(ring2);
 root.add(plat);
 const sm0=new T.MeshBasicMaterial({color:0xff5a64,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});sm0.userData.ui=1;glowMats.push(sm0);
 const splash=mesh(new T.RingGeometry(1,1.18,SEG*3),sm0,0,.04,0);splash.rotation.x=-PI/2;root.add(splash);
 const car=new T.Group();root.add(car);car.position.y=.2;
 // caroseria joasă (profil lateral extrudat)
 const low=edges(mesh(prof([[-3.95,.74],[-4.02,1.15],[-3.85,1.58],[-3.1,1.72],[-1.9,1.78],[1.6,1.78],[2.8,1.72],[3.62,1.52],[4.0,1.22],[3.94,.74]],2.8),body),M.edge,35);car.add(low);
 // habitaclu: geam + plafon vopsit + stâlpi
 car.add(edges(mesh(prof([[-2.15,1.76],[-1.3,2.62],[-.75,2.9],[.8,2.9],[2.0,1.76]],2.42,.05),M.glass),M.edge,35));
 car.add(box(1.7,.1,2.36,body,.02,2.95,0));
 [-1,1].forEach(s=>{const p=box(.14,1.2,.1,body,-1.55,2.3,s*1.18);p.rotation.z=.62;car.add(p);const q=box(.14,1.2,.1,body,1.55,2.3,s*1.18);q.rotation.z=-.78;car.add(q)});
 // capotă / portbagaj ca plăci vopsite
 car.add(box(1.7,.08,2.5,body,2.75,1.8,0));car.add(box(1.1,.08,2.5,body,-3.2,1.76,0));
 // bare, oglinzi, mânere, linii de uși, grilă, faruri
 [-1,1].forEach(s=>{car.add(box(.2,.4,2.7,body,s*4.0,.9,0));
  car.add(box(.28,.2,.34,body,1.45,2.05,s*1.62));
  car.add(box(.6,.06,.1,M.steel,.35,1.5,s*1.42));car.add(box(.6,.06,.1,M.steel,-1.3,1.5,s*1.42));
  [-2.2,-.45,1.2].forEach(x=>car.add(box(.03,.95,.03,M.dark,x,1.3,s*1.41)));
  car.add(box(7.0,.08,.03,M.dark,0,.95,s*1.41));
  car.add(edges(box(.14,.26,.7,M.lampF,3.98,1.38,s*.95),M.edge));car.add(edges(box(.14,.24,.7,M.lampR,-4.03,1.42,s*.95),M.edge))});
 car.add(box(.08,.34,1.1,M.dark,4.07,1.02,0));
 // roți: anvelopă, jantă, spițe, butuc, disc de frână
 const wheels=[];
 [[2.5,1.5],[2.5,-1.5],[-2.5,1.5],[-2.5,-1.5]].forEach(q=>{const sg=q[1]>0?1:-1,wg=new T.Group(),sp=new T.Group();
  car.add(cylZ(.8,.12,M.dark,q[0],1.07,q[1]>0?1.39:-1.39,SEG));
  sp.add(mesh(new T.TorusGeometry(.5,.17,10,SEG),M.rubber));
  sp.add(cylZ(.5,.1,M.dark));sp.add(tor(.43,.04,M.steel,0,0,sg*.09));
  for(let i=0;i<5;i++){const b=box(.09,.84,.05,M.steel,0,0,sg*.07);b.rotation.z=i*PI/5;sp.add(b)}
  sp.add(cylZ(.12,.2,M.tin,0,0,sg*.08));wg.add(sp);wheels.push(sp);wg.position.set(q[0],1.07,q[1]);car.add(wg)});
 // pensulă de lumină sub mașină (reflexie)
 const parts=[];
 return{root,car,paintMats,glowMats,body,splash,splashMat:sm0,wheels,parts,
  update(t,dt,o){o=o||{};this.wheels.forEach(w=>w.rotation.z-=dt*1.2);
   const s=o.splash;if(s&&s.t<1){s.t+=dt*1.15;const k=Math.min(1,s.t);splash.scale.setScalar(1+k*5.2);sm0.opacity=(1-k)*(1-k)*.9;body.emissive.copy(Paint.cur);body.emissiveIntensity=.55*(1-k)*(1-k)}
   else{sm0.opacity=0;body.emissiveIntensity=0}
   car.position.y=.2+Math.sin(t*1.3)*.05}}}

/* ================= OBIECTE PENTRU SECȚIUNEA FIXATĂ ================= */
// 1. Cutie de vopsea: mixare la cod — picături de pigment cad în vopseaua care se amestecă
function can(SEG){
 const K=kit(SEG),M=stdMats(),label=paintMat(),disc=paintMat(),paintMats=[label,disc];
 const{root,V,mesh,box,cylY,tor,edges,add}=K;
 const body=new T.Group();body.add(edges(cylY(1.7,3.2,M.tin,0,0,0),M.edge,40));body.add(tor(1.7,.08,M.steel,0,1.6,0,PI/2));body.add(tor(1.7,.08,M.steel,0,-1.6,0,PI/2));
 add(body,V(0,-.5,0),V(0,-3.1,0));
 const lab=cylY(1.74,1.5,label,0,0,0,SEG,true);lab.material.side=T.DoubleSide;add(lab,V(0,-.5,0),V(0,-.7,0));
 const dg=new T.Group();dg.add(cylY(1.6,.16,disc,0,0,0));
 const swirl=new T.Group();const sw=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false});
 [[.55,1.4],[1.05,1.2],[1.45,1.0]].forEach((c,i)=>{const a=tor(c[0],.06,sw,0,.12,0,PI/2,0,PI*c[1]);a.rotation.z=i*2.1;swirl.add(a)});dg.add(swirl);
 add(dg,V(0,1.0,0),V(0,1.3,0));
 const lid=new T.Group();lid.add(cylY(1.78,.26,M.steel,0,0,0));lid.add(tor(1.78,.07,M.tin,0,.13,0,PI/2));lid.add(cylY(.5,.1,M.tin,0,.18,0,16));
 add(lid,V(0,1.25,0),V(0,2.7,0));
 const hd=new T.Group();hd.add(tor(1.78,.05,M.steel,0,0,0,0,0,PI));hd.add(cylY(.2,.4,M.dark,1.78,0,0,10));hd.add(cylY(.2,.4,M.dark,-1.78,0,0,10));
 add(hd,V(0,1.1,0),V(0,3.8,0));
 // picături de pigment (cyan / magenta / galben) care cad
 const drops=[M.cyan,M.mag,M.yel].map((m,i)=>{const d=mesh(new T.SphereGeometry(.2,12,10),m,0,5,0);d.scale.y=1.4;root.add(d);return d});
 root.position.y=-.3;
 return{root,parts:K.parts,paintMats,glowMats:[],size:{h0:5.2,h1:10.6,w0:4.4,w1:4.8},
  update(t,dt,e){swirl.rotation.y+=dt*(1+3*e);
   drops.forEach((d,i)=>{const u=(t*.55+i/3)%1;d.visible=e>.35;d.position.set((i-1)*.7,4.4-(4.4-1.55)*u*u,(i-1)*.15);d.scale.set(1,1.4*(1-.25*u),1)})}}}

// 2. Spray auto: spray la cod — se ridică capacul, apare norul de vopsea
function spray(SEG){
 const K=kit(SEG),M=stdMats(),label=paintMat(),paintMats=[label];
 const{root,V,mesh,box,cylY,tor,edges,add}=K;
 const base=cylY(1.12,.16,M.steel,0,0,0);add(base,V(0,-2.3,0),V(0,-4.7,0));
 const bd=edges(cylY(1.1,3.6,M.tin,0,0,0),M.edge,40);add(bd,V(0,-.5,0),V(0,-2.7,0));
 const lb=cylY(1.14,1.9,label,0,0,0,SEG,true);lb.material.side=T.DoubleSide;add(lb,V(0,-.6,0),V(0,-.4,0));
 const sh=mesh(new T.CylinderGeometry(.5,1.1,.7,SEG),M.tin);add(sh,V(0,1.65,0),V(0,1.3,0));
 const vc=cylY(.5,.14,M.steel,0,0,0,16);add(vc,V(0,2.08,0),V(0,2.1,0));
 const nz=new T.Group();nz.add(cylY(.26,.5,M.dark,0,0,0,14));nz.add(box(.34,.16,.16,M.dark,.2,.15,0));nz.add(box(.1,.1,.1,M.white,.4,.15,0));
 add(nz,V(0,2.45,0),V(0,2.9,0));
 const cp=new T.Group();cp.add(cylY(.62,1.0,M.dark,0,0,0,SEG));cp.add(mesh(new T.SphereGeometry(.62,SEG,8,0,PI*2,0,PI/2),M.dark,0,.5,0));cp.add(tor(.62,.05,M.steel,0,-.5,0,PI/2));
 add(cp,V(0,2.55,0),V(0,4.8,0));
 // nor de vopsea (particule) din duza
 const NP=70,tex=dotTex(),gg=new T.BufferGeometry(),pos=new Float32Array(NP*3),seed=[];let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let i=0;i<NP;i++)seed.push({u:rnd(),v:.45+rnd()*.5,a:rnd()-.5,b:rnd()-.5});
 gg.setAttribute('position',new T.BufferAttribute(pos,3));
 const pm=new T.PointsMaterial({color:0xc1121f,size:.5,map:tex,transparent:true,depthWrite:false,opacity:0});const cloud=new T.Points(gg,pm);cloud.frustumCulled=false;root.add(cloud);
 const pmats=[pm];
 root.position.y=-.4;
 return{root,parts:K.parts,paintMats:paintMats.concat(pmats),glowMats:[],size:{h0:5.6,h1:10.8,w0:3.4,w1:6.6},
  update(t,dt,e){const on=sm((e-.55)*3);pm.opacity=.8*on;const ny=nz.position.y+.15;
   for(let i=0;i<NP;i++){const s=seed[i];s.u+=dt*s.v;if(s.u>1)s.u-=1;const k=s.u;
    pos[i*3]=.5+k*3.2;pos[i*3+1]=ny+s.a*k*1.6;pos[i*3+2]=s.b*k*1.6}
   gg.attributes.position.needsUpdate=true}}}

// 3. Straturi pe un panou de ușă: metal, grund, bază (culoarea), lac
function layers(SEG){
 const K=kit(SEG),M=stdMats(),base=paintMat(),paintMats=[base];
 const{root,V,mesh,box,add}=K;
 const shape=new T.Shape();[[-3.2,-1.5],[3.0,-1.5],[3.3,-1.2],[3.3,.9],[2.2,1.5],[-2.6,1.5],[-3.3,.9],[-3.3,-1.2]].forEach((p,i)=>{if(i)shape.lineTo(p[0],p[1]);else shape.moveTo(p[0],p[1])});shape.closePath();
 const mk=()=>{const g=new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelThickness:.04,bevelSize:.05,bevelSegments:1});g.translate(0,0,-.08);g.rotateX(-PI/2);return g};
 const metal=new T.MeshStandardMaterial({color:0x9aa3b5,metalness:.95,roughness:.38});
 const primer=new T.MeshStandardMaterial({color:0x8b919c,metalness:.05,roughness:.92});
 const clear=new T.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.03,transparent:true,opacity:.3,clearcoat:1,clearcoatRoughness:0,depthWrite:false});
 const ep=new T.LineBasicMaterial({color:0xdfe5ff,transparent:true,opacity:.55});
 const l1=K.edges(mesh(mk(),metal),ep,20);add(l1,V(0,-.3,0),V(0,-3.7,0));
 const l2=K.edges(mesh(mk(),primer),ep,20);add(l2,V(0,-.1,0),V(0,-1.3,0));
 const l3=K.edges(mesh(mk(),base),ep,20);
 // fulgi metalizați în bază
 const NF=90,fg=new T.BufferGeometry(),fp=new Float32Array(NF*3);let sd=5;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let i=0;i<NF;i++){fp[i*3]=(rnd()-.5)*6.2;fp[i*3+1]=.14;fp[i*3+2]=(rnd()-.5)*2.7}
 fg.setAttribute('position',new T.BufferAttribute(fp,3));const fm=new T.PointsMaterial({color:0xffffff,size:.11,transparent:true,opacity:.8,depthWrite:false,blending:T.AdditiveBlending});const flakes=new T.Points(fg,fm);flakes.frustumCulled=false;l3.add(flakes);
 add(l3,V(0,.1,0),V(0,1.3,0));
 const l4=K.edges(mesh(mk(),clear),ep,20);
 const gl=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false});const shine=box(.5,.02,3.2,gl,0,.12,0);shine.rotation.y=.25;l4.add(shine);
 add(l4,V(0,.3,0),V(0,3.7,0));
 root.rotation.x=0;
 return{root,parts:K.parts,paintMats,glowMats:[],size:{h0:5.4,h1:9.4,w0:7.6,w1:7.6},
  update(t,dt,e){shine.position.x=Math.sin(t*.9)*3;gl.opacity=.15+.25*(.5+.5*Math.sin(t*.9));fm.opacity=.45+.4*Math.sin(t*3)}}}

// 4. Perete + rolă + bandă de mascare (vopsele lavabile)
function wall(SEG){
 const K=kit(SEG),M=stdMats(),patch=paintMat('matte'),head=paintMat('matte'),paintMats=[patch,head];
 const{root,V,mesh,box,cylX,cylY,tor,edges,add}=K;
 const w=edges(box(6.4,4.2,.25,M.wall,0,0,0),M.edge,30);add(w,V(0,0,-.5),V(0,0,-3.2));
 const p=box(5.5,3.4,.06,patch,0,0,0);add(p,V(0,0,-.34),V(0,0,-1.5));
 const strips=new T.Group();[-1,1].forEach(s=>{strips.add(box(.2,4.3,.04,M.tape,s*3.0,0,0));strips.add(box(6.5,.2,.04,M.tape,0,s*1.95,0))});
 add(strips,V(0,0,-.33),V(0,0,.1));
 // rola: cap, ax, cadru, mâner
 const rl=new T.Group(),rs=new T.Group();rl.add(rs);
 const hd=new T.Group();hd.add(cylX(.5,2.6,head,0,0,0,SEG));[0,1,2,3,4,5].forEach(i=>{const b=box(2.62,.05,.05,M.white,0,0,0);b.position.y=Math.sin(i*PI/3)*.51;b.position.z=Math.cos(i*PI/3)*.51;b.rotation.x=-i*PI/3;hd.add(b)});
 rs.add(hd);rs.add(cylX(.07,3.1,M.steel,0,0,0,8));
 rs.add(cylY(.06,.9,M.steel,1.5,-.45,0,8));rs.add(cylX(.06,1.6,M.steel,.7,-.9,0,8));rs.add(cylY(.07,.5,M.steel,0,-1.15,0,8));rs.add(cylY(.2,1.2,M.dark,0,-1.95,0,12));
 add(rl,V(-.2,0,.2),V(-.2,.4,2.8));
 // rolă de bandă de mascare
 const tp=new T.Group();const trg=mesh(new T.TorusGeometry(.62,.3,12,SEG),M.tape);tp.add(trg);tp.add(tor(.34,.04,M.steel,0,0,0));
 add(tp,V(2.6,-2.75,.35),V(3.1,-3.0,3.2));
 root.position.y=.55;
 return{root,parts:K.parts,paintMats,glowMats:[],size:{h0:6.2,h1:8.6,w0:7.6,w1:9.6},
  update(t,dt,e){rs.position.set(Math.sin(t*.5)*.5,.35+Math.sin(t*1.1)*.7,0);hd.rotation.x-=dt*(1.5+Math.cos(t*1.1)*1.2);tp.rotation.z+=dt*.6}}}

return{Paint,FIN,paintMat,car,objects:[can,spray,layers,wall],sm}}
root.IMBuild=build;if(typeof module!=='undefined')module.exports=build;
})(typeof window!=='undefined'?window:globalThis);

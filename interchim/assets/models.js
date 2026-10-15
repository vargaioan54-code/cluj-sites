/* Interchim — modele 3D (primitive three.js r149). Fiecare constructor întoarce un "obiect" cu părți care se separă (a -> b)
   și materiale de vopsea care urmează culoarea aleasă. Modele ilustrative, fără logo-uri. */
(function(root){
function build(T){
try{T.ColorManagement.legacyMode=false}catch(e){}
const PI=Math.PI,sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
/* ---------- starea vopselei (culoare + finisaj), interpolată lin ---------- */
const FIN={
 gloss:{metalness:.12,roughness:.2,clearcoat:1,clearcoatRoughness:.03,iridescence:.001,envMapIntensity:.8},
 metal:{metalness:.6,roughness:.3,clearcoat:1,clearcoatRoughness:.06,iridescence:.001,envMapIntensity:1},
 pearl:{metalness:.38,roughness:.2,clearcoat:1,clearcoatRoughness:.03,iridescence:.85,envMapIntensity:1},
 matte:{metalness:.03,roughness:.85,clearcoat:0,clearcoatRoughness:.6,iridescence:.001,envMapIntensity:.55}};
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

/* ================= MAȘINA (hero) — sedan realist, caroserie vopsită live =================
   Caroserie = „loft" de secțiuni (superelipse) pe lungime, habitaclu separat cu geamuri, faruri/stopuri,
   grilă, oglinzi, mânere, linii de ușă, roți cu anvelopă, jantă cu spițe, disc și etrier de frână. Fără resurse externe. */
function carBuild(SEG){
 const hi=SEG>=30,PI2=PI*2;
 const lerp=(a,b,t)=>a+(b-a)*t,cl=(x,a,b)=>Math.max(a,Math.min(b,x));
 const sgp=(v,p)=>(v<0?-1:1)*Math.pow(Math.abs(v),p);
 // curbă netedă (Catmull-Rom) printre puncte [x,y]
 const crv=pts=>{const n=pts.length,m=[];for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)];m.push((b[1]-a[1])/Math.max(1e-6,(b[0]-a[0])))}
  return x=>{if(x<=pts[0][0])return pts[0][1];if(x>=pts[n-1][0])return pts[n-1][1];let i=0;while(x>pts[i+1][0])i++;
   const x0=pts[i][0],x1=pts[i+1][0],h=x1-x0,t=(x-x0)/h,t2=t*t,t3=t2*t,y0=pts[i][1],y1=pts[i+1][1];
   return(2*t3-3*t2+1)*y0+(t3-2*t2+t)*h*m[i]+(-2*t3+3*t2)*y1+(t3-t2)*h*m[i+1]}};
 /* ---- dimensiuni ---- */
 const WH=1.56,xsF=3.0,xeF=4.22,xsR=-3.5,xeR=-4.22,nT=2.8,nB=4,PW=4;
 const S=crv([[-4.22,1.46],[-4.1,1.62],[-3.7,1.74],[-3.0,1.80],[-1.5,1.84],[0,1.82],[1.3,1.77],[2.2,1.68],[3.1,1.56],[3.8,1.43],[4.22,1.18]]);
 const B=crv([[-4.22,.56],[-4.0,.46],[-3.5,.35],[-2.5,.32],[2.5,.32],[3.5,.35],[4.0,.42],[4.22,.50]]);
 const planW=x=>{let d;if(x>xsF){d=(x-xsF)/(xeF-xsF)}else if(x<xsR){d=(xsR-x)/(xsR-xeR)}else return 1;return Math.pow(Math.max(0,1-Math.pow(d,PW)),1/3)};
 const halfW=(x,y)=>{if(x<=xeR||x>=xeF)return 0;const T0=S(x),B0=B(x),yc=(T0+B0)/2,hh=(T0-B0)/2,e=(y-yc)/hh;if(Math.abs(e)>=1)return 0;
  const n=e>=0?nT:nB;return WH*planW(x)*Math.pow(1-Math.pow(Math.abs(e),n),1/n)};
 const yTop=(x,z)=>{const T0=S(x),B0=B(x),yc=(T0+B0)/2,hh=(T0-B0)/2,w=WH*planW(x);const q=Math.min(1,Math.abs(z)/Math.max(1e-6,w));return yc+hh*Math.pow(1-Math.pow(q,nT),1/nT)};
 // habitaclu
 const R=crv([[-3.25,1.60],[-3.0,1.84],[-2.4,2.16],[-1.6,2.50],[-.8,2.69],[0,2.74],[.6,2.70],[1.0,2.50],[1.4,2.22],[1.85,1.86],[2.05,1.62]]);
 const gX0=-3.25,gX1=2.05,WG=1.36,nG=3;
 const gBase=x=>S(x)-.22,gH=x=>Math.max(1e-4,R(x)-gBase(x));
 const GH=(x,ph)=>{const hg=gH(x),s=Math.sin(ph),c=Math.cos(ph);return[x,gBase(x)+hg*Math.pow(Math.max(0,s),2/nG),-WG*sgp(c,2/nG)]}; // ph:0..PI, z<0 -> z>0
 const ghHalfW=(x,y)=>{if(x<=gX0||x>=gX1)return 0;const f=(y-gBase(x))/gH(x);if(f<=0||f>=1)return 0;const sn=Math.pow(f,nG/2);return WG*Math.pow(Math.max(0,1-sn*sn),1/nG)};
 const outerW=(x,y)=>Math.max(halfW(x,y),ghHalfW(x,y));
 /* ---- ajutoare de geometrie ---- */
 const C0=new T.Vector3(0,1.2,0);
 // suprafață parametrică (u,v)∈[0,1]² cu normale prin diferențe finite; off = deplasare pe normală
 function paramGeo(fn,nu,nv,off,wrapV){off=off||0;const pos=[],nor=[],idx=[],V=(a)=>new T.Vector3(a[0],a[1],a[2]),e=1e-3;
  const P=(u,v)=>V(fn(cl(u,0,1),wrapV?((v%1)+1)%1:cl(v,0,1)));
  const N=(u,v)=>{const a=P(u+e,v).sub(P(u-e,v)),b=P(u,v+e).sub(P(u,v-e));const n=new T.Vector3().crossVectors(a,b);if(n.lengthSq()<1e-14){const q=P(u,v);n.set(0,1,0).add(q.sub(C0).normalize().multiplyScalar(.01))}return n.normalize()};
  const m=P(.5,.5),nm=N(.5,.5),sgn=nm.dot(m.clone().sub(C0))<0?-1:1;
  for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const u=i/nu,v=j/nv,p=P(u,v),n=N(u,v).multiplyScalar(sgn);
   if(!(isFinite(p.x)&&isFinite(p.y)&&isFinite(p.z))){p.set(0,1,0)}if(!(isFinite(n.x)&&isFinite(n.y)&&isFinite(n.z)))n.set(0,1,0);
   p.addScaledVector(n,off);pos.push(p.x,p.y,p.z);nor.push(n.x,n.y,n.z)}
  const W=nv+1;
  const mi=Math.floor(nu/2)*W+Math.floor(nv/2),b00=new T.Vector3(pos[mi*3],pos[mi*3+1],pos[mi*3+2]),b10=new T.Vector3(pos[(mi+W)*3],pos[(mi+W)*3+1],pos[(mi+W)*3+2]),b01=new T.Vector3(pos[(mi+1)*3],pos[(mi+1)*3+1],pos[(mi+1)*3+2]);
  const g=b10.sub(b00).cross(b01.sub(b00)),flip=g.dot(new T.Vector3(nor[mi*3],nor[mi*3+1],nor[mi*3+2]))<0;
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*W+j,b=(i+1)*W+j,c=(i+1)*W+j+1,d=i*W+j+1;if(flip){idx.push(a,d,c,a,c,b)}else{idx.push(a,b,c,a,c,d)}}
  const G=new T.BufferGeometry();G.setAttribute('position',new T.Float32BufferAttribute(pos,3));G.setAttribute('normal',new T.Float32BufferAttribute(nor,3));G.setIndex(idx);return G}
 function mergeG(list){const P=[],N=[];list.forEach(g0=>{const g=g0.index?g0.toNonIndexed():g0;P.push(...g.attributes.position.array);N.push(...g.attributes.normal.array)});
  const G=new T.BufferGeometry();G.setAttribute('position',new T.Float32BufferAttribute(P,3));G.setAttribute('normal',new T.Float32BufferAttribute(N,3));return G}
 const rawMat=(o)=>new T.MeshStandardMaterial(o);
 const Mt={
  paint:null,
  glass:new T.MeshPhysicalMaterial({color:0x1a2838,metalness:.15,roughness:.04,transparent:true,opacity:.5,clearcoat:1,clearcoatRoughness:0,envMapIntensity:1.7,depthWrite:false}),
  glassBack:rawMat({color:0x06080c,metalness:.2,roughness:.55}),
  chrome:rawMat({color:0xd5dbe6,metalness:1,roughness:.12}),
  alu:rawMat({color:0xc9cdd6,metalness:1,roughness:.22}),
  black:rawMat({color:0x0b0b0f,metalness:.35,roughness:.5}),
  plastic:rawMat({color:0x15151b,metalness:.1,roughness:.7}),
  rubber:rawMat({color:0x0d0d11,metalness:0,roughness:.9}),
  disc:rawMat({color:0x8b909b,metalness:.9,roughness:.45}),
  cal:rawMat({color:0xd0102a,metalness:.3,roughness:.4}),
  lamp:new T.MeshBasicMaterial({color:0xfff5d6}),
  lampHouse:rawMat({color:0x1b1c24,metalness:1,roughness:.18}),
  lens:new T.MeshPhysicalMaterial({color:0xeaf3ff,metalness:0,roughness:.02,transparent:true,opacity:.16,clearcoat:1,clearcoatRoughness:0,envMapIntensity:1.1,depthWrite:false}),
  tail:rawMat({color:0x4a0610,metalness:.2,roughness:.25,emissive:0xff0a1e,emissiveIntensity:.85}),
  tailGlow:new T.MeshBasicMaterial({color:0xff3a48}),
  plate:rawMat({color:0xe9e9ec,metalness:.05,roughness:.6}),
  gap:new T.MeshBasicMaterial({color:0x05050a})};
 const body=paintMat();Mt.paint=body;
 const paintMats=[body],glowMats=[];
 const root=new T.Group(),car=new T.Group();
 const mesh=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);return o};
 /* ---- caroseria joasă ---- */
 const NX=hi?110:72,NT=hi?80:52,xe0=xeR+2e-5,xe1=xeF-2e-5;
 const bodyFn=(u,v)=>{const x=lerp(xe0,xe1,.5-.5*Math.cos(PI*u)),T0=S(x),B0=B(x),yc=(T0+B0)/2,hh=(T0-B0)/2,w=WH*planW(x),a=v*PI2,c=Math.cos(a),s=Math.sin(a),n=s>=0?nT:nB;
  return[x,yc+hh*sgp(s,2/n),w*sgp(c,2/n)]};
 car.add(mesh(paramGeo(bodyFn,NX,NT,0,true),body));
 [0,1].forEach(e=>{const pos=[],nor=[],idx=[],c=bodyFn(e,0),nx=e?1:-1;pos.push(c[0],(S(c[0])+B(c[0]))/2,0);nor.push(nx,0,0);
  for(let j=0;j<=24;j++){const q=bodyFn(e,j/24);pos.push(q[0],q[1],q[2]);nor.push(nx,0,0)}
  for(let j=1;j<=24;j++){if(e)idx.push(0,j+1,j);else idx.push(0,j,j+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setIndex(idx);const m=mesh(g,body);m.material=body;car.add(m)});
 /* ---- habitaclu: acoperiș/stâlpi vopsiți + geamuri ---- */
 const NGX=hi?90:60,NGT=hi?56:36;
 const ghFn=(u,v)=>GH(lerp(gX0+.002,gX1-.002,u),v*PI);
 car.add(mesh(paramGeo(ghFn,NGX,NGT,0,false),body));
 const f1=.86,fB=x=>cl((S(x)+.06-gBase(x))/gH(x),0,.95);
 const phOf=(f,right)=>{const a=Math.asin(Math.pow(cl(f,0,1),nG/2));return right?PI-a:a};
 function sideWin(xr,xf,off,sg,mat,shrink){ // (x,y-fracție) -> pe peretele lateral
  const fn=(u,v)=>{const x0=xr(v),x1=xf(v),x=lerp(x0,x1,u),lo=fB(x)+(shrink||0),f=lerp(lo,f1-(shrink||0),v);return GH(x,phOf(f,sg>0))};
  car.add(mesh(paramGeo(fn,hi?24:14,hi?12:8,off),mat))}
 function winSet(off,mat,shrink){[-1,1].forEach(sg=>{
   sideWin(v=>-.28,v=>1.50-.55*v,off,sg,mat,shrink);          // geam ușă față
   sideWin(v=>-2.28+.62*v,v=>-.50,off,sg,mat,shrink);         // geam ușă spate
  });
  // parbriz
  const wsFn=(u,v)=>{const x=lerp(1.88,.80,u),ph=lerp(.52,PI-.52,v);return GH(x,ph)};
  car.add(mesh(paramGeo(wsFn,hi?20:12,hi?30:18,off),mat));
  // lunetă
  const rwFn=(u,v)=>{const x=lerp(-2.50,-2.98,u),ph=lerp(.5,PI-.5,v);return GH(x,ph)};
  car.add(mesh(paramGeo(rwFn,hi?10:6,hi?30:18,off),mat))}
 winSet(.006,Mt.glassBack,.006);winSet(.012,Mt.glass,.014);
 // profil cromat sub geamuri
 const tubeAt=(pts,r,mat,seg)=>{const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],p[1],p[2])));const g=new T.TubeGeometry(c,seg||pts.length*3,r,5,false);car.add(mesh(g,mat))};
 [-1,1].forEach(sg=>{const pts=[];for(let i=0;i<=24;i++){const x=lerp(-2.28,1.52,i/24),p=GH(x,phOf(fB(x)-.012,sg>0));pts.push([p[0],p[1],p[2]*1.004])}tubeAt(pts,.016,Mt.chrome,60)});
 /* ---- linii de panou: uși, capotă, portbagaj ---- */
 const sideLine=(x0,k,ya,yb,sg)=>{const pts=[];for(let i=0;i<=18;i++){const y=lerp(ya,yb,i/18),x=x0+k*(y-1),w=outerW(x,y)+.006;pts.push([x,y,sg*w])}tubeAt(pts,.011,Mt.gap,40)};
 [-1,1].forEach(sg=>{sideLine(1.46,-.08,.5,1.88,sg);sideLine(-.30,.0,.5,1.88,sg);sideLine(-2.22,.10,.5,1.88,sg);
  const pts=[];for(let i=0;i<=20;i++){const x=lerp(-2.22,1.46,i/20),y=.5,w=halfW(x,y)+.006;pts.push([x,y,sg*w])}tubeAt(pts,.011,Mt.gap,40);
  // capotă (contur) și portbagaj
  const hs=[];for(let i=0;i<=16;i++){const x=lerp(1.98,3.66,i/16),z=1.10-.12*Math.pow(i/16,2);hs.push([x,yTop(x,z)+.006,sg*z])}tubeAt(hs,.011,Mt.gap,40);
  const ts=[];for(let i=0;i<=16;i++){const x=lerp(-3.04,-3.86,i/16),z=1.10-.06*Math.pow(i/16,2);ts.push([x,yTop(x,z)+.006,sg*z])}tubeAt(ts,.011,Mt.gap,40)});
 {const fr=[];for(let i=0;i<=20;i++){const z=lerp(-1.04,1.04,i/20);fr.push([3.66,yTop(3.66,z)+.006,z])}tubeAt(fr,.011,Mt.gap,40);
  const tr=[];for(let i=0;i<=20;i++){const z=lerp(-1.04,1.04,i/20);tr.push([-3.86,yTop(-3.86,z)+.006,z])}tubeAt(tr,.011,Mt.gap,40)}
 /* ---- capete: suprafață la extremități (față/spate) ---- */
 const endX=(z,y,front)=>{z=Math.abs(z);let lo=front?xsF:xsR,hi2=front?xeF-1e-4:xeR+1e-4;const g=x=>{const yy=cl(y,B(x)+.04,S(x)-.04);return halfW(x,yy)-z};
  for(let k=0;k<36;k++){const m=(lo+hi2)/2;if(g(m)>0)lo=m;else hi2=m}const x=(lo+hi2)/2;return[x,cl(y,B(x)+.04,S(x)-.04)]};
 const endPatch=(front,za,zb,yfn,off,mat,nz,ny)=>{ // yfn(a)=[ybot,ytop]
  const fn=(u,v)=>{const z=lerp(za,zb,u),yy=yfn(u),y=lerp(yy[0],yy[1],v),q=endX(z,y,front);return[q[0],q[1],z]};
  const m=mesh(paramGeo(fn,nz||14,ny||5,off),mat);car.add(m);return m};
 [-1,1].forEach(sg=>{
  // far față: carcasă, lentilă, bandă luminoasă (DRL)
  const zi=.52,zo=1.30,yf=u=>[lerp(.98,1.07,u),lerp(1.19,1.13,u)];
  const zz=(a,b)=>sg>0?[a,b]:[-a,-b];
  let q=zz(zi,zo);
  endPatch(true,q[0],q[1],yf,.006,Mt.lampHouse,hi?22:12,6);
  endPatch(true,sg*(zi+.06),sg*(zo-.05),u=>[lerp(1.01,1.08,u),lerp(1.15,1.12,u)],.012,Mt.lamp,hi?18:10,4);
  endPatch(true,q[0],q[1],yf,.02,Mt.lens,hi?22:12,6);
  endPatch(true,sg*(zi+.1),sg*(zo-.1),u=>[lerp(1.06,1.10,u)-.014,lerp(1.06,1.10,u)+.014],.016,Mt.chrome,10,2);
  // proiector mic jos (ceață)
  endPatch(true,sg*.98,sg*1.24,u=>[.58,.70],.008,Mt.lampHouse,8,4);
  endPatch(true,sg*1.01,sg*1.21,u=>[.60,.68],.013,Mt.lamp,8,3);
  // stop
  const tz=u=>[lerp(1.18,1.10,u),lerp(1.50,1.42,u)];
  endPatch(false,sg*.50,sg*1.30,u=>[lerp(1.20,1.12,u),lerp(1.44,1.52,u)],.006,Mt.tail,hi?22:12,6);
  endPatch(false,sg*.56,sg*1.26,u=>[lerp(1.31,1.26,u),lerp(1.36,1.34,u)],.012,Mt.tailGlow,hi?18:10,3);
  endPatch(false,sg*.50,sg*1.30,u=>[lerp(1.20,1.12,u),lerp(1.44,1.52,u)],.02,Mt.lens,hi?22:12,6);
  // eșapament
  const ex=endX(sg*.92,.66,false);const et=mesh(new T.CylinderGeometry(.09,.09,.3,16,1,true),Mt.chrome);et.rotation.z=PI/2;et.position.set(ex[0]+.02,.62,sg*.92);et.material.side=T.DoubleSide;car.add(et);
  const ei=mesh(new T.CylinderGeometry(.075,.075,.32,14,1,true),Mt.black);ei.rotation.z=PI/2;ei.position.set(ex[0]+.02,.62,sg*.92);ei.material.side=T.DoubleSide;car.add(ei);
 });
 // grilă
 endPatch(true,-.66,.66,u=>[.64,.94],.008,Mt.black,hi?30:16,6);
 for(let i=0;i<5;i++){const y0=.68+i*.052;endPatch(true,-.62,.62,u=>[y0,y0+.022],.016,Mt.chrome,hi?26:14,2)}
 endPatch(true,-.86,.86,u=>[.50,.62],.006,Mt.black,hi?30:16,4);   // priză aer jos
 endPatch(true,-1.0,1.0,u=>[.455,.495],.012,Mt.plastic,hi?30:16,2); // splitter
 // spate: difuzor și plăcuță (fără număr)
 endPatch(false,-.9,.9,u=>[.50,.66],.008,Mt.black,hi?26:14,4);
 endPatch(false,-.5,.5,u=>[.80,.98],.014,Mt.black,10,3);endPatch(false,-.47,.47,u=>[.82,.96],.022,Mt.plate,10,3);
 endPatch(false,-.86,.86,u=>[1.00,1.004+.012],.012,Mt.chrome,hi?26:14,1);
 /* ---- praguri, pasaje de roată, mânere, oglinzi ---- */
 const sideP=(sg,fn,nu,nv,off,mat)=>car.add(mesh(paramGeo((u,v)=>{const q=fn(u,v),w=halfW(q[0],q[1]);return[q[0],q[1],sg*w]},nu,nv,off),mat));
 const WHX=[2.55,-2.55],WR=.64,WZ=1.34,AR=.80;
 [-1,1].forEach(sg=>{
  sideP(sg,(u,v)=>[lerp(-1.72,1.72,u),lerp(.34,.50,v)],hi?34:20,3,.01,Mt.plastic);  // prag lateral
  // pasaje
  WHX.forEach(xw=>{const a0=Math.asin(cl((WR+.0-.34+.0)/AR,0,.95));
   const dfn=(u,v)=>{const a=lerp(-a0,PI+a0,u),r=AR*v;return[xw+r*Math.cos(a),WR+r*Math.sin(a),0]};
   sideP(sg,(u,v)=>{const q=dfn(u,v);return[q[0],Math.max(q[1],B(q[0])+.012),0]},hi?36:22,5,.022,Mt.black);
   const arc=[];for(let i=0;i<=28;i++){const a=lerp(-a0+.03,PI+a0-.03,i/28),x=xw+AR*1.012*Math.cos(a),y=Math.max(WR+AR*1.012*Math.sin(a),B(x)+.015);arc.push([x,y,sg*(halfW(x,y)+.03)])}
   tubeAt(arc,.026,body,56)});
  // mânere
  [.62,-1.30].forEach(x=>{const y=1.60,w=outerW(x,y)+.012;const h=mesh(new T.SphereGeometry(1,14,10),body,x,y,sg*w);h.scale.set(.30,.035,.04);h.rotation.y=0;car.add(h);
   const h2=mesh(new T.SphereGeometry(1,10,8),Mt.black,x,y-.0,sg*(w-.004));h2.scale.set(.33,.045,.045);car.add(h2)});
  // oglindă
  const mx=1.62,my=2.0,mz=sg*1.62;
  const mh=mesh(new T.SphereGeometry(1,hi?20:12,hi?14:8),body,mx,my,mz);mh.scale.set(.25,.14,.13);mh.rotation.y=sg*.18;car.add(mh);
  const mg=mesh(new T.CircleGeometry(.2,20),Mt.glassBack,mx-.03,my,mz-sg*.0);mg.scale.set(.6,.6,1);mg.position.set(mx-.2,my,mz+sg*.006);mg.rotation.y=-PI/2+(-sg*.2);mg.scale.set(.62,.64,1);car.add(mg);
  const st=mesh(new T.CylinderGeometry(.035,.045,.62,8),Mt.black,mx+.02,my-.1,sg*1.30);st.rotation.x=sg*PI/2*.78;st.rotation.z=-.2;car.add(st);
 });
 /* ---- roți ---- */
 const tyreP=[[.465,-.16],[.49,-.215],[.54,-.245],[.595,-.238],[.633,-.205],[.652,-.15],[.658,-.08],[.658,.08],[.652,.15],[.633,.205],[.595,.238],[.54,.245],[.49,.215],[.465,.16]];
 const tyreG=(()=>{const g=new T.LatheGeometry(tyreP.map(p=>new T.Vector2(p[0]-.01,p[1])),hi?64:36);g.rotateX(PI/2);return g})();
 const rimG=(()=>{const P=[[.445,-.13],[.47,-.12],[.47,.10],[.495,.15],[.51,.17],[.485,.18],[.452,.15],[.44,.10],[.44,-.10]].map(p=>new T.Vector2(p[0],p[1]));const g=new T.LatheGeometry(P,hi?56:32);g.rotateX(PI/2);return g})();
 const spokeG=(()=>{const L=[];const sh=new T.Shape();sh.moveTo(.09,-.058);sh.lineTo(.36,-.038);sh.lineTo(.462,-.056);sh.lineTo(.462,.056);sh.lineTo(.36,.038);sh.lineTo(.09,.058);sh.closePath();
  const ex=new T.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:1,steps:1});
  for(let i=0;i<10;i++){const g=ex.clone();g.rotateZ(i*PI2/10);g.translate(0,0,.08-(i%2?.012:0));L.push(g)}return mergeG(L)})();
 const hubG=(()=>{const g=new T.CylinderGeometry(.14,.17,.07,hi?28:16);g.rotateX(PI/2);g.translate(0,0,.08);return g})();
 const boltG=(()=>{const L=[];for(let i=0;i<5;i++){const g=new T.CylinderGeometry(.018,.018,.03,8);g.rotateX(PI/2);const a=i*PI2/5;g.translate(Math.cos(a)*.09,Math.sin(a)*.09,.12);L.push(g)}return mergeG(L)})();
 const discG=(()=>{const g=new T.CylinderGeometry(.40,.40,.035,hi?48:28);g.rotateX(PI/2);g.translate(0,0,-.005);return g})();
 const calG=(()=>{const sh=new T.Shape(),r0=.25,r1=.42,a0=-.40,a1=.40;sh.moveTo(r0*Math.cos(a0),r0*Math.sin(a0));sh.lineTo(r1*Math.cos(a0),r1*Math.sin(a0));
  for(let i=1;i<=10;i++){const a=lerp(a0,a1,i/10);sh.lineTo(r1*Math.cos(a),r1*Math.sin(a))}for(let i=10;i>=0;i--){const a=lerp(a0,a1,i/10);sh.lineTo(r0*Math.cos(a),r0*Math.sin(a))}sh.closePath();
  const g=new T.ExtrudeGeometry(sh,{depth:.12,bevelEnabled:true,bevelThickness:.015,bevelSize:.012,bevelSegments:1});g.translate(0,0,-.075);return g})();
 const wheels=[];
 WHX.forEach(xw=>[-1,1].forEach(sg=>{const wg=new T.Group(),sp=new T.Group();
  sp.add(mesh(tyreG,Mt.rubber));const rm=mesh(rimG,Mt.alu);rm.material=Mt.alu;sp.add(rm);sp.add(mesh(spokeG,Mt.alu));sp.add(mesh(hubG,Mt.chrome));sp.add(mesh(boltG,Mt.black));sp.add(mesh(discG,Mt.disc));
  const cal=mesh(calG,Mt.cal);cal.rotation.z=.55;wg.add(cal);
  wg.add(sp);sp.userData.spin=wheels.length;wg.position.set(xw,WR,sg*WZ);if(sg<0)wg.rotation.y=PI;car.add(wg);wheels.push({sp,sg})}));
 Mt.rubber.side=T.DoubleSide;Mt.alu.side=T.DoubleSide;
 root.add(car);
 /* ---- platformă lucioasă, reflexie, umbră ---- */
 const floorBase=new T.MeshBasicMaterial({color:0x0b0a18,depthWrite:false});
 const floor=mesh(new T.CircleGeometry(5.0,SEG*3),floorBase);floor.rotation.x=-PI/2;floor.position.y=-.004;floor.renderOrder=0;root.add(floor);
 const sheen=new T.MeshPhysicalMaterial({color:0x07060f,metalness:.9,roughness:.45,transparent:true,opacity:.78,clearcoat:0,clearcoatRoughness:.3,depthWrite:false,envMapIntensity:.14});
 const sheenM=mesh(new T.CircleGeometry(5.0,SEG*3),sheen);sheenM.rotation.x=-PI/2;sheenM.position.y=.004;sheenM.renderOrder=5;root.add(sheenM);
 const wall=mesh(new T.CylinderGeometry(5.1,5.1,.3,SEG*3,1,true),Mt.black,0,-.15,0);wall.material=new T.MeshStandardMaterial({color:0x14121f,metalness:.6,roughness:.4,side:T.DoubleSide});root.add(wall);
 const gm=new T.MeshBasicMaterial({color:0xff5a64,transparent:true,opacity:.9,depthWrite:false});gm.userData.ui=1;glowMats.push(gm);
 const ring=mesh(new T.TorusGeometry(4.98,.05,8,SEG*3),gm,0,.01,0);ring.rotation.x=PI/2;root.add(ring);
 const gm2=new T.MeshBasicMaterial({color:0xff5a64,transparent:true,opacity:.35,depthWrite:false});gm2.userData.ui=1;glowMats.push(gm2);
 const ring2=mesh(new T.TorusGeometry(4.05,.025,8,SEG*3),gm2,0,.012,0);ring2.rotation.x=PI/2;root.add(ring2);
 const radTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.55,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)})();
 const poolM=new T.MeshBasicMaterial({color:0xff5a64,map:radTex,transparent:true,opacity:.42,depthWrite:false,blending:T.AdditiveBlending});poolM.userData.ui=1;glowMats.push(poolM);
 const pool=mesh(new T.PlaneGeometry(1,1),poolM);pool.rotation.x=-PI/2;pool.scale.set(10.4,6.2,1);pool.position.y=.008;pool.renderOrder=6;root.add(pool);
 const shM=new T.MeshBasicMaterial({color:0x000000,map:radTex,transparent:true,opacity:.85,depthWrite:false});
 const shd=mesh(new T.PlaneGeometry(1,1),shM);shd.rotation.x=-PI/2;shd.scale.set(10.2,4.9,1);shd.position.y=.014;shd.renderOrder=7;root.add(shd);
 const sm0=new T.MeshBasicMaterial({color:0xff5a64,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});sm0.userData.ui=1;glowMats.push(sm0);
 const splash=mesh(new T.RingGeometry(1,1.18,SEG*3),sm0,0,.04,0);splash.rotation.x=-PI/2;root.add(splash);
 /* reflexia mașinii pe podea (desktop): copie oglindită, decupată prin stencil la discul podelei */
 let mirrorOK=false;const mspin=[];
 if(hi){try{
  floorBase.stencilWrite=true;floorBase.stencilRef=1;floorBase.stencilFunc=T.AlwaysStencilFunc;floorBase.stencilZPass=T.ReplaceStencilOp;
  const mir=new T.Group(),cp=car.clone(true),mp=new Map();
  cp.traverse(o=>{if(o.userData&&o.userData.spin!==undefined)mspin[o.userData.spin]=o;if(o.isMesh){let m=mp.get(o.material);if(!m){m=o.material.clone();m.stencilWrite=true;m.stencilRef=1;m.stencilFunc=T.EqualStencilFunc;m.stencilFail=T.KeepStencilOp;m.stencilZFail=T.KeepStencilOp;m.stencilZPass=T.KeepStencilOp;mp.set(o.material,m);if(o.material===body)paintMats.push(m)}o.material=m;o.renderOrder=1}});
  mir.add(cp);mir.scale.y=-1;root.add(mir);mirrorOK=true;
  }catch(e){mirrorOK=false}}
 return{root,car,paintMats,glowMats,body,splash,splashMat:sm0,wheels,parts:[],mirrorOK,
  update(t,dt,o){o=o||{};this.wheels.forEach(w=>{w.sp.rotation.z-=dt*1.1*w.sg});
   mspin.forEach((m,i)=>{if(m&&this.wheels[i])m.rotation.z=this.wheels[i].sp.rotation.z});
   const s=o.splash;if(s&&s.t<1){s.t+=dt*1.15;const k=Math.min(1,s.t);splash.scale.setScalar(1+k*5.2);sm0.opacity=(1-k)*(1-k)*.9;body.emissive.copy(Paint.cur);body.emissiveIntensity=.35*(1-k)*(1-k)}
   else{sm0.opacity=0;body.emissiveIntensity=0}}}}
function car(SEG){return carBuild(SEG)}

/* ================= OBIECTE PENTRU SECȚIUNEA FIXATĂ ================= */
// 1. Cutie de vopsea: mixare la cod — picături de pigment cad în vopseaua care se amestecă
function can(SEG){
 const K=kit(SEG),M=stdMats(),label=paintMat(),disc=paintMat('gloss'),paintMats=[label,disc];M.tin.side=T.DoubleSide;
 const{root,V,mesh,box,cylY,tor,edges,add}=K;
 const body=new T.Group();body.add(cylY(1.7,3.2,M.tin,0,0,0,SEG,true));body.add(cylY(1.68,.08,M.tin,0,-1.58,0));body.add(tor(1.7,.08,M.steel,0,1.6,0,PI/2));body.add(tor(1.7,.08,M.steel,0,-1.6,0,PI/2));
 add(body,V(0,-.5,0),V(0,-3.1,0));
 const lab=cylY(1.74,1.5,label,0,0,0,SEG,true);lab.material.side=T.DoubleSide;add(lab,V(0,-.5,0),V(0,-.7,0));
 const dg=new T.Group();dg.add(cylY(1.62,.16,disc,0,0,0));
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
 const st={open:false,k:0},size={h0:6.2,h1:11,w0:4.6,w1:4.9};
 return{root,parts:K.parts,paintMats,glowMats:[],size,toggle(){st.open=!st.open;return st.open},get open(){return st.open},
  update(t,dt,e){swirl.rotation.y+=dt*(1+3*e);
   st.k+=((st.open?1:0)-st.k)*Math.min(1,dt*6.5+(dt?0:1));const kk=st.k,ke=kk*kk*(3-2*kk)*(1+.08*Math.sin(kk*PI));
   lid.position.x+=2.35*ke;lid.position.y+=.55*ke;lid.rotation.z=-.95*ke;lid.rotation.x=.12*ke;root.position.x=-1.15*ke;size.w0=4.6+2.4*kk;size.w1=4.9+2.4*kk;
   dg.scale.set(1,1+.0*kk,1);swirl.children.forEach((a,i)=>{a.scale.setScalar(1+.04*Math.sin(t*2.2+i*2)*kk)});
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

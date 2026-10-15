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
 matte:{metalness:.03,roughness:.85,clearcoat:0,clearcoatRoughness:.6,iridescence:.001,envMapIntensity:.55},
 label:{metalness:.05,roughness:.5,clearcoat:.35,clearcoatRoughness:.35,iridescence:.001,envMapIntensity:.7},
 dry:{metalness:.02,roughness:.42,clearcoat:.5,clearcoatRoughness:.25,iridescence:.001,envMapIntensity:.8}};
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
// 1. Cutie de vopsea realistă (tablă, nervuri rulate, etichetă, mâner, capac): mixare la cod
function latheHard(pts,mat,seg,ang){const g=new T.Group();let cur=[pts[0]];const mk=a=>{if(a.length>1)g.add(new T.Mesh(new T.LatheGeometry(a,seg),mat))};
 for(let i=1;i<pts.length;i++){cur.push(pts[i]);if(i<pts.length-1){const a=pts[i].clone().sub(pts[i-1]),b=pts[i+1].clone().sub(pts[i]);const c=a.dot(b)/((a.length()*b.length())||1);if(c<Math.cos(ang)){mk(cur);cur=[pts[i]]}}}
 mk(cur);return g}
function can(SEG,opts){
 opts=opts||{};const hero=!!opts.hero;
 const K=kit(SEG),M=stdMats(),{root,V,mesh,add}=K;
 const W=2.7,D=1.8,H=4.2,RC=.17,HB=H/2,CS=SEG>=28?8:5,HI=SEG>=28;
 const front=paintMat('label'),lidM=paintMat('label'),disc=paintMat('gloss'),dry=paintMat('dry'),paintMats=[front,lidM,disc,dry];
 const black=new T.MeshPhysicalMaterial({color:0x0a0a0c,metalness:0,roughness:.6,clearcoat:.12,clearcoatRoughness:.5,envMapIntensity:.2,specularIntensity:.5,side:T.DoubleSide});
 const silver=new T.MeshStandardMaterial({color:0xe2e6ee,metalness:1,roughness:.26,envMapIntensity:1.4});
 const noray=m=>{m.raycast=function(){};return m};
 const wood=new T.MeshStandardMaterial({color:0xb98a54,metalness:0,roughness:.6});
 const bristle=new T.MeshStandardMaterial({color:0xcdbf9f,metalness:0,roughness:.9});
 const shTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.45,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)})();
 /* ---- geometrie: dreptunghi rotunjit (contur), inel, prismă ---- */
 const rr=(w,d,r)=>{const s=new T.Shape(),x=w/2,y=d/2;r=Math.max(.02,Math.min(r,x-.01,y-.01));
  s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.absarc(x-r,-y+r,r,-PI/2,0,false);s.lineTo(x,y-r);s.absarc(x-r,y-r,r,0,PI/2,false);s.lineTo(-x+r,y);s.absarc(-x+r,y-r,r,PI/2,PI,false);s.lineTo(-x,-y+r);s.absarc(-x+r,-y+r,r,PI,PI*1.5,false);return s};
 const ringG=(ow,od,orr,iw,id,ir,h,b)=>{const s=rr(ow-2*b,od-2*b,orr-b);if(iw>0)s.holes.push(rr(iw+2*b,id+2*b,ir+b));
  const g=new T.ExtrudeGeometry(s,{depth:Math.max(.002,h-2*b),bevelEnabled:b>0,bevelThickness:b,bevelSize:b,bevelSegments:1,curveSegments:CS,steps:1});
  g.rotateX(-PI/2);g.translate(0,-(h/2-b),0);return g};
 const prism=(w,d,r,h,N)=>{const P=[],Nn=[],I=[],c=[[w/2-r,d/2-r,0],[-(w/2-r),d/2-r,PI/2],[-(w/2-r),-(d/2-r),PI],[w/2-r,-(d/2-r),PI*1.5]];const ring=[];
  c.forEach(q=>{for(let k=0;k<=N;k++){const a=q[2]+PI/2*k/N;ring.push([q[0]+r*Math.cos(a),q[1]+r*Math.sin(a),Math.cos(a),Math.sin(a)])}});
  ring.forEach(p=>{P.push(p[0],-h/2,p[1],p[0],h/2,p[1]);Nn.push(p[2],0,p[3],p[2],0,p[3])});
  const n=ring.length;for(let i=0;i<n;i++){const j=(i+1)%n,a=i*2,b=i*2+1,c2=j*2,d2=j*2+1;I.push(a,c2,b,b,c2,d2)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(P,3));g.setAttribute('normal',new T.Float32BufferAttribute(Nn,3));g.setIndex(I);return g};
 /* ---- textura frontală: corp negru mat + panou diagonal + etichetă (alb = culoarea cutiei) ---- */
 const PW=W-2*RC,PH=H;
 const ftex=(()=>{const cw=HI?1024:768,ch=cw*2,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d');
  x.setTransform(cw/PW,0,0,ch/PH,0,0);x.fillStyle='#101013';x.fillRect(0,0,PW,PH);
  const poly=a=>{x.beginPath();a.forEach((q,i)=>i?x.lineTo(q[0]*PW,q[1]*PH):x.moveTo(q[0]*PW,q[1]*PH));x.closePath()};
  const A=[[0,0],[1,0],[1,.24],[.72,.39],[.16,.42],[0,.49]],B=[[.16,.57],[.88,.57],[.88,.77],[.32,.82],[0,1],[0,.82],[.16,.78]];
  x.fillStyle='#fff';poly(A);x.fill();poly(B);x.fill();
  x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=.008;poly(A);x.stroke();poly(B);x.stroke();
  x.setTransform(1,0,0,1,0,0);const n=cw*ch/160;for(let i=0;i<n;i++){x.fillStyle=Math.random()<.5?'rgba(0,0,0,.05)':'rgba(255,255,255,.035)';x.fillRect(Math.random()*cw,Math.random()*ch,2,2)}
  const t=new T.CanvasTexture(c);t.anisotropy=4;try{t.encoding=T.sRGBEncoding}catch(e){}return t})();
 front.map=ftex;
 /* ---- insigne: scut, pensulă, picătură (iconițe simple, fără logo) ---- */
 const itex=(()=>{const cw=HI?1024:768,ch=cw/4,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d');
  x.setTransform(cw/PW,0,0,ch/.5,0,0);
  const IC=['M12 3 L19 6 V12 C19 16.5 15.8 19.8 12 21 C8.2 19.8 5 16.5 5 12 V6 Z M12 6 V18 M8.4 8.4 L12 7 L15.6 8.4','M5 20 C5 16 7 14 9 13.5 L11.5 16 C10.5 18 8.5 20 5 20Z M10.5 14.5 L18.5 5.5 L20 7 L12 15.5Z','M12 4 C12 4 6.5 10.5 6.5 14.5 A5.5 5.5 0 0 0 17.5 14.5 C17.5 10.5 12 4 12 4Z M9.5 14 A2.5 2.5 0 0 0 12 16.6'];
  [.28,.52,.75].forEach((fx,k)=>{const cx=fx*PW,cy=.25;x.fillStyle='#0a0a0c';x.beginPath();x.arc(cx,cy,.15,0,PI*2);x.fill();x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=.005;x.stroke();
   x.save();x.translate(cx-.105,cy-.105);x.scale(.21/24,.21/24);x.strokeStyle='#ece8df';x.lineWidth=1.7;x.lineJoin='round';x.lineCap='round';x.stroke(new Path2D(IC[k]));x.restore()});
  const t=new T.CanvasTexture(c);t.anisotropy=4;try{t.encoding=T.sRGBEncoding}catch(e){}return t})();
 /* ---- wordmark INTERCHIM + numele culorii (doar text), redesenat când se schimbă ---- */
 const nc=document.createElement('canvas');nc.width=1024;nc.height=512;const nx=nc.getContext('2d');
 const ntex=new T.CanvasTexture(nc);ntex.anisotropy=4;try{ntex.encoding=T.sRGBEncoding}catch(e){}
 let nkey='';
 function drawName(name){const L=Paint.tgt,lum=.2126*L.r+.7152*L.g+.0722*L.b,dark=lum>.2,key=name+(dark?'d':'l');if(key===nkey)return;nkey=key;
  nx.clearRect(0,0,1024,512);nx.textAlign='center';nx.textBaseline='middle';nx.fillStyle=dark?'#0b0b0d':'#f4f1ea';
  try{nx.letterSpacing='22px'}catch(e){}nx.font='800 60px system-ui,Segoe UI,sans-serif';nx.fillText('INTERCHIM',518,129);
  try{nx.letterSpacing='0px'}catch(e){}let fs=150;do{nx.font='800 '+fs+'px system-ui,Segoe UI,sans-serif';fs-=6}while(nx.measureText(name).width>940&&fs>50);nx.fillText(name,512,383);ntex.needsUpdate=true}
 drawName('Roșu');
 const decal=(map,w,h,z,flip)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:map,transparent:true,roughness:.55,metalness:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));m.position.z=z;if(flip)m.rotation.y=PI;return noray(m)};
 /* ---- corp ---- */
 const bodyG=new T.Group();
 bodyG.add(mesh(prism(W,D,RC,H,HI?6:4),black));
 [1,-1].forEach(sg=>{const f=mesh(new T.PlaneGeometry(PW,PH),front);f.position.z=sg*(D/2+.004);if(sg<0)f.rotation.y=PI;bodyG.add(f);
  const ic=decal(itex,PW,.5,0,sg<0);ic.position.set(0,HB-.70*PH,sg*(D/2+.008));bodyG.add(ic);
  const nm=decal(ntex,2.2,1.1,0,sg<0);nm.position.set(0,HB-.18*PH,sg*(D/2+.008));bodyG.add(nm)});
 const bot=mesh(new T.ShapeGeometry(rr(W-.04,D-.04,RC-.02),CS),black);bot.rotation.x=-PI/2;bot.position.y=-HB+.1;bodyG.add(bot);
 bodyG.add(mesh(ringG(W+.14,D+.14,RC+.07,W-.12,D-.12,RC-.05,.09,.02),silver,0,HB-.01,0));
 bodyG.add(mesh(ringG(W+.12,D+.12,RC+.06,W-.2,D-.2,RC-.1,.1,.03),silver,0,-HB+.015,0));
 add(bodyG,V(0,0,0),V(0,-2.1,0));
 /* ---- vopseaua dinăuntru: lucioasă, cu undă + menisc ---- */
 const yL=HB-.22,dg=new T.Group();
 const pg=new T.PlaneGeometry(W-.4,D-.4,HI?30:20,HI?18:12);pg.rotateX(-PI/2);const pp=pg.attributes.position,rr2=new Float32Array(pp.count);for(let i=0;i<pp.count;i++)rr2[i]=Math.hypot(pp.getX(i),pp.getZ(i)*1.5);
 dg.add(new T.Mesh(pg,disc));dg.add(mesh(ringG(W-.08,D-.08,RC-.04,W-.42,D-.42,RC-.2,.05,.012),disc,0,.01,0));
 const swirl=new T.Group(),sw=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,depthWrite:false});
 [[.5,1.4],[.85,1.2],[1.15,1.0]].forEach((c,i)=>{const a=K.tor(c[0],.035,sw,0,.045,0,PI/2,0,PI*c[1]);a.rotation.z=i*2.1;swirl.add(a)});swirl.scale.set(1,1,.6);dg.add(swirl);
 add(dg,V(0,yL,0),V(0,2.2,0));
 /* ---- capac slip-on: fustă + placă + margine ridicată (treaptă), amprentă în relief ---- */
 const lidP=new T.Group(),lidO=new T.Group(),lidT=new T.Group(),lid=new T.Group();
 const wl=W+.1,dl=D+.1,rl=RC+.05,LH=.42,LTOP=.465;
 lid.add(mesh(ringG(wl,dl,rl,wl-.12,dl-.12,rl-.06,LH,.015),lidM,0,LH/2,0));
 lid.add(mesh(ringG(wl,dl,rl,0,0,0,.07,.02),lidM,0,LH-.035,0));
 lid.add(mesh(ringG(wl-.04,dl-.04,rl-.02,wl-.32,dl-.32,rl-.14,.05,.012),lidM,0,LH+.02,0));
 const etex=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');x.textAlign='center';x.textBaseline='middle';
  const draw=(ox,oy,col)=>{x.strokeStyle=col;x.fillStyle=col;x.lineWidth=5;x.beginPath();if(x.roundRect)x.roundRect(80+ox,70+oy,864,372,52);else x.rect(80+ox,70+oy,864,372);x.stroke();
   try{x.letterSpacing='26px'}catch(e){}x.font='800 92px system-ui,Segoe UI,sans-serif';x.fillText('INTERCHIM',524+ox,256+oy)};
  draw(4,5,'rgba(0,0,0,.34)');draw(-2,-3,'rgba(255,255,255,.4)');
  const t=new T.CanvasTexture(c);t.anisotropy=4;return t})();
 const em=new T.Mesh(new T.PlaneGeometry(2.3,1.15),new T.MeshBasicMaterial({map:etex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));em.rotation.x=-PI/2;em.position.y=LH+.003;noray(em);lid.add(em);
 const ug=new T.CircleGeometry(1,40);{const up=ug.attributes.position;for(let i=1;i<up.count;i++){const a=Math.atan2(up.getY(i),up.getX(i)),f=.8+.14*Math.sin(a*3+1)+.06*Math.sin(a*7);up.setXY(i,up.getX(i)*f,up.getY(i)*f)}}
 const und=new T.Mesh(ug,disc);und.rotation.x=PI/2;und.scale.set(1.08,.66,1);und.position.set(0,LH-.073,0);lid.add(und);
 [[-.95,.2,.3],[.8,-.1,.22]].forEach(s=>{const u2=new T.Mesh(ug,dry);u2.rotation.x=PI/2;u2.scale.set(s[2],s[2]*.8,1);u2.position.set(s[0],LH-.074,s[1]);lid.add(u2)});
 lidT.add(lid);lidO.add(lidT);lidP.add(lidO);
 const LY0=HB+.04;add(lidP,V(0,LY0,0),V(0,4.2,0));
 /* poziția capacului scos: culcat cu fața interioară în sus, rezemat de cutie */
 const al=.42,phi=PI-al,cph=Math.cos(phi),sph=Math.sin(phi),hw=wl/2;
 let mnx=1e9,mxx=-1e9,mny=1e9;[[-hw,0],[hw,0],[-hw,LTOP],[hw,LTOP]].forEach(q=>{const xx=q[0]*cph-q[1]*sph,yy=q[0]*sph+q[1]*cph;mnx=Math.min(mnx,xx);mxx=Math.max(mxx,xx);mny=Math.min(mny,yy)});
 const FL=-HB-.03,rest={x:W/2+.1-mnx,y:FL-mny+.01,z:.25,ry:-.32,rz:-(PI+al)};
 const LEFT=1.6,RIGHT=rest.x+mxx+.15,TOTAL=LEFT+RIGHT,SHIFT=(RIGHT-LEFT)/2;
 /* pensulă sprijinită pe marginea cutiei deschise */
 const br=new T.Group();
 const bh=new T.Mesh(new T.CylinderGeometry(.06,.09,2.5,10),wood);bh.rotation.z=-PI/2;bh.position.x=1.55+1.25-.2;br.add(bh);
 const fe=new T.Mesh(new T.CylinderGeometry(.13,.12,.55,12),silver);fe.rotation.z=-PI/2;fe.position.x=.78;br.add(fe);
 const bs=new T.Mesh(new T.CylinderGeometry(.13,.15,.55,12),bristle);bs.rotation.z=-PI/2;bs.scale.set(1,1,.42);bs.position.x=.28;br.add(bs);
 const bt=new T.Mesh(new T.CylinderGeometry(.12,.13,.3,12),dry);bt.rotation.z=-PI/2;bt.scale.set(1,1,.42);bt.position.x=.06;br.add(bt);
 br.rotation.z=.34;br.rotation.y=PI;br.visible=false;root.add(br);
 const spin=new T.Group();root.add(spin);[bodyG,dg].forEach(g=>spin.add(g));
 /* umbre de contact + reflexie colorată pe podea */
 const shM=new T.MeshBasicMaterial({color:0x000000,map:shTex,transparent:true,opacity:.75,depthWrite:false});
 const sh=noray(mesh(new T.PlaneGeometry(1,1),shM));sh.rotation.x=-PI/2;sh.scale.set(5.2,3.8,1);sh.position.y=FL+.01;sh.renderOrder=2;root.add(sh);
 const shL=noray(mesh(new T.PlaneGeometry(1,1),shM.clone()));shL.rotation.x=-PI/2;shL.scale.set(3.6,2.2,1);shL.position.y=FL+.012;shL.renderOrder=2;shL.material.opacity=0;root.add(shL);
 const poolM=new T.MeshBasicMaterial({color:0xc1121f,map:shTex,transparent:true,opacity:.3,depthWrite:false,blending:T.AdditiveBlending});paintMats.push(poolM);
 const pool=noray(mesh(new T.PlaneGeometry(1,1),poolM));pool.rotation.x=-PI/2;pool.scale.set(5.8,4.4,1);pool.position.y=FL+.006;pool.renderOrder=1;root.add(pool);
 const drops=[M.cyan,M.mag,M.yel].map(m=>{const d=mesh(new T.SphereGeometry(.2,12,10),m,0,5,0);d.scale.y=1.4;root.add(d);d.visible=false;return d});
 root.position.y=-.2;
 const st={open:false,k:0},size={h0:5.9,h1:10,w0:3.4,w1:3.7};
 const lidA=V(0,LY0,0),lidB=V(0,4.2,0);let rippleAcc=0;
 const sm2=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
 const angd=(a,b)=>{let d=(a-b)%(PI*2);if(d>PI)d-=PI*2;if(d<-PI)d+=PI*2;return d};
 return{root,parts:K.parts,paintMats,glowMats:[],size,spinner:spin,
  toggle(){st.open=!st.open;return st.open},get open(){return st.open},setOpen(v){st.open=!!v},setName:drawName,
  update(t,dt,e){e=e||0;swirl.rotation.y+=dt*(1+3*e);swirl.visible=e>.05||st.k>.05;
   st.k+=((st.open?1:0)-st.k)*Math.min(1,dt*3.2+(dt?0:1));const kk=st.k,ke=kk*kk*(3-2*kk),s=ke*(1-e);
   const cy=lidA.y+(lidB.y-lidA.y)*e,sx=sm2((s-.12)/.88),sr=sm2((s-.06)/.8),spy=spin.rotation.y;
   lidP.position.set(rest.x*sx,cy+(rest.y-cy)*sx+Math.sin(PI*Math.min(1,s*1.15))*1.5,rest.z*sx);
   lidO.rotation.y=rest.ry+(1-sr)*angd(spy,rest.ry);lidT.rotation.z=rest.rz*sr;
   root.position.x=-SHIFT*ke;
   size.w0=3.4+(TOTAL-3.4)*kk;size.w1=size.w0+.3;
   br.visible=ke>.04;br.scale.setScalar(Math.max(.001,ke*.56));br.position.set(.3,1.98+.9*(1-ke),.15);
   shL.material.opacity=.7*s;shL.position.x=rest.x*sx;shL.position.z=rest.z*sx;sh.material.opacity=.75*(1-.8*e);pool.material.opacity=.3*(1-e);
   if(kk>.04&&e<.5){rippleAcc+=dt;if(rippleAcc>.03||!dt){rippleAcc=0;for(let i=0;i<rr2.length;i++){const r=rr2[i];pp.setY(i,.025*Math.sin(r*7.5-t*3.4)*Math.exp(-r*.7)*(.7+.3*Math.sin(t*.6)))}pp.needsUpdate=true;pg.computeVertexNormals()}}
   drops.forEach((d,i)=>{const u=(t*.55+i/3)%1;d.visible=e>.35;d.position.set((i-1)*.7,dg.position.y+3.2-3.1*u*u,(i-1)*.15);d.scale.set(1,1.4*(1-.25*u),1)})}}}

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

return{Paint,FIN,paintMat,car,can:(S)=>can(S,{hero:true}),objects:[(S)=>can(S),spray,layers,wall],sm}}
root.IMBuild=build;if(typeof module!=='undefined')module.exports=build;
})(typeof window!=='undefined'?window:globalThis);

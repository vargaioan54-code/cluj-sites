(function(){
'use strict';
var C=window.RAFT_COLORS||[],body=document.body,root=document.documentElement;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var mobMQ=window.matchMedia('(max-width:899px)');
var SP=['#C8102E','#F26A1B','#F7C600','#2E8B3D','#14A3A1','#1F5FBF','#6B3FA0','#E8579A'];
var WP=['#1F5FBF','#F7C600','#C8102E','#2E8B3D','#F26A1B','#6B3FA0','#14A3A1','#E8579A'];
var PI=Math.PI;
function clamp01(v){return v<0?0:v>1?1:v;}
function ease(t){t=clamp01(t);return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
function easeS(t){t=clamp01(t);return .5-.5*Math.cos(PI*t);}
function lerp(a,b,t){return a+(b-a)*t;}
function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function rgb2hex(a){return '#'+a.map(function(v){return ('0'+Math.max(0,Math.min(255,Math.round(v))).toString(16)).slice(-2);}).join('');}
function mix(a,b,t){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t]);}
function rgba(h,a){var x=hex2rgb(h);return 'rgba('+x[0]+','+x[1]+','+x[2]+','+a+')';}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function nameOf(h){for(var i=0;i<C.length;i++)if(C[i].h.toLowerCase()===h.toLowerCase())return C[i].n;return '';}
function title(n){return n?n.charAt(0)+n.slice(1).toLowerCase():'';}
function spec(t){var u=(t/3.2)%SP.length,i=Math.floor(u);return mix(SP[i],SP[(i+1)%SP.length],easeS(u-i));}
function silver(c,x0,x1){var g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#6f757c');g.addColorStop(.12,'#c9ced3');g.addColorStop(.28,'#f7f9fa');g.addColorStop(.48,'#b4b9bf');g.addColorStop(.7,'#e6e9ec');g.addColorStop(.9,'#9ba1a8');g.addColorStop(1,'#6f757c');return g;}
function readPick(){if(body.classList.contains('picked')){var h=(body.style.getPropertyValue('--c')||'').trim();if(/^#[0-9a-f]{6}$/i.test(h))return h;}return null;}
function cycCol(k,off){var p=readPick();return p||SP[((k+(off||0))%SP.length+SP.length)%SP.length];}
/* noise pattern */
var noiseC=(function(){var c=document.createElement('canvas');c.width=c.height=128;var g=c.getContext('2d');for(var i=0;i<900;i++){var l=Math.random()<.5;g.fillStyle=l?'rgba(255,255,255,'+(.05+Math.random()*.1)+')':'rgba(0,0,0,'+(.04+Math.random()*.09)+')';g.fillRect(Math.random()*128,Math.random()*128,1+Math.random()*1.6,1+Math.random()*1.6);}return c;})();
var gx=null;
function noisePat(c){return c.createPattern(noiseC,'repeat');}

/* ---------- scenes ---------- */
var scenes=[],RF=window.RaftFX={scenes:scenes,hold:false};
function mkScene(id,draw,o){
 var cv=document.getElementById(id);if(!cv||!cv.getContext)return null;
 var s={id:id,cv:cv,ctx:cv.getContext('2d'),draw:draw,w:0,h:0,dpr:1,vis:false,clock:0,fig:cv.closest('.fig'),still:o.still,cname:'',cur:'#888',init:o.init};
 s.lab=s.fig&&s.fig.querySelector('[data-cn]');
 function size(){var r=cv.getBoundingClientRect();if(!r.width)return;s.dpr=Math.min(window.devicePixelRatio||1,2);s.w=r.width;s.h=r.height;cv.width=Math.round(r.width*s.dpr);cv.height=Math.round(r.height*s.dpr);if(s.vis||reduce)render(s);}
 s.size=size;
 if(window.ResizeObserver)new ResizeObserver(size).observe(cv);else window.addEventListener('resize',size);
 if('IntersectionObserver' in window){new IntersectionObserver(function(en){var v=en[0].isIntersecting;if(v&&!s.vis){if(!reduce)s.clock=0;if(s.reset)s.reset();}s.vis=v;if(v)render(s);},{threshold:.15}).observe(cv);}else{s.vis=true;}
 cv.addEventListener('pointerup',function(){if(s.tap)s.tap();else{s.clock=0;if(s.reset)s.reset();}if(reduce)render(s);});
 if(o.init)o.init(s);
 size();scenes.push(s);return s;
}
function render(s){
 if(!s.w)return;
 var c=s.ctx;c.setTransform(s.dpr,0,0,s.dpr,0,0);c.clearRect(0,0,s.w,s.h);c.globalAlpha=1;
 s.draw(s,c,reduce?s.still:s.clock);
}
function fit(s,c,W,H){var k=Math.min(s.w/W,s.h/H);c.translate((s.w-W*k)/2,(s.h-H*k)/2);c.scale(k,k);return k;}

/* ===== MIXER ===== */
var MIXL=10.6,TINT=['#d3243a','#f6c40f','#2a68c9','#e8579a'],NZX=[160,187,213,240],BASE='#ecebe4';
var DROPS=[];(function(){for(var k=0;k<4;k++)for(var j=0;j<3;j++)DROPS.push({k:k,x:NZX[k],rel:.35+k*.5+j*1.05+(k%2)*.12});})();
function drawMix(s,c,t){
 var cyc=Math.floor(t/MIXL),lt=t-cyc*MIXL,col=cycCol(cyc,s.off||0);
 s.cur=col;s.cname=title(nameOf(col));
 fit(s,c,400,300);
 var fa=Math.min(1,lt/.4,(MIXL-lt)/.5);fa=clamp01(fa);c.globalAlpha=fa;
 var shAmp=0;if(lt>5.7&&lt<8.2)shAmp=Math.min(1,(lt-5.7)/.35,(8.2-lt)/.3);
 var dx=Math.sin(lt*95)*3.1*shAmp,dy=Math.sin(lt*121)*1.7*shAmp;
 var mixP=clamp01((lt-5.9)/2.0);
 /* floor */
 var g=c.createLinearGradient(0,258,0,300);g.addColorStop(0,'#2a2d33');g.addColorStop(1,'#14161a');c.fillStyle=g;c.fillRect(0,258,400,42);
 c.fillStyle='rgba(255,255,255,.14)';c.fillRect(0,258,400,1.5);
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(200+dx*.5,262,86,6,0,0,PI*2);c.fill();
 /* posts */
 c.fillStyle='rgba(120,128,138,.35)';rr(c,108,60,9,200,3);c.fill();rr(c,283,60,9,200,3);c.fill();
 c.fillStyle='rgba(255,255,255,.12)';c.fillRect(110,60,2,200);c.fillRect(285,60,2,200);
 /* assembly */
 c.save();c.translate(dx,dy);
 /* bottom plate */
 rr(c,126,246,148,11,3);c.fillStyle='#3a3f46';c.fill();c.fillStyle='rgba(255,255,255,.2)';c.fillRect(129,247,142,1.4);
 /* tin cutaway */
 var L=147,R=253,TOP=156,BOT=239;
 c.fillStyle='rgba(8,10,13,.72)';c.fillRect(L,TOP-2,R-L,BOT-TOP+2);
 /* level + drops */
 var landed=0,lvl;
 DROPS.forEach(function(d){landed+=ease((lt-(d.rel+.5))/.3);});
 lvl=.30+.024*landed;
 var sy=BOT-lvl*(BOT-TOP);
 var lc=mix(BASE,col,mixP);
 /* liquid */
 c.save();c.beginPath();c.rect(L,TOP-2,R-L,BOT-TOP+2);c.clip();
 var amp=shAmp*4.2+ (lt>8.2&&lt<9?Math.max(0,(9-lt))*1.2:0);
 c.beginPath();c.moveTo(L,BOT);
 for(var x=L;x<=R;x+=4){var yy=sy+Math.sin(x*.11+lt*26)*amp*.8+Math.sin(x*.05-lt*15)*amp*.6+Math.sin(lt*3+x*.04)*.7;c.lineTo(x,yy);}
 c.lineTo(R,BOT);c.closePath();
 var lg=c.createLinearGradient(0,sy-6,0,BOT);lg.addColorStop(0,mix(lc,'#ffffff',.18));lg.addColorStop(.25,lc);lg.addColorStop(1,mix(lc,'#000000',.25));
 c.fillStyle=lg;c.fill();
 /* blobs */
 c.save();c.clip();
 DROPS.forEach(function(d,i){
  var a=lt-(d.rel+.5);if(a<0)return;
  var col2=TINT[d.k];
  var gr=clamp01(a/.5);
  var bx=d.x+Math.sin(i*2.3)*6,by=sy+4+Math.min(a,3)*9;
  var sw=clamp01((lt-5.6)/2.3);
  var ang=(lt-5.6)*(7+i*.5)*(shAmp>0?1:.2)+i;
  var rad=(1-sw)*18;
  var cx=lerp(bx,200,sw*.8)+Math.cos(ang)*rad*.6, cy=lerp(by,(sy+BOT)/2,sw*.9)+Math.sin(ang)*rad*.7;
  var al=.95*Math.pow(1-mixP,1.3);if(al<=.01)return;
  var r=lerp(3,15+ (i%3)*2,gr)+sw*5;
  var rg=c.createRadialGradient(cx,cy,0,cx,cy,r);rg.addColorStop(0,rgba(col2,al));rg.addColorStop(.6,rgba(col2,al*.55));rg.addColorStop(1,rgba(col2,0));
  c.fillStyle=rg;c.beginPath();c.arc(cx,cy,r,0,PI*2);c.fill();
 });
 c.restore();
 /* surface highlight */
 c.fillStyle='rgba(255,255,255,.22)';c.fillRect(L+4,sy+2,R-L-8,1.3);
 c.restore();
 /* glass reflection */
 var rf=c.createLinearGradient(L,0,R,0);rf.addColorStop(0,'rgba(255,255,255,.10)');rf.addColorStop(.25,'rgba(255,255,255,0)');rf.addColorStop(1,'rgba(255,255,255,.04)');c.fillStyle=rf;c.fillRect(L,TOP,R-L,BOT-TOP);
 /* walls */
 c.fillStyle=silver(c,140,260);c.fillRect(140,150,7,96);c.fillRect(253,150,7,96);c.fillRect(140,239,120,7);
 c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.strokeRect(140.5,150.5,119,95);
 /* rim back arc */
 c.strokeStyle='#cfd4d9';c.lineWidth=3;c.beginPath();c.ellipse(200,150,62,8,0,PI,PI*2);c.stroke();
 c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=1;c.beginPath();c.ellipse(200,150,63.5,9.5,0,PI,PI*2);c.stroke();
 /* lid */
 var lidP=ease((lt-4.6)/.7),offP=ease((lt-8.5)/.6),lx,ly;
 if(lt<8.5){lx=lerp(150,0,lidP);ly=lerp(-34,0,lidP)-Math.sin(lidP*PI)*14;}
 else{lx=lerp(0,150,offP);ly=lerp(0,-34,offP)-Math.sin(offP*PI)*14;}
 if(lt>4.6&&lt<9.15){c.save();c.translate(lx,ly);c.rotate((lt<8.5?(1-lidP):offP)*-.18);
  rr(c,137,143,126,8,3);c.fillStyle=silver(c,137,263);c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke();
  c.fillStyle='rgba(255,255,255,.4)';c.fillRect(142,144.5,116,1.3);c.restore();}
 /* top plate */
 var tp=ease((lt-5.2)/.5)-ease((lt-8.2)/.4);
 if(tp>.001){var py=lerp(-30,131,tp);
  c.fillStyle='#4a5058';rr(c,194,-20,12,py+20,3);c.fill();
  rr(c,132,py,136,12,3);c.fillStyle='#3a3f46';c.fill();c.fillStyle='rgba(255,255,255,.22)';c.fillRect(135,py+1,130,1.4);}
 c.restore();
 /* motion lines */
 if(shAmp>.1){c.strokeStyle='rgba(255,255,255,'+(.3*shAmp)+')';c.lineWidth=1.6;c.lineCap='round';
  for(var i=0;i<5;i++){var yy=170+i*17,o=Math.sin(lt*40+i)*3;c.beginPath();c.moveTo(118+o,yy);c.lineTo(108+o,yy);c.moveTo(282-o,yy+6);c.lineTo(292-o,yy+6);c.stroke();}}
 /* dispenser rack */
 var up=ease((lt-4.1)/.7)*100;
 c.save();c.translate(0,-up);
 rr(c,122,10,156,14,4);var rg2=c.createLinearGradient(0,10,0,24);rg2.addColorStop(0,'#555b63');rg2.addColorStop(1,'#2e3238');c.fillStyle=rg2;c.fill();
 c.fillStyle='rgba(255,255,255,.2)';c.fillRect(126,11.5,148,1.3);
 NZX.forEach(function(cx,k){
  rr(c,cx-11,24,22,48,5);var cg=c.createLinearGradient(cx-11,0,cx+11,0);cg.addColorStop(0,mix(TINT[k],'#000',.3));cg.addColorStop(.35,mix(TINT[k],'#fff',.28));cg.addColorStop(1,mix(TINT[k],'#000',.35));c.fillStyle=cg;c.fill();
  c.fillStyle='#2b2f35';rr(c,cx-7,19,14,7,2);c.fill();
  c.beginPath();c.moveTo(cx-6,72);c.lineTo(cx+6,72);c.lineTo(cx+2.2,84);c.lineTo(cx-2.2,84);c.closePath();c.fillStyle='#aab0b7';c.fill();
 });
 c.restore();
 /* drops (in world coords, not translated) */
 DROPS.forEach(function(d){
  var a=lt-d.rel;if(a<0||a>1.25)return;
  var tip=84-(a>0?0:0);
  if(a<.3){var r=3.6*ease(a/.3);c.fillStyle=TINT[d.k];c.beginPath();c.arc(d.x,tip+r*.8,r,0,PI*2);c.fill();return;}
  var f=(a-.3)/.5,yy=lerp(tip+4,sy,f*f);if(f>1){
   var rp=clamp01((a-.8)/.45);if(rp>0&&rp<1){c.strokeStyle=rgba(TINT[d.k],.8*(1-rp));c.lineWidth=1.4;c.beginPath();c.ellipse(d.x+dx,sy,4+rp*18,1+rp*4,0,0,PI*2);c.stroke();}
   return;}
  c.fillStyle=TINT[d.k];c.beginPath();c.ellipse(d.x,yy,3,3+f*3.5,0,0,PI*2);c.fill();
 });
 /* final shine on liquid */
 if(lt>8.4&&lt<9.6){var q=(lt-8.4)/1.2;c.save();c.beginPath();c.rect(L+dx,TOP,R-L,BOT-TOP);c.clip();c.fillStyle='rgba(255,255,255,.28)';c.save();c.translate(lerp(L-40,R+20,q),0);c.transform(1,0,-.5,1,0,0);c.fillRect(0,TOP,16,BOT-TOP);c.restore();c.restore();}
}

/* ===== SPRAY ===== */
var SPL=10.8,RW=.85,RS=.3,NR=7,XA=44,XB=336;
var DOOR=new Path2D('M56 246L56 140Q56 122 74 120L112 118L142 58Q146 50 156 50L262 50Q272 50 280 58L322 118L338 122Q346 124 346 138L346 246Q346 250 340 250L62 250Q56 250 56 246Z');
var GLASS=new Path2D('M126 112L150 66L262 66L298 112Z');
var DOORBOTH=new Path2D();DOORBOTH.addPath(DOOR);DOORBOTH.addPath(GLASS);
function rowY(r){return 56+30*r;}
function nozz(lt){
 var u=(lt-RS)/RW;
 if(u<0)return {x:XA,y:56,on:false,out:1};
 if(u>=NR){var q=clamp01((lt-RS-NR*RW)/.8);return {x:XB+ease(q)*140,y:rowY(NR-1),on:false,out:0};}
 var r=Math.floor(u),p=u-r,dir=r%2===0?1:-1,sw=.84,x,y,on=false;
 if(p<sw){var e=ease(p/sw);x=dir>0?lerp(XA,XB,e):lerp(XB,XA,e);y=rowY(r);on=true;}
 else{var q2=ease((p-sw)/(1-sw));x=dir>0?XB:XA;y=lerp(rowY(r),rowY(r+1),q2);}
 return {x:x,y:y,on:on};
}
function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)*.9;}
function sprite(s,col){if(s.spc===col)return s.spr;var c=document.createElement('canvas');c.width=c.height=64;var g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,rgba(col,1));r.addColorStop(.55,rgba(col,.55));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(0,0,64,64);s.spc=col;s.spr=c;return c;}
function spraySim(s,to,col){
 if(s.cyc!==s.simCyc||to<s.st-.001){s.lg.clearRect(0,0,800,600);s.st=0;s.simCyc=s.cyc;}
 var spr=sprite(s,col);
 while(s.st<to-1e-6){
  var b=Math.min(s.st+.034,to),pa=nozz(s.st),pb=nozz(b);
  if(pb.on){var n=Math.ceil((b-s.st)*430);for(var i=0;i<n;i++){var f=Math.random(),x=lerp(pa.x,pb.x,f)+gauss()*8,y=lerp(pa.y,pb.y,f)+gauss()*10,r=5+Math.random()*6;s.lg.globalAlpha=.34+Math.random()*.2;s.lg.drawImage(spr,(x-r)*2,(y-r)*2,r*4,r*4);}}
  s.st=b;
 }
 s.lg.globalAlpha=1;
}
function drawCan(c,x,y,col){
 c.save();c.translate(x,y-9);c.rotate(.1);
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(36,142,26,5,0,0,PI*2);c.fill();
 rr(c,10,18,44,124,9);c.fillStyle=silver(c,10,54);c.fill();
 /* band */
 c.save();rr(c,10,18,44,124,9);c.clip();
 var bg=c.createLinearGradient(10,0,54,0);bg.addColorStop(0,mix(col,'#000',.35));bg.addColorStop(.3,mix(col,'#fff',.3));bg.addColorStop(.7,col);bg.addColorStop(1,mix(col,'#000',.4));
 c.fillStyle=bg;c.fillRect(10,66,44,46);
 c.fillStyle='rgba(255,255,255,.55)';c.fillRect(10,66,44,1.4);c.fillRect(10,111,44,1.4);
 c.fillStyle='rgba(0,0,0,.12)';c.fillRect(10,134,44,8);c.restore();
 c.fillStyle='#b4b9bf';rr(c,22,11,20,9,3);c.fill();
 c.fillStyle='#2b2f35';rr(c,17,2,30,11,4);c.fill();rr(c,0,5,22,6,3);c.fill();
 c.fillStyle='rgba(255,255,255,.25)';c.fillRect(20,4,24,1.2);
 c.fillStyle='#0c0d0f';c.beginPath();c.arc(.8,8,1.4,0,PI*2);c.fill();
 c.restore();
}
function drawSpray(s,c,t){
 var cyc=Math.floor(t/SPL),lt=t-cyc*SPL,col=cycCol(cyc,s.off||0);
 s.cyc=cyc;s.cur=col;s.cname=title(nameOf(col));
 spraySim(s,Math.min(lt,RS+NR*RW+.8),col);
 fit(s,c,400,300);
 var fa=clamp01(Math.min(lt/.4,(SPL-lt)/.5));c.globalAlpha=fa;
 /* shadow */
 c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(200,262,150,7,0,0,PI*2);c.fill();
 /* primer */
 var pg=c.createLinearGradient(0,50,0,250);pg.addColorStop(0,'#9aa0a8');pg.addColorStop(1,'#767c84');
 c.fillStyle=pg;c.fill(DOOR);
 c.save();c.clip(DOORBOTH,'evenodd');
 c.fillStyle=noisePat(c);c.globalAlpha=fa*.5;c.fillRect(0,0,400,300);c.globalAlpha=fa;
 c.drawImage(s.layer,0,0,400,300);
 var cov=clamp01((lt-4.9)/1.5);
 if(cov>0){var cg=c.createLinearGradient(0,50,0,250);cg.addColorStop(0,mix(col,'#ffffff',.2));cg.addColorStop(.45,col);cg.addColorStop(1,mix(col,'#000000',.3));c.globalAlpha=fa*cov*.94;c.fillStyle=cg;c.fillRect(0,40,400,220);c.globalAlpha=fa;}
 /* character line + shade */
 c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=2;c.beginPath();c.moveTo(60,186);c.lineTo(342,182);c.stroke();
 c.strokeStyle='rgba(255,255,255,'+(.18+.3*cov)+')';c.lineWidth=1.2;c.beginPath();c.moveTo(60,188);c.lineTo(342,184);c.stroke();
 if(lt>6.4&&lt<8.4){var q=(lt-6.4)/2;c.save();c.translate(lerp(0,420,q),0);c.transform(1,0,-.45,1,0,0);var sg=c.createLinearGradient(-50,0,50,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.55)');sg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=sg;c.fillRect(-50,40,100,220);c.restore();}
 c.restore();
 /* glass */
 var gg=c.createLinearGradient(0,66,0,112);gg.addColorStop(0,'#2a3541');gg.addColorStop(1,'#10151b');
 c.fillStyle=gg;c.fill(GLASS);c.save();c.clip(GLASS);c.fillStyle='rgba(255,255,255,.1)';c.beginPath();c.moveTo(150,66);c.lineTo(190,66);c.lineTo(160,112);c.lineTo(126,112);c.fill();c.restore();
 c.lineJoin='round';c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2.4;c.stroke(GLASS);
 /* handle */
 rr(c,232,146,46,10,5);c.fillStyle='rgba(0,0,0,.35)';c.fill();rr(c,232,144,46,10,5);c.fillStyle=silver(c,232,278);c.fill();
 /* outline */
 c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1.5;c.stroke(DOOR);
 /* can + mist */
 var N=nozz(lt);
 if(lt<RS+NR*RW+.8){
  var cx=N.x+38,cy=N.y+3;
  if(N.on){
   var cone=c.createLinearGradient(cx,0,N.x,0);cone.addColorStop(0,rgba(col,.0));cone.addColorStop(1,rgba(col,.34));
   c.fillStyle=cone;c.beginPath();c.moveTo(cx,cy);c.lineTo(N.x-4,cy-20);c.lineTo(N.x-4,cy+20);c.closePath();c.fill();
   for(var i=0;i<46;i++){var f=Math.random(),px=lerp(cx-4,N.x-6,f),sp=f*20*(Math.random()*2-1);c.fillStyle=rgba(col,.45+Math.random()*.5);c.beginPath();c.arc(px,cy+sp,.9+Math.random()*1.7,0,PI*2);c.fill();}
  }
  drawCan(c,cx,cy,col);
 }
}

/* ===== WALL ===== */
var WS_L=9.6,WT_L=9.0;
function wallBase(c,W,H,x0,x1,y0,y1){
 c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
 var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#dcd8cf');g.addColorStop(1,'#cbc7bd');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle=noisePat(c);c.fillRect(0,0,W,H);c.restore();
}
function roller(c,x,y,h,col,dir){
 var w=22,fx=x-dir*(w/2+9);
 c.save();c.lineCap='round';c.lineJoin='round';
 c.strokeStyle='#8d949c';c.lineWidth=2.4;
 c.beginPath();c.moveTo(x,y-h/2-3);c.lineTo(fx,y-h/2-3);c.lineTo(fx,y+h/2+3);c.lineTo(x,y+h/2+3);c.stroke();
 var gy=y+h/2+22;
 c.beginPath();c.moveTo(fx,y+h/2+3);c.lineTo(fx-dir*10,gy);c.stroke();
 c.strokeStyle='#23262b';c.lineWidth=10;c.beginPath();c.moveTo(fx-dir*10,gy);c.lineTo(fx-dir*28,gy+44);c.stroke();
 c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=2;c.beginPath();c.moveTo(fx-dir*11,gy+2);c.lineTo(fx-dir*29,gy+44);c.stroke();
 rr(c,x-w/2,y-h/2,w,h,8);
 var g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,mix(col,'#000000',.35));g.addColorStop(.3,mix(col,'#ffffff',.32));g.addColorStop(.62,col);g.addColorStop(1,mix(col,'#000000',.4));
 c.fillStyle=g;c.fill();
 c.save();c.clip();c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=1;for(var yy=y-h/2+3;yy<y+h/2;yy+=4){c.beginPath();c.moveTo(x-w/2,yy);c.lineTo(x+w/2,yy);c.stroke();}c.restore();
 c.fillStyle='#b4b9bf';c.beginPath();c.arc(x,y-h/2-1,3.4,0,PI*2);c.fill();c.beginPath();c.arc(x,y+h/2+1,3.4,0,PI*2);c.fill();
 c.restore();
}
function stripeCol(k,cyc,pk){var base=WP[(k+cyc*3)%WP.length];if(pk&&k%2===0)return pk;if(pk&&base.toLowerCase()===pk.toLowerCase())return WP[(k+cyc*3+1)%WP.length];return base;}
function paintRect(c,col,x0,x1,y0,y1,lead,dir){
 if(x1<=x0)return;
 var g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,mix(col,'#ffffff',.14));g.addColorStop(.5,col);g.addColorStop(1,mix(col,'#000000',.2));
 c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0);
 c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();c.globalAlpha=.55;c.fillStyle=noisePat(c);c.fillRect(x0,y0,x1-x0,y1-y0);c.globalAlpha=1;
 if(lead){var lx=dir>0?x1:x0,g2=c.createLinearGradient(lx-dir*14,0,lx,0);g2.addColorStop(0,'rgba(255,255,255,0)');g2.addColorStop(1,'rgba(255,255,255,.28)');c.fillStyle=g2;c.fillRect(Math.min(lx,lx-dir*14),y0,14,y1-y0);}
 c.restore();
}
function drawWall(s,c,t){
 var W=400,k=s.w/W,H=s.h/k;
 c.save();c.scale(k,k);
 var mode=s.mode,L=mode==='stripes'?WS_L:WT_L;
 if(reduce){mode=s.pin==='tape'?'tape':'stripes';L=99;}
 var lt=reduce?(mode==='tape'?7.2:8.0):t,cyc=s.cyc||0,pk=readPick();
 if(!reduce&&lt>=L){ if(s.pin==='auto'){s.mode=s.mode==='stripes'?'tape':'stripes';} s.cyc=(s.cyc||0)+1; s.clock=0; lt=0;mode=s.mode;L=mode==='stripes'?WS_L:WT_L;cyc=s.cyc; }
 var fa=reduce?1:clamp01(Math.min(lt/.35,(L-lt)/.55));c.globalAlpha=fa;
 var WL=document.querySelector('[data-wt]');if(WL&&s.wt!==mode){s.wt=mode;WL.textContent=mode==='stripes'?'Rola: dungă după dungă':'Banda de mascare: linie curată';}
 wallBase(c,400,H,0,400,0,H);
 var bt=H-16,top=8;
 if(mode==='stripes'){
  var n=6,hh=(bt-top)/n,T=1.15,last=null;
  s.cur=pk||WP[cyc*3%WP.length];s.cname=pk?title(nameOf(pk)):'';
  var ry=0,rx=-30,rc=null,rd=1,rvis=false;
  for(var i=0;i<n;i++){
   var t0=.3+i*T,col=stripeCol(i,cyc,pk),dir=i%2===0?1:-1,y0=top+i*hh,y1=y0+hh+1.2;
   var p=clamp01((lt-t0-.22)/.9);
   if(lt<t0+.22)continue;
   var e=ease(p),ex=dir>0?lerp(-16,400+16,e):lerp(416,-16,e);
   if(dir>0)paintRect(c,col,0,Math.min(400,Math.max(0,ex)),y0,y1,p<1,1);else paintRect(c,col,Math.max(0,Math.min(400,ex)),400,y0,y1,p<1,-1);
   if(p<1||i===n-1){rx=ex;rd=dir;rc=col;}
  }
  /* roller position */
  var cur=Math.min(n-1,Math.max(0,Math.floor((lt-.3)/T)));
  var tt0=.3+cur*T;
  var cy0=top+cur*hh+hh/2,cdir=cur%2===0?1:-1;
  var yy=cy0;
  if(cur>0&&lt<tt0+.22){yy=lerp(top+(cur-1)*hh+hh/2,cy0,ease((lt-tt0)/.22));}
  var pp=clamp01((lt-tt0-.22)/.9),ee=ease(pp),xx;
  if(lt<tt0+.22)xx=cdir>0?-16:416;else xx=cdir>0?lerp(-16,416,ee):lerp(416,-16,ee);
  if(cur===0&&lt<.3){xx=-16;}
  var colr=stripeCol(cur,cyc,pk);
  if(lt<.3+n*T)roller(c,xx,yy,hh+6,colr,cdir);
  s.cur=pk||stripeCol(cur,cyc,pk);
 }else{
  var col=pk||SP[(cyc*3+1)%SP.length];s.cur=col;s.cname=title(nameOf(col));
  var Ly=Math.round(H*.52),th=17,yb=Ly+11,TL=lt<.9?0:1;
  var tl=clamp01(lt/.8),tx=400*ease(tl);
  /* tape */
  var tg=c.createLinearGradient(0,Ly,0,Ly+th);tg.addColorStop(0,'#eadba9');tg.addColorStop(1,'#d9c68c');
  c.fillStyle=tg;c.fillRect(0,Ly,tx,th);
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(0,Ly+1,tx,1.2);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(0,Ly+th-1,tx,1.2);
  if(tl<1&&tl>0){c.fillStyle='#e2d09a';c.beginPath();c.arc(tx+2,Ly+th/2,th*.72,0,PI*2);c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1.2;c.stroke();c.fillStyle='#4a4338';c.beginPath();c.arc(tx+2,Ly+th/2,th*.28,0,PI*2);c.fill();}
  /* paint passes */
  var hb=(yb-top)/3,T2=1.0,pT0=.95,cur=-1,xx,yy,cdir=1;
  for(var j=0;j<3;j++){
   var t0=pT0+j*T2;if(lt<t0+.2)continue;
   var dir2=j%2===0?1:-1,p2=clamp01((lt-t0-.2)/.8),e2=ease(p2),ex2=dir2>0?lerp(-16,416,e2):lerp(416,-16,e2);
   var y0=top+j*hb,y1=y0+hb+1.2;if(j===2)y1=yb;
   if(dir2>0)paintRect(c,col,0,Math.min(400,Math.max(0,ex2)),y0,y1,p2<1,1);else paintRect(c,col,Math.max(0,Math.min(400,ex2)),400,y0,y1,p2<1,-1);
  }
  /* peel */
  var pl=clamp01((lt-4.45)/1.9),px=-24+(400+60)*ease(pl);
  if(pl>0&&pl<1.0001){
   wallBase(c,400,H,0,Math.max(0,px),Ly-.5,Ly+th+1);
   /* crisp edge */
   c.fillStyle='rgba(0,0,0,.16)';c.fillRect(0,Ly-1,Math.max(0,px),1);
  }else if(pl>=1){wallBase(c,400,H,0,400,Ly-.5,Ly+th+1);c.fillStyle='rgba(0,0,0,.16)';c.fillRect(0,Ly-1,400,1);}
  if(pl>0&&pl<1){
   var q=px;
   c.save();c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(q,Ly+2);c.lineTo(q,Ly+th+2);c.lineTo(q-26,Ly+th-20);c.lineTo(q-26,Ly-20);c.closePath();c.fill();
   var lg=c.createLinearGradient(q-26,0,q,0);lg.addColorStop(0,'#f1e6bf');lg.addColorStop(1,'#d9c68c');
   c.fillStyle=lg;c.beginPath();c.moveTo(q,Ly);c.lineTo(q,Ly+th);c.lineTo(q-28,Ly+th-24);c.lineTo(q-28,Ly-24);c.closePath();c.fill();
   c.fillStyle=col;c.beginPath();c.moveTo(q,Ly);c.lineTo(q,Ly+th*.62);c.lineTo(q-28,Ly+th*.62-24);c.lineTo(q-28,Ly-24);c.closePath();c.fill();
   c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;c.beginPath();c.moveTo(q,Ly);c.lineTo(q-28,Ly-24);c.stroke();
   c.restore();
  }
  /* roller */
  var jj=Math.min(2,Math.max(0,Math.floor((lt-pT0)/T2)));
  if(lt>=pT0-.4&&lt<pT0+3*T2){
   var cdir2=jj%2===0?1:-1,t0b=pT0+jj*T2,y0b=top+jj*hb,y1b=jj===2?yb:y0b+hb+1.2,cyb=(y0b+y1b)/2,yprev=jj>0?(top+(jj-1)*hb+hb/2):cyb;
   var yy2=cyb;if(jj>0&&lt<t0b+.2)yy2=lerp(yprev,cyb,ease((lt-t0b)/.2));
   var xx2;if(lt<t0b+.2)xx2=cdir2>0?-16:416;else{var e3=ease((lt-t0b-.2)/.8);xx2=cdir2>0?lerp(-16,416,e3):lerp(416,-16,e3);}
   roller(c,xx2,yy2,(y1b-y0b)+6,col,cdir2);
  }
 }
 /* baseboard */
 var bgz=c.createLinearGradient(0,bt,0,H);bgz.addColorStop(0,'#f1eee8');bgz.addColorStop(1,'#d8d4cb');c.fillStyle=bgz;c.fillRect(0,bt,400,H-bt);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(0,bt-1.5,400,1.6);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(0,bt+.5,400,1.2);
 c.restore();
}

/* ---------- create scenes ---------- */
var sMix=mkScene('cvMix',drawMix,{still:9.4,init:function(s){s.off=0;}});
var sSpr=mkScene('cvSpray',drawSpray,{still:8.0,init:function(s){var l=document.createElement('canvas');l.width=800;l.height=600;s.layer=l;s.lg=l.getContext('2d');s.st=0;s.simCyc=-1;s.cyc=0;s.off=3;
 s.reset=function(){s.st=0;s.simCyc=-1;s.lg.clearRect(0,0,800,600);};}});
var sWall=mkScene('cvWall',drawWall,{still:8,init:function(s){s.mode='stripes';s.pin='auto';s.cyc=0;}});
if(sWall){
 var tabs=document.querySelectorAll('.tab');
 tabs.forEach(function(b){b.addEventListener('click',function(){
  var m=b.getAttribute('data-mode');sWall.pin=m;if(m!=='auto')sWall.mode=m;sWall.clock=0;sWall.cyc=0;
  tabs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
  if(reduce)render(sWall);
 });});
 sWall.tap=function(){sWall.clock=0;sWall.cyc=(sWall.cyc||0)+1;if(reduce)render(sWall);};
}
RF.set=function(id,t,mode){scenes.forEach(function(s){if(s.id===id){if(mode){s.mode=mode;s.pin=mode;}s.clock=t;if(s.reset)s.reset();s.vis=true;render(s);}});tick();};

/* ---------- background tools ---------- */
var bg={cv:document.getElementById('bgfx'),w:0,h:0,t:0,passes:[],drops:[],ti:0,lastSpawn:-2,lastSy:window.pageYOffset||0,spawnSy:window.pageYOffset||0};
function bgSize(){if(!bg.cv)return;bg.w=window.innerWidth;bg.h=window.innerHeight;bg.cv.width=bg.w;bg.cv.height=bg.h;bg.ctx=bg.cv.getContext('2d');if(reduce)bgStatic();}
function mkPass(tool,y){
 var col=readPick()||spec(bg.t*1+bg.ti*3);
 var hh=tool===0?68:tool===1?56:26,lines=[],i;
 for(i=0;i<9;i++)lines.push({o:(i/8)*2-1+(Math.random()-.5)*.1,w:.6+Math.random()*.9,a:.5+Math.random()*.5,lag:Math.random()*40});
 return {tool:tool,y:y,t:0,dur:mobMQ.matches?7:9,col:col,hh:hh,lines:lines};
}
function spawnPass(tool,y){bg.passes.push(mkPass(tool==null?(bg.ti++%3):tool,y==null?bg.h*(.16+Math.random()*.68):y));bg.lastSpawn=bg.t;bg.spawnSy=window.pageYOffset||0;}
function brushTool(c,x,y,hh,col){
 rr(c,x-30,y-hh/2,30,hh,5);var g=c.createLinearGradient(x-30,0,x,0);g.addColorStop(0,'#cdb98a');g.addColorStop(.7,'#e9dcb6');g.addColorStop(1,mix(col,'#ffffff',.1));c.fillStyle=g;c.fill();
 c.fillStyle=rgba(col,.9);c.fillRect(x-9,y-hh/2+2,9,hh-4);
 c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1;for(var yy=y-hh/2+3;yy<y+hh/2-2;yy+=3.2){c.beginPath();c.moveTo(x-30,yy);c.lineTo(x,yy);c.stroke();}
 rr(c,x-64,y-hh/2-4,34,hh+8,3);c.fillStyle=silver(c,x-64,x-30);c.fill();c.strokeStyle='rgba(0,0,0,.3)';c.stroke();
 c.strokeStyle='rgba(0,0,0,.25)';c.beginPath();c.moveTo(x-52,y-hh/2-3);c.lineTo(x-52,y+hh/2+3);c.moveTo(x-44,y-hh/2-3);c.lineTo(x-44,y+hh/2+3);c.stroke();
 c.beginPath();c.moveTo(x-64,y-9);c.lineTo(x-64,y+9);c.lineTo(x-210,y-22);c.lineTo(x-210,y-48);c.closePath();var wg=c.createLinearGradient(0,y-40,0,y+10);wg.addColorStop(0,'#a77a4b');wg.addColorStop(1,'#6a4a2a');c.fillStyle=wg;c.fill();
}
function knifeTool(c,x,y,col){
 c.beginPath();c.moveTo(x,y-22);c.lineTo(x,y+22);c.lineTo(x-74,y+11);c.lineTo(x-74,y-11);c.closePath();
 var g=c.createLinearGradient(0,y-22,0,y+22);g.addColorStop(0,'#eef1f3');g.addColorStop(.5,'#b9bfc5');g.addColorStop(1,'#868d95');c.fillStyle=g;c.fill();
 c.fillStyle=rgba(col,.8);c.fillRect(x-14,y-20,14,40);
 c.strokeStyle='rgba(0,0,0,.3)';c.stroke();
 c.save();c.translate(x-74,y);c.rotate(-.28);rr(c,-100,-10,100,20,10);var wg=c.createLinearGradient(0,-10,0,10);wg.addColorStop(0,'#b88655');wg.addColorStop(1,'#6a4a2a');c.fillStyle=wg;c.fill();c.restore();
}
function bgFrame(dt){
 var c=bg.ctx;if(!c)return;
 var mobile=mobMQ.matches,sy=window.pageYOffset||0,ds=sy-bg.lastSy;bg.lastSy=sy;bg.t+=dt;
 var act=bg.passes.length;
 bg.passes.forEach(function(p){p.t+=dt;p.y-=ds*.35;});
 bg.passes=bg.passes.filter(function(p){return p.t<p.dur+8;});
 if(bg.passes.length<3&&((bg.t-bg.lastSpawn>6.5)||(bg.t-bg.lastSpawn>2.6&&Math.abs(sy-bg.spawnSy)>520)))spawnPass();
 c.clearRect(0,0,bg.w,bg.h);
 var A=mobile?.05:.07,TA=mobile?.1:.14;
 bg.passes.forEach(function(p){drawPass(c,p,A,TA);});
 drawDrops(c,dt,mobile);
 var hr=document.getElementById('raft');
 if(hr){var r=hr.getBoundingClientRect();if(r.bottom>0&&r.top<bg.h){c.save();c.globalCompositeOperation='destination-out';c.fillStyle='rgba(0,0,0,.72)';c.fillRect(0,Math.max(0,r.top),bg.w,r.height);c.restore();}}
}
function drawPass(c,p,A,TA){
 var e=easeS(p.t/p.dur),hx=-260+(bg.w+520)*e,fa=p.t<p.dur+3?1:clamp01(1-(p.t-p.dur-3)/5);
 var y=p.y,x0=-40,x1=hx-18,col=p.col;
 c.save();
 if(p.tool===0){
  c.fillStyle=rgba(col,A*fa);c.fillRect(x0,y-p.hh/2,Math.max(0,x1-x0),p.hh);
  c.fillStyle=rgba('#ffffff',.18*A*fa*3);c.fillRect(x0,y-p.hh/2,Math.max(0,x1-x0),1.5);c.fillRect(x0,y+p.hh/2-1.5,Math.max(0,x1-x0),1.5);
 }else if(p.tool===1){
  p.lines.forEach(function(l){var ey=x1-l.lag;if(ey<=x0)return;c.fillStyle=rgba(col,A*fa*l.a*1.1);var lh=p.hh/9*(1+l.w*.4);c.fillRect(x0,y+l.o*p.hh/2-lh/2,ey-x0,lh);});
 }else{
  c.fillStyle=rgba(col,A*1.15*fa);c.fillRect(x0,y-p.hh/2,Math.max(0,x1-x0),p.hh);
  c.fillStyle=rgba('#000000',.16*fa);for(var k=-1;k<=1;k+=1)c.fillRect(x0,y+k*7-.7,Math.max(0,x1-x0),1.4);
  c.fillStyle=rgba('#ffffff',.14*fa);c.fillRect(x0,y-p.hh/2,Math.max(0,x1-x0),1.6);
 }
 if(p.t<p.dur&&hx>-220&&hx<bg.w+260){
  c.globalAlpha=TA*clamp01(Math.min(1,(p.dur-p.t)/.8));
  if(p.tool===0){c.save();c.translate(hx,y);roller(c,0,0,p.hh+8,col,1);c.restore();}
  else if(p.tool===1)brushTool(c,hx,y,p.hh,col);
  else knifeTool(c,hx,y,col);
 }
 c.restore();
}
function drawDrops(c,dt,mobile){
 if(!bg.drops.length){for(var i=0;i<10;i++)bg.drops.push({x:Math.random()*bg.w,y:Math.random()*bg.h,v:8+Math.random()*14,r:4+Math.random()*5,ph:Math.random()*6,o:Math.random()*8});}
 var pk=readPick(),a=mobile?.06:.09;
 bg.drops.forEach(function(d){
  d.y+=d.v*dt;if(d.y>bg.h+30){d.y=-30;d.x=Math.random()*bg.w;}
  var x=d.x+Math.sin(bg.t*.5+d.ph)*14,col=pk||spec(bg.t+d.o*3.2),r=d.r;
  c.save();c.translate(x,d.y);c.fillStyle=rgba(col,a);
  c.beginPath();c.moveTo(0,-2.2*r);c.bezierCurveTo(.4*r,-1.2*r,r,-.5*r,r,.3*r);c.arc(0,.3*r,r,0,PI);c.bezierCurveTo(-r,-.5*r,-.4*r,-1.2*r,0,-2.2*r);c.fill();
  c.fillStyle='rgba(255,255,255,'+(a*1.2)+')';c.beginPath();c.arc(-r*.35,.1*r,r*.22,0,PI*2);c.fill();
  c.restore();
 });
}
function bgStatic(){
 var c=bg.ctx;if(!c)return;c.clearRect(0,0,bg.w,bg.h);
 var col=readPick()||SP[5];
 [[0,.3],[1,.58],[2,.82]].forEach(function(a,i){var p=mkPass(a[0],bg.h*a[1]);p.col=readPick()||SP[(i*2+1)%8];p.t=p.dur*.6;drawPass(c,p,mobMQ.matches?.05:.07,0);});
}
RF.bgPass=function(tool,y,tt){var p=mkPass(tool,y);p.t=tt;bg.passes.push(p);};
RF.bgFrame=function(dt){bgFrame(dt);};

/* ---------- drips ---------- */
var drips=[].slice.call(document.querySelectorAll('.drip'));
drips.forEach(function(d,idx){
 var n=mobMQ.matches?9:18,html='';
 for(var i=0;i<n;i++){
  var left=(i+.3+Math.random()*.5)/n*100,w=7+Math.random()*9,h=14+Math.random()*30,dl=(Math.random()*.9).toFixed(2),fall=Math.random()<.4;
  html+='<i style="left:'+left.toFixed(1)+'%;width:'+w.toFixed(1)+'px;--h:'+h.toFixed(0)+'px;--d:'+dl+'s"></i>';
  if(fall)html+='<b style="left:calc('+left.toFixed(1)+'% + '+(w/2-3).toFixed(1)+'px);--h:'+h.toFixed(0)+'px;--d:'+(1.2+Math.random()*2).toFixed(2)+'s"></b>';
 }
 d.innerHTML=html;
});
if('IntersectionObserver' in window){
 var dio=new IntersectionObserver(function(en){en.forEach(function(x){x.target.classList.toggle('vis',x.isIntersecting);if(x.isIntersecting)x.target.classList.add('in');});},{threshold:.2});
 drips.forEach(function(d){dio.observe(d);});
 var cio=new IntersectionObserver(function(en){en.forEach(function(x){x.target.classList.toggle('vis',x.isIntersecting);});},{threshold:.1});
 document.querySelectorAll('.card').forEach(function(d){cio.observe(d);});
}else{drips.forEach(function(d){d.classList.add('in','vis');});document.querySelectorAll('.card').forEach(function(d){d.classList.add('vis');});}

/* ---------- tick: colour vars + labels ---------- */
var lastTick=0;
function tick(){
 var pk=readPick(),now=performance.now()/1000,gc=pk||spec(now);
 drips.forEach(function(d){d.style.setProperty('--fx',gc);});
 scenes.forEach(function(s){
  if(!s.fig)return;
  s.fig.style.setProperty('--fx',s.cur);
  if(s.lab){var tx=s.id==='cvWall'?(pk?'Culoare aleasă: '+title(nameOf(pk)):'Culori din paletă'):(s.cname||'');if(s.labt!==tx){s.labt=tx;s.lab.textContent=tx;}}
 });
}

/* ---------- loop ---------- */
var last=0;
function loop(ts){
 requestAnimationFrame(loop);
 var dt=Math.min((ts-last)/1000,.1);last=ts;
 if(document.hidden||RF.hold)return;
 for(var i=0;i<scenes.length;i++){var s=scenes[i];if(!s.vis)continue;s.clock+=dt;render(s);}
 bg.acc=(bg.acc||0)+dt;if(bg.acc>=.032){bgFrame(bg.acc);bg.acc=0;}
 if(ts-lastTick>160){lastTick=ts;tick();}
}
bgSize();
var rzT;window.addEventListener('resize',function(){clearTimeout(rzT);rzT=setTimeout(bgSize,150);});
if(reduce){
 var rs=function(){scenes.forEach(function(s){if(s.vis||true)render(s);});bgStatic();tick();};
 if('MutationObserver' in window)new MutationObserver(rs).observe(body,{attributes:true,attributeFilter:['class','style']});
 rs();
}else{
 tick();requestAnimationFrame(loop);
}
})();

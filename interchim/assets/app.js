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

/* ---------- CUTII care se deschid + GĂLEȚI care se toarnă ---------- */
function canSvg(i,name,hex){const p='k'+i;
 const X0=42,W=86,T=62,B=194,DX=-13,DY=-19,LT=49;
 const f1=n=>(Math.round(n*10)/10);
 const pts=a=>a.map(q=>f1(q[0])+','+f1(q[1])).join(' ');
 const F=(fx,fy)=>[X0+fx*W,T+fy*(B-T)];
 const P=(u,v,y)=>[X0+u*W+v*DX,y+v*DY];
 const lum=(()=>{const h=(hex||'#888888').replace('#','');const r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);return (.2126*r+.7152*g+.0722*b)/255})();
 const tc=lum>.5?'#0b0b0d':'#f4f1ea';
 const up=pts([F(0,0),F(1,0),F(1,.24),F(.72,.39),F(.16,.42),F(0,.49)]);
 const lb=pts([F(.16,.57),F(.88,.57),F(.88,.77),F(.32,.82),F(0,1),F(0,.82),F(.16,.78)]);
 const IC=['M12 3 L19 6 V12 C19 16.5 15.8 19.8 12 21 C8.2 19.8 5 16.5 5 12 V6 Z M12 6 V18 M8.4 8.4 L12 7 L15.6 8.4','M5 20 C5 16 7 14 9 13.5 L11.5 16 C10.5 18 8.5 20 5 20Z M10.5 14.5 L18.5 5.5 L20 7 L12 15.5Z','M12 4 C12 4 6.5 10.5 6.5 14.5 A5.5 5.5 0 0 0 17.5 14.5 C17.5 10.5 12 4 12 4Z M9.5 14 A2.5 2.5 0 0 0 12 16.6'];
 const badges=[.28,.52,.75].map((fx,k)=>{const c=F(fx,.70);return '<circle cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" r="5.7" fill="#0a0a0c" stroke="#fff" stroke-opacity=".12" stroke-width=".4"/><g transform="translate('+f1(c[0]-3.7)+' '+f1(c[1]-3.7)+') scale(.31)"><path d="'+IC[k]+'" fill="none" stroke="#ece8df" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></g>'}).join('');
 const cw=F(.5,.115),cn=F(.5,.245),tl=Math.min(name.length*6.6,64).toFixed(1);
 const txt='<text x="'+f1(cw[0])+'" y="'+f1(cw[1])+'" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" font-size="6.6" letter-spacing="1.6" fill="'+tc+'" fill-opacity=".92">INTERCHIM</text>'+
  '<text x="'+f1(cn[0])+'" y="'+f1(cn[1])+'" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-weight="800" font-size="11.5" fill="'+tc+'" textLength="'+tl+'" lengthAdjust="spacingAndGlyphs">'+name+'</text>';
 const sideP=pts([P(0,0,T),P(0,0,B),P(0,1,B),P(0,1,T)]);
 const ringOut=pts([[X0-1.5,T],[X0+W+1.5,T],[X0+W+1.5+DX,T+DY],[X0-1.5+DX,T+DY]]);
 const opn=[P(.05,.075,T),P(.95,.075,T),P(.95,.93,T),P(.05,.93,T)],opnS=pts(opn);
 const pnt=pts([P(0,0,T+5),P(1,0,T+5),P(1,1,T+5),P(0,1,T+5)]);
 const pc=P(.5,.5,T+5);
 const Lp=(u,v)=>[40+u*90+v*DX,LT+v*DY];
 const lidTop=pts([Lp(0,0),Lp(1,0),Lp(1,1),Lp(0,1)]),step=pts([Lp(.06,.15),Lp(.94,.15),Lp(.94,.85),Lp(.06,.85)]);
 const lidSide=pts([[40,LT],[40,60.5],[40+DX,60.5+DY],[40+DX,LT+DY]]);
 const sv=['#6b7180','#f4f6fa','#b2b8c5','#7a8191'];
 return '<svg viewBox="-2 16 172 194" aria-hidden="true"><defs>'+
  '<linearGradient id="'+p+'sv" x1="0" x2="1"><stop offset="0" stop-color="'+sv[0]+'"/><stop offset=".2" stop-color="'+sv[1]+'"/><stop offset=".55" stop-color="'+sv[2]+'"/><stop offset="1" stop-color="'+sv[3]+'"/></linearGradient>'+
  '<linearGradient id="'+p+'sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity=".02"/><stop offset=".8" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>'+
  '<linearGradient id="'+p+'sd" x1="0" x2="1"><stop offset="0" stop-color="#2a2a30"/><stop offset="1" stop-color="#101014"/></linearGradient>'+
  '<linearGradient id="'+p+'lt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>'+
  '<linearGradient id="'+p+'wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>'+
  '<radialGradient id="'+p+'hh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'+
  '<clipPath id="'+p+'cp"><polygon points="'+opnS+'"/></clipPath></defs>'+
  '<ellipse cx="86" cy="'+(B+3)+'" rx="70" ry="10" fill="url(#'+p+'hh)"/>'+
  '<g class="cg">'+
  '<polygon points="'+sideP+'" fill="url(#'+p+'sd)"/>'+
  '<polygon points="'+pts([[X0,T],[X0+W,T],[X0+W,B],[X0,B]])+'" fill="#0c0c0f"/>'+
  '<polygon points="'+up+'" style="fill:var(--c)"/><polygon points="'+lb+'" style="fill:var(--c)"/>'+
  '<polygon points="'+up+'" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width=".5"/><polygon points="'+lb+'" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width=".5"/>'+
  txt+badges+
  '<polygon points="'+pts([[X0,T],[X0+W,T],[X0+W,B],[X0,B]])+'" fill="url(#'+p+'sh)"/>'+
  '<polygon points="'+pts([[41,B-2.5],[129,B-2.5],[129,B+2],[41,B+2]])+'" fill="url(#'+p+'sv)" stroke="#5d6372" stroke-width=".4"/><polygon points="'+pts([[41,B-2.5],[41+DX,B-2.5+DY],[41+DX,B+2+DY],[41,B+2]])+'" fill="#7f8798"/>'+
  '<polygon points="'+pts([[41,60],[129,60],[129,64.5],[41,64.5]])+'" fill="url(#'+p+'sv)" stroke="#5d6372" stroke-width=".4"/><polygon points="'+pts([[41,T-2],[41+DX,T-2+DY],[41+DX,T+2.5+DY],[41,T+2.5]])+'" fill="#8b93a4"/>'+
  '<polygon points="'+ringOut+'" fill="url(#'+p+'sv)" stroke="#5d6372" stroke-width=".4"/>'+
  '<polygon points="'+opnS+'" fill="#08080a"/>'+
  '<g class="pnt" clip-path="url(#'+p+'cp)"><polygon points="'+opnS+'" fill="url(#'+p+'wl)"/><polygon class="pf" points="'+pnt+'"/><polygon points="'+pnt+'" fill="url(#pntG)"/>'+
  '<ellipse class="hl" cx="'+f1(pc[0]-14)+'" cy="'+f1(pc[1]-2)+'" rx="15" ry="1.9"/><ellipse class="rp" cx="'+f1(pc[0])+'" cy="'+f1(pc[1])+'" rx="30" ry="6"/><ellipse class="rp rp2" cx="'+f1(pc[0])+'" cy="'+f1(pc[1])+'" rx="30" ry="6"/>'+
  '<path d="'+'M'+f1(P(0,1,T+5)[0])+' '+f1(P(0,1,T+5)[1])+' L'+f1(P(1,1,T+5)[0])+' '+f1(P(1,1,T+5)[1])+'" stroke="#fff" stroke-opacity=".45" stroke-width="1" fill="none"/></g>'+
  '<polygon points="'+opnS+'" fill="none" stroke="#3b3f4a" stroke-width=".6"/>'+
  '<circle class="spl" cx="'+f1(pc[0]-8)+'" cy="'+f1(pc[1]-2)+'" r="3" style="--dx:-7px"/><circle class="spl" cx="'+f1(pc[0]+10)+'" cy="'+f1(pc[1]-3)+'" r="2.4" style="--dx:8px"/><circle class="spl" cx="'+f1(pc[0])+'" cy="'+f1(pc[1]-4)+'" r="2" style="--dx:1px"/>'+
  '<g class="brush"><path d="M50 28 L82 51" stroke="#b78750" stroke-width="3.4" stroke-linecap="round"/><path d="M50 26.8 L82 49.8" stroke="#e5be8a" stroke-opacity=".7" stroke-width="1" stroke-linecap="round"/><path d="M78 48.6 L87 55" stroke="#cdd2dc" stroke-width="4.8"/><path d="M78 47 L87 53.4" stroke="#fff" stroke-opacity=".8" stroke-width="1"/><path d="M87 55 L93 59" stroke="#d8cdb0" stroke-width="5" stroke-linecap="round"/><path d="M91 58 L94 60" style="stroke:var(--c)" stroke-width="5.2" stroke-linecap="round"/></g>'+
  '<g class="lid"><polygon points="'+lidSide+'" style="fill:var(--c)"/><polygon points="'+lidSide+'" fill="#000" fill-opacity=".3"/>'+
  '<polygon points="'+pts([[40,LT],[130,LT],[130,60.5],[40,60.5]])+'" style="fill:var(--c)"/><polygon points="'+pts([[40,LT],[130,LT],[130,60.5],[40,60.5]])+'" fill="url(#'+p+'sh)"/>'+
  '<path d="M40 60 H130" stroke="#000" stroke-opacity=".28" stroke-width="1"/>'+
  '<polygon points="'+lidTop+'" style="fill:var(--c)"/><polygon points="'+lidTop+'" fill="url(#'+p+'lt)"/>'+
  '<polygon points="'+step+'" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".8" transform="translate(0 .8)"/><polygon points="'+step+'" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>'+
  '<path d="M40 '+LT+' H130 L'+(130+DX)+' '+(LT+DY)+'" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".9"/></g></g>'+
  '<g class="lidu"><g transform="translate(0 0)"><polygon points="134,194 166,186 166,122 134,133" fill="#b9bfcc"/><polygon points="134,194 166,186 166,122 134,133" style="fill:var(--c)" fill-opacity=".35"/>'+
  '<polygon points="137,190.5 163,184 163,127 137,135.5" class="pf"/><polygon points="137,190.5 163,184 163,127 137,135.5" fill="url(#pntG)"/>'+
  '<path d="M140 146 Q150 138 160 139 L161 152 Q151 148 142 156Z" fill="#fff" fill-opacity=".25"/><path d="M138 182 q4 -10 10 -8 q4 3 -1 9z" fill="#000" fill-opacity=".18"/><path d="M134 133 L166 122" stroke="#fff" stroke-opacity=".8" stroke-width="1"/></g></g></svg>'}
const BKSVG='<svg viewBox="0 0 100 112" aria-hidden="true"><ellipse cx="50" cy="106" rx="34" ry="5" fill="#000" opacity=".35"/><ellipse class="pud" cx="96" cy="105" rx="20" ry="4.5"/><path class="strm" d="M91 35 Q99 58 97 104"/>'+
 '<g class="bkb"><path d="M12 36 Q50 -8 88 36" fill="none" stroke="#9aa2b4" stroke-width="2.8" stroke-linecap="round"/><path d="M10 32 L90 32 L80 100 A30 6 0 0 1 20 100 Z" fill="url(#tinG)"/>'+
 '<path d="M13.5 58 Q50 66 86.5 58 L83.5 86 Q50 94 16.5 86 Z" style="fill:var(--c)"/><path d="M13.5 58 Q50 66 86.5 58 L83.5 86 Q50 94 16.5 86 Z" fill="url(#lblG)"/>'+
 '<ellipse cx="50" cy="32" rx="40" ry="9" fill="#c9cfdc" stroke="#7d8597" stroke-width="1.2"/><ellipse cx="50" cy="33" rx="35.5" ry="7" style="fill:var(--c)"/><ellipse cx="50" cy="33" rx="35.5" ry="7" fill="url(#pntG)"/>'+
 '<path d="M16 37 v11 a4 4 0 0 0 8 0 v-11z" style="fill:var(--c)"/><path d="M42 40 v6 a3 3 0 0 0 6 0 v-6z" style="fill:var(--c)"/><path d="M71 38 v14 a4 4 0 0 0 8 0 v-14z" style="fill:var(--c)"/></g>'+
 '<circle class="sd" cx="96" cy="103" r="2.8" style="--dx:-15px;--dy:-24px"/><circle class="sd" cx="96" cy="103" r="2.2" style="--dx:-4px;--dy:-32px"/><circle class="sd" cx="96" cy="103" r="2.6" style="--dx:9px;--dy:-27px"/><circle class="sd" cx="96" cy="103" r="2" style="--dx:16px;--dy:-18px"/></svg>';
const HERO_BK=[['Roșu','#c1121f'],['Portocaliu','#ef7413'],['Verde','#1f6b45'],['Albastru','#1e50b5'],['Violet','#6d3fc0']];
const ROW_BK=[['Roșu','#c1121f'],['Portocaliu','#ef7413'],['Galben','#f3c40f'],['Verde','#1f6b45'],['Turcoaz','#14a3a8'],['Albastru','#1e50b5'],['Violet','#6d3fc0'],['Roz','#d6338f']];
function mkBk(c,label){const b=document.createElement('button');b.type='button';b.className='bk';b.dataset.hex=c[1];b.dataset.name=c[0];b.style.setProperty('--c',c[1]);
 b.setAttribute('aria-label','Găleată '+c[0]+': atinge ca s-o torni pe mașină');b.innerHTML=BKSVG+(label?'<span class="bl">'+c[0]+'</span>':'');return b}
const heroBk=$('#heroBk'),rowBk=$('#bkrow'),cansEl=$('#cans');
if(heroBk)HERO_BK.forEach(c=>heroBk.appendChild(mkBk(c,false)));
if(rowBk)ROW_BK.forEach(c=>rowBk.appendChild(mkBk(c,true)));
function pour(e){const b=e.target.closest('.bk');if(!b||b.classList.contains('pour'))return;const r=b.getBoundingClientRect();
 b.classList.add('pour');const x=r.left+r.width*.82,y=r.top+r.height*.7;
 setTimeout(()=>setColor(b.dataset.hex,b.dataset.name,{x:x,y:y}),RM?0:430);setTimeout(()=>b.classList.remove('pour'),RM?0:1750)}
if(heroBk)heroBk.addEventListener('click',pour);if(rowBk)rowBk.addEventListener('click',pour);
let cansI=0;
if(cansEl){CAR.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='cn';b.dataset.hex=c[1];b.dataset.name=c[0];b.style.setProperty('--c',c[1]);b.setAttribute('aria-expanded','false');
  b.setAttribute('aria-label','Cutie de vopsea '+c[0]+' '+c[1].toUpperCase()+': atinge ca să deschizi capacul');
  b.innerHTML=canSvg(cansI++,c[0],c[1])+'<span class="cl">'+c[0]+'</span><code class="ch">'+c[1].toUpperCase()+'</code><span class="tapi">atinge</span>';cansEl.appendChild(b)});
 cansEl.addEventListener('click',e=>{const b=e.target.closest('.cn');if(!b)return;const was=b.classList.contains('open');
  $$('.cn.open').forEach(x=>{x.classList.remove('open');x.setAttribute('aria-expanded','false');const t=x.querySelector('.tapi');if(t)t.textContent='atinge'});
  if(!was){b.classList.add('open');b.setAttribute('aria-expanded','true');const t=b.querySelector('.tapi');if(t)t.textContent='deschisă';const r=b.getBoundingClientRect();
   setColor(b.dataset.hex,b.dataset.name,{x:r.left+r.width/2,y:r.top+r.height*.38})}})}


function ripple(x,y){if(RM||x===undefined)return;const r=document.createElement('i');r.className='pring';r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),950);
 const pv=$('#pvbox');if(pv){const b=pv.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight){const f=document.createElement('i');f.className='pfill';f.style.left=b.width*.5+'px';f.style.top=b.height*.55+'px';pv.appendChild(f);setTimeout(()=>f.remove(),900)}}}
function setColor(hex,name,o){o=o||{};hex=hex.toLowerCase();const[r,g,b]=hex2rgb(hex),hsl=rgb2hsl(r,g,b),prev=S.hex;S.hex=hex;S.name=name||nameFor(hsl[0],hsl[1],hsl[2]);
 const u=uiAccent(hsl[0],hsl[1],hsl[2]),st=document.documentElement.style;
 st.setProperty('--paintprev',prev);st.setProperty('--paint',hex);st.setProperty('--ac',u.hex);st.setProperty('--acr',u.rgb.join(','));st.setProperty('--acx',u.on);
 const a2=hsl2rgb(hsl[0]+38,80,64);st.setProperty('--ac2',rgb2hex(a2[0],a2[1],a2[2]));
 $$('.rd-name').forEach(x=>x.textContent=S.name);$$('.rd-hex').forEach(x=>x.textContent=hex.toUpperCase());
 $$('.hs,.ws,.bk,.cn').forEach(x=>x.classList.toggle('sel',x.dataset.hex===hex));
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
function makeEnv(ren){try{const pm=new T.PMREMGenerator(ren),s=new T.Scene(),R=40,g=new T.SphereGeometry(R,32,20),pos=g.attributes.position,col=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const t=(pos.getY(i)/R+1)/2;const top=[.5,.57,.76],hz=[.30,.31,.40],bt=[.10,.10,.14];const a=t>.5?top:bt,k=t>.5?Math.pow((t-.5)*2,1.1):Math.pow(1-t*2,.8);
  for(let c=0;c<3;c++)col[i*3+c]=hz[c]+(a[c]-hz[c])*k}
 g.setAttribute('color',new T.BufferAttribute(col,3));s.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
 const box=(w,h,x,y,z,k)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color().setRGB(k,k,k),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);s.add(m)};
 box(44,12,0,34,0,3.6);box(40,3,0,16,-30,4.2);box(40,3,0,13,30,3);box(14,22,-34,10,0,1.8);box(14,22,34,10,0,1.8);box(3,26,-32,12,12,2.6);box(3,26,32,12,-12,2.6);box(30,2.4,30,5,-6,1.8);box(30,2.4,-30,5,-6,1.8);
 const rt=pm.fromScene(s,.02);pm.dispose();return rt.texture}catch(e){return null}}
function lights(sc,k){sc.add(new T.HemisphereLight(0xdfe6ff,0x140f2a,.3));const d=new T.DirectionalLight(0xffffff,.6);d.position.set(5,8,7);sc.add(d);
 const rim=new T.PointLight(0xffffff,.9,60);rim.position.set(-8,4,-8);sc.add(rim);const a=new T.PointLight(0xff5a64,1.2*k,50);a.position.set(0,-1,9);sc.add(a);return a}
function mkRen(o){const r=new T.WebGLRenderer(o);try{r.outputEncoding=T.sRGBEncoding}catch(e){}return r}
const TK=2*Math.tan(16*PI/180);
const vis=(box,cb)=>{let v=false;new IntersectionObserver(es=>{v=es[0].isIntersecting;cb(v)},{rootMargin:'120px'}).observe(box);return()=>v};

/* ---------- HERO: cutia de vopsea care se rotește și își schimbă culorile (+ mașina, la cerere) ---------- */
function hero(){
 const box=$('#gl');if(!box)return;
 let ren;try{ren=mkRen({antialias:!isMob(),alpha:true})}catch(e){box.classList.add('nogl');return}
 ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
 const sc=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,200);const env=makeEnv(ren);if(env)sc.environment=env;
 const ac=lights(sc,1);
 const P=new T.Group(),G=new T.Group();sc.add(G);G.add(P);G.rotation.x=.4;
 const CN=IM.can(isMob()?24:36);P.add(CN.root);
 const sp={t:1};let mode='can',E=null,uiCar=0;
 function ensureCar(){if(E)return E;E=IM.car(isMob()?24:36);E.root.position.y=-.85;E.root.visible=false;P.add(E.root);return E}
 const BAR=54;let asp=1;
 function vo(){const w=box.clientWidth,h=box.clientHeight-BAR;if(!w||h<50)return;ren.setSize(w,h,false);cam.aspect=w/h;asp=cam.aspect;cam.updateProjectionMatrix()}
 vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(box);setTimeout(vo,600);setTimeout(vo,1800);
 // comutator Cutie / Mașină (sub 3D, nu se suprapune cu modelul)
 const sw=document.createElement('div');sw.className='gsw';sw.setAttribute('role','group');sw.setAttribute('aria-label','Model 3D');
 sw.innerHTML='<button type="button" data-m="can" class="on">Cutia de vopsea</button><button type="button" data-m="car">Mașina</button>';box.appendChild(sw);
 function setMode(m){if(m==='car')ensureCar();mode=m;CN.root.visible=m==='can';if(E)E.root.visible=m==='car';$$('.gsw button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  if(m==='car'){IM.Paint.set(S.hex);stopCycle()}}
 sw.addEventListener('click',e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.m)});
 addEventListener('click',e=>{if(e.target.closest('.rdbar a[href="#hero"]'))setMode('car')});
 // ciclul automat de culori
 let userT=-1e9,cycOn=false,cycH=355,cycUp=0,openUntil=0,manualT=-1e9;
 function readouts(hex,name){$$('.rd-name').forEach(x=>x.textContent=name);$$('.rd-hex').forEach(x=>x.textContent=hex.toUpperCase());$$('.rd-chip').forEach(x=>x.style.background=hex)}
 function stopCycle(){if(!cycOn)return;cycOn=false;$$('.rd-chip').forEach(x=>x.style.background='');$$('.rd-name').forEach(x=>x.textContent=S.name);$$('.rd-hex').forEach(x=>x.textContent=S.hex.toUpperCase());IM.Paint.set(S.hex);CN.setName(S.name)}
 addEventListener('paintchange',()=>{sp.t=0;userT=performance.now();if(cycOn){cycOn=false;$$('.rd-chip').forEach(x=>x.style.background='')}openUntil=performance.now()+5200;CN.setName(S.name)});
 let uy=0,drag=null,mx=0,tx=0,tapS=null;const el=ren.domElement;el.style.touchAction='pan-y';
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse')tx=e.clientX/innerWidth-.5},{passive:true});
 const ray=new T.Raycaster(),nd=new T.Vector2();
 function doTap(ev){const r=el.getBoundingClientRect();if(!r.width||!r.height||mode!=='can')return;nd.set((ev.clientX-r.left)/r.width*2-1,-((ev.clientY-r.top)/r.height*2-1));CN.root.updateMatrixWorld(true);cam.updateMatrixWorld(true);ray.setFromCamera(nd,cam);
  if(ray.intersectObject(CN.root,true).length){manualT=performance.now();CN.setOpen(!CN.open)}}
 el.addEventListener('pointerdown',ev=>{drag=ev.clientX;tapS={x:ev.clientX,y:ev.clientY,t:performance.now()};try{el.setPointerCapture(ev.pointerId)}catch(_){}});
 el.addEventListener('pointermove',ev=>{if(tapS&&Math.hypot(ev.clientX-tapS.x,ev.clientY-tapS.y)>9)tapS=null;if(!drag&&drag!==0)return;uy+=(ev.clientX-drag)*.012;drag=ev.clientX});
 const pu=ev=>{drag=null;if(ev.type==='pointerup'&&tapS&&performance.now()-tapS.t<650)doTap(ev);tapS=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
 let on=false,t=0,last=performance.now();
 const isv=vis(box,v=>{on=v;if(v){last=performance.now();loop()}else stopCycle()});
 const TK2=TK;
 function loop(){if(!on)return;requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
  mx+=(tx-mx)*.05;if(drag===null)uy*=.985;
  if(mode==='can'){
   const idle=now-userT>6000;
   if(!RM&&idle){if(!cycOn){cycOn=true;cycH=rgb2hsl(...hex2rgb(S.hex))[0]}
    cycH=(cycH+dt*34)%360;const c=hsl2rgb(cycH,84,50),hx=rgb2hex(c[0],c[1],c[2]);
    const uu=uiAccent(cycH,84,50);IM.Paint.set(hx,uu.hex);
    if(now-cycUp>260){cycUp=now;const nm=nameFor(cycH,84,50);readouts(hx,nm);CN.setName(nm)}}
   // capacul se ridică periodic și lasă vopseaua la vedere
   if(now-manualT>9000){const ph=t%13;CN.setOpen(RM?true:(now<openUntil||(ph>3.2&&ph<10.2)))}
   IM.Paint.step(dt,now);IM.Paint.apply(CN.paintMats);ac.color.copy(IM.Paint.ui);
   P.rotation.y=mx*.35;CN.spinner.rotation.y=-.6+(RM?0:t*.32)+uy;
   CN.update(t,RM?0:dt,0);
   const Hh=CN.size.h0+.2,Ww=CN.size.w0*1.1,dz=Math.max(Hh/TK,Ww/(TK*asp))*1.06;cam.position.set(0,0,dz);cam.lookAt(0,0,0);G.rotation.x=.4;
  }else{
   IM.Paint.step(dt,now);IM.Paint.apply(E.paintMats);IM.Paint.apply(E.glowMats);ac.color.copy(IM.Paint.ui);
   G.rotation.x=.2;P.rotation.y=-.6+(RM?0:t*.22)+mx*.5+uy;
   E.update(t,RM?0:dt,{splash:sp});
   const W=11.1,H=7.0,dz=Math.max(H/TK,W/(TK*asp))*1.04;cam.position.set(0,0,dz);cam.lookAt(0,0,0)}
  ren.render(sc,cam)}
}
try{hero()}catch(e){const g=$('#gl');if(g)g.classList.add('nogl')}

/* ---------- SECȚIUNE FIXATĂ: cutie → spray → straturi → perete ---------- */
function model(){
 const sec=$('#model3d'),stage=$('#r3stage');if(!sec||!stage)return;
 const W=()=>stage.clientWidth,H=()=>stage.clientHeight;
 let ren;try{ren=mkRen({antialias:!isMob(),alpha:true,powerPreference:'low-power'})}catch(e){sec.classList.add('fallback');return}
 ren.setPixelRatio(Math.min(devicePixelRatio,isMob()?1.5:2));ren.setSize(W(),H());stage.appendChild(ren.domElement);
 const sc=new T.Scene(),cam=new T.PerspectiveCamera(32,W()/H(),.1,200);const env=makeEnv(ren);if(env)sc.environment=env;
 const ac=lights(sc,1.2);
 const SEG=isMob()?20:32,objs=IM.objects.map(f=>f(SEG)),P=new T.Group(),G=new T.Group();sc.add(P);P.add(G);
 objs.forEach(o=>{G.add(o.root);o.root.visible=false;o.e=0});G.rotation.y=-.45;
 let uy=0,up=0,drag=null,prog=0,aspEff=1,spin=0,last=performance.now(),fi=0;
 const el=ren.domElement;el.style.touchAction='pan-y';const ptrs=new Map();
 let tap=null;const ray=new T.Raycaster(),nd=new T.Vector2();
 function doTap(ev){const o=objs[fi];if(!o||!o.toggle)return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;nd.set((ev.clientX-r.left)/r.width*2-1,-((ev.clientY-r.top)/r.height*2-1));o.root.updateMatrixWorld(true);cam.updateMatrixWorld(true);ray.setFromCamera(nd,cam);if(ray.intersectObject(o.root,true).length)o.toggle()}
 el.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,1);try{el.setPointerCapture(ev.pointerId)}catch(_){}drag=[ev.clientX,ev.clientY];tap={x:ev.clientX,y:ev.clientY,t:performance.now()}});
 el.addEventListener('pointermove',ev=>{if(tap&&Math.hypot(ev.clientX-tap.x,ev.clientY-tap.y)>9)tap=null;if(!drag||!ptrs.has(ev.pointerId))return;uy=clamp(uy+(ev.clientX-drag[0])*.01,-2.4,2.4);up=clamp(up+(ev.clientY-drag[1])*.005,-.5,.5);drag=[ev.clientX,ev.clientY]});
 const pu=ev=>{ptrs.delete(ev.pointerId);if(!ptrs.size)drag=null;if(ev.type==='pointerup'&&tap&&performance.now()-tap.t<650)doTap(ev);tap=null};el.addEventListener('pointerup',pu);el.addEventListener('pointercancel',pu);
 const chs=$$('#model3d .r3ch'),bar=$('#r3bar'),rd=$$('.r3dots i'),hint=$('#r3hint');let hintI=-1;const HT=['ATINGE CUTIA CA S-O DESCHIZI · TRAGE ↔','MODEL ILUSTRATIV · DERULEAZĂ ↓ · TRAGE ↔'];
 const explode=u=>u<.14?0:u<.42?sm((u-.14)/.28):u<.68?1:u<.9?1-sm((u-.68)/.22):0;
 function onScroll(){const r=sec.getBoundingClientRect(),den=r.height-innerHeight;prog=den>0?clamp(-r.top/den,0,1):0;const i=Math.min(chs.length-1,Math.floor(prog*chs.length));chs.forEach((c,j)=>c.classList.toggle('on',j===i));rd.forEach((c,j)=>c.classList.toggle('on',j===i));if(hint&&hintI!==(i===0?0:1)){hintI=i===0?0:1;hint.textContent=HT[hintI]};if(bar)bar.style.transform=`scaleX(${prog})`}
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 // telefon: 3D doar în banda liberă de sub cel mai înalt text și deasupra barei; desktop: jumătatea dreaptă
 function vo(){const w=W(),h=H();if(!w||!h)return;ren.setSize(w,h);
  if(innerWidth>=900){const fw=w*.5;cam.aspect=fw/h;cam.setViewOffset(fw,h,-(w-fw),0,w,h)}
  else{let tb=0;chs.forEach(c=>{tb=Math.max(tb,c.offsetHeight)});const top=78+tb+14,bot=h-112,rh=Math.max(150,bot-top);cam.aspect=w/rh;cam.setViewOffset(w,rh,0,-top,w,h)}
  aspEff=cam.aspect;cam.updateProjectionMatrix()}
 vo();addEventListener('resize',vo);new ResizeObserver(vo).observe(stage);chs.forEach(c=>new ResizeObserver(vo).observe(c));setTimeout(vo,800);setTimeout(vo,2000);setTimeout(vo,3500);
 let on=false,firstFit=true;vis(sec,v=>{on=v;if(v){last=performance.now();tick()}});
 const TILT=[.34,.16,.42,.22];
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
  if(firstFit||RM){cam.position.z=dz;firstFit=false}else cam.position.z+=(dz-cam.position.z)*.1;cam.lookAt(0,0,0);
  ren.render(sc,cam)}
}
try{model()}catch(err){const s=$('#model3d');if(s)s.classList.add('fallback')}
})();

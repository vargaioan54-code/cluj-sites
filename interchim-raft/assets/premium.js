(function(){
'use strict';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
function $$(s){return [].slice.call(document.querySelectorAll(s));}
/* scroll progress line (follows the picked colour through --acs) + nav scrollspy */
var prog=document.createElement('div');prog.id='prog';prog.setAttribute('aria-hidden','true');document.body.appendChild(prog);
var links=$$('nav.top .lk a'),secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
var tick=false;
function onScroll(){
 if(tick)return;tick=true;
 requestAnimationFrame(function(){
  tick=false;
  var h=document.documentElement,max=h.scrollHeight-window.innerHeight,p=max>0?Math.min(1,Math.max(0,(window.pageYOffset||h.scrollTop)/max)):0;
  prog.style.setProperty('--p',p.toFixed(4));
  var mid=window.innerHeight*.38,cur=-1;
  secs.forEach(function(s,i){if(!s)return;var r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)cur=i;});
  /* sections without a nav link inherit the closest previous one */
  if(cur<0){var all=$$('main>section'),k=-1;all.forEach(function(s,i){var r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)k=i;});
   if(k>=0){for(var i=0;i<secs.length;i++){if(secs[i]&&all.indexOf(secs[i])<=k)cur=i;}}}
  links.forEach(function(a,i){a.classList.toggle('on',i===cur);if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 });
}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();

/* year counters: 1992 / 1993 count up once, when the timeline appears */
(function(){
 var ys=$$('#tl .y').filter(function(e){return /^\d{4}$/.test(e.textContent.trim());});
 if(!ys.length)return;
 var tl=document.getElementById('tl');
 ys.forEach(function(e){e.setAttribute('aria-label',e.textContent.trim());e.setAttribute('role','text');});
 if(reduce||!('IntersectionObserver' in window))return;
 ys.forEach(function(e){e.textContent=(+e.textContent.trim())-70;});
 var done=false;
 function run(){
  if(done)return;done=true;
  var t0=performance.now(),D=1300;
  var items=ys.map(function(e){var v=+e.getAttribute('aria-label');return{e:e,v:v,s:v-70};});
  (function step(now){
   var k=Math.min(1,(now-t0)/D),q=1-Math.pow(1-k,3);
   items.forEach(function(o){o.e.textContent=Math.round(o.s+(o.v-o.s)*q);});
   if(k<1)requestAnimationFrame(step);
  })(t0);
 }
 /* start the visual state at the start value only just before the observer fires */
 var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();run();}},{threshold:.2});
 io.observe(tl);
})();

/* cards: soft light that follows the pointer + slight icon parallax (mouse only) */
if(fine&&!reduce){
 $$('.card').forEach(function(c){
  var raf=0,ev=null;
  function upd(){raf=0;var r=c.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;
   c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
   c.style.setProperty('--px',((x/r.width-.5)*7).toFixed(1)+'px');c.style.setProperty('--py',((y/r.height-.5)*7).toFixed(1)+'px');}
  c.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;ev=e;c.classList.add('hot');if(!raf)raf=requestAnimationFrame(upd);});
  c.addEventListener('pointerleave',function(){c.classList.remove('hot');c.style.setProperty('--px','0px');c.style.setProperty('--py','0px');});
 });
}

/* cursor-follow soft glow (desktop only) */
if(fine&&!reduce){
 var g=document.createElement('div');g.id='cglow';g.setAttribute('aria-hidden','true');document.body.appendChild(g);
 var tx=-999,ty=-999,x=tx,y=ty,run=false,seen=false;
 window.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;if(!seen){seen=true;x=tx;y=ty;g.classList.add('on');}if(!run){run=true;requestAnimationFrame(loop);}},{passive:true});
 document.addEventListener('pointerleave',function(){g.classList.remove('on');seen=false;});
 function loop(){
  if(document.hidden){run=false;return;}
  x+=(tx-x)*.12;y+=(ty-y)*.12;
  g.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
  if(Math.abs(tx-x)+Math.abs(ty-y)>.6)requestAnimationFrame(loop);else run=false;
 }
}
})();

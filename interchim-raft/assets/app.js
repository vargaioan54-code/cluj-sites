(function(){
'use strict';
var C=window.RAFT_COLORS,N=C.length,body=document.body,INK='#0d0e11';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s){return document.querySelector(s);}
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function rgb2hex(a){return '#'+a.map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2);}).join('');}
function mix(a,b,t){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t]);}
function lum(h){var c=hex2rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
/* intro */
var intro=$('#intro');
function endIntro(skip){
 if(!intro||intro.classList.contains('gone'))return;
 if(skip){intro.classList.add('out');}
 body.classList.remove('intro-on');
 setTimeout(function(){intro.classList.add('gone');},skip?750:100);
}
if(intro){
 if(reduce){intro.classList.add('gone');body.classList.remove('intro-on');}
 else{
  intro.addEventListener('click',function(){endIntro(true);});
  setTimeout(function(){body.classList.remove('intro-on');},3000);
  intro.addEventListener('animationend',function(e){if(e.animationName==='iup'||e.animationName==='iup2')intro.classList.add('gone');});
  setTimeout(function(){intro.classList.add('gone');},4000);
 }
}
/* chips */
var chl=$('#chl'),chips=[];
C.forEach(function(c,i){
 var b=document.createElement('button');b.type='button';b.className='chip';b.setAttribute('aria-pressed','false');b.style.setProperty('--c',c.h);
 b.innerHTML='<span class="dot" aria-hidden="true"></span><span>'+c.n+'</span>';
 b.setAttribute('aria-label','Deschide cutia '+c.n.toLowerCase());
 b.addEventListener('click',function(){request(i,true);});chl.appendChild(b);chips.push(b);
});
/* state */
var cur=-1,gl=window.RaftGL&&window.RaftGL.ok;
var info=$('#info');
function paintUI(i){
 var c=C[i],bg=mix(INK,c.h,.3);
 if(lum(c.h)>.6)bg=mix(INK,c.h,.22);
 var ac=c.h;if(lum(ac)<.14)ac=mix(ac,'#ffffff',.55);
 var r=document.documentElement.style;
 r.setProperty('--bg',bg);r.setProperty('--ac',ac);r.setProperty('--acs',lum(ac)<.25?mix(ac,'#ffffff',.35):ac);
 r.setProperty('--ac-tx',lum(ac)>.3?INK:'#ffffff');
 $('#isw').style.setProperty('--c',c.h);$('#inm').textContent=c.n;$('#ihx').textContent=c.h.toUpperCase();
 document.querySelector('meta[name=theme-color]').setAttribute('content',bg);
 info.style.setProperty('--c',c.h);
 body.style.setProperty('--c',c.h);
 var fb=$('.fbbig');if(fb)fb.style.setProperty('--c',c.h);var fn=$('#fbnm');if(fn)fn.textContent=c.n;
 chips.forEach(function(b,k){b.setAttribute('aria-pressed',k===i?'true':'false');});
 return bg;
}
function resetUI(){
 var r=document.documentElement.style;['--bg','--ac','--acs','--ac-tx'].forEach(function(k){r.removeProperty(k);});
 document.querySelector('meta[name=theme-color]').setAttribute('content',INK);
 chips.forEach(function(b){b.setAttribute('aria-pressed','false');});
}
function scrollHero(){
 var h=$('#raft'),y=h.getBoundingClientRect().top+window.pageYOffset;
 var cut=window.pageYOffset-y;
 if(cut>-10||window.pageYOffset-y<-80){window.scrollTo({top:Math.max(0,y),behavior:reduce?'auto':'smooth'});}
}
function request(i,fromChip){
 if(i===cur)return;
 if(gl&&window.RaftGL.isBusy())return;
 var bg=paintUI(i);
 body.classList.add('picked');$('#hint').firstChild.innerHTML='<b>Închide</b> ca să pui cutia înapoi pe raft';
 if(fromChip)scrollHero();
 if(gl){window.RaftGL.pick(i,bg);}
 else{body.classList.remove('opened');void body.offsetWidth;setTimeout(function(){body.classList.add('opened');},60);}
 cur=i;
}
function closeIt(){
 if(cur<0)return;
 if(gl)window.RaftGL.close();else body.classList.remove('opened');
 body.classList.remove('picked');$('#hint').firstChild.innerHTML='<b>Atinge o cutie</b> ca să o deschizi';cur=-1;resetUI();
}
$('#iclose').addEventListener('click',closeIt);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeIt();});
if(gl){
 window.RaftGL.onPick=function(i){request(i,false);};
 window.RaftGL.onBackground=closeIt;
}else{
 body.classList.add('nogl');
 var fb=$('#fb');var rows=Math.ceil(N/7);
 for(var r=0;r<rows;r++){
  var row=document.createElement('div');row.className='fbrow';
  for(var k=r*7;k<Math.min(N,r*7+7);k++)(function(i){
   var b=document.createElement('button');b.type='button';b.className='stin';b.setAttribute('aria-label','Deschide cutia '+C[i].n.toLowerCase());
   b.innerHTML='<i></i><b>'+C[i].n+'</b>';b.addEventListener('click',function(){request(i,false);});row.appendChild(b);
  })(k);
  fb.appendChild(row);
 }
}
/* hours */
(function(){
 var d=new Date(),day=d.getDay(),rows=document.querySelectorAll('#hrs tr');
 rows.forEach(function(r){if(+r.getAttribute('data-d')===day)r.classList.add('today');});
 var m=d.getHours()*60+d.getMinutes(),o=false;
 if(day>=1&&day<=5)o=m>=480&&m<960;else if(day===6)o=m>=540&&m<780;
 var s=$('#openstate');s.textContent=o?'Acum: deschis':'Acum: închis';s.style.color=o?'#7be08f':'#ffb4a8';
})();
/* reveal */
(function(){
 var els=document.querySelectorAll('.rv');
 if(!('IntersectionObserver' in window)||reduce){els.forEach(function(e){e.classList.add('in');});return;}
 var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});
 els.forEach(function(e){io.observe(e);});
 var tl=$('#tl');
})();
/* hint text on touch */
(function(){var h=$('#hint');if(window.matchMedia('(max-width:899px)').matches&&gl){}})();
})();

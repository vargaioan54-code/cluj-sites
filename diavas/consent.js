(()=>{
const K='diavas_consent_v1',MAPQ='https://maps.google.com/maps?q=Strada+Beiu%C8%99ului+50,+Cluj-Napoca&z=16&output=embed';
const css=`#ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;background:#0b2034;border:1px solid #17354f;border-radius:16px;padding:20px;color:#eef7fc;font:15px/1.5 system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.7)}
#ck h4{font:700 22px system-ui,sans-serif;text-transform:uppercase;margin:0 0 6px}#ck p{margin:0 0 12px;color:#8aa6bb}#ck a{color:#3fc8ff;text-decoration:underline;display:inline-block;padding:11px 0;line-height:22px}
#ck .r{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}#ck button{font:700 16px system-ui,sans-serif;text-transform:uppercase;padding:11px 8px;border-radius:999px;border:1.5px solid #3fc8ff;background:#0b2034;color:#3fc8ff;cursor:pointer}
#ck button:hover{background:#3fc8ff;color:#031526}#ck label{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid #17354f}#ck input{margin-top:4px;accent-color:#3fc8ff}#ck .st{display:none;margin-bottom:12px}#ck.set .st{display:block}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const get=()=>{try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}};
function apply(c){if(!c)return;
 if(c.ext)loadMap()}
function loadMap(){const m=document.getElementById('map');if(m&&!m.querySelector('iframe'))m.innerHTML=`<iframe title="Hartă Diavas spălătorie auto, Str. Beiușului 50, Cluj-Napoca" loading="lazy" src="${MAPQ}" style="width:100%;height:100%;min-height:340px;border:0;display:block"></iframe>`}
function save(ext){const c={ext:!!ext,ts:new Date().toISOString()};localStorage.setItem(K,JSON.stringify(c));close();apply(c);}
function close(){const b=document.getElementById('ck');b&&b.remove()}
function open(set){close();const c=get()||{};const d=document.createElement('div');d.id='ck';d.setAttribute('role','dialog');d.setAttribute('aria-label','Consimțământ cookie');
 d.innerHTML=`<h4>Cookie-uri</h4><p>Site-ul nu folosește cookie-uri proprii de urmărire. Harta Google se încarcă doar dacă ești de acord. Detalii în <a href="politica-cookies.html">Politica de cookie-uri</a>.</p>
 <div class="st"><label><input type="checkbox" checked disabled> <span><b>Strict necesare</b> – memorarea alegerii tale (localStorage). Mereu active.</span></label><label><input type="checkbox" id="ckx" ${c.ext?'checked':''}> <span><b>Servicii externe</b> – Google Maps (hartă).</span></label></div>
 <div class="r"><button data-a="acc">Accept</button><button data-a="ref">Refuz</button><button data-a="set">Setări</button></div>`;
 document.body.appendChild(d);if(set)d.classList.add('set');
 d.addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
  if(a==='acc')save(true);if(a==='ref')save(false);
  if(a==='set'){if(d.classList.contains('set'))save(document.getElementById('ckx').checked);else{d.classList.add('set');e.target.textContent='Salvează'}}})}
document.addEventListener('click',e=>{if(e.target.closest('[data-ck]')){e.preventDefault();open(true)}
 if(e.target.id==='loadmap'){const c=get()||{};if(c.ext)loadMap();else open(true)}});
const c=get();if(c)apply(c);else open(false);
window.gsCookieSettings=()=>open(true);
})();

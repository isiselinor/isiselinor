// Eventos de Google Analytics (el tag base está en el <head> de index.html)
(function(){
if(typeof window.gtag!=='function')return;
const track=(n,p)=>gtag('event',n,p||{});window.track=track;
const once={};const t1=(n,p)=>{if(once[n])return;once[n]=1;track(n,p);};
document.addEventListener('click',e=>{const a=e.target.closest('a,button');if(!a)return;
const h=a.getAttribute('href')||'';
if(h.indexOf('wa.me')>-1)track('whatsapp_click');
else if(h.indexOf('mailto:')===0)track('email_click');
else{const r=h.match(/substack|instagram|youtube|linkedin/);if(r)track('social_click',{red:r[0]});}
if(a.id==='auto')track('planner_auto');
if(a.closest('.pin')||a.closest('.mtabs'))t1('anatomia_interaccion');
if(a.closest('.lang'))track('idioma',{idioma:a.dataset.l||''});
if(a.closest('.qo'))t1('crisis_inicio');
if(a.id==='qdMail')track('crisis_a_contacto');
},true);
document.addEventListener('pointerup',e=>{if(e.target.closest&&e.target.closest('.it'))t1('planner_interaccion');},true);
const f=document.getElementById('cf');if(f)f.addEventListener('submit',()=>track('generate_lead'));
const d=document.getElementById('done');if(d)new MutationObserver(()=>{if(d.classList.contains('show'))t1('planner_completo');}).observe(d,{attributes:true,attributeFilter:['class']});
})();

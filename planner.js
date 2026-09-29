(function(){
const cal=document.getElementById('cal'),margin=document.getElementById('margin');if(!cal)return;
const U={prod:'#f0a93c',gira:'#9c86d9',dir:'#241d1a',lio:'#d62b25'};const TT={prod:'#fbe3b8',gira:'#e7e0f7',dir:'#ffffff',lio:'#f6d5d2'};
const N=[['gira','Show Guayaquil',4,'ok'],['gira','Pasajes a México',15,'urg'],['prod','Renta de equipos',8,'done'],['prod','Cuentas por pagar',29,''],['gira','Check-in Zacatecas',18,'ok'],['prod','Rider técnico',10,'done'],['dir','Base de datos videógrafos',28,''],['lio','Email del newsletter',30,'urg'],['dir','Reunión con el sello',22,'ok'],['prod','Pastel para el cumple',12,''],['gira','Logística Cali',24,''],['lio','Llegar 15 min antes',1,'done']];
const H=[[10,38,-5],[40,86,4],[6,134,-2],[30,182,6],[4,230,-4],[36,278,3],[8,326,-6],[28,374,2],[12,422,-3],[42,470,5],[6,518,-2],[32,566,4]];
const cells=[];
for(let k=0;k<35;k++){const c=document.createElement('div');c.className='day';let num;
if(k===0){num=31;c.classList.add('out');}else{num=k;if(num>30){num-=30;c.classList.add('out');}else c.dataset.d=num;}
if(num===29&&c.dataset.d)c.classList.add('today');
c.innerHTML='<span class="n">'+num+'</span><div class="list"></div>';cal.appendChild(c);if(c.dataset.d)cells.push(c);}
const dayCell=n=>cells.find(c=>+c.dataset.d===n);
const ST=['','s-ok','s-done','s-urg'];
const items=N.map(([u,t],i)=>{const e=document.createElement('div');e.className='it';e.dataset.i=i;e.innerHTML='<i class="u" style="background:'+U[u]+'"></i><span class="x">'+t+'</span>';e.style.setProperty('--tint',TT[u]);e.style.setProperty('--i',i);home(e,i);return e;});
function home(e,i){margin.appendChild(e);const h=H[i],w=margin.clientWidth||220;e.style.left=Math.max(6,Math.min(h[0]/100*w,w-178))+'px';e.style.top=h[1]+'px';e.style.setProperty('--r',h[2]+'deg');e.className='it';e.style.width='';}
function flip(e,mut){const a=e.getBoundingClientRect();mut();const b=e.getBoundingClientRect();e.style.transition='none';e.style.transform='translate('+(a.left-b.left)+'px,'+(a.top-b.top)+'px)';e.offsetWidth;e.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';e.style.transform='';setTimeout(()=>e.style.transition='',600);}
function toDay(e,c){e.classList.remove('drag');e.style.left='';e.style.top='';e.style.width='';c.querySelector('.list').appendChild(e);}
function setState(e,s){ST.forEach(x=>x&&e.classList.remove(x));if(s)e.classList.add(s);}
function update(){const n=items.filter(e=>e.closest('.day')).length;
cells.forEach(c=>{const l=[...c.querySelectorAll('.it')];c.classList.toggle('closed',l.length>0&&l.every(e=>e.classList.contains('s-done')));});
const bar=document.getElementById('bar');bar.style.width=(n/12*100)+'%';bar.style.setProperty('--mc',n<6?'#d62b25':n<12?'#f0a93c':'#5d4aa0');document.getElementById('count').textContent=n+' de 12 en su día';
document.getElementById('state').textContent=n===0?'Modo crisis.':n<6?'Vamos armando el mes.':n<12?'Ya se ve el mes.':'Mes en orden.';
document.body.classList.toggle('crisis',n<6);document.getElementById('done').classList.toggle('show',n===12);}
function target(x,y){return document.elementsFromPoint(x,y).find(el=>el.classList&&(el.classList.contains('day')||el.id==='margin'));}
let dr=null;
items.forEach(e=>e.addEventListener('pointerdown',ev=>{ev.preventDefault();const r=e.getBoundingClientRect();dr={e,sx:ev.clientX,sy:ev.clientY,ox:ev.clientX-r.left,oy:ev.clientY-r.top,moved:false};}));
window.addEventListener('pointermove',ev=>{if(!dr)return;const e=dr.e;if(!dr.moved&&Math.hypot(ev.clientX-dr.sx,ev.clientY-dr.sy)<5)return;ev.preventDefault();
if(!dr.moved){dr.moved=true;document.body.appendChild(e);e.classList.add('drag');e.style.width='170px';e.style.transform='rotate(-2deg)';}
e.style.left=(ev.clientX-dr.ox)+'px';e.style.top=(ev.clientY-dr.oy)+'px';
cells.forEach(c=>c.classList.remove('over'));const t=target(ev.clientX,ev.clientY);if(t&&t.dataset&&t.dataset.d)t.classList.add('over');},{passive:false});
function end(ev){if(!dr)return;const e=dr.e,moved=dr.moved;dr=null;cells.forEach(c=>c.classList.remove('over'));
if(!moved){if(e.closest('.day')){const k=ST.findIndex(s=>s&&e.classList.contains(s));setState(e,ST[(k<0?0:k)+1]||'');update();}return;}
e.style.transform='';const t=target(ev.clientX,ev.clientY),i=+e.dataset.i;
if(t&&t.dataset&&t.dataset.d){flip(e,()=>toDay(e,t));}
else if(t===margin){const m=margin.getBoundingClientRect();e.classList.remove('drag');e.style.width='';margin.appendChild(e);e.className='it';e.style.left=Math.max(6,Math.min(ev.clientX-20-m.left,m.width-178))+'px';e.style.top=Math.max(30,Math.min(ev.clientY-m.top-10,m.height-50))+'px';}
else{flip(e,()=>home(e,i));}
update();}
window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
document.getElementById('auto').onclick=()=>items.forEach((e,k)=>setTimeout(()=>{const c=dayCell(N[k][2]);if(e.closest('.day')!==c)flip(e,()=>toDay(e,c));setState(e,N[k][3]?'s-'+N[k][3]:'');update();},k*120));
document.getElementById('reset').onclick=()=>items.forEach((e,i)=>setTimeout(()=>{flip(e,()=>home(e,i));update();},i*50));
let lw=0;new ResizeObserver(()=>{const w=margin.clientWidth;if(w===lw)return;lw=w;items.forEach((e,i)=>{if(e.parentNode===margin)home(e,i);});}).observe(margin);
update();
})();

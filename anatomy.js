(function(){
const A=document.getElementById('anat');if(!A)return;
const pins=[...A.querySelectorAll('.pin')].sort((x,y)=>x.dataset.k-y.dataset.k),hs=[...A.querySelectorAll('.hs')],fig=A.querySelector('.fig'),zoom=document.getElementById('zoom'),img=fig.querySelector('img');
const st=document.getElementById('anatState'),all=document.getElementById('allAt'),mob=document.getElementById('anatMob'),tabs=mob.querySelector('.mtabs');
const W={1:'cabeza',2:'corazón',3:'voz',4:'cuerpo',5:'laptop',6:'pies en la tierra'};
const mq=matchMedia('(max-width:860px)');let cur=0,allOn=false;
pins.forEach(p=>{const b=document.createElement('button');b.type='button';b.textContent='0'+p.dataset.k;b.dataset.k=p.dataset.k;b.setAttribute('role','tab');b.onclick=()=>sel(+p.dataset.k);tabs.appendChild(b);});
function frame(k){if(!k){zoom.style.setProperty('--s',1);zoom.style.setProperty('--ty','0px');zoom.style.setProperty('--ox','50%');zoom.style.setProperty('--oy','50%');return;}
const d=hs.find(x=>+x.dataset.k===k),top=parseFloat(d.style.top),fh=fig.clientHeight,zh=zoom.clientHeight;
const s=k===4||k===6?1.5:1.9;zoom.style.setProperty('--ox',d.style.left);zoom.style.setProperty('--oy',d.style.top);zoom.style.setProperty('--s',s);const ty=fh/2-top/100*zh;zoom.style.setProperty('--ty',ty+'px');
const box=document.getElementById('miniBox');if(box&&zh){const ox=parseFloat(d.style.left)/100,oy=top/100,fw=fig.clientWidth,zw=zoom.clientWidth,zl=(fw-zw)/2;
// área visible del fig en coordenadas del zoom sin escalar
const vx0=(0-zl-ox*zw)/s+ox*zw,vx1=(fw-zl-ox*zw)/s+ox*zw,vy0=(0-ty-oy*zh)/s+oy*zh,vy1=(fh-ty-oy*zh)/s+oy*zh;
const cl=v=>Math.max(0,Math.min(100,v));box.style.left=cl(vx0/zw*100)+'%';box.style.width=(cl(vx1/zw*100)-cl(vx0/zw*100))+'%';box.style.top=cl(vy0/zh*100)+'%';box.style.height=(cl(vy1/zh*100)-cl(vy0/zh*100))+'%';}
const cn=document.getElementById('capN');if(cn){cn.textContent='0'+k;document.getElementById('capW').textContent=W[k];document.getElementById('capS').textContent='× '+s;}}
function render(){const k=cur;
pins.forEach(p=>p.classList.toggle('on',allOn||+p.dataset.k===k));hs.forEach(d=>d.classList.toggle('on',!allOn&&+d.dataset.k===k));
A.classList.toggle('focus',!allOn&&k>0);[...tabs.children].forEach(b=>b.classList.toggle('on',+b.dataset.k===k));
frame(allOn?0:k);
st.textContent=allOn?'6 de 6 — así trabaja una productora.':k?'0'+k+' · '+W[k]:'Toca uno para verlo de cerca';all.textContent=allOn?'Uno por uno':'Todos a la vez';
if(k){const p=pins[k-1];document.getElementById('mN').textContent='0'+k+' / 06';document.getElementById('mWhere').textContent=W[k];document.getElementById('mT').innerHTML=p.querySelector('.ti').innerHTML;document.getElementById('mD').textContent=p.querySelector('.de').textContent;document.getElementById('mNext').textContent=k===6?'Volver al 01 →':'Siguiente →';}}
function sel(k){allOn=false;cur=(!mq.matches&&cur===k)?0:k;render();}
pins.forEach(p=>{p.addEventListener('click',()=>sel(+p.dataset.k));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(+p.dataset.k);}});});
all.onclick=()=>{allOn=!allOn;cur=allOn?0:1;render();};
document.getElementById('mPrev').onclick=()=>sel(cur<=1?6:cur-1);document.getElementById('mNext').onclick=()=>sel(cur>=6?1:cur+1);
let sx=0;fig.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
fig.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)sel(dx<0?(cur>=6?1:cur+1):(cur<=1?6:cur-1));});
const sync=()=>{if(mq.matches&&!cur){cur=1;allOn=false;}render();};
mq.addEventListener('change',sync);if(img.complete)sync();else img.addEventListener('load',sync);
new ResizeObserver(()=>render()).observe(fig);
})();

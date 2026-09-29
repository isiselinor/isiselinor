(function(){
const qs=[...document.querySelectorAll('.qz-q')];if(!qs.length)return;const ans={};
const res=document.getElementById('qzRes'),pct=document.getElementById('qzPct'),bar=document.getElementById('qzBar'),ti=document.getElementById('qzTitle'),no=document.getElementById('qzNote'),go=document.getElementById('qzGo'),lbl=document.getElementById('qzLbl');
const L=[
{t:'Casi en orden.',n:'Lo tuyo es un empujón: una mentoría para ordenar tu proceso y arrancar.',s:'Mentoría para creativos'},
{t:'Lío mediano. Nada que no se ordene.',n:'Necesitas estructura y alguien que sostenga los tiempos. Dirección creativa, por etapas.',s:'Dirección creativa de producciones'},
{t:'Modo crisis total. Llámame.',n:'Hay gente, fechas y logística en juego. Producción integral y tour management, de principio a fin.',s:'Producción integral / Tour management'}];
let shown=0;
function anim(to){const from=shown;const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/600);const v=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));pct.textContent=v;if(k<1)requestAnimationFrame(step);else shown=to;};requestAnimationFrame(step);}
function upd(){const n=Object.keys(ans).length,sum=Object.values(ans).reduce((a,b)=>a+b,0),p=n?Math.round(sum/(n*2)*100):0;
anim(p);bar.style.left='calc('+p+'% - 1.5px)';
const lv=p<34?0:p<67?1:2;res.classList.remove('l0','l1','l2');if(n)res.classList.add('l'+lv);
lbl.textContent=n<6?'Tu nivel · '+n+' de 6':'Tu nivel';
if(n<6){ti.textContent=n?'Sigue… faltan '+(6-n)+'.':'Responde para ver tu nivel.';go.setAttribute('aria-disabled','true');}
else{ti.textContent=L[lv].t;no.innerHTML='<span class="ast">*</span> '+L[lv].n;go.setAttribute('aria-disabled','false');go.dataset.s=L[lv].s;go.dataset.p=p;}
document.body.classList.toggle('crisis',n===6&&lv===2);}
qs.forEach(q=>q.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{q.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));ans[q.dataset.q]=+b.dataset.v;q.classList.add('done');upd();})));
document.getElementById('qzReset').onclick=()=>{for(const k in ans)delete ans[k];qs.forEach(q=>{q.classList.remove('done');q.querySelectorAll('button').forEach(x=>x.classList.remove('on'));});no.innerHTML='<span class="ast">*</span> sin compromiso: es un diagnóstico, no un presupuesto.';upd();};
const S=[
{c:'var(--lilac-700)',t:'var(--lilac-100)',n:'Mentoría para creativos',d:'Uno a uno, para entender tu propio proceso. Mapeamos tus territorios confusos, nombramos tus patrones y encontramos lo que de verdad funciona para ti.',inc:['Mapeo de tus territorios confusos','Nombrar tus patrones de trabajo','Un método propio que funcione para ti','Te guío por tus propios experimentos'],sk:[['02','Brújula emocional'],['03','Comunicación que fluye']],fl:[0,2]},
{c:'var(--mango-700)',t:'var(--mango-100)',n:'Dirección creativa de producciones',d:'Diseño y dirijo tours, lanzamientos y eventos donde coexisten visiones distintas. Cada rol claro, la información fluyendo, cada voz escuchada.',inc:['Forma y rumbo para tu tour, lanzamiento o evento','Cada rol claro','La información fluyendo','Cada voz escuchada'],sk:[['01','Dirección creativa'],['03','Comunicación que fluye'],['04','Producción integral']],fl:[0,1,3]},
{c:'var(--red)',t:'var(--red-100)',n:'Producción integral + tour management',d:'De la idea al montaje: estructura, tiempos y ejecución. Tour management de logística integral, con control y respuesta rápida ante imprevistos.',inc:['Estructura, tiempos y ejecución','Logística integral: vuelos, hoteles, riders','Monitoreo con agentes de IA propios','Respuesta rápida ante imprevistos'],sk:[['04','Producción integral'],['05','IA & automatización'],['06','Gestión de crisis']],fl:[0,1,2,3]}];
const FL=['Iniciar','Experimentar','Enseñar','Conectar'];
const dlg=document.getElementById('qzDlg'),tabs=[...dlg.querySelectorAll('.qd-tabs button')];let rec=0;
function show(l){const s=S[l];dlg.style.setProperty('--c',s.c);dlg.style.setProperty('--t',s.t);
tabs.forEach(b=>{b.classList.toggle('on',+b.dataset.l===l);b.classList.toggle('rec',+b.dataset.l===rec);});
document.getElementById('qdT').textContent=s.n;document.getElementById('qdD').textContent=s.d;
document.getElementById('qdRec').textContent=l===rec?'Recomendado para ti':'Otra opción';
document.getElementById('qdInc').innerHTML=s.inc.map((x,i)=>'<li><b>0'+(i+1)+'</b><span>'+x+'</span></li>').join('');
document.getElementById('qdSk').innerHTML=s.sk.map(x=>'<li><b>'+x[0]+'</b><span>'+x[1]+'</span></li>').join('');
document.getElementById('qdFl').innerHTML=FL.map((x,i)=>'<span class="'+(s.fl.includes(i)?'on':'')+'">'+x+'</span>').join('→');
dlg.dataset.l=l;}
function why(){const hi=qs.filter(q=>ans[q.dataset.q]===2).map(q=>q.querySelector('button.on').textContent);
return hi.length?'<b>Lo que más pesa</b>'+hi.join(' · '):'<b>Lo que más pesa</b>Nada urgente. Buen momento para ordenar antes de que lo sea.';}
tabs.forEach(b=>b.onclick=()=>show(+b.dataset.l));
document.getElementById('qdX').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
const summary=()=>qs.map(q=>{const b=q.querySelector('button.on');return '– '+q.querySelector('.qt').textContent+' '+(b?b.textContent:'');}).join('\n');
go.addEventListener('click',()=>{const p=+go.dataset.p;rec=p<34?0:p<67?1:2;document.getElementById('qdPct').textContent=p+'%';document.getElementById('qdWhy').innerHTML=why();show(rec);dlg.showModal();});
document.getElementById('qdMail').onclick=()=>{const l=+dlg.dataset.l,a=document.getElementById('cf-asunto'),m=document.getElementById('cf-mensaje');
if(a)a.value='Crisis-ómetro '+go.dataset.p+'% — '+S[l].n;if(m)m.value=summary();dlg.close();window.scrollTo({top:document.getElementById('contacto').getBoundingClientRect().top+scrollY-80,behavior:'smooth'});setTimeout(()=>document.getElementById('cf-nombre').focus({preventScroll:true}),600);};
dlg.addEventListener('close',()=>{});
document.getElementById('qdWa').addEventListener('click',function(){const l=+dlg.dataset.l;this.href='https://wa.me/5491164136897?text='+encodeURIComponent('Hola Isis, hice el Crisis-ómetro: '+go.dataset.p+'%. Me interesa: '+S[l].n+'.');});
upd();
})();

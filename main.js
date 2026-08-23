const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.preloader')?.remove(),1700));
$('.menu-btn')?.addEventListener('click',()=>$('.menu')?.classList.toggle('open'));
$$('.menu a').forEach(a=>a.addEventListener('click',()=>$('.menu')?.classList.remove('open')));
const phrases=['Built to Compete...','Programmed to Win...','APS LBS Marg Tinkering Lab'];let pi=0,ci=0,del=false;
function type(){const el=$('#typewriter');if(!el)return;const t=phrases[pi];el.textContent=del?t.slice(0,ci--):t.slice(0,ci++);if(!del&&ci>t.length){del=true;setTimeout(type,900);return}if(del&&ci<0){del=false;pi=(pi+1)%phrases.length;ci=0}setTimeout(type,del?35:70)}type();
const deadline=new Date('2026-09-01T00:00:00+05:30').getTime();function tick(){const box=$('#countdown'),st=$('#deadlineStatus');if(!box)return;let d=deadline-Date.now();if(d<=0){box.innerHTML='<div style="min-width:280px"><b style="font-size:26px;color:#e7b75b">REGISTRATION CLOSED</b></div>';st.textContent='REGISTRATION CLOSED';return}const day=Math.floor(d/864e5);d%=864e5;const h=Math.floor(d/36e5);d%=36e5;const m=Math.floor(d/6e4);const s=Math.floor(d/1e3)%60;[day,h,m,s].forEach((v,i)=>box.children[i*2].querySelector('b').textContent=String(v).padStart(2,'0'))}tick();setInterval(tick,1000);

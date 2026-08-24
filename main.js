
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const $=(s,c=document)=>c.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('loaded');
  const loader=$('#rk-loader'); if(loader) setTimeout(()=>loader.remove(),900);

  // Mobile navigation
  const toggle=$('[data-menu]'), menu=$('[data-mobile-menu]');
  toggle?.addEventListener('click',()=>{
    const open=!menu?.classList.contains('open');
    menu?.classList.toggle('open',open); toggle.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open)); document.body.classList.toggle('menu-open',open);
  });
  $$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');toggle?.classList.remove('open');document.body.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false')}));

  // Active navigation
  const path=location.pathname.split('/').pop()||'index.html';
  $$('.desktop-nav a,.mobile-menu a').forEach(a=>{const href=a.getAttribute('href')||''; if(href.endsWith(path) || (path===''&&href.endsWith('index.html'))) a.classList.add('active')});

  // Scroll reveal
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8%'});
  $$('.reveal,.stagger').forEach(e=>observer.observe(e));

  // Scroll progress + top button
  const bar=document.createElement('div'); bar.id='rk-progress'; document.body.appendChild(bar);
  const top=document.createElement('button'); top.className='rk-top'; top.type='button'; top.setAttribute('aria-label','Back to top'); top.textContent='↑'; document.body.appendChild(top);
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
  const nav=$('[data-nav]'); let ticking=false;
  const update=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.width=`${scrollY/max*100}%`;nav?.classList.toggle('scrolled',scrollY>30);top.classList.toggle('show',scrollY>500);ticking=false};
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true}); update();

  // Countdown
  $$('[data-countdown-target]').forEach(el=>{
    const target=Date.parse(el.dataset.countdownTarget); if(!Number.isFinite(target)) return;
    const days=$('[data-days]',el), hours=$('[data-hours]',el), minutes=$('[data-minutes]',el), seconds=$('[data-seconds]',el), timer=$('.timer',el), deadline=$('.deadline',el);
    let last=[];
    const tick=()=>{let r=target-Date.now(); if(r<=0){if(timer) timer.innerHTML='<div class="closed-message"><strong>REGISTRATION CLOSED</strong><span>The deadline has passed. Event day: 02 September 2026.</span></div>';if(deadline)deadline.textContent='REGISTRATION CLOSED';return clearInterval(id)}; const v=[Math.floor(r/864e5),Math.floor(r/36e5)%24,Math.floor(r/6e4)%60,Math.floor(r/1e3)%60];[days,hours,minutes,seconds].forEach((x,i)=>{if(!x)return;const s=String(v[i]).padStart(2,'0');if(last[i]!==s){x.textContent=s;x.closest('.time')?.classList.add('tick');setTimeout(()=>x.closest('.time')?.classList.remove('tick'),350);last[i]=s}})};
    let id=0; tick(); id=setInterval(tick,250);
  });

  // Accordion rules / FAQ
  $$('.rule button').forEach(btn=>btn.addEventListener('click',()=>{const rule=btn.closest('.rule'); const open=rule.classList.contains('open'); $$('.rule.open').forEach(x=>x.classList.remove('open')); if(!open) rule.classList.add('open')}));

  // Subtle parallax for visual elements
  if(!reduced){
    $$('[data-parallax]').forEach(el=>{addEventListener('scroll',()=>{const r=el.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight)return; const y=(r.top-innerHeight/2)*-.035; el.style.transform=`translate3d(0,${y}px,0)`},{passive:true})});
  }
});

/* RoboKriti 2026 — interaction, animation, navigation and countdown layer */
document.addEventListener('DOMContentLoaded',()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.body.dataset.page=page.replace('.html','');

  // Progress + system UI
  const progress=document.createElement('div'); progress.className='progress'; document.body.prepend(progress);
  const grid=document.createElement('div'); grid.className='ui-grid'; document.body.appendChild(grid);
  const back=document.createElement('button'); back.className='backtop'; back.type='button'; back.setAttribute('aria-label','Back to top'); back.textContent='↑'; document.body.appendChild(back);
  const toast=document.createElement('div'); toast.className='toast'; toast.setAttribute('role','status'); document.body.appendChild(toast);
  function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),3600)}

  // Mobile nav + active link
  const h=$('.hamb'), l=$('.links');
  if(h&&l){h.setAttribute('aria-expanded','false');h.addEventListener('click',()=>{const open=l.classList.toggle('open');h.setAttribute('aria-expanded',String(open));h.textContent=open?'×':'☰'});}
  $$('.links a').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(href===page) a.classList.add('active');
    a.addEventListener('click',()=>l&&l.classList.remove('open'));
  });

  // Scroll UI
  let ticking=false;
  function onScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
    $('.nav')?.classList.toggle('scrolled',scrollY>24);
    back.classList.toggle('show',scrollY>500);
    ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}}, {passive:true}); onScroll();
  back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // Reveal observer
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.10});
  $$('.reveal').forEach((e,i)=>{e.classList.add('delay-'+((i%4)+1));observer.observe(e)});

  // Add a small system badge to page headers, making every page feel part of one UI system
  const ph=$('.pagehead');
  if(ph&&!$('.page-kicker',ph)){
    const kicker=document.createElement('div'); kicker.className='page-kicker'; kicker.innerHTML='<i></i> ROBOKRITI // SYSTEM ONLINE';
    ph.appendChild(kicker);
  }

  // Pointer glow
  if(matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')},{passive:true});
    $$('.card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-7px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  // Working countdown. Registration deadline is explicit; event date is fallback if a page uses data-event-countdown.
  const countEls=$$('[data-count]');
  if(countEls.length){
    const target=Date.parse('2026-08-31T23:59:59+05:30');
    let closed=false, last=[];
    const countBox=$('.count');
    const tick=()=>{
      let diff=Math.max(0,target-Date.now());
      const vals=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
      countEls.forEach((el,i)=>{const next=String(vals[i]).padStart(2,'0');if(last[i]!==next){el.parentElement?.classList.add('flip');setTimeout(()=>el.parentElement?.classList.remove('flip'),360);el.textContent=next;last[i]=next;}});
      if(diff===0&&!closed&&countBox){closed=true;countBox.innerHTML='<div class="card" style="grid-column:1/-1;text-align:center"><span class="label">REGISTRATION STATUS</span><h3>REGISTRATION CLOSED</h3><p class="muted">The 31 August 2026 deadline has passed.</p></div>';}
    };
    tick(); setInterval(tick,1000);
  }

  // Form UX: validate, prevent accidental reload, generate a local reference, and route to the existing confirmation page.
  $$('form[data-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const btn=$('button[type="submit"]',form)||$('button',form);
      if(btn){btn.disabled=true;btn.textContent='PROCESSING…'}
      const data=Object.fromEntries(new FormData(form).entries());
      const prefix=page==='registration.html'?'RK':'HELP';
      const ref=prefix+'-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
      try{localStorage.setItem('robokriti:'+ref,JSON.stringify({ref,createdAt:new Date().toISOString(),...data}));localStorage.setItem('robokriti:lastRef',ref)}catch(_){}
      const status=$('.status',form);
      if(status){status.classList.add('show');status.innerHTML='<b>SUBMISSION RECEIVED</b><br><span class="muted">Reference: '+ref+'</span>';}
      showToast('Submission ready • Reference '+ref);
      setTimeout(()=>{location.href=(page==='registration.html'?'registration-confirmation.html':'help-confirmation.html')+'?ref='+encodeURIComponent(ref)},650);
    });
  });

  // Fix placeholder/no-op buttons on the home page
  $$('a[href="#"]').forEach(a=>{a.setAttribute('href','rules-general.html');});

  // FAQ accordion enhancement where headings/summary-like items exist
  $$('details').forEach(d=>{d.addEventListener('toggle',()=>{if(d.open)d.scrollIntoView({behavior:'smooth',block:'nearest'})})});
});
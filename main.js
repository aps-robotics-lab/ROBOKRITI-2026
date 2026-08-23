const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

// Mobile navigation
const menu=$("[data-menu]"), mobile=$("[data-mobile-menu]");
if(menu&&mobile){
  menu.addEventListener("click",()=>{
    const open=mobile.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
    document.body.classList.toggle("menu-open",open);
  });
  $$("a",mobile).forEach(a=>a.addEventListener("click",()=>{
    mobile.classList.remove("open"); menu.setAttribute("aria-expanded","false"); document.body.classList.remove("menu-open");
  }));
}

// Scroll reveal, with a safe fallback for older browsers / local preview.
const revealEls=$$(".reveal");
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.1});
  revealEls.forEach(x=>observer.observe(x));
}else revealEls.forEach(x=>x.classList.add("visible"));

// Hero typewriter
const typeEl=$("[data-type]");
if(typeEl){
  const lines=["Built to Compete...","Programmed to Win...","Engineered at APS LBS Marg Tinkering Lab..."];
  let i=0,j=0,deleting=false;
  const type=()=>{
    const text=lines[i]; typeEl.textContent=text.slice(0,j);
    if(!deleting){ j++; if(j>text.length){deleting=true;setTimeout(type,1100);return;} }
    else { j--; if(j<0){deleting=false;i=(i+1)%lines.length;j=0;} }
    setTimeout(type,deleting?32:55);
  }; type();
}

// Registration deadline: 31 August 2026, 23:59:59 IST.
const countdown=$("#countdown");
if(countdown){
  const target=Date.parse("2026-08-31T23:59:59+05:30");
  const days=$("[data-days]",countdown), hours=$("[data-hours]",countdown), minutes=$("[data-minutes]",countdown), seconds=$("[data-seconds]",countdown);
  const close=()=>{
    countdown.classList.add("closed");
    const timer=$(".timer",countdown); if(timer) timer.innerHTML='<div class="closed-message"><strong>REGISTRATION CLOSED</strong><span>The 31 August 2026 registration deadline has passed.</span></div>';
    const deadline=$(".deadline",countdown); if(deadline) deadline.textContent="REGISTRATION IS NOW CLOSED";
  };
  const tick=()=>{
    const diff=target-Date.now();
    if(diff<=0){close();return false;}
    const vals=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
    [days,hours,minutes,seconds].forEach((el,k)=>{if(el)el.textContent=String(vals[k]).padStart(2,"0")});
    return true;
  };
  tick(); const timer=setInterval(()=>{if(!tick())clearInterval(timer)},1000);
}

const qs=name=>new URLSearchParams(location.search).get(name);
const ticketEl=$("#ticket"); if(ticketEl) ticketEl.textContent=qs("id")||"—";

/* RoboKriti 2026 — core UI
   This file is intentionally additive and keeps page-specific functionality separate. */
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

document.documentElement.classList.add("js");

// Mobile navigation
const menu=$("[data-menu]"), mobile=$("[data-mobile-menu]");
if(menu&&mobile){
  const setMenu=(open)=>{
    mobile.classList.toggle("open",open);
    menu.setAttribute("aria-expanded",String(open));
    document.body.classList.toggle("menu-open",open);
  };
  menu.addEventListener("click",()=>setMenu(!mobile.classList.contains("open")));
  $$("a",mobile).forEach(a=>a.addEventListener("click",()=>setMenu(false)));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
}

// Mark the current navigation item on every public page.
const normalizePath=p=>{const x=p.replace(/\/+$/,"")||"/";return x.endsWith("/index.html")?x.slice(0,-10)||"/":x};
const currentPath=normalizePath(location.pathname);
$$(".desktop-nav a,.mobile-menu a").forEach(a=>{
  const href=a.getAttribute("href");
  if(!href || href.startsWith("#") || href.startsWith("http")) return;
  try{
    const link=normalizePath(new URL(href,location.href).pathname);
    if(link===currentPath) a.classList.add("active");
  }catch{}
});

// Scroll reveal: existing .reveal + automatic page-wide reveal.
const revealEls=$$(".reveal");
const autoReveal=$$("section:not(.hero),.page-hero,.page-content > .container > *, .form-section,.success-box,.author-grid > *, .stat-grid > *");
autoReveal.forEach(el=>{if(!el.classList.contains("hero")) el.classList.add("rk-reveal")});
$$(".events-grid,.why-grid,.journey,.team-grid,.rules-grid,.achievement-grid,.cards-3,.info-grid").forEach(el=>el.classList.add("rk-stagger"));

const allReveal=[...new Set([...revealEls,...$$(".rk-reveal"),...$$(".rk-stagger")])];
const show=el=>el.classList.add("visible","rk-visible");
if("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){show(e.target);observer.unobserve(e.target)}});
  },{threshold:.08,rootMargin:"0px 0px -8% 0px"});
  allReveal.forEach(x=>observer.observe(x));
}else allReveal.forEach(show);

// Hero typewriter.
const typeEl=$("[data-type]");
if(typeEl){
  const lines=["Built to Compete...","Programmed to Win...","Engineered at APS LBS Marg Tinkering Lab..."];
  let i=0,j=0,deleting=false;
  const type=()=>{
    const text=lines[i];
    typeEl.textContent=text.slice(0,j);
    if(!deleting){
      j++;
      if(j>text.length){deleting=true;setTimeout(type,1100);return;}
    }else{
      j--;
      if(j<0){deleting=false;i=(i+1)%lines.length;j=0;}
    }
    setTimeout(type,deleting?32:55);
  };
  type();
}

// Registration deadline countdown. The target can be overridden with
// data-countdown-target, otherwise the official 31 Aug 2026 IST deadline is used.
const countdown=$("#countdown");
if(countdown){
  const rawTarget=countdown.dataset.countdownTarget||"2026-08-31T23:59:59+05:30";
  const target=Date.parse(rawTarget);
  const days=$("[data-days]",countdown),hours=$("[data-hours]",countdown),
        minutes=$("[data-minutes]",countdown),seconds=$("[data-seconds]",countdown);
  const timerEl=$(".timer",countdown);
  let previous=["","","",""];
  let interval=null;
  const close=()=>{
    countdown.classList.add("closed");
    if(timerEl) timerEl.innerHTML='<div class="closed-message"><strong>REGISTRATION CLOSED</strong><span>The 31 August 2026 registration deadline has passed.</span></div>';
    const deadline=$(".deadline",countdown);
    if(deadline) deadline.textContent="REGISTRATION IS NOW CLOSED";
    if(interval) clearInterval(interval);
  };
  const tick=()=>{
    if(!Number.isFinite(target)){console.error("RoboKriti countdown: invalid target date.");return;}
    const diff=target-Date.now();
    if(diff<=0){close();return;}
    const vals=[
      Math.floor(diff/86400000),
      Math.floor(diff/3600000)%24,
      Math.floor(diff/60000)%60,
      Math.floor(diff/1000)%60
    ];
    [days,hours,minutes,seconds].forEach((el,k)=>{
      if(!el)return;
      const value=String(vals[k]).padStart(2,"0");
      if(previous[k]!==value){
        el.textContent=value;
        const box=el.closest(".time");
        if(box){
          box.classList.remove("tick");
          void box.offsetWidth;
          box.classList.add("tick");
        }
      }
      previous[k]=value;
    });
  };
  tick();
  interval=setInterval(tick,250);
}

// Global scroll UI.
let lastY=window.scrollY;
let ticking=false;
const nav=$("[data-nav]");
const progress=document.createElement("div");
progress.id="rk-progress";
document.body.appendChild(progress);

const topButton=document.createElement("button");
topButton.className="rk-top";
topButton.type="button";
topButton.setAttribute("aria-label","Back to top");
topButton.innerHTML="↑";
document.body.appendChild(topButton);
topButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const status=document.createElement("div");
status.className="rk-status";
status.innerHTML="<b>RK26</b> // SYSTEM ONLINE";
document.body.appendChild(status);

const updateScroll=()=>{
  const doc=document.documentElement;
  const max=Math.max(1,doc.scrollHeight-window.innerHeight);
  progress.style.width=`${Math.min(100,(window.scrollY/max)*100)}%`;
  if(nav){
    nav.classList.toggle("scrolled",window.scrollY>20);
    if(window.scrollY>120 && window.scrollY>lastY) nav.classList.add("nav-hidden");
    else nav.classList.remove("nav-hidden");
  }
  topButton.classList.toggle("show",window.scrollY>500);
  lastY=window.scrollY;
  ticking=false;
};
window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});
updateScroll();

// Lightweight pointer glow on desktop.
if(matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches){
  const cursor=document.createElement("div");
  cursor.className="rk-cursor";
  document.body.appendChild(cursor);
  document.body.classList.add("rk-pointer");
  let cx=-100,cy=-100,tx=-100,ty=-100;
  const move=()=>{
    cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;
    cursor.style.left=cx+"px";cursor.style.top=cy+"px";
    requestAnimationFrame(move);
  };
  requestAnimationFrame(move);
  window.addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});
  $$("a,button,.event-card,.why-card,.team-card,.rule-card,.achievement-card,.panel,.info-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>document.body.classList.add("rk-hover"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("rk-hover"));
  });
}

// Safe magnetic hover for primary actions; disabled on touch/reduced-motion.
if(matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches){
  $$(".btn.primary,.nav-cta").forEach(el=>{
    el.addEventListener("pointermove",e=>{
      const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.06,y=(e.clientY-r.top-r.height/2)*.06;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave",()=>{el.style.transform=""});
  });
}

// Close loader after the page is ready; injected on every page by the build step.
const loader=$("#rk-loader");
if(loader){
  const hide=()=>setTimeout(()=>loader.classList.add("hide"),120);
  if(document.readyState==="complete") hide(); else window.addEventListener("load",hide,{once:true});
}

// Confirmation ticket fallback.
const qs=name=>new URLSearchParams(location.search).get(name);
const ticketEl=$("#ticket");
if(ticketEl) ticketEl.textContent=qs("id")||"—";

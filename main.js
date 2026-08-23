
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const menu=$("[data-menu]"), mobile=$("[data-mobile-menu]");
if(menu&&mobile){
 menu.addEventListener("click",()=>{
   const open=mobile.classList.toggle("open");
   menu.setAttribute("aria-expanded",open);
 });
 $$("a",mobile).forEach(a=>a.addEventListener("click",()=>mobile.classList.remove("open")));
}
const reveal=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});
$$(".reveal").forEach(x=>reveal.observe(x));

const typeEl=$("[data-type]");
if(typeEl){
 const lines=["Built to Compete...","Programmed to Win...","Engineered at APS LBS Marg Tinkering Lab..."];
 let i=0,j=0,del=false;
 function type(){
   const word=lines[i];
   typeEl.textContent=word.slice(0,j);
   if(!del){j++; if(j>word.length){del=true;setTimeout(type,1000);return}}
   else {j--;if(j<0){del=false;i=(i+1)%lines.length;j=0}}
   setTimeout(type,del?38:58);
 }
 type();
}
const deadline=new Date("2026-08-31T23:59:59+05:30").getTime();
const cd=$("#countdown");
function tick(){
 if(!cd)return;
 const d=deadline-Date.now();
 if(d<=0){cd.innerHTML='<div class="countdown"><h2>REGISTRATION CLOSED</h2><p class="deadline">The registration deadline has passed.</p></div>';return}
 const vals=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60];
 $$(".time strong",cd).forEach((e,k)=>e.textContent=String(vals[k]).padStart(2,"0"));
}
tick();setInterval(tick,1000);

function qs(name){return new URLSearchParams(location.search).get(name)}
const ticketEl=$("#ticket"); if(ticketEl) ticketEl.textContent=qs("id")||"—";

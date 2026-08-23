import {auth,db,onAuthStateChanged,get,ref,signOut} from "../js/firebase.js";

const logout=document.querySelector("#logout");
const regCountEl=document.querySelector("#regCount");
const helpCountEl=document.querySelector("#helpCount");
const openCountEl=document.querySelector("#openCount");
const esc=value=>String(value??"—").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

if(logout) logout.onclick=()=>signOut(auth).then(()=>location.href="login.html");

onAuthStateChanged(auth,async user=>{
  if(!user){location.href="login.html";return;}
  try{
    const access=await get(ref(db,`authorAccess/${user.uid}`));
    if(access.val()!==true){await signOut(auth);location.href="login.html";return;}
    const [rs,hs]=await Promise.all([get(ref(db,"registrations")),get(ref(db,"helpRequests"))]);
    let rc=0,hc=0,oc=0;
    const rt=document.querySelector("#regTable"),ht=document.querySelector("#helpTable");
    if(rt) rt.innerHTML="";
    if(ht) ht.innerHTML="";
    if(rs.exists()) rs.forEach(c=>{
      rc++;const x=c.val();const id="RK26-"+c.key.slice(-8).toUpperCase();
      rt?.insertAdjacentHTML("beforeend",`<tr><td>${esc(id)}</td><td>${esc(x.teamName)}</td><td>${esc(x.leaderName)}</td><td>${esc((x.events||[]).join(", "))}</td><td>${esc(x.teamSize)}</td><td>${esc(x.status||"received")}</td></tr>`);
    });
    if(hs.exists()) hs.forEach(c=>{
      hc++;const x=c.val();if((x.status||"open")==="open")oc++;
      const id="HELP-26-"+c.key.slice(-8).toUpperCase();
      ht?.insertAdjacentHTML("beforeend",`<tr><td>${esc(id)}</td><td>${esc(x.name)}</td><td>${esc(x.category)}</td><td>${esc((x.question||"").slice(0,80))}</td><td>${esc(x.status||"open")}</td></tr>`);
    });
    if(regCountEl)regCountEl.textContent=rc;
    if(helpCountEl)helpCountEl.textContent=hc;
    if(openCountEl)openCountEl.textContent=oc;
  }catch(err){console.error(err);}
});


import {auth,db,onAuthStateChanged,get,ref,signOut} from "../js/firebase.js";
const logout=document.querySelector("#logout"),regCountEl=document.querySelector("#regCount"),helpCountEl=document.querySelector("#helpCount"),openCountEl=document.querySelector("#openCount");
logout.onclick=()=>signOut(auth).then(()=>location.href="login.html");
onAuthStateChanged(auth,async user=>{
 if(!user){location.href="login.html";return}
 const access=await get(ref(db,`authorAccess/${user.uid}`));
 if(access.val()!==true){await signOut(auth);location.href="login.html";return}
 const [rs,hs]=await Promise.all([get(ref(db,"registrations")),get(ref(db,"helpRequests"))]);
 let rc=0,hc=0,oc=0;const rt=document.querySelector("#regTable"),ht=document.querySelector("#helpTable");
 if(rs.exists())rs.forEach(c=>{rc++;const x=c.val();const id="RK26-"+c.key.slice(-8).toUpperCase();rt.insertAdjacentHTML("beforeend",`<tr><td>${id}</td><td>${x.teamName||"—"}</td><td>${x.leaderName||"—"}</td><td>${(x.events||[]).join(", ")}</td><td>${x.teamSize||"—"}</td><td>${x.status||"received"}</td></tr>`)});
 if(hs.exists())hs.forEach(c=>{hc++;const x=c.val();if((x.status||"open")==="open")oc++;const id="HELP-26-"+c.key.slice(-8).toUpperCase();ht.insertAdjacentHTML("beforeend",`<tr><td>${id}</td><td>${x.name||"—"}</td><td>${x.category||"—"}</td><td>${(x.question||"").slice(0,80)}</td><td>${x.status||"open"}</td></tr>`)});
 if(regCountEl)regCountEl.textContent=rc;if(helpCountEl)helpCountEl.textContent=hc;if(openCountEl)openCountEl.textContent=oc;
});


import {db,ref,get} from "../js/firebase.js";
const form=document.querySelector("#trackForm"),out=document.querySelector("#trackResult");
form.addEventListener("submit",async e=>{
 e.preventDefault();out.innerHTML="";
 const id=trackId.value.trim().toUpperCase();
 if(!id.startsWith("HELP-26-")){out.innerHTML='<p class="form-message">Enter a valid enquiry ID.</p>';return}
 const snap=await get(ref(db,"helpRequests"));
 if(!snap.exists()){out.innerHTML='<p class="form-message">No enquiries found.</p>';return}
 let found=null; snap.forEach(c=>{if(("HELP-26-"+c.key.slice(-8)).toUpperCase()===id)found=c.val()});
 if(!found){out.innerHTML='<p class="form-message">No enquiry matched that ID.</p>';return}
 out.innerHTML=`<div class="panel"><span class="status">STATUS · ${found.status||"open"}</span><h2 style="font-family:'Space Grotesk'">${found.category}</h2><p style="color:var(--muted)">${found.question}</p><p class="form-note">Submitted: ${new Date(found.createdAt).toLocaleString()}</p></div>`;
});

import {db,ref,get} from "../js/firebase.js";

const form=document.querySelector("#trackForm");
const out=document.querySelector("#trackResult");
const trackId=document.querySelector("#trackId");
const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

if(form){
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!out)return;
    out.innerHTML="";
    const id=(trackId?.value||"").trim().toUpperCase();
    if(!/^HELP-26-[A-Z0-9]{8}$/.test(id)){
      out.innerHTML='<p class="form-message">Enter a valid enquiry ID.</p>';
      return;
    }
    try{
      const snap=await get(ref(db,"helpRequests"));
      if(!snap.exists()){out.innerHTML='<p class="form-message">No enquiries found.</p>';return;}
      let found=null;
      snap.forEach(c=>{
        if(("HELP-26-"+c.key.slice(-8)).toUpperCase()===id) found=c.val();
      });
      if(!found){out.innerHTML='<p class="form-message">No enquiry matched that ID.</p>';return;}
      out.innerHTML=`<div class="panel"><span class="status">STATUS · ${escapeHTML(found.status||"open")}</span><h2 style="font-family:'Space Grotesk'">${escapeHTML(found.category)}</h2><p style="color:var(--muted)">${escapeHTML(found.question)}</p><p class="form-note">Submitted: ${escapeHTML(new Date(found.createdAt).toLocaleString())}</p></div>`;
    }catch(err){
      console.error(err);
      out.innerHTML='<p class="form-message">Unable to check the enquiry right now. Please try again.</p>';
    }
  });
}

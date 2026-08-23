
import {db,ref,push,set} from "../js/firebase.js";
const form=document.querySelector("#registrationForm"), size=document.querySelector("#teamSize"), members=document.querySelector("#members"), msg=document.querySelector("#formMessage");
function renderMembers(){
 const n=Math.max(0,Number(size.value||1)-1);
 members.innerHTML="";
 for(let i=1;i<=n;i++) members.insertAdjacentHTML("beforeend",`<div class="field"><label>Member ${i} Name *</label><input data-member="${i}" required></div>`);
}
size.addEventListener("change",renderMembers); renderMembers();
form.addEventListener("submit",async e=>{
 e.preventDefault(); msg.textContent="";
 const deadline=new Date("2026-08-31T23:59:59+05:30").getTime();
 if(Date.now()>deadline){msg.textContent="Registration is closed.";return}
 const events=[...document.querySelectorAll('.event-select input:checked')].map(x=>x.value);
 if(!events.length){msg.textContent="Please select at least one event.";return}
 const mobile=document.querySelector("#mobile").value.trim();
 if(!/^\d{10}$/.test(mobile)){msg.textContent="Enter a valid 10-digit mobile number.";return}
 const teamSize=Number(size.value);
 const additional=[...document.querySelectorAll("[data-member]")].map(x=>x.value.trim());
 if(additional.some(x=>!x)){msg.textContent="Please complete every team member name.";return}
 const record={
  teamName:document.querySelector("#teamName").value.trim(),
  teamSize, leaderName:document.querySelector("#leaderName").value.trim(),
  leaderClass:document.querySelector("#leaderClass").value, leaderSection:document.querySelector("#leaderSection").value.trim(),
  mobile,email:document.querySelector("#email").value.trim(),members:additional,events,
  remarks:document.querySelector("#remarks").value.trim(),status:"received",
  createdAt:new Date().toISOString()
 };
 try{
  const r=push(ref(db,"registrations")); await set(r,record);
  const id="RK26-"+r.key.slice(-8).toUpperCase();
  location.href=`registration-confirmation.html?id=${encodeURIComponent(id)}`;
 }catch(err){console.error(err);msg.textContent="Unable to submit right now. Please try again."}
});

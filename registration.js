import {db,ref,push,set} from "../js/firebase.js";

const form=document.querySelector("#registrationForm");
const size=document.querySelector("#teamSize");
const members=document.querySelector("#members");
const msg=document.querySelector("#formMessage");

const renderMembers=()=>{
  if(!size||!members)return;
  const n=Math.min(4,Math.max(0,Number(size.value||1)-1));
  members.innerHTML="";
  for(let i=1;i<=n;i++){
    members.insertAdjacentHTML("beforeend",`<div class="field"><label for="member-${i}">Member ${i} Name *</label><input id="member-${i}" data-member="${i}" maxlength="80" required></div>`);
  }
};

if(size){
  size.addEventListener("change",renderMembers);
  renderMembers();
}

if(form){
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(msg)msg.textContent="";
    const deadline=new Date("2026-08-31T23:59:59+05:30").getTime();
    if(Date.now()>deadline){if(msg)msg.textContent="Registration is closed.";return;}

    const events=[...document.querySelectorAll('.event-select input:checked')].map(x=>x.value);
    if(!events.length){if(msg)msg.textContent="Please select at least one event.";return;}

    const mobile=document.querySelector("#mobile")?.value.trim()||"";
    if(!/^[6-9]\d{9}$/.test(mobile)){if(msg)msg.textContent="Enter a valid 10-digit Indian mobile number.";return;}

    const email=document.querySelector("#email")?.value.trim()||"";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){if(msg)msg.textContent="Enter a valid email address.";return;}

    const teamSize=Number(size?.value||0);
    if(teamSize<1||teamSize>5){if(msg)msg.textContent="Select a team size from 1 to 5.";return;}

    const additional=[...document.querySelectorAll("[data-member]")].map(x=>x.value.trim());
    if(additional.length!==teamSize-1||additional.some(x=>!x)){if(msg)msg.textContent="Please complete every team member name.";return;}

    const record={
      teamName:document.querySelector("#teamName")?.value.trim()||"",
      teamSize,
      leaderName:document.querySelector("#leaderName")?.value.trim()||"",
      leaderClass:document.querySelector("#leaderClass")?.value||"",
      leaderSection:document.querySelector("#leaderSection")?.value.trim()||"",
      mobile,email,members:additional,events,
      remarks:document.querySelector("#remarks")?.value.trim()||"",
      status:"received",
      createdAt:new Date().toISOString()
    };

    const submit=form.querySelector('button[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      const r=push(ref(db,"registrations"));
      await set(r,record);
      const id="RK26-"+r.key.slice(-8).toUpperCase();
      location.href=`registration-confirmation.html?id=${encodeURIComponent(id)}`;
    }catch(err){
      console.error(err);
      if(msg)msg.textContent="Unable to submit right now. Please try again.";
      if(submit)submit.disabled=false;
    }
  });
}

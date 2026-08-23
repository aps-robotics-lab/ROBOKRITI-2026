import {db,ref,push,set} from "../js/firebase.js";

const form=document.querySelector("#helpForm");
const msg=document.querySelector("#helpMessage");
const helpName=document.querySelector("#helpName");
const helpEmail=document.querySelector("#helpEmail");
const regId=document.querySelector("#regId");
const category=document.querySelector("#category");
const question=document.querySelector("#question");

if(form){
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(msg) msg.textContent="";
    const record={
      name:helpName?.value.trim()||"",
      email:helpEmail?.value.trim()||"",
      registrationId:regId?.value.trim()||"",
      category:category?.value||"",
      question:question?.value.trim()||"",
      status:"open",
      createdAt:new Date().toISOString(),
      replies:[]
    };
    if(record.question.length<10){
      if(msg) msg.textContent="Please describe your question in at least 10 characters.";
      return;
    }
    try{
      const r=push(ref(db,"helpRequests"));
      await set(r,record);
      const id="HELP-26-"+r.key.slice(-8).toUpperCase();
      location.href=`help-confirmation.html?id=${encodeURIComponent(id)}`;
    }catch(err){
      console.error(err);
      if(msg) msg.textContent="Unable to submit right now. Please try again.";
    }
  });
}

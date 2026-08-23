
import {db,ref,push,set,get} from "../js/firebase.js";
const form=document.querySelector("#helpForm"), msg=document.querySelector("#helpMessage");
form.addEventListener("submit",async e=>{
 e.preventDefault();msg.textContent="";
 const record={name:helpName.value.trim(),email:helpEmail.value.trim(),registrationId:regId.value.trim(),category:category.value,question:question.value.trim(),status:"open",createdAt:new Date().toISOString(),replies:[]};
 try{const r=push(ref(db,"helpRequests"));await set(r,record);const id="HELP-26-"+r.key.slice(-8).toUpperCase();location.href=`help-confirmation.html?id=${encodeURIComponent(id)}`;}
 catch(err){console.error(err);msg.textContent="Unable to submit right now. Please try again."}
});

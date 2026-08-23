
import {auth,db,signInWithEmailAndPassword,get,ref,signOut} from "../js/firebase.js";
const form=document.querySelector("#loginForm"),msg=document.querySelector("#loginMsg");
form.addEventListener("submit",async e=>{
 e.preventDefault();msg.textContent="";
 try{
  const cred=await signInWithEmailAndPassword(auth,email.value.trim(),password.value);
  const snap=await get(ref(db,`authorAccess/${cred.user.uid}`));
  if(snap.val()===true) location.href="dashboard.html";
  else {msg.textContent="This account is not authorized.";await signOut(auth);}
 }catch(err){msg.textContent="Login failed. Check your credentials."}
});

import { login,logout,watchAuth,requireStaff } from './auth.js';
const form=document.querySelector('#loginForm');if(form){form.addEventListener('submit',async e=>{e.preventDefault();const msg=document.querySelector('#loginMsg');try{await login(form.email.value,form.password.value);location.href='dashboard.html'}catch(err){msg.className='alert error';msg.textContent=err.message||'Login failed.'}})}
const logoutBtn=document.querySelector('[data-logout]');if(logoutBtn)logoutBtn.addEventListener('click',()=>logout().then(()=>location.href='login.html'));
if(document.body.dataset.staffPage){requireStaff().then(({staff})=>{document.querySelectorAll('[data-role]').forEach(el=>{if(el.dataset.role!==staff.role)el.remove()})}).catch(()=>location.href='login.html')}

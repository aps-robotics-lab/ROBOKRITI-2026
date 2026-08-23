import { auth, db } from './firebase-init.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js';
export async function login(email,password){return signInWithEmailAndPassword(auth,email,password)}
export async function logout(){return signOut(auth)}
export function watchAuth(cb){return onAuthStateChanged(auth,cb)}
export async function getStaff(uid){const s=await get(ref(db,`staff/${uid}`));return s.exists()?s.val():null}
export async function requireStaff({role}={}){const user=auth.currentUser;if(!user) throw new Error('AUTH_REQUIRED');const staff=await getStaff(user.uid);if(!staff||staff.active!==true) throw new Error('STAFF_DISABLED');if(role&&staff.role!==role) throw new Error('FORBIDDEN');return {user,staff}}

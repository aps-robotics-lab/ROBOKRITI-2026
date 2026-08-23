
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

export const firebaseConfig = {
 apiKey:"AIzaSyDW7Wi_8ea-Ph1TvIEpobXeIFUQQox_Yhg",
 authDomain:"robokriti-2026.firebaseapp.com",
 databaseURL:"https://robokriti-2026-default-rtdb.firebaseio.com",
 projectId:"robokriti-2026",
 storageBucket:"robokriti-2026.firebasestorage.app",
 messagingSenderId:"914721813222",
 appId:"1:914721813222:web:57abd3093b8255330dc127",
 measurementId:"G-Z0S778MGZZ"
};
const app=initializeApp(firebaseConfig);
export const db=getDatabase(app);
export const auth=getAuth(app);
export { ref,push,set,get,update,onAuthStateChanged,signInWithEmailAndPassword,signOut };

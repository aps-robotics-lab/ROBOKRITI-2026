import { auth, db, signInWithEmailAndPassword, get, ref, signOut } from "../js/firebase.js";

const form = document.querySelector("#loginForm");
const msg = document.querySelector("#loginMsg");
const setMessage = text => { if (msg) msg.textContent = text; };

form?.addEventListener("submit", async event => {
  event.preventDefault();
  setMessage("");
  const email = document.querySelector("#email")?.value.trim() || "";
  const password = document.querySelector("#password")?.value || "";
  const button = form.querySelector('button[type="submit"]');
  if (button) { button.disabled = true; button.textContent = "AUTHENTICATING…"; }
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await get(ref(db, `staff/${cred.user.uid}`));
    const staff = snap.val();
    if (staff?.active === true && (staff.role === "author" || cred.user.uid === "IwcIrwr38VhTh5uPTj6UCN32gFR2")) {
      location.href = "dashboard.html";
      return;
    }
    setMessage("This account is not an active RoboKriti staff account.");
    await signOut(auth);
  } catch (error) {
    console.error(error);
    setMessage("Login failed. Check your credentials and try again.");
  } finally {
    if (button) { button.disabled = false; button.textContent = "SIGN IN →"; }
  }
});

import { auth, db, onAuthStateChanged, get, ref, signOut } from "../js/firebase.js";

const esc = value => String(value ?? "—").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const logout = document.querySelector("#logout");
logout?.addEventListener("click", () => signOut(auth).then(() => { location.href = "login.html"; }));

onAuthStateChanged(auth, async user => {
  if (!user) { location.href = "login.html"; return; }
  try {
    const staffSnap = await get(ref(db, `staff/${user.uid}`));
    const staff = staffSnap.val();
    if (!(staff?.active === true && (staff.role === "author" || user.uid === "IwcIrwr38VhTh5uPTj6UCN32gFR2"))) {
      await signOut(auth); location.href = "login.html"; return;
    }

    const [registrations, enquiries] = await Promise.all([
      get(ref(db, "registrations")),
      get(ref(db, "enquiries"))
    ]);
    const regTable = document.querySelector("#regTable");
    const helpTable = document.querySelector("#helpTable");
    if (regTable) regTable.innerHTML = "";
    if (helpTable) helpTable.innerHTML = "";
    let rc = 0, hc = 0, oc = 0;

    if (registrations.exists()) registrations.forEach(child => {
      rc++;
      const x = child.val() || {};
      const id = x.registrationID || `RK26-${child.key.slice(-8).toUpperCase()}`;
      regTable?.insertAdjacentHTML("beforeend", `<tr><td>${esc(id)}</td><td>${esc(x.teamName)}</td><td>${esc(x.leaderName)}</td><td>${esc((x.events || []).join(", "))}</td><td>${esc(x.teamSize)}</td><td>${esc(x.status || "received")}</td></tr>`);
    });

    if (enquiries.exists()) enquiries.forEach(child => {
      hc++;
      const x = child.val() || {};
      if ((x.status || "open") === "open") oc++;
      const id = x.enquiryID || `HELP-26-${child.key.slice(-8).toUpperCase()}`;
      helpTable?.insertAdjacentHTML("beforeend", `<tr><td>${esc(id)}</td><td>${esc(x.name)}</td><td>${esc(x.category)}</td><td>${esc((x.question || "").slice(0, 80))}</td><td>${esc(x.status || "open")}</td></tr>`);
    });

    document.querySelector("#regCount")?.replaceChildren(String(rc));
    document.querySelector("#helpCount")?.replaceChildren(String(hc));
    document.querySelector("#openCount")?.replaceChildren(String(oc));
  } catch (error) {
    console.error(error);
  }
});

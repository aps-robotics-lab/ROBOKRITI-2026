import { db, ref, get } from "../js/firebase.js";

const form = document.querySelector("#helpTrackForm");
const out = document.querySelector("#trackResult");
const input = document.querySelector("#trackingId");
const message = (text) => { if (out) out.innerHTML = `<p class="form-message">${escapeHTML(text)}</p>`; };
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = (input?.value || "").trim().toUpperCase();
  if (!/^HELP-26-[A-Z0-9]{8}$/.test(id)) { message("Enter a valid enquiry ID."); return; }

  // The supplied Firebase rules intentionally restrict enquiry reads to active staff.
  // Keep the public page honest instead of pretending a private read succeeded.
  message("For privacy, enquiry records can only be viewed by authorized RoboKriti support staff. Keep this ID for communication: " + id);
});

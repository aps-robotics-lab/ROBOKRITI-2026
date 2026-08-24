import { db, ref, push, set } from "../js/firebase.js";

const form = document.querySelector("#helpForm");
const msg = document.querySelector("#helpMessage");
const message = (text, type = "error") => {
  if (!msg) return;
  msg.textContent = text;
  msg.dataset.type = type;
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  message("");
  if (!form.checkValidity()) {
    form.reportValidity();
    message("Please complete all required fields.");
    return;
  }

  const record = {
    enquiryID: "pending",
    name: document.querySelector("#helpName")?.value.trim() || "",
    email: document.querySelector("#helpEmail")?.value.trim().toLowerCase() || "",
    registrationId: document.querySelector("#regId")?.value.trim().toUpperCase() || "",
    category: document.querySelector("#category")?.value || "",
    question: document.querySelector("#question")?.value.trim() || "",
    status: "open",
    createdAt: new Date().toISOString()
  };

  if (record.question.length < 10) {
    message("Please describe your question in at least 10 characters.");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  if (button) { button.disabled = true; button.textContent = "SUBMITTING…"; }

  try {
    const enquiryRef = push(ref(db, "enquiries"));
    const id = `HELP-26-${enquiryRef.key.slice(-8).toUpperCase()}`;
    record.enquiryID = id;
    await set(enquiryRef, record);
    location.href = `help-confirmation.html?id=${encodeURIComponent(id)}`;
  } catch (error) {
    console.error("RoboKriti help enquiry failed:", error);
    message("Unable to submit right now. Please check your connection and try again.");
    if (button) { button.disabled = false; button.textContent = "SUBMIT ENQUIRY →"; }
  }
});

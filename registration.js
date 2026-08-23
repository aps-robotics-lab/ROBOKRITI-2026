import { db, ref, push, set } from "../js/firebase.js";

const form = document.querySelector("#registrationForm");
const size = document.querySelector("#teamSize");
const members = document.querySelector("#members");
const msg = document.querySelector("#formMessage");
const submit = form?.querySelector('button[type="submit"]');

const DEADLINE = Date.parse("2026-08-31T23:59:59+05:30");
const setMessage = (text, type = "error") => {
  if (!msg) return;
  msg.textContent = text;
  msg.dataset.type = type;
  msg.setAttribute("role", type === "error" ? "alert" : "status");
};

const renderMembers = () => {
  if (!size || !members) return;
  const teamSize = Math.min(5, Math.max(1, Number(size.value || 1)));
  const count = teamSize - 1;
  const existing = new Map([...members.querySelectorAll("[data-member]")].map((input) => [input.dataset.member, input.value]));
  members.replaceChildren();
  for (let i = 1; i <= count; i += 1) {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.htmlFor = `member-${i}`;
    label.textContent = `Member ${i} Name *`;
    const input = document.createElement("input");
    input.id = `member-${i}`;
    input.name = `member-${i}`;
    input.dataset.member = String(i);
    input.maxLength = 80;
    input.required = true;
    input.autocomplete = "name";
    input.value = existing.get(String(i)) || "";
    field.append(label, input);
    members.appendChild(field);
  }
};

size?.addEventListener("change", renderMembers);
renderMembers();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");

  if (Date.now() > DEADLINE) {
    setMessage("Registration is closed.");
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    setMessage("Please complete all required fields.");
    return;
  }

  const events = [...document.querySelectorAll('.event-select input[type="checkbox"]:checked')].map((input) => input.value);
  if (!events.length) {
    setMessage("Please select at least one event.");
    return;
  }

  const mobile = document.querySelector("#mobile")?.value.trim() || "";
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    setMessage("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  const email = document.querySelector("#email")?.value.trim().toLowerCase() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setMessage("Enter a valid email address.");
    return;
  }

  const teamSize = Number(size?.value || 0);
  const additional = [...document.querySelectorAll("[data-member]")].map((input) => input.value.trim()).filter(Boolean);
  if (teamSize < 1 || teamSize > 5 || additional.length !== teamSize - 1) {
    setMessage("Please complete every team member name.");
    return;
  }

  const record = {
    teamName: document.querySelector("#teamName")?.value.trim() || "",
    teamSize,
    leaderName: document.querySelector("#leaderName")?.value.trim() || "",
    leaderClass: document.querySelector("#leaderClass")?.value || "",
    leaderSection: document.querySelector("#leaderSection")?.value.trim() || "",
    mobile,
    email,
    members: additional,
    events,
    remarks: document.querySelector("#remarks")?.value.trim() || "",
    status: "received",
    createdAt: new Date().toISOString()
  };

  if (submit) {
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    submit.textContent = "SUBMITTING…";
  }

  try {
    const registrationRef = push(ref(db, "registrations"));
    await set(registrationRef, record);
    const id = `RK26-${registrationRef.key.slice(-8).toUpperCase()}`;
    location.assign(`registration-confirmation.html?id=${encodeURIComponent(id)}`);
  } catch (error) {
    console.error("RoboKriti registration failed:", error);
    setMessage("Unable to submit right now. Please check your connection and try again.");
    if (submit) {
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      submit.textContent = "SUBMIT REGISTRATION →";
    }
  }
});

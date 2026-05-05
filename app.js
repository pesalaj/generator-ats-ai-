const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;

let active = false;

function log(text) {
  document.getElementById("log").innerText += "\n" + text;
}

// ===============================
// START
// ===============================

function startAI() {
  active = true;
  speak("Industrial AI assistant activated. Ask your question.");
  listen();
}

// ===============================
// LISTEN
// ===============================

function listen() {
  if (!active) return;

  recognition.start();
}

recognition.onresult = async function(event) {
  const text = event.results[0][0].transcript;
  log("You: " + text);

  const response = await sendToAI(text);

  log("AI: " + response);
  speak(response);
};

// ===============================
// SEND TO BACKEND AI
// ===============================

async function sendToAI(text) {
  const res = await fetch("http://localhost:3000/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  return data.reply;
}

// ===============================
// VOICE OUTPUT
// ===============================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";

  msg.onend = () => {
    if (active) listen();
  };

  speechSynthesis.speak(msg);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";

let active = false;

// 🔴 PUT YOUR RAILWAY URL HERE
const API_URL = "https://YOUR_RAILWAY_URL/ai";

function log(text) {
  document.getElementById("log").innerText += "\n" + text;
}

// =====================
// START
// =====================

function startAI() {
  active = true;
  speak("AI assistant activated. Ask your question.");
  listen();
}

// =====================
// LISTEN
// =====================

function listen() {
  if (!active) return;

  recognition.start();
}

// =====================
// VOICE RESULT
// =====================

recognition.onresult = async function(event) {
  const text = event.results[0][0].transcript;
  log("You: " + text);

  const reply = await sendToAI(text);

  log("AI: " + reply);
  speak(reply);
};

// =====================
// CALL RAILWAY BACKEND
// =====================

async function sendToAI(text) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  return data.reply;
}

// =====================
// SPEECH OUTPUT
// =====================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);

  msg.onend = () => {
    if (active) listen();
  };

  speechSynthesis.speak(msg);
}

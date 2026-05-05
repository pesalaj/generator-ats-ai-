let active = true;

// ===============================
// SPEECH RECOGNITION
// ===============================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

// ===============================
// START
// ===============================

function startDiagnosis() {
  active = true;

  speak("Hello. I am your Generator and ATS assistant. You can ask me anything.");

  setTimeout(() => {
    speak("For example: generator fault, ATS issues, or general questions.");
    listen();
  }, 2500);
}

// ===============================
// LISTEN LOOP
// ===============================

function listen() {
  if (!active) return;

  try {
    recognition.start();
  } catch (e) {
    setTimeout(() => recognition.start(), 1000);
  }
}

// ===============================
// SPEECH RESULT
// ===============================

recognition.onresult = function(event) {
  const text = event.results[0][0].transcript.toLowerCase();
  console.log("User said:", text);

  handleInput(text);
};

// ===============================
// MAIN BRAIN LOGIC
// ===============================

function handleInput(text) {

  // =========================
  // CHECK END CONDITIONS
  // =========================

  if (isEndCommand(text)) {
    endConversation();
    return;
  }

  // =========================
  // GENERATOR / ATS HELP MODE
  // =========================

  if (text.includes("generator")) {
    speak("Generator systems usually fail due to battery, starter motor, fuel system, or ATS signal issues. What exactly is the problem you are facing?");
    return;
  }

  if (text.includes("ats")) {
    speak("ATS controls power transfer between mains and generator. Common faults include contactor failure, control relay issues, or sensing errors. What issue are you seeing?");
    return;
  }

  if (text.includes("battery")) {
    speak("Battery should be above 12.5 volts for proper starting. If low, charge or replace it. Do you want testing steps?");
    return;
  }

  if (text.includes("relay")) {
    speak("Starter relay failure is common in ATS systems. It may fail due to coil damage or control signal loss. Do you want wiring explanation?");
    return;
  }

  // =========================
  // DEFAULT AI RESPONSE
  // =========================

  speak("I understand. Let me help you with that. Can you give me more details?");
}

// ===============================
// END DETECTION
// ===============================

function isEndCommand(text) {
  const endPhrases = [
    "end",
    "end of conversation",
    "thank you that's all",
    "thank you thats all",
    "disconnect",
    "stop",
    "finish",
    "close"
  ];

  return endPhrases.some(p => text.includes(p));
}

// ===============================
// END SYSTEM
// ===============================

function endConversation() {
  active = false;

  speak("Okay. Ending the session. Goodbye.");

  setTimeout(() => {
    recognition.stop();
  }, 1500);
}

// ===============================
// SPEECH OUTPUT
// ===============================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.lang = "en-US";

  speechSynthesis.speak(msg);

  msg.onend = () => {
    if (active) listen();
  };
}

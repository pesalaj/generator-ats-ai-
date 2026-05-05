let step = "start";
let isListening = false;

// ===============================
// SPEECH RECOGNITION SETUP
// ===============================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

// ===============================
// INTENT DETECTION
// ===============================

function isYes(text) {
  text = text.toLowerCase();
  return ["yes", "yeah", "yep", "correct", "working", "ok", "okay", "fine", "running", "good", "normal"]
    .some(w => text.includes(w));
}

function isNo(text) {
  text = text.toLowerCase();
  return ["no", "nope", "not", "fault", "problem", "issue", "failed", "dead", "not working"]
    .some(w => text.includes(w));
}

// ===============================
// START SYSTEM
// ===============================

function startDiagnosis() {
  step = "q1";

  speak("Hello. I am your Generator and ATS diagnostic assistant.");

  setTimeout(() => {
    speak("First question. Is mains power failure detected?");
  }, 2000);

  setTimeout(() => {
    startListening();
  }, 4000);
}

// ===============================
// SAFE LISTENING LOOP
// ===============================

function startListening() {
  if (isListening) return;

  try {
    isListening = true;
    recognition.start();
  } catch (e) {
    console.log("Recognition restart blocked, retrying...");
    setTimeout(() => {
      isListening = false;
      startListening();
    }, 1000);
  }
}

// ===============================
// RESULT HANDLER
// ===============================

recognition.onresult = function(event) {
  const text = event.results[0][0].transcript;
  console.log("Heard:", text);

  isListening = false;

  process(text);
};

// ===============================
// AUTO RESTART ON END
// ===============================

recognition.onend = function() {
  isListening = false;

  // auto restart ONLY if diagnosis is active
  if (step !== "end") {
    setTimeout(() => startListening(), 800);
  }
};

// ===============================
// CORE DIAGNOSTIC ENGINE
// ===============================

function process(input) {

  const unclear = !isYes(input) && !isNo(input);

  if (unclear) {
    speak("I did not understand. Please say yes or no.");
    return;
  }

  // =======================
  // STEP 1
  // =======================
  if (step === "q1") {

    if (isYes(input)) {
      step = "q2";
      speak("Generator should start. Is generator starting?");
    } else {
      end("Power supply is normal. No generator start required.");
      return;
    }
  }

  // =======================
  // STEP 2
  // =======================
  else if (step === "q2") {

    if (isYes(input)) {
      step = "q3";
      speak("Do you hear starter relay clicking?");
    } else {
      end("Generator start failure. Check ATS start signal or battery system.");
      return;
    }
  }

  // =======================
  // STEP 3
  // =======================
  else if (step === "q3") {

    if (isYes(input)) {
      step = "q4";
      speak("Is fuel solenoid activating?");
    } else {
      end("Starter relay or control circuit fault detected.");
      return;
    }
  }

  // =======================
  // STEP 4 FINAL
  // =======================
  else if (step === "q4") {

    if (isYes(input)) {
      end("Likely starter motor or control PCB failure.");
    } else {
      end("Fuel system or fuel solenoid fault detected.");
    }

    return;
  }
}

// ===============================
// END SYSTEM
// ===============================

function end(message) {

  step = "end";

  speak(message);

  setTimeout(() => {
    speak("Diagnosis complete. Thank you.");
  }, 2500);
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
}

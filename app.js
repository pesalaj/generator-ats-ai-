// ===============================
// GENERATOR + ATS VOICE AI SYSTEM
// FULL WORKING VERSION
// ===============================

let step = "start";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;

// ===============================
// INTENT DETECTION (IMPORTANT)
// ===============================

function isYes(input) {
  const text = input.toLowerCase();

  const yesWords = [
    "yes", "yeah", "yep", "correct", "true", "working", "ok", "okay",
    "fine", "running", "operating", "good", "normal", "it is", "that's right", "yup"
  ];

  return yesWords.some(w => text.includes(w));
}

function isNo(input) {
  const text = input.toLowerCase();

  const noWords = [
    "no", "nope", "not", "false", "not working", "fault",
    "issue", "problem", "dead", "failed", "not ok", "not okay"
  ];

  return noWords.some(w => text.includes(w));
}

// ===============================
// START SYSTEM
// ===============================

function startDiagnosis() {
  step = "q1";

  speak("Hello. I am your Generator and ATS diagnostic assistant.");
  
  setTimeout(() => {
    speak("Let us begin. Is the generator not starting when mains fails?");
    listen();
  }, 2000);
}

// ===============================
// VOICE LISTENING
// ===============================

function listen() {
  recognition.start();
}

recognition.onresult = function(event) {
  const input = event.results[0][0].transcript;
  process(input);
};

// ===============================
// CORE DIAGNOSTIC ENGINE
// ===============================

function process(input) {

  const unclear = !isYes(input) && !isNo(input);

  if (unclear) {
    speak("I did not clearly understand. Please say yes or no.");
    setTimeout(() => listen(), 1500);
    return;
  }

  // =========================
  // STEP 1
  // =========================
  if (step === "q1") {

    if (isYes(input)) {
      step = "battery";
      speak("Check battery voltage. Is it above 12.5 volts?");
    } else {
      end("Generator is functioning normally. No fault detected.");
      return;
    }
  }

  // =========================
  // STEP 2
  // =========================
  else if (step === "battery") {

    if (isYes(input)) {
      step = "relay";
      speak("Do you hear the starter relay clicking?");
    } else {
      end("Battery is weak or faulty. Please charge or replace the battery.");
      return;
    }
  }

  // =========================
  // STEP 3
  // =========================
  else if (step === "relay") {

    if (isYes(input)) {
      step = "fuel";
      speak("Is the fuel solenoid activating during start attempt?");
    } else {
      end("Starter relay or ATS start signal fault detected.");
      return;
    }
  }

  // =========================
  // STEP 4 (FINAL)
  // =========================
  else if (step === "fuel") {

    if (isYes(input)) {
      end("Likely starter motor or control PCB failure.");
    } else {
      end("Fuel system or fuel solenoid fault detected.");
    }

    return;
  }

  setTimeout(() => listen(), 1200);
}

// ===============================
// END SYSTEM (IMPORTANT)
// ===============================

function end(message) {

  speak(message);

  setTimeout(() => {
    speak("Diagnosis complete. Thank you for using the system. Goodbye.");
  }, 2500);
}

// ===============================
// TEXT TO SPEECH
// ===============================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  msg.lang = "en-US";

  speechSynthesis.speak(msg);
}

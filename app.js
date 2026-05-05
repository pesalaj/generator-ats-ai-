let step = "start";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;

// 🧠 GREETING
function startDiagnosis() {
  step = "q1";

  speak("Hello. I am your Generator and ATS diagnostic assistant. Let us begin troubleshooting.");

  setTimeout(() => {
    speak("Is the generator not starting when mains fails?");
    listen();
  }, 2500);
}

// 🎤 LISTEN
function listen() {
  recognition.start();
}

// 🧠 VOICE INPUT HANDLER
recognition.onresult = function(event) {
  let input = event.results[0][0].transcript.toLowerCase();
  process(input);
};

// 🧠 CORE FAULT TREE (DEEP LOGIC)
function process(input) {

  // STEP 1
  if (step === "q1") {
    if (input.includes("yes")) {
      step = "battery";
      speak("Check battery voltage. Is it above 12.5 volts?");
    } else {
      end("System is functioning normally. No fault detected.");
      return;
    }
  }

  // STEP 2
  else if (step === "battery") {
    if (input.includes("yes")) {
      step = "relay";
      speak("Do you hear the starter relay clicking?");
    } else {
      end("Battery is weak or faulty. Charge or replace the battery.");
      return;
    }
  }

  // STEP 3
  else if (step === "relay") {
    if (input.includes("yes")) {
      step = "fuel";
      speak("Is fuel solenoid activating during start attempt?");
    } else {
      end("Starter relay or ATS start signal fault detected.");
      return;
    }
  }

  // STEP 4 (FINAL DECISION)
  else if (step === "fuel") {
    if (input.includes("yes")) {
      end("Likely starter motor or control PCB failure.");
    } else {
      end("Fuel system or fuel solenoid fault detected.");
    }
    return;
  }

  // continue listening after each step
  setTimeout(() => listen(), 1500);
}

// 🧠 END SYSTEM (IMPORTANT FIX)
function end(result) {
  speak(result);

  setTimeout(() => {
    speak("Diagnosis complete. Thank you for using the system. Goodbye.");
  }, 2500);
}

// 🔊 SPEECH OUTPUT
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  speechSynthesis.speak(msg);
}

let step = 0;

const questions = [
  "Is generator not starting on mains failure?",
  "Is battery voltage above 12.5 volts?",
  "Do you hear starter relay click?",
  "Is fuel solenoid activating?"
];

const results = [
  "Check system power supply.",
  "Battery is weak or faulty.",
  "Check ATS start signal or relay fault.",
  "Fuel system or control wiring fault."
];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-US";

function startDiagnosis() {
  step = 0;
  speak(questions[step]);
  listen(); // start listening immediately
}

function listen() {
  recognition.start();
}

recognition.onresult = function(event) {
  let answer = event.results[0][0].transcript.toLowerCase();
  processAnswer(answer);
};

function processAnswer(answer) {
  let isYes = answer.includes("yes");
  let isNo = answer.includes("no");

  step++;

  if (step < questions.length) {
    speak(questions[step]);
    listen(); // keep loop going
  } else {
    speak(results[step - questions.length]);
  }
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);

  msg.onend = function() {
    // automatically start listening after speaking
    if (step < questions.length) {
      listen();
    }
  };
}

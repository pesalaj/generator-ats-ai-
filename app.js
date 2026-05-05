let step = 0;

const questions = [
  "Is generator not starting on mains failure?",
  "Is battery voltage above 12.5V?",
  "Do you hear starter relay click?",
  "Is fuel solenoid activating?"
];

const results = [
  "Check system power supply.",
  "Battery is weak or faulty.",
  "Check ATS start signal or relay fault.",
  "Fuel system or control wiring fault."
];

function startDiagnosis() {
  step = 0;
  speak(questions[step]);
  show(questions[step]);
}

function answer(val) {
  step++;

  if (step < questions.length) {
    speak(questions[step]);
    show(questions[step]);
  } else {
    speak(results[step - questions.length]);
    show(results[step - questions.length]);
  }
}

function show(text) {
  document.getElementById("display").innerText = text;
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

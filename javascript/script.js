document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  //   const animationArea = document.querySelector(".animation-area");

  /* --- AUDIO CONTROLS --- */
  const ffBtn = document.getElementById("ff");
  const sloBtn = document.getElementById("slo");
  const normalBtn = document.getElementById("normal");
  const pickSelect = document.getElementById("pick");
  const progressContainer = document.getElementById("progress-container");

  ffBtn.addEventListener("click", () => {
    audio.playbackRate = 1.5;
  });

  sloBtn.addEventListener("click", () => {
    audio.playbackRate = 0.75;
  });

  normalBtn.addEventListener("click", () => {
    audio.playbackRate = 1.0;
  });

  pickSelect.addEventListener("change", (e) => {
    if (e.target.value) {
      audio.src = e.target.value;
      audio.play();
    }
  });

  const audioInfo = document.createElement("div");
  audioInfo.className = "video-info";
  audioInfo.style.position = "relative";
  audioInfo.style.bottom = "auto";
  audioInfo.innerHTML = `
    <span id="audio-speed">Speed: 1x</span>
  `;
  progressContainer.appendChild(audioInfo);

  //   const audioTime = audioInfo.querySelector("#audio-time");
  const audioSpeed = audioInfo.querySelector("#audio-speed");

  //   audio.addEventListener("timeupdate", () => {
  //     const current = formatTime(audio.currentTime);
  //     const duration = formatTime(audio.duration);
  //     audioTime.textContent = `${current} / ${duration}`;
  //   });

  //   function formatTime(seconds) { //created w AI--
  //     if (isNaN(seconds)) return "0:00";          //checks if input is not a valid number
  //     const minutes = Math.floor(seconds / 60);   //converts seconds to minutes
  //     const secs = Math.floor(seconds % 60)       //calculates remains seconds after min
  //       .toString()                               //converts to number to a string
  //       .padStart(2, "0");                        //leads w zero
  //     return `${minutes}:${secs}`;                // returns in a time format
  //   }

  function updateAudioSpeedDisplay() {
    //changes display of playback speed to be consistent w current speed. changes simultaneously
    audioSpeed.textContent = `Speed: ${audio.playbackRate.toFixed(1)}x`;
  }

  audio.addEventListener("ratechange", updateAudioSpeedDisplay);
  updateAudioSpeedDisplay(); // Initialize speed display on load
});

/* --- CUE POINT SYSTEM --- */
let currentPath = null; // Track which path user chose
const DELAY = 1000;

const cuePoints = {
  decision1: 25,
  beachStart: 26,
  cafeStart: 150,
  decision2Beach: 58,
  decision2Cafe: 186,
  playfulStart: 59,
  playfulEnd: 99.5,
  sincereStart: 100,
  sincereEnd: 149,
  publicStart: 187,
  publicEnd: 235,
  privateStart: 236,
  privateEnd: 281,
  saidYes1: 87,
  saidYes2: 136,
  saidYes3: 223,
  saidYes4: 263,
  outro: 282,
};

// Apply background animation to right section
function applyBackgroundAnimation(gradient) {
  const rightSection = document.querySelector(".right-section");
  rightSection.style.transition = "background 1s ease-in";
  rightSection.style.background = gradient;
  currentBackgroundAnimation = gradient;
}

// Reset background to original
function resetBackground() {
  const rightSection = document.querySelector(".right-section");
  rightSection.style.transition = "background 1s ease-in";
  rightSection.style.background = "rgba(255, 255, 255, 0.03)";
  rightSection.style.borderColor = "rgba(255, 182, 193, 0.2)";
  currentBackgroundAnimation = null;
}

// Spawn floating hearts
function spawnFloatingHearts() {
  const rightSection = document.querySelector(".right-section");
  const heartCount = 7;
  const hearts = [];

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "💕";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.bottom = "-50px";
    heart.style.animation = `floatUp 3s ease-in forwards ${i * 0.3}s`;
    rightSection.appendChild(heart);
    hearts.push(heart);
  }

  return hearts;
}

// Remove all floating hearts
function removeFloatingHearts() {
  const hearts = document.querySelectorAll(".floating-heart");
  hearts.forEach((heart) => {
    heart.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => heart.remove(), 500);
  });
}

// Create and show decision buttons
function showDecisionButtons(title, buttonLabels, buttonActions) {
  // Remove any existing decision buttons
  const animationArea = document.querySelector(".animation-area");
  const existingButtons = animationArea.querySelector(
    ".animation-area .decision-buttons"
  );
  if (existingButtons) {
    existingButtons.remove();
  }

  const decisionContainer = document.createElement("div");
  decisionContainer.className = "decision-buttons";
  decisionContainer.innerHTML = `<h2>${title}</h2>`;

  buttonLabels.forEach((label, index) => {
    const btn = document.createElement("button");
    btn.className = "decision-button";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      buttonActions[index]();
      fadeOutButtons(decisionContainer);
    });
    decisionContainer.appendChild(btn);
  });

  animationArea.appendChild(decisionContainer);
}

// Fade out buttons
function fadeOutButtons(element) {
  element.style.animation = "fadeOut 0.5s ease-out forwards";
  setTimeout(() => {
    element.remove();
  }, 500);
}

// Seek to time and play after delay
function seekAndPlay(time) {
  audio.pause();
  audio.currentTime = time;
  setTimeout(() => {
    audio.play();
  }, DELAY);
}

// Show restart button
function showRestartButton() {
  console.log("showrestartbutton called!");
  const animationArea = document.querySelector(".animation-area");
  const restartContainer = document.createElement("div");
  restartContainer.className = "restart-container";
  restartContainer.style.animation = "fadeIn 0.5s ease-out";
  restartContainer.innerHTML = `<h2>The End 💕</h2>`;

  const restartBtn = document.createElement("button");
  restartBtn.className = "restart-button";
  restartBtn.textContent = "Start Over";
  restartBtn.addEventListener("click", () => {
    // Reset everything
    currentPath = null;
    console.log("setting outrotriggered to false!!");
    outroTriggered = false;
    resetBackground();
    removeFloatingHearts();
    restartContainer.remove();
    audio.currentTime = 0;
    audio.play();
  });

  restartContainer.appendChild(restartBtn);
  animationArea.appendChild(restartContainer);
}

function isEndOfMainStory(currentTime) {
  // currentTime >= X && currentTime < X + 0.1
  const EndTimes = [
    cuePoints.playfulEnd,
    cuePoints.sincereEnd,
    cuePoints.publicEnd,
    cuePoints.privateEnd,
  ];
  for (const time of EndTimes) {
    if (currentTime >= time && currentTime < time + 0.3) {
      return true;
    }
  }

  return false;
}

let outroTriggered = false;
// Monitor audio timeupdate for cue points
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  // Decision 1 (25 seconds)
  if (
    currentTime >= cuePoints.decision1 - 0.5 &&
    currentTime < cuePoints.decision1 + 0.5 &&
    currentPath === null
  ) {
    audio.pause();
    showDecisionButtons(
      "Where should we go?",
      ["🏖️ Beach", "☕ Cafe"],
      [
        () => {
          currentPath = "beach";
          resetBackground();
          removeFloatingHearts();
          seekAndPlay(cuePoints.beachStart);
        },
        () => {
          currentPath = "cafe";
          resetBackground();
          removeFloatingHearts();
          seekAndPlay(cuePoints.cafeStart);
        },
      ]
    );
  }

  // Beach Start - Apply beach background
  if (
    currentPath === "beach" &&
    currentTime >= cuePoints.beachStart - 0.5 &&
    currentTime < cuePoints.beachStart + 0.5
  ) {
    applyBackgroundAnimation(
      "linear-gradient(180deg, #FFD89B 0%, #FFA500 50%, #87CEEB 100%)"
    );
  }

  // Cafe Start - Apply cafe background
  if (
    currentPath === "cafe" &&
    currentTime >= cuePoints.cafeStart - 0.5 &&
    currentTime < cuePoints.cafeStart + 0.5
  ) {
    applyBackgroundAnimation(
      "linear-gradient(135deg, #8B6F47 0%, #D4A574 50%, #E8D4B8 100%)"
    );
  }

  // Decision 2 (Beach path at 58 seconds)
  if (
    currentPath === "beach" &&
    currentTime >= cuePoints.decision2Beach - 0.5 &&
    currentTime < cuePoints.decision2Beach + 0.5
  ) {
    audio.pause();
    showDecisionButtons(
      "How should we do this?",
      ["😄 Playful", "💕 Sincere"],
      [
        () => {
          seekAndPlay(cuePoints.playfulStart);
        },
        () => {
          seekAndPlay(cuePoints.sincereStart);
        },
      ]
    );
  }

  // Decision 2 (Cafe path at 186 seconds)
  if (
    currentPath === "cafe" &&
    currentTime >= cuePoints.decision2Cafe - 0.5 &&
    currentTime < cuePoints.decision2Cafe + 0.5
  ) {
    audio.pause();
    showDecisionButtons(
      "How should we do this?",
      ["👥 Public", "🤫 Private"],
      [
        () => {
          seekAndPlay(cuePoints.publicStart);
        },
        () => {
          seekAndPlay(cuePoints.privateStart);
        },
      ]
    );
  }

  // Said Yes animations - Spawn hearts at specific times
  if (
    (Math.abs(currentTime - cuePoints.saidYes1) < 0.5 ||
      Math.abs(currentTime - cuePoints.saidYes2) < 0.5 ||
      Math.abs(currentTime - cuePoints.saidYes3) < 0.5 ||
      Math.abs(currentTime - cuePoints.saidYes4) < 0.5) &&
    !outroTriggered
  ) {
    spawnFloatingHearts();
  }

  // End of main story - shift to outro
  if (isEndOfMainStory(currentTime)) {
    seekAndPlay(cuePoints.outro);
  }

  // Outro - Start at 282 seconds
  if (
    currentTime >= cuePoints.outro - 0.5 &&
    currentTime < cuePoints.outro + 0.5 &&
    !outroTriggered
  ) {
    outroTriggered = true;
    resetBackground();
    removeFloatingHearts();
    // Stop audio after 5 seconds
    setTimeout(() => {
      audio.pause();
      showRestartButton();
    }, 5000 + DELAY); // 5 secs + 1 sec audio delay
  }
});

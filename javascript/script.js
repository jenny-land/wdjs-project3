document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const animationArea = document.querySelector(".animation-area");



  /* --- AUDIO CONTROLS --- */
  const ffBtn = document.getElementById("ff");
  const sloBtn = document.getElementById("slo");
  const normalBtn = document.getElementById("normal");
  const pickSelect = document.getElementById("pick");

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
    <span id="audio-time">0:00 / 0:00</span>
    <span id="audio-speed">Speed: 1x</span>
  `;
  audio.parentElement.appendChild(audioInfo);

  const audioTime = audioInfo.querySelector("#audio-time");
  const audioSpeed = audioInfo.querySelector("#audio-speed");

  audio.addEventListener("timeupdate", () => {
    const current = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    audioTime.textContent = `${current} / ${duration}`;
  });

  function formatTime(seconds) { //created w AI--
    if (isNaN(seconds)) return "0:00";          //checks if input is not a valid number
    const minutes = Math.floor(seconds / 60);   //converts seconds to minutes
    const secs = Math.floor(seconds % 60)       //calculates remains seconds after min
      .toString()                               //converts to number to a string
      .padStart(2, "0");                        //leads w zero
    return `${minutes}:${secs}`;                // returns in a time format
  }

  function updateAudioSpeedDisplay() { //changes display of playback speed to be consistent w current speed. changes simultaneously
    audioSpeed.textContent = `Speed: ${audio.playbackRate.toFixed(1)}x`;
  }
  
  audio.addEventListener("ratechange", updateAudioSpeedDisplay);
  updateAudioSpeedDisplay(); // Initialize speed display on load

});


/* --- CUE POINT SYSTEM --- */
  let currentPath = null; // Track which path user chose

  const cuePoints = {
    decision1: 25,
    beachStart: 26,
    cafeStart: 150,
    decision2Beach: 58,
    decision2Cafe: 186,
    playfulEnd: 59,
    sincereEnd: 187,
    publicEnd: 187,
    privateEnd: 236,
    outro: 282
  };

// Create and show decision buttons
  function showDecisionButtons(title, buttonLabels, buttonActions) {
    // Remove any existing decision buttons
    const existingButtons = animationArea.querySelector(".decision-buttons");
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
  function seekAndPlay(time, delay = 2000) {
    audio.pause();
    audio.currentTime = time;
    setTimeout(() => {
      audio.play();
    }, delay);
  }

  // Monitor audio timeupdate for cue points
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;

    // Decision 1 (25 seconds)
    if (currentTime >= cuePoints.decision1 - 0.5 && currentTime < cuePoints.decision1 + 0.5 && currentPath === null) {
      audio.pause();
      showDecisionButtons("Where should we go?", ["🏖️ Beach", "☕ Cafe"], [
        () => {
          currentPath = "beach";
          seekAndPlay(cuePoints.beachStart);
        },
        () => {
          currentPath = "cafe";
          seekAndPlay(cuePoints.cafeStart);
        }
      ]);
    }

   // Decision 2 (Beach path at 58 seconds)
    if (currentPath === "beach" && currentTime >= cuePoints.decision2Beach - 0.5 && currentTime < cuePoints.decision2Beach + 0.5) {
      audio.pause();
      showDecisionButtons("How should we do this?", ["😄 Playful", "💕 Sincere"], [
        () => {
          seekAndPlay(cuePoints.playfulEnd);
        },
        () => {
          seekAndPlay(cuePoints.sincereEnd);
        }
      ]);
    }

    // Decision 2 (Cafe path at 186 seconds)
    if (currentPath === "cafe" && currentTime >= cuePoints.decision2Cafe - 0.5 && currentTime < cuePoints.decision2Cafe + 0.5) {
      audio.pause();
      showDecisionButtons("How should we do this?", ["👥 Public", "🤫 Private"], [
        () => {
          seekAndPlay(cuePoints.publicEnd);
        },
        () => {
          seekAndPlay(cuePoints.privateEnd);
        }
      ]);
    }
  });
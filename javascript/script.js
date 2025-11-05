document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");



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

  function updateAudioSpeedDisplay() {
    audioSpeed.textContent = `Speed: ${audio.playbackRate.toFixed(1)}x`;
  }

  audio.addEventListener("ratechange", updateAudioSpeedDisplay);
});


/* --- Cue Point Timers --- */
const cuePoints = {
    decision1: { time: 23 },     // First pause at 23 seconds
    decision2: { time: 78 },     // Second pause at 78 seconds
    endingAnimation: { time: 175 }, // Trigger effects at 175 seconds
    outro: { time: 178 }         // Story ends at 178 seconds
};
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
    decision1: { time: 25 },            // First pause for beach or cafe

    beachStart: { time: 26 },           // start beach scene 3A
    decision2: { time: 58 },            // Second pause for playful or sincere
    playEnd: { time: 59},               // plays 3A1 choosing button playful
    endingAnimation1: { time: 87 },     // yes animation for 3A1 (end scene @100)
    outro: { time: 282 }                // Story ends for 3A1 ends @ 286.5

    beachStart: { time: 26 },           // start beach scene 3A
    decision2: { time: 58 },            // Second pause for playful or sincere
    playEnd: { time: 187},              // plays 3A2 choosing button sincere
    endingAnimation2: { time: 223 },    // yes animation for 3A2 ends @ 282
    outro: { time: 282 }                // Story ends for 3A2 ends @ 286.5

    cafeStart: { time: 150 },           // start cafe scene 3A
    decision2: { time: 186 },           // Second pause for public or private
    playEnd: { time: 187 },             // plays 3B1 choosing button private
    endingAnimation3: { time: 223 },    // yes animation for 3B1 ends @ 235
    outro: { time: 282 }                // Story ends for 3B1 ends @ 286.5

    cafeStart: { time: 159 },           // start cafe scene 3A
    decision2: { time: 186 },           // Second pause for public or private
    playEnd: { time: 236 },             // plays 3B2 choosing button private
    endingAnimation4: { time: 263 },    // yes animation for 3B2 ends @ 282
    outro: { time: 282 }                // Story ends for 3B2 ends @ 286.5
};
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

function setTextContent(content) {
  const textContent = document.getElementById("text-content");
  if (textContent) {
    textContent.innerHTML = content;
  }
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
    outroTriggered = false;
    resetBackground();
    removeFloatingHearts();
    restartContainer.remove();
    setTextContent(textContent.intro);
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
          setTextContent(textContent.beach);
        },
        () => {
          currentPath = "cafe";
          resetBackground();
          removeFloatingHearts();
          seekAndPlay(cuePoints.cafeStart);
          setTextContent(textContent.cafe);
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
          setTextContent(textContent.playful);
        },
        () => {
          seekAndPlay(cuePoints.sincereStart);
          setTextContent(textContent.sincere);
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
          setTextContent(textContent.public);
        },
        () => {
          seekAndPlay(cuePoints.privateStart);
          setTextContent(textContent.private);
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
    setTextContent(textContent.outro);
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

const textContent = {
  intro: `
    <h1>INTRO SCENE - DECISION POINT 1</h1>
    <p>
        NARRATOR: Okay. Ring's in your pocket. Heart's racing. And your
        mind won't stop spinning. You've planned two versions of
        tonight. One by the water. Calm. Cinematic. Simple. And one at
        your favorite café, the place where it all began. Which one
        feels right?
    </p>
  `,
  beach: `
        <h1>BEACH PATH - SCENE 2A</h1>
        <p>NARRATOR: Golden light on the water. The ocean breeze moves through your hair. Her hand is in yours, and you've both been quiet for a while. The kind of silence that means everything.</p>
        <p>PARTNER: It's perfect here. You've been weirdly quiet though... are you okay?</p>
        <p>NARRATOR: Your heart's pounding. This is it. The moment. Do you make her laugh first, or just tell her what's in your heart?</p>
    `,
  playful: `
        <h1>BEACH PLAYFUL - SCENE 3A.1</h1>
        <p>NARRATOR: You take a breath. Squeeze her hand.</p>
        <p>YOU: Okay, I'm only slightly nervous right now. And I swear, this isn't about that seagull stealing our fries earlier. But I've been thinking... I just kind of want to spend the rest of my life being your problem.</p>
        <p>PARTNER: Wait, what? Are you...?</p>
        <p>YOU: Yeah. That's me asking. Will you marry me?</p>
        <p>PARTNER: You're such an idiot, but yes. A thousand times yes.</p>
        <p>NARRATOR: She's in your arms. The sunset paints everything gold. This is real. This is happening. And it's everything you hoped for.</p>
    `,
  sincere: `
        <h1>BEACH SINCERE - SCENE 3A.2</h1>
        <p>NARRATOR: You look at her. Really look at her. And suddenly all the nerves fall away.</p>
        <p>YOU: I never thought I'd find someone who makes me feel calm and excited at the same time. Every moment with you feels like this... this sunset. Familiar. Fleeting. Beautiful in a way I can't quite explain. And I don't want to miss another one. So, will you marry me?</p>
        <p>PARTNER: Oh my god, you're going to make me cry.</p>
        <p>YOU: Then I'll take that as a yes?</p>
        <p>PARTNER: Yes. Of course yes. Always yes.</p>
        <p>NARRATOR: She's in your arms. The world is quiet except for the waves. And you've never felt more certain about anything in your life. This is where your forever begins.</p>
    `,
  cafe: `
        <h1>CAFE PATH - SCENE 2B</h1>
        <p>NARRATOR: You're back where it all began. The corner table. The same one from your first date. And she's looking at you with that crooked smile, the one that made you fall in love in the first place.</p>
        <p>PARTNER: You even ordered the same latte, wow. You're really going for nostalgia, huh?</p>
        <p>NARRATOR: She knows something's happening. You can feel her wondering. The café is full of people. Do you make this a grand moment, let everyone in on your joy? Or do you keep it intimate, just the two of you in this crowded room, in your own world?</p>
    `,
  public: `
        <h1>CAFE GRAND GESTURE - SCENE 3B.1</h1>
        <p>NARRATOR: You can feel your pulse in your throat. This is bold. This is big. But it feels right.</p>
        <p>YOU: Hey, sorry everyone. Can I just say something real quick?</p>
        <p>PARTNER: Wait, what are you doing?</p>
        <p>YOU: I just wanted everyone here to know, I somehow got the best person in the world to fall in love with me. And I don't plan on letting that go. So I'm asking, right here, right now, will you marry me?</p>
        <p>PARTNER: Oh my god, yes! Before you make me cry in front of everyone, yes!</p>
        <p>NARRATOR: The café erupts. People are clapping. She's laughing and crying and throwing her arms around you. And you're grinning like an idiot because you just made it happen. She said yes.</p>
    `,
  private: `
        <h1>CAFE INTIMATE - SCENE 3B.2</h1>
        <p>NARRATOR: You lean forward. The café fades away. In this moment, it's just you and her. No audience. No performance. Just truth.</p>
        <p>YOU: I don't need a big speech. I don't need the whole café watching. I just need you. I just want to build a life with you. Will you marry me?</p>
        <p>PARTNER: You really brought me here to cry quietly in public, didn't you? Yes. God, yes. (263) 4.23</p>
        <p>NARRATOR: That's it. No crowd. No lights. No grand gestures. Just her. Just you. And the moment you've been waiting for. This is your beginning. Quiet. Real. Perfect in its simplicity. And it's everything you ever wanted it to be.</p>
    `,
  outro: `
    <h1>OUTRO - ALL PATHS</h1>
    <p>NARRATOR: And that's how you said yes to forever.</p>
    `,
};

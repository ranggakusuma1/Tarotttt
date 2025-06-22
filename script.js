const audio = document.getElementById("audio");
const currentLine = document.getElementById("current-line");
const playBtn = document.getElementById("play-btn");
const volumeSlider = document.getElementById("volume-slider");
let currentIndex = 0;

// Fungsi set ikon
function setPlayIcon() {
  playBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="white">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  `;
}
function setPauseIcon() {
  playBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="white">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  `;
}
function setReplayIcon() {
  playBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="white">
      <path d="M12 5v3l4-4-4-4v3c-5 0-9 4-9 9s4 9 9 9c4.4 0 8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6z"/>
    </svg>
  `;
}

// === Visualizer Canvas ===
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// === Spotify-Style Fake Visualizer (Mirror Bars) ===
const barCount = 32;
const barHeights = new Array(barCount).fill(0);

function drawFakeVisualizer() {
  requestAnimationFrame(drawFakeVisualizer);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const barWidth = (canvas.width / (barCount * 2)) * 0.8;

  for (let i = 0; i < barCount; i++) {
    const target = Math.random() * canvas.height * 0.9;
    barHeights[i] += (target - barHeights[i]) * 0.15;

    const barHeight = barHeights[i];
    const offset = i * (barWidth + 2);
    ctx.fillStyle = "rgba(30, 215, 96, 0.85)";

    ctx.fillRect(centerX + offset, canvas.height - barHeight, barWidth, barHeight);
    ctx.fillRect(centerX - offset - barWidth, canvas.height - barHeight, barWidth, barHeight);
  }
}
drawFakeVisualizer();

// === Sinkronisasi Lirik ===
function updateLyrics() {
  if (currentIndex >= lyrics.length) return;

  const currentTime = audio.currentTime;
  const [time, line] = lyrics[currentIndex];

  if (currentTime >= time) {
    const nextTime = lyrics[currentIndex + 1]
      ? lyrics[currentIndex + 1][0]
      : audio.duration;
    const duration = nextTime - time;

    currentLine.classList.remove("fade-in", "fade-out");
    void currentLine.offsetWidth;

    currentLine.textContent = line;
    currentLine.classList.add("fade-in");

    setTimeout(() => {
      currentLine.classList.remove("fade-in");
      currentLine.classList.add("fade-out");
    }, duration * 1000 * 0.9);

    currentIndex++;
  }

  requestAnimationFrame(updateLyrics);
}

// === Volume Slider ===
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// === Tombol Play/Pause/Replay ===
playBtn.addEventListener("click", () => {
  if (audio.paused || audio.ended) {
    if (audio.ended) {
      audio.currentTime = 0;
      currentIndex = 0;
    }
    audio.play();
    setPauseIcon();
    requestAnimationFrame(updateLyrics);
  } else {
    audio.pause();
    setPlayIcon();
  }
});

audio.addEventListener("ended", () => {
  setReplayIcon();
});
audio.addEventListener("pause", () => {
  if (!audio.ended) {
    setPlayIcon();
  }
});

// === Inisialisasi ikon awal ===
setPlayIcon();

// === Partikel ===
particlesJS('particles-js', {
  particles: {
    number: { value: 80 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 1.5 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  },
  retina_detect: true
});

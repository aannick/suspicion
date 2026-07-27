let thunderTimeout = null;
let stormAudioRunning = false;

const rainAudio = document.getElementById("rain-audio");
const thunderAudio = document.getElementById("thunder-audio");
const chimeAudio = document.getElementById("chime-audio");

rainAudio.volume = 0.4;
thunderAudio.volume = 0.3;
chimeAudio.volume = 0.8;

function enterMansion() {
  const acceptBtn = document.getElementById("accept-btn");
  acceptBtn.disabled = true;

  rainAudio.play().then(() => {
    rainAudio.pause();
    rainAudio.currentTime = 0;
  }).catch(() => {});

  thunderAudio.play().then(() => {
    thunderAudio.pause();
    thunderAudio.currentTime = 0;
  }).catch(() => {});

  chimeAudio.play().catch(() => {});

  document.body.classList.add("entered");
  loopWeather();
}


function buildRain() {
  const rain = document.getElementById("hero-rain");
  rain.innerHTML = "";
  const dropCount = 90;
  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    const left = Math.random() * 100;
    const height = 16 + Math.random() * 16;
    const duration = (0.5 + Math.random() * 0.4).toFixed(2);
    const delay = (Math.random() * 2).toFixed(2);
    drop.style.left = left + "%";
    drop.style.height = height + "px";
    drop.style.animationDuration = duration + "s";
    drop.style.animationDelay = delay + "s";
    rain.appendChild(drop);
  }
}

const STORM_DURATION = 9000;
const CLEAR_DURATION = 9000;

function goClear() {
  document.getElementById("hero").classList.add("clear");
  stopStormSound();
}

function goStorm() {
  document.getElementById("hero").classList.remove("clear");
  startStormSound();
}

function loopWeather() {
  goClear();

  setTimeout(() => {
    goStorm();

    setTimeout(loopWeather, STORM_DURATION);
  }, CLEAR_DURATION);
}


function fadeAudio(audio, targetVolume, duration) {
  const step = 0.02;
  const interval = duration / (targetVolume / step);

  const fade = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + step, targetVolume);
    } else {
      audio.volume = Math.max(audio.volume - step, targetVolume);
    }

    if (audio.volume === targetVolume) {
      clearInterval(fade);
    }
  }, interval);
}

function startStormSound() {
  if (stormAudioRunning) return;

  stormAudioRunning = true;

  rainAudio.play();
  fadeAudio(rainAudio, 0.35, 3000);

  thunderLoop();
}

function stopStormSound() {
  stormAudioRunning = false;

  if (thunderTimeout) {
    clearTimeout(thunderTimeout);
    thunderTimeout = null;
  }

  fadeAudio(rainAudio, 0, 4000);

  setTimeout(() => {
    rainAudio.pause();
  }, 4000);
}

function thunderLoop() {
  const delay = 2000 + Math.random() * 10000;

  thunderTimeout = setTimeout(() => {
    if (document.getElementById("hero").classList.contains("clear")) {
      return;
    }

    thunderAudio.currentTime = 0;
    thunderAudio.play();

    thunderLoop();
  }, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  buildRain();
});
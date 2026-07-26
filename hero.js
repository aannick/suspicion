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

function goClear() {
  document.getElementById("hero").classList.add("clear");
}

function goStorm() {
  document.getElementById("hero").classList.remove("clear");
}

let transitionTimer;

function startSequence() {
  goStorm();
  buildRain();
  transitionTimer = setTimeout(goClear, 3500);
}

function replay() {
  clearTimeout(transitionTimer);
  startSequence();
}

document.addEventListener("DOMContentLoaded", startSequence);

const ASSETS = {
  craneLeft: 'assets/crane-left.png',
  craneRight: 'assets/crane-right.png',
  craneBase: 'assets/crane-base.png'
};

const craneLeftClaw = document.getElementById("craneLeftClaw");
const craneRightClaw = document.getElementById("craneRightClaw");
const craneBase = document.getElementById("craneBase");
const craneItem = document.getElementById("craneItem");
const craneContainerPos = document.getElementById("craneContainerPos");
const craneContainerRot = document.getElementById("craneContainerRot");
const displayContainer = document.getElementById('displayContainer');
const displayItem = document.getElementById('displayItem');
const displayImage = document.getElementById('displayImage');
const lightContainer = document.getElementById('lightContainer');
const displayUser = document.getElementById('displayUser');
const messageEl = document.getElementById('message');

let queue = [];
let isBusy = false;
let currentUser = "";
let currentItem = null;
let isUnique = false;

const colorMap = {
  common: '#655b43', uncommon: '#26d64f', rare: '#0060ff',
  epic: '#8f00ff', legendary: '#ff5a00'
};

const sparklePool = [];
const maxSparkles = 10;
let currentIndex = 0;

// Create sparkles
for (let i = 0; i < maxSparkles; i++) {
  const sparkle = document.createElement('img');
  sparkle.className = 'sparkle';
  displayContainer.appendChild(sparkle);
  sparklePool.push(sparkle);
}

// ====================== HELPERS ======================
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupCraneImages() {
  craneLeftClaw.src = ASSETS.craneLeft;
  craneRightClaw.src = ASSETS.craneRight;
  craneBase.src = ASSETS.craneBase;
}

function enterQueue(name) {
  queue.push(name);
  if (!isBusy) {
    isBusy = true;
    getItem();
  }
}

function getItem() {
  currentUser = queue.shift() || "DemoUser";
  
  // Demo items
  const demoItems = [
    {name: "Golden Dragon", rarity: "legendary", image: "assets/items/legendary.png"},
    {name: "Neon Cat", rarity: "epic", image: "assets/items/epic.png"},
    {name: "Lucky Coin", rarity: "rare", image: "assets/items/rare.png"}
  ];
  
  currentItem = demoItems[getRandom(0, demoItems.length-1)];
  isUnique = Math.random() < 0.12;

  if (isUnique) {
    craneItem.style.filter = 'hue-rotate(' + getRandom(0,5)*60 + 'deg)';
    displayImage.style.filter = 'hue-rotate(' + getRandom(0,5)*60 + 'deg)';
  } else {
    craneItem.style.filter = '';
    displayImage.style.filter = '';
  }

  playCraneAnimation();
}

// ====================== CRANE ANIMATION ======================
function playCraneAnimation() {
  // Simplified crane animation for demo
  craneItem.style.visibility = 'hidden';
  setTimeout(() => {
    craneItem.src = currentItem.image;
    craneItem.style.visibility = 'visible';
    playDisplayAnimation();
  }, 4500);
}

function playDisplayAnimation() {
  displayItem.textContent = currentItem.name;
  displayItem.style.webkitTextStrokeColor = colorMap[currentItem.rarity] || '#ffffff';
  displayItem.style.visibility = "visible";

  displayImage.src = currentItem.image;
  displayImage.style.visibility = "visible";
  displayImage.classList.add("displayAnimation");

  displayUser.textContent = currentUser;
  displayUser.style.visibility = "visible";

  lightContainer.style.display = "block";

  if (isUnique) startSparkles();

  setTimeout(clearItem, 6500);
}

function clearItem() {
  displayItem.style.visibility = "hidden";
  displayImage.style.visibility = "hidden";
  displayUser.style.visibility = "hidden";
  lightContainer.style.display = "none";
  displayImage.classList.remove("displayAnimation");

  if (queue.length > 0) {
    setTimeout(getItem, 600);
  } else {
    isBusy = false;
  }
  endSparkles();
}

// Sparkles
let sparkleInterval;
function startSparkles() {
  sparkleInterval = setInterval(createSparkles, 180);
}
function endSparkles() {
  clearInterval(sparkleInterval);
}
function createSparkles() {
  const sparkle = sparklePool[currentIndex];
  currentIndex = (currentIndex + 1) % maxSparkles;
  const size = getRandom(40, 70);
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `${getRandom(80, 420)}px`;
  sparkle.style.top = `${getRandom(80, 420)}px`;
  sparkle.style.animation = 'sparkle 1.2s ease-in-out forwards';
}

// ====================== INITIALIZE ======================
function initialize() {
  setupCraneImages();
  console.log("✅ Crane Game Widget Demo Loaded");
}

// Start
window.addEventListener('load', initialize);

let displayPositionX, displayPositionY;
let enableSubs, enableGiftedSubs, enableBits, bitMinimum, enableDonos, donoMinimum, channelPointName, chatCommand, multiPlay;

let isEditorMode = false;
let ownerName = "";
let fieldData;

let commonChance, uncommonChance, rareChance, epicChance, legendaryChance;

let uniqueChance = 0.1;
let isUnique = false;

let initiateSFX, commonSFX, uncommonSFX, rareSFX, epicSFX, legendarySFX, uniqueSFX, uniqueLegendarySFX;
let enableAudio = false;
let audio = new Audio();

const container = document.getElementById('container');
const displayContainer = document.getElementById('displayContainer');
const displayItem = document.getElementById('displayItem');
const displayImage = document.getElementById('displayImage');
const lightContainer = document.getElementById('lightContainer');
const lightColors = document.querySelectorAll('stop.color-stop');
const displayUser = document.getElementById('displayUser');
const message = document.getElementById('message');

let rarities = [
  { name: 'common', chance: 55 },
  { name: 'uncommon', chance: 30 },
  { name: 'rare', chance: 10 },
  { name: 'epic', chance: 4 },
  { name: 'legendary', chance: 1 }
];


let item = {
  name: "",
  rarity: "",
  image: "" ,
  sound: ""
};

const colorMap = {
  common: '#655b43',        // gray
  uncommon: '#26d64f',      // green
  rare: '#0060ff',          // blue
  epic: '#8f00ff',          // purple
  legendary: '#ff5a00'      // orange/red
};

let displayScale = 1;
let displayTime;
let displayFontName, displayNameColor, displayStrokeWidth;
let currentItem;
let itemPool = [];
let queue = [];
let isBusy = false;
let currentUser = "OhMySez";

let savePath = 'CustomCraneGameData';

const craneContainerPos = document.getElementById("craneContainerPos");
const craneRightClaw = document.getElementById("craneRightClaw");
const craneLeftClaw = document.getElementById("craneLeftClaw");
const craneBase = document.getElementById("craneBase");
const craneItem = document.getElementById("craneItem");
const craneRangeDisplay = document.getElementById("craneRangeDisplay");


let craneTargetPos = '0px';
let craneStartPos = '0px';

let randomizeCraneDirection = true;
let craneDirection = 'right';

let craneRange = 50;
let craneRangeShift = 25;

const sparklePool = [];
const maxSparkles = 10;

for (let i = 0; i < maxSparkles; i++) {
  const sparkle = document.createElement('img');
  sparkle.className = 'sparkle';
  displayContainer.appendChild(sparkle);
  sparklePool.push(sparkle);
}

let sparkleInterval;
let currentIndex = 0;

let channelId;
let jwtToken = null;
let postToChat = false;

//=========================
//       PLAY AUDIO
//=========================

function playAudio(filePath) {
  if (audio !== null && filePath != null) {
    if (!audio.paused) {
      audio.pause(); // Pause the audio if it's already playing
    }
    if (filePath != "") {
      audio = new Audio(filePath);
      audio.play(); // Start playing the new audio
    }
  }
}

//=========================
//       ENTER QUEUE
//=========================

function enterQueue(name) {
  queue.push(name);
  if(!isBusy)
  {
    isBusy = true;
    getItem();
  }
}

//=========================
//     DISPLAY MESSAGE
//=========================

function displayMessage(msg, time) {
  message.textContent = msg;
  message.style.visibility = 'visible';

  setTimeout(function () {
    message.style.visibility = 'hidden';
  }, time);
}

//=========================
//        GET ITEM
//=========================

function getItem() {
    
  currentUser = queue.shift();
  
  let rngRarity = getRandom(1, 100);
  let newRarity = getRarity(rngRarity);   
  let rngUnique = getRandom(1, 10000);


  if (itemPool.length > 0) {
            
    let pool = itemPool.filter((i) => {
      return i.rarity == newRarity
    });
        
    currentItem = Object.assign({}, pool[getRandom(0, pool.length - 1)]);
  }
  else {
    displayMessage("Prize Pool is empty. Add prizes.")
  }



    if(rngUnique <= uniqueChance)
    {
      isUnique = true;
      let newHue = getRandom(1, 5) * 60;
      craneItem.style.filter = 'hue-rotate(' + newHue + 'deg)';
      displayImage.style.filter = 'hue-rotate(' + newHue + 'deg)';
    }
    else
    {
      isUnique = false;
      craneItem.style.filter = '';
      displayImage.style.filter = '';
    }

    playCraneAnimation();  
}

//=========================
//        SET CRANE
//=========================


function setCranePosition() {
  if (randomizeCraneDirection) {
    let rng = getRandom(0, 1);
    
    if(rng === 0)
    {
      craneDirection = 'right';
      craneStartPos = '1250px';
    }
    else
    {
      craneDirection = 'left';
      craneStartPos = '-1250px';
    }
  } else {
    if(craneDirection === 'left')
    {
      craneDirection = 'left';
      craneStartPos = '-1250px';
    }
    else 
    {
      craneDirection = 'right';
      craneStartPos = '1250px';
    }
  }

  craneContainerPos.style.setProperty("--craneStartPos", craneStartPos);
  craneContainerPos.style.transform = `translateX(${craneStartPos}) translateY(-900px)`;
}

//=========================
//     CRANE ANIMATION
//=========================

function playCraneAnimation()
{
  setCranePosition();

  playAudio(initiateSFX);
  
  let rng = getRandom(0, 100);

  let targetWidth = (craneRange / 100) * 1520;
  let targetShiftAmount = (craneRangeShift / 50 ) * 760;

  let minTargPos = -targetWidth / 2 + targetShiftAmount;
  let maxTargPos = targetWidth / 2 + targetShiftAmount;

  craneTargetPos = (rng / 100 * (maxTargPos - minTargPos) + minTargPos) + "px";
  
  
  craneContainerPos.style.setProperty("--craneTargetPos", craneTargetPos);
  
  moveBaseIn();
  rotateBaseIn();
	


}

function moveBaseIn() {
  craneContainerPos.style.animation = '';
  void craneContainerPos.offsetHeight; 
  craneContainerPos.style.animation = 'moveBase 1.5s ease-in-out forwards';
  craneItem.style.visibility = 'hidden';
}

function rotateBaseIn() {
  craneContainerRot.style.animation = '';
  void craneContainerRot.offsetHeight; 
  if(craneDirection === 'right')
  {
    craneContainerRot.style.animation = 'rotateBaseL 1s ease-in-out forwards, pendulumBaseL 3s ease-in-out 1s forwards';
  }
  else
  {
    craneContainerRot.style.animation = 'rotateBaseR 1s ease-in-out forwards, pendulumBaseR 3s ease-in-out 1s forwards';
  }
}

function moveBaseOut() {
  craneContainerPos.style.animation = '';
  void craneContainerPos.offsetHeight; 
  craneContainerPos.style.animation = 'moveBase 1.5s ease-in-out reverse forwards';
}

function rotateBaseOut() {
  craneContainerRot.style.animation = '';
  void craneContainerRot.offsetHeight; 

  if(craneDirection === 'left') {
    craneContainerRot.style.animation = 'rotateBaseL 1s ease-in-out forwards, pendulumBaseL 3s ease-in-out 1s forwards';
  }
  else {
    craneContainerRot.style.animation = 'rotateBaseR 1s ease-in-out forwards, pendulumBaseR 3s ease-in-out 1s forwards';
  }

}

function dropClaw() {
  craneContainerPos.style.animation = '';
  void craneContainerPos.offsetHeight; 
  craneContainerPos.style.animation = 'dropClaw 2s ease-out forwards';
}

function raiseClaw() {
  craneContainerPos.style.animation = '';
  void craneContainerPos.offsetHeight; 
  craneContainerPos.style.animation = 'dropClaw 3s ease-in-out reverse forwards';
}

function openClaws() {
  craneRightClaw.style.animation = '';
  void craneRightClaw.offsetHeight; 
  craneLeftClaw.style.animation = '';
  void craneLeftClaw.offsetHeight; 
  craneRightClaw.style.animation = 'rotateRightClaw 1s ease-in-out forwards';
  craneLeftClaw.style.animation = 'rotateLeftClaw 1s ease-in-out forwards';
}

function closeClaws() {
  craneRightClaw.style.animation = '';
  void craneRightClaw.offsetHeight; 
  craneLeftClaw.style.animation = '';
  void craneLeftClaw.offsetHeight; 
  craneRightClaw.style.animation = 'rotateRightClaw 2s ease-in reverse forwards';
  craneLeftClaw.style.animation = 'rotateLeftClaw 2s ease-in reverse forwards';
  
  setTimeout(() => {
    craneItem.src = currentItem.image;
    craneItem.style.visibility = 'visible';
  }, 2000);
}


//=========================
//    DISPLAY ANIMATION
//=========================

  function playDisplayAnimation()
  {
    if(isUnique)
    {
      startSparkles();
    }
    if(enableAudio) {
      if(isUnique)
      {
        if(currentItem.rarity == 'legendary')
        {
          playAudio(uniqueLegendarySFX);
        }
        else
        {
          playAudio(uniqueSFX);
        }
      }
      else
      {
        switch(currentItem.rarity) {
          case 'common':
            playAudio(commonSFX);
            break;
          case 'uncommon':
            playAudio(uncommonSFX);
            break;
          case 'rare':
            playAudio(rareSFX);
            break;
          case 'epic':
            playAudio(epicSFX);
            break;
          case 'legendary':
            playAudio(legendarySFX);
            break;
          default:
            playAudio(commonSFX);
            break;
          }
      }
    }

    displayItem.textContent = currentItem.name;
    displayItem.style.webkitTextStrokeColor = colorMap[currentItem.rarity];
    displayItem.style.visibility = "visible";
    
    const newLightColor = lightenHexColor(colorMap[currentItem.rarity], 50);

    lightColors.forEach((stop) => {
      stop.setAttribute('stop-color', newLightColor);
    });

    lightContainer.style.display = "block";

    displayImage.classList.remove("displayAnimation");
    void displayImage.offsetWidth;
    displayImage.classList.add("displayAnimation");
    displayImage.src = currentItem.image;
    displayImage.style.visibility = "visible";

    displayUser.textContent = currentUser;
    displayUser.style.visibility = "visible";

    if(postToChat)
    {
      
      var nextWord = isUnique ? "shiny" : currentItem.rarity;

      var article = /^[aeiou8]/i.test(nextWord) ? "an" : "a";

      var text = currentUser + " pulled " + article + " " +
                (isUnique ? "shiny " : "") +
                currentItem.rarity + " " +
                currentItem.name + " !!";

      botSay(text);
    }

    setTimeout(clearItem, displayTime);
}

//=========================
//     CONTAINS RARITY
//=========================

function containsRarity(desiredRarity) {
    return itemPool.some(item => item.rarity === desiredRarity);
}


//=========================
//      GET RARITY
//=========================

function containsRarity(desiredRarity) {
  return itemPool.some(item => item.rarity === desiredRarity);
}

function getRarity(roll) {
  let rarities = [
    { name: 'common', chance: commonChance },
    { name: 'uncommon', chance: uncommonChance },
    { name: 'rare', chance: rareChance },
    { name: 'epic', chance: epicChance },
    { name: 'legendary', chance: legendaryChance }
  ];

  rarities = rarities.filter(r => r.chance > 0 && containsRarity(r.name));

  let total = rarities.reduce((sum, r) => sum + r.chance, 0);
  if (total === 0) return 'No valid rarities';

  // Normalize probabilities to sum to 100
  let normalizedChances = rarities.map(r => (r.chance / total) * 100);
  let cumulative = 0;
  let ranges = normalizedChances.map(chance => {
    cumulative += chance;
    return cumulative;
  });

  // Compare roll (1–100) directly to ranges
  for (let i = 0; i < ranges.length; i++) {
    if (roll <= ranges[i]) return rarities[i].name;
  }

  return rarities[rarities.length - 1].name;
}

//=========================
//      CLEAR DISPLAY
//=========================

function clearItem()
{
  displayItem.style.visibility = "hidden";
  displayImage.style.visibility = "hidden";
  displayUser.style.visibility = "hidden";
  lightContainer.style.display = "none";

  
  if(queue.length > 0)
  {
    setTimeout(getItem, 500);
  }
  else
  {
    isBusy = false;
  }
  
  endSparkles();
}

//=========================
//       INITIALIZE
//=========================

function initialize() {

  //updateCSS();
  setCranePosition();
  
  for (let i = 1; i <= 100; i++) {
      const nameKey = `item${i}Name`;
      const rarityKey = `item${i}Rarity`;
      const imageKey = `item${i}Image`;
		  	  
      if (fieldData[nameKey]?.trim() && 
          fieldData[rarityKey]?.trim() && 
          fieldData[imageKey]?.trim()) {
          itemPool.push({
              name: fieldData[nameKey].trim(),
              rarity: fieldData[rarityKey].trim(),
              image: fieldData[imageKey].trim()
          });
      }
  }

  itemPool = [
  {
	  name: "Shooting Star",
	  rarity: "common",
	  image: "assets/items/prizeShootingStar.png" },
  {
	  name: "Space Cow",
	  rarity: "uncommon",
	  image: "assets/items/prizeCow.png" },
  {
	  name: "Ray Gun",
	  rarity: "rare",
	  image: "assets/items/prizeRayGun.png" },
  {
	  name: "Astronaut",
	  rarity: "epic",
	  image: "assets/items/prizeAstronaut.png" },
  {
	  name: "Glorp",
	  rarity: "legendary",
	  image: "assets/items/prizeGlorp.png" },
  ];

  if(isEditorMode)
  {
    displayLocationText = document.createElement('p');
    displayLocationText.textContent = "Display Area"; 
    displayLocationText.classList.add("displayText"); 
    displayContainer.appendChild(displayLocationText);

    craneRangeText = document.createElement('p');
    craneRangeText.textContent = "Crane Area"; 
    craneRangeText.classList.add("craneRangeText"); 
    craneRangeDisplay.appendChild(craneRangeText);

    displayContainer.style.background = 'rgba(0, 0, 255, 0.25)';
    craneRangeDisplay.style.visibility = "visible";
    craneRangeDisplay.style.background = 'rgba(0, 255, 0, 0.25)';
  }
  
  displayContainer.style.transform = 'scale(' + displayScale + ')';

  const scaledWidth = 500 * displayScale;
  const scaledHeight = 500 * displayScale;

  const newPosX = (displayPositionX / 100) * (1920 - scaledWidth);
  const newPosY = (displayPositionY / 100) * (1080 - scaledHeight);

  displayContainer.style.left = `${newPosX}px`;
  displayContainer.style.bottom = `${newPosY}px`;
}

//=========================
//       UPDATE CSS
//=========================

function updateCSS() {
  
	const formattedDisplayFontName = displayFontName.split(" ").join("+");
    const displayFontStylesheet = document.createElement("link");
 
    displayFontStylesheet.rel = "stylesheet";
    displayFontStylesheet.href = `https://fonts.googleapis.com/css2?family=${formattedDisplayFontName}:wght@400;500;600&display=swap`;
    document.head.appendChild(displayFontStylesheet);
 	
  	displayItem.style.fontFamily = displayFontName;
    displayItem.style.color = "#FFFFFF";
    displayItem.style.webkitTextStrokeWidth = displayStrokeWidth * .25 + "px";
  
    displayUser.style.fontFamily = displayFontName;
    displayUser.style.color = displayNameColor;
}


//=========================
//     ON WIDGET LOAD
//=========================

function start() {
  const obj = window.SE_widgetLoadData;

  ownerName = obj.detail.channel.username;
  isEditorMode = obj.detail.overlay.isEditorMode;
  fieldData = obj.detail.fieldData;
    
  const armOffsetX = fieldData.armOffsetX || 0;
  const armOffsetY = fieldData.armOffsetY || 0;

  craneLeftClaw.style.setProperty("bottom", -225 - armOffsetY + "px");
  craneLeftClaw.style.setProperty("left", -53 - armOffsetX + "px");
  craneRightClaw.style.setProperty("bottom", -225 - armOffsetY + "px");
  craneRightClaw.style.setProperty("right", -53 - armOffsetX + "px");
    
  ({enableSubs, enableGiftedSubs, enableBits, bitMinimum, enableDonos, donoMinimum, channelPointName, chatCommand, multiPlay} = fieldData);

  ({commonChance, uncommonChance, rareChance, epicChance, legendaryChance} = fieldData);
  
  ({enableAudio, initiateSFX, commonSFX, uncommonSFX, rareSFX, epicSFX, legendarySFX, uniqueSFX, uniqueLegendarySFX} = fieldData);
  
  ({displayFontName, displayNameColor, displayStrokeWidth} = fieldData);

  uniqueChance = Math.max(0.01, Math.min(100, fieldData.uniqueChance)) * 100;

  displayPositionX = fieldData.displayPositionX;
  displayPositionY = fieldData.displayPositionY;
  
  displayTime = fieldData.displayTime * 1000;
  displayScale = fieldData.displayScale / 5;

  craneRange = fieldData.craneRange;

  if(fieldData?.jwtToken)
  {
    jwtToken = fieldData.jwtToken;
    postToChat = true;
  }

  channelId = obj.detail.channel.id;
  
  let maxShift = (100 - craneRange) * 0.5;

  craneRangeShift = Math.sign(fieldData.craneRangeShift) * Math.min(Math.abs(fieldData.craneRangeShift), maxShift);
  
  craneRangeDisplay.style.width = craneRange / 100 * 1520 + "px";
  craneRangeDisplay.style.transform = `translateX(${(craneRangeShift / 50 ) * 760}px)`;
  
  if(fieldData.craneLeftClaw)
  {
  craneLeftClaw.src = fieldData.craneLeftClaw;
  }

  if(fieldData.craneRightClaw)
  {
    craneRightClaw.src = fieldData.craneRightClaw;
  }

  if(fieldData.craneBase)
  {
    craneBase.src = fieldData.craneBase;
  }

  if(fieldData.craneDirection == "random")
  {
    randomizeCraneDirection = true;
  }
  else
  {
    randomizeCraneDirection = false;
    craneDirection = fieldData.craneDirection;
  }
    
  initialize();
}

setTimeout(start, 1000);

//=========================
//    ON EVENT RECEIVED
//=========================

window.addEventListener('onEventReceived', function (obj) {

  const { listener, event } = obj.detail;
  if (!event || !listener) return; // Basic validation

  const data = event.data;
  const user = data?.displayName || 'Unknown';

  if (listener === 'event')
  {
    switch (event.type) {
        case 'channelPointsRedemption':
            if (data?.redemption === channelPointName) {
                enterQueue(user);
            }
            break;
        case 'subscriber':
            if (data?.gifted) {
              if (enableGiftedSubs) enterQueue(data.sender);
            } else {
              if (enableSubs) enterQueue(user);
            }
            break;
        case 'sponsor':
            if (data?.gifted) {
              if (enabledGiftedSubs) enterQueue(data.sender);
            } else {
              if (enableSubs) enterQueue(user);
            }
            break;
        case 'communityGiftPurchase':

            break;
        case 'cheer':
            if (enableBits && data?.amount >= bitMinimum) {
              if(multiPlay) {
                const count = Math.floor(data.amount / bitMinimum);
                for (let i = 0; i < count; i++) enterQueue(user);
              }
              else {
                enterQueue(user);
              }
            }
            break;
        case 'superchat':
            if (enableBits && data?.amount >= bitMinimum) {
              if(multiPlay) {
                const count = Math.floor(data.amount / bitMinimum);
                for (let i = 0; i < count; i++) enterQueue(user);
              }
              else {
                enterQueue(user);
              }
            }
            break;
        case 'tip':
            if (enableDonos && data?.amount >= (donoMinimum / 100)) {
              if(multiPlay) {
                  const count = Math.floor(data.amount / (donoMinimum / 100));
                  for (let i = 0; i < count; i++) enterQueue(user);
              }
              else {
                enterQueue(user);
              }
            }
            break;
        default:
            console.log('Unhandled event type:', event.type, event);
            break;
    }
  }

  if (listener === 'message')
  {
    if(data.text === chatCommand)
    {
      enterQueue(data.displayName);
    }
  }
});

//=========================
//       SPARKLES
//=========================

function startSparkles() {
  sparkleInterval = setInterval(() => {
      createSparkles();
  }, getRandom(25, 125) * 10); 
}

function endSparkles() {
  clearInterval(sparkleInterval);
}

function getSparkleFromPool() {
  const sparkle = sparklePool[currentIndex];
  currentIndex = (currentIndex + 1) % maxSparkles;
  return sparkle;
}

function createSparkles() {
  const sparkle = getSparkleFromPool();
  const size = getRandom(50, 75); 

  const offsetX = getRandom(150, 350); 
  const offsetY = getRandom(150, 350);

  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  
  sparkle.style.left = `${offsetX}px`;
  sparkle.style.top = `${offsetY}px`;

  sparkle.style.animation = 'none';
  sparkle.offsetHeight;
  const sparkleLife = getRandom(2, 3);
  sparkle.style.animation = `sparkle ${sparkleLife}s ease-in-out forwards`;
}

//=========================
//  LIGHT RAY COLOR ADJUST
//=========================

function lightenHexColor(hex, percent) {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '');

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate the amount to add to each channel
  const amount = Math.round(255 * (percent / 100));

  // Add the amount, clamping to 255
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  // Convert back to hex and ensure two digits with padding
  const toHex = (c) => ('00' + c.toString(16)).slice(-2);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

//=========================
//          R N G
//=========================

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//=========================
//         Bot Say 
//=========================
async function botSay(message) {
  if (!message || typeof message !== "string") return false;

  var trimmed = message.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 500) trimmed = trimmed.substring(0, 500);

  try {
    var url = "https://api.streamelements.com/kappa/v2/bot/" + channelId + "/say";

    var res = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + jwtToken
      },
      body: JSON.stringify({ message: trimmed })
    });

    if (res.ok) {
      console.log("Bot → " + trimmed.substring(0, 100) + (trimmed.length > 100 ? "..." : ""));
      return true;
    }

    if (res.status === 401) {
      console.error("Invalid/expired JWT - update it in StreamElements → Account → Channels");
    } else if (res.status === 429) {
      console.warn("Rate limited by StreamElements");
    } else {
      console.error("Bot say failed (" + res.status + ")");
    }

    return false;

  } catch (err) {
    console.error("Network error:", err);
    return false;
  }
}

// ======================
// SE MOCK (unchanged)
// ======================
const SE_API = {
  _store: {},
  store: {
    set(key, value) {
      SE_API._store[key] = JSON.parse(JSON.stringify(value));
    },
    async get(key) {
      return SE_API._store[key]
        ? JSON.parse(JSON.stringify(SE_API._store[key]))
        : null;
    }
  }
};

window.SE_widgetLoadData = {
  detail: {
    channel: { username: "Claw Player", id: "demo123" },
    overlay: { isEditorMode: false },
    fieldData: {
      craneLeftClaw: "assets/clawArmL.png",
      craneRightClaw: "assets/clawArmR.png",
      craneBase: "assets/clawBase.png",
      craneDirection: "random",

      displayScale: 4,
      displayTime: 6,

      uniqueChance: 8,
      commonChance: 55,
      uncommonChance: 25,
      rareChance: 12,
      epicChance: 6,
      legendaryChance: 2,

      enableSubs: true,
      enableGiftedSubs: true,
      enableBits: true,
      bitMinimum: 50,
      enableDonos: true,
      donoMinimum: 500
    }
  }
};

// ======================
// CONTROL STATE (LIVE OVERRIDES)
// ======================
const controlState = {
  displayPosition: "center",
  displayScale: "medium",
  craneDirection: "random",
  craneRange: "medium"
};

// ======================
// INIT WIDGET DATA
// ======================

// ======================
// START
// ======================
window.addEventListener("load", () => {
  createControlPanel();
});

// ======================
// CONTROL PANEL
// ======================
function createControlPanel() {
  const panel = document.createElement("div");
  panel.id = "control-panel";

  panel.innerHTML = `
    <h3>🎮 Demo Controls</h3>

    <label>
      Display Position
      <select id="c-pos">
        <option value="left">Left</option>
        <option value="center" selected>Center</option>
        <option value="right">Right</option>
      </select>
    </label>

    <label>
      Display Scale
      <select id="c-scale">
        <option value="small">Small</option>
        <option value="medium" selected>Medium</option>
        <option value="large">Large</option>
      </select>
    </label>

    <label>
      Crane Direction
      <select id="c-dir">
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="random" selected>Random</option>
      </select>
    </label>

    <label>
      Crane Range
      <select id="c-range">
        <option value="small">Small</option>
        <option value="medium" selected>Medium</option>
        <option value="large">Large</option>
      </select>
    </label>

    <div class="panel-buttons">
      <button onclick="demoSubscribe()">⭐ Sub</button>
      <button onclick="demoCheer()">💎 Cheer</button>
      <button onclick="demoDonate()">💵 Tip</button>
    </div>
  `;

  document.body.appendChild(panel);
  bindLiveControls(); 
}

function bindLiveControls() {
  const controls = [
    "c-pos",
    "c-scale",
    "c-dir",
    "c-range"
  ];

  controls.forEach(id => {
    document.getElementById(id).addEventListener("change", applyControls);
  });
}

// ======================
// APPLY CONTROLS (LIVE)
// ======================
function applyControls() {
  const pos = document.getElementById("c-pos").value;
  const scale = document.getElementById("c-scale").value;
  const dir = document.getElementById("c-dir").value;
  const range = document.getElementById("c-range").value;

  controlState.displayPosition = pos;
  controlState.displayScale = scale;
  controlState.craneDirection = dir;
  controlState.craneRange = range;

  // ----------------------
  // DISPLAY POSITION
  // ----------------------
  displayPositionX =
    pos === "left" ? 10 :
    pos === "center" ? 50 : 90;

  updateDisplayPosition();
  flash(displayContainer);

  // ----------------------
  // DISPLAY SCALE
  // ----------------------
  displayScale =
    scale === "small" ? 0.7 :
    scale === "medium" ? 1 :
    1.4;

  displayContainer.style.transform = `scale(${displayScale})`;
  flash(displayContainer);

  // ----------------------
  // CRANE DIRECTION
  // ----------------------
  craneDirection = dir;
  randomizeCraneDirection = dir === "random";
  flash(craneContainerPos);

  // ----------------------
  // CRANE RANGE
  // ----------------------
  craneRange =
    range === "small" ? 25 :
    range === "medium" ? 50 :
    80;

  craneRangeDisplay.style.width = `${(craneRange / 100) * 1520}px`;
  flash(craneRangeDisplay);
}

// ======================
// DISPLAY POSITION UPDATE
// ======================
function updateDisplayPosition() {
  const scaledWidth = 500 * displayScale;
  const scaledHeight = 500 * displayScale;

  const newPosX =
    (displayPositionX / 100) * (1920 - scaledWidth);

  const newPosY =
    (displayPositionY / 100) * (1080 - scaledHeight);

  displayContainer.style.left = `${newPosX}px`;
  displayContainer.style.bottom = `${newPosY}px`;
}

// ======================
// VISUAL FEEDBACK
// ======================
function flash(el) {
  if (!el) return;

  el.style.outline = "3px solid #00ff88";

  setTimeout(() => {
    el.style.outline = "0px solid transparent";
  }, 2000);
}

// ======================
// DEMO EVENTS
// ======================
function demoSubscribe() {
  window.dispatchEvent(
    new CustomEvent("onEventReceived", {
      detail: {
        listener: "event",
        event: {
          type: "subscriber",
          data: {
            displayName: "Claw Player",
            gifted: false
          }
        }
      }
    })
  );
}

function demoCheer() {
  window.dispatchEvent(
    new CustomEvent("onEventReceived", {
      detail: {
        listener: "event",
        event: {
          type: "cheer",
          data: {
            displayName: "Claw Player",
            amount: 100
          }
        }
      }
    })
  );
}

function demoDonate() {
  window.dispatchEvent(
    new CustomEvent("onEventReceived", {
      detail: {
        listener: "event",
        event: {
          type: "tip",
          data: {
            displayName: "Claw Player",
            amount: 10
          }
        }
      }
    })
  );
}

// ======================
// STYLES
// ======================
const style = document.createElement("style");
style.textContent = `
  #control-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(20,20,30,0.95);
    border: 2px solid #00ff88;
    border-radius: 12px;
    padding: 12px;
    z-index: 9999;
    color: white;
    font-family: Arial;
    width: 220px;
  }

  #control-panel h3 {
    margin: 0 0 10px;
    color: #00ff88;
    font-size: 14px;
  }

  #control-panel label {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    margin-bottom: 8px;
  }

  #control-panel select {
    margin-top: 4px;
    padding: 4px;
  }

  #apply {
    width: 100%;
    margin-top: 6px;
    padding: 6px;
    background: #00ff88;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }

  .panel-buttons {
    display: flex;
    gap: 6px;
    margin-top: 10px;
  }

  .panel-buttons button {
    flex: 1;
    font-size: 10px;
    padding: 6px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

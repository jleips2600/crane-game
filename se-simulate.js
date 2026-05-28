const SE_API = {
  _store: {},
  store: {
    set(key, value) { SE_API._store[key] = JSON.parse(JSON.stringify(value)); },
    async get(key) { return SE_API._store[key] ? JSON.parse(JSON.stringify(SE_API._store[key])) : null; }
  }
};


window.SE_widgetLoadData = {
    detail: {
    channel: { username: "Crane Player", id: "demo123" },
    overlay: { isEditorMode: false },
    fieldData: {
      craneLeftClaw: "assets/clawArmL.png",
      craneRightClaw: "assets/clawArmR.png",
      craneBase: "assets/clawBase.png",
      craneDirection: "random",
      displayScale: 4,
      displayTime: 6,
      uniqueChance: 8,
      commonChance: 55, uncommonChance: 25, rareChance: 12,
      epicChance: 6, legendaryChance: 2,
      enableSubs: true, enableGiftedSubs: true,
      enableBits: true, bitMinimum: 50,
      enableDonos: true, donoMinimum: 500
    }
  }
};

function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'control-panel';
  panel.innerHTML = `
    <div class="panel-header">
      <h3>🎮 Demo Controls</h3>
    </div>
    <div class="panel-buttons">
      <button onclick="demoSubscribe()" class="demo-btn sub-btn">
        <span>⭐</span> Subscribe
      </button>
      <button onclick="demoCheer()" class="demo-btn cheer-btn">
        <span>💎</span> Cheer (Bits)
      </button>
      <button onclick="demoDonate()" class="demo-btn donate-btn">
        <span>💵</span> Donate
      </button>
    </div>
  `;

  document.body.appendChild(panel);
}

// ====================== DEMO FUNCTIONS ======================
window.demoSubscribe = () => {
    window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: {
      listener: 'subscriber-latest',
      event: {
        name,
        amount,
        tier,
        gifted: false,
        bulkGifted: false,
        isCommunityGift: false,
        sender: "Crane Player"
      }
    }
  }));
};

window.demoCheer = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'cheer-latest', event: { "Crane Player", 300, "" } }
  }));
};

window.demoDonate = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
      detail: { listener: 'tip-latest', event: { "Crane Player", 300, "" } }
    }));
}

// ====================== STYLES FOR CONTROL PANEL ======================
const panelStyle = document.createElement('style');
panelStyle.textContent = `
  #control-panel {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 15, 25, 0.95);
    backdrop-filter: blur(10px);
    border: 2px solid #00ff88;
    border-radius: 16px;
    padding: 12px 20px;
    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
    z-index: 9999;
    user-select: none;
  }

  .panel-header {
    text-align: center;
    margin-bottom: 12px;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 18px;
    color: #00ff88;
  }

  .panel-buttons {
    display: flex;
    gap: 12px;
  }

  .demo-btn {
    padding: 14px 24px;
    font-family: 'Luckiest Guy', sans-serif;
    font-size: 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
  }

  .demo-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }

  .sub-btn {
    background: linear-gradient(135deg, #ff00aa, #aa00ff);
  }

  .cheer-btn {
    background: linear-gradient(135deg, #00aaff, #0088ff);
  }

  .donate-btn {
    background: linear-gradient(135deg, #00cc66, #00aa44);
  }
`;

document.head.appendChild(panelStyle);

// Auto create panel when widget loads
window.addEventListener('load', () => {
  createControlPanel();
});

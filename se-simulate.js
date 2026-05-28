const SE_API = {
  _store: {},
  store: {
    set(key, value) { SE_API._store[key] = JSON.parse(JSON.stringify(value)); },
    async get(key) { return SE_API._store[key] ? JSON.parse(JSON.stringify(SE_API._store[key])) : null; }
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

createControlPanel();

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

// Demo Functions
window.demoSub = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'subscriber-latest', event: { name: "TestSub", amount: 1 } }
  }));
};

window.demoGiftedSub = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'subscriber-latest', event: { name: "LuckyUser", gifted: true, sender: "Gifter" } }
  }));
};

window.demoBits = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'cheer-latest', event: { name: "BitKing", amount: 100 } }
  }));
};

window.demoBitsMulti = () => {
  for (let i = 0; i < 5; i++) window.demoBits();
};

window.demoDonation = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'tip-latest', event: { name: "BigDonor", amount: 5.00 } }
  }));
};

window.demoChannelPoints = () => {
  window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: { listener: 'event', event: { type: 'channelPointsRedemption', data: { redemption: "Crane Pull", displayName: "PointRedeemer" } } }
  }));
};

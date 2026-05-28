const SE_API = {
  _store: {},
  store: {
    set(key, value) { SE_API._store[key] = JSON.parse(JSON.stringify(value)); },
    async get(key) { return SE_API._store[key] ? JSON.parse(JSON.stringify(SE_API._store[key])) : null; }
  }
};

const SESimulate = {
  widgetLoad() {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('onWidgetLoad', {
        detail: {
          channel: { username: "SezDemo", id: "demo123" },
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
      }));
    }, 200);
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

window.demoRandom = () => window.demoSub();
window.clearQueueDemo = () => { queue = []; isBusy = false; alert("Queue cleared!"); };

SESimulate.widgetLoad();

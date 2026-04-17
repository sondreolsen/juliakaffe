const AVATAR_API_BASE = "https://api.dicebear.com/9.x/toon-head/svg";

const AVATAR_OPTIONS = {
  skin: {
    soft: "f1c3a5",
    warm: "c68e7a",
    tan: "b98e6a",
    deep: "a36b4f"
  },
  hairColor: {
    midnight: "2c1b18",
    chestnut: "724133",
    amber: "a55728",
    golden: "d6b370"
  },
  clothesColor: {
    berry: "8f3534",
    rose: "d4706b",
    forest: "56785b",
    espresso: "6f4630"
  }
};

const AVATAR_DEFAULT_STATE = {
  name: "Barista Nova",
  seed: "barista-base",
  skin: "warm",
  hairStyle: "bun",
  rearHair: "longStraight",
  hairColor: "chestnut",
  eyes: "wide",
  eyebrows: "neutral",
  mouth: "smile",
  clothes: "turtleNeck",
  clothesColor: "rose",
  background: "sunrise"
};

const DRINK_DEFAULT_STATE = {
  drink: "latte",
  size: "medium",
  serve: "hot",
  milk: "whole",
  syrup: "none",
  topping: "none"
};

const STORAGE_KEYS = {
  avatar: "julia-cafe-avatar-v1",
  drink: "julia-cafe-drink-v1",
  order: "julia-cafe-order-v1",
  progress: "julia-cafe-progress-v1"
};

const DRINK_VISUALS = {
  latte: { label: "Latte", liquid: "#ad7850", foam: "#f4e3d2", accent: "#cb8a58" },
  cappuccino: { label: "Cappuccino", liquid: "#92613f", foam: "#f1deca", accent: "#b87446" },
  mocha: { label: "Mocha", liquid: "#704333", foam: "#e8cfbe", accent: "#9b5a40" },
  matcha: { label: "Matcha", liquid: "#8da86b", foam: "#dce8c3", accent: "#6d8a4d" },
  hotChocolate: { label: "Kakao", liquid: "#5c3125", foam: "#eed7c6", accent: "#8a4a34" },
  smoothie: { label: "Smoothie", liquid: "#d97f7a", foam: "#ffd6d2", accent: "#ea9d70" }
};

const DRINK_LABELS = {
  drink: {
    latte: "Latte",
    cappuccino: "Cappuccino",
    mocha: "Mocha",
    matcha: "Matcha",
    hotChocolate: "Kakao",
    smoothie: "Smoothie"
  },
  size: {
    small: "Liten",
    medium: "Medium",
    large: "Stor"
  },
  serve: {
    hot: "Varm",
    iced: "Iskald",
    frozen: "Frozen"
  },
  milk: {
    whole: "Helmelk",
    oat: "Havremelk",
    almond: "Mandelmelk",
    none: "Ingen melk"
  },
  syrup: {
    none: "Ingen smak",
    vanilla: "Vanilje",
    caramel: "Karamell",
    hazelnut: "Hasselnott",
    chocolate: "Sjokolade"
  },
  topping: {
    none: "Ingen topping",
    cinnamon: "Kanel",
    foam: "Ekstra skum",
    cream: "Krem",
    sprinkles: "Strossel"
  }
};

const ORDER_TEMPLATES = [
  {
    intro: "Kan jeg f\u00e5 en myk kaffedrikk som smaker litt karamell?",
    order: {
      drink: "latte",
      size: "large",
      serve: "hot",
      milk: "oat",
      syrup: "caramel",
      topping: "foam"
    }
  },
  {
    intro: "Jeg vil ha noe iskaldt og litt ekstra luksus i dag.",
    order: {
      drink: "mocha",
      size: "medium",
      serve: "iced",
      milk: "whole",
      syrup: "chocolate",
      topping: "cream"
    }
  },
  {
    intro: "Lag noe gront, rolig og varmt til meg.",
    order: {
      drink: "matcha",
      size: "medium",
      serve: "hot",
      milk: "oat",
      syrup: "vanilla",
      topping: "foam"
    }
  },
  {
    intro: "Jeg vil ha kakao med litt ekstra kos pa toppen.",
    order: {
      drink: "hotChocolate",
      size: "small",
      serve: "hot",
      milk: "whole",
      syrup: "none",
      topping: "cream"
    }
  },
  {
    intro: "Har du noe friskt og kaldt uten kaffe?",
    order: {
      drink: "smoothie",
      size: "large",
      serve: "frozen",
      milk: "none",
      syrup: "vanilla",
      topping: "sprinkles"
    }
  },
  {
    intro: "Jeg trenger en klassisk cappuccino for a komme i gang.",
    order: {
      drink: "cappuccino",
      size: "medium",
      serve: "hot",
      milk: "almond",
      syrup: "hazelnut",
      topping: "cinnamon"
    }
  }
];

const CUSTOMER_NAMES = [
  "Mina",
  "Theo",
  "Amina",
  "Lea",
  "Jonas",
  "Sofie",
  "Iben",
  "Noah",
  "Selma",
  "Elias"
];

const avatarState = loadJson(STORAGE_KEYS.avatar, AVATAR_DEFAULT_STATE, normalizeAvatarState);
const drinkState = loadJson(STORAGE_KEYS.drink, DRINK_DEFAULT_STATE, normalizeDrinkState);
let currentOrder = loadJson(STORAGE_KEYS.order, null, normalizeOrder);
let progress = loadJson(STORAGE_KEYS.progress, { served: 0, started: false }, normalizeProgress);

if (!currentOrder) {
  currentOrder = createOrder();
  persistJson(STORAGE_KEYS.order, currentOrder);
}

const avatarPreview = document.getElementById("avatar-preview");
const avatarImage = document.getElementById("avatar-image");
const avatarNameInput = document.getElementById("avatar-name");
const avatarNameplate = document.getElementById("avatar-nameplate");
const avatarScore = document.getElementById("avatar-score");
const avatarMessage = document.getElementById("avatar-message");
const serviceAvatarImage = document.getElementById("service-avatar-image");
const serviceAvatarName = document.getElementById("service-avatar-name");

const serviceSection = document.getElementById("drikkestasjon");
const matchScore = document.getElementById("match-score");
const customerName = document.getElementById("customer-name");
const customerIntro = document.getElementById("customer-intro");
const orderList = document.getElementById("order-list");
const servedCount = document.getElementById("served-count");
const serviceResult = document.getElementById("service-result");
const serviceMessage = document.getElementById("service-message");

const drinkPreview = document.getElementById("drink-preview");
const cupLiquid = document.getElementById("cup-liquid");
const cupFoam = document.getElementById("cup-foam");
const cupLabel = document.getElementById("cup-label");
const drinkSummary = document.getElementById("drink-summary");
const drinkScore = document.getElementById("drink-score");
const cupTopping = document.getElementById("cup-topping");

document.querySelectorAll("[data-avatar-setting]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]");
    if (!button) {
      return;
    }

    avatarState[group.dataset.avatarSetting] = button.dataset.value;
    syncButtons(group, button);
    renderAvatar();
  });
});

document.querySelectorAll("[data-drink-setting]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]");
    if (!button) {
      return;
    }

    drinkState[group.dataset.drinkSetting] = button.dataset.value;
    syncButtons(group, button);
    renderDrink();
  });
});

avatarNameInput.addEventListener("input", () => {
  avatarState.name = avatarNameInput.value.trim() || AVATAR_DEFAULT_STATE.name;
  renderAvatar();
});

document.getElementById("randomize-avatar-button").addEventListener("click", () => {
  avatarState.seed = createSeed("avatar");
  avatarState.skin = randomKey(AVATAR_OPTIONS.skin);
  avatarState.hairStyle = randomFrom(["bun", "sideComed", "spiky", "undercut"]);
  avatarState.rearHair = randomFrom(["longStraight", "longWavy", "shoulderHigh", "neckHigh"]);
  avatarState.hairColor = randomKey(AVATAR_OPTIONS.hairColor);
  avatarState.eyes = randomFrom(["wide", "happy", "humble", "wink"]);
  avatarState.eyebrows = randomFrom(["happy", "neutral", "raised", "sad"]);
  avatarState.mouth = randomFrom(["smile", "laugh", "agape", "sad"]);
  avatarState.clothes = randomFrom(["dress", "openJacket", "tShirt", "turtleNeck"]);
  avatarState.clothesColor = randomKey(AVATAR_OPTIONS.clothesColor);
  avatarState.background = randomFrom(["sunrise", "latte", "berry", "mint"]);
  renderAvatarControls();
  renderAvatar();
  avatarMessage.textContent = "Ny avatar klar for kafebaren.";
});

document.getElementById("download-avatar-button").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Lager bilde...";

  try {
    await downloadAvatarImage();
    avatarMessage.textContent = "Avatarbilde lastet ned.";
  } catch {
    avatarMessage.textContent = "Kunne ikke laste ned avataren akkurat na.";
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
});

document.getElementById("start-service-button").addEventListener("click", () => {
  progress.started = true;
  persistJson(STORAGE_KEYS.progress, progress);
  unlockService();
  avatarMessage.textContent = "Baristaen er klar. Drikkestasjonen er apnet.";
  serviceSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("randomize-drink-button").addEventListener("click", () => {
  drinkState.drink = randomFrom(Object.keys(DRINK_VISUALS));
  drinkState.size = randomFrom(["small", "medium", "large"]);
  drinkState.serve = randomFrom(["hot", "iced", "frozen"]);
  drinkState.milk = randomFrom(["whole", "oat", "almond", "none"]);
  drinkState.syrup = randomFrom(["none", "vanilla", "caramel", "hazelnut", "chocolate"]);
  drinkState.topping = randomFrom(["none", "cinnamon", "foam", "cream", "sprinkles"]);
  renderDrinkControls();
  renderDrink();
  serviceMessage.textContent = "Tilfeldig drikke satt opp. Klar for a teste mot kunden.";
});

document.getElementById("new-customer-button").addEventListener("click", () => {
  currentOrder = createOrder();
  persistJson(STORAGE_KEYS.order, currentOrder);
  renderOrder();
  matchScore.textContent = "0";
  serviceResult.textContent = "Ny kunde pa plass";
  serviceMessage.textContent = "Les bestillingen og bygg drikken pa nytt.";
});

document.getElementById("serve-button").addEventListener("click", () => {
  if (!progress.started) {
    serviceMessage.textContent = "Trykk start i avatarstudioet for a apne drikkestasjonen.";
    serviceSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const result = evaluateDrink(drinkState, currentOrder.order);
  matchScore.textContent = String(result.percent);

  if (result.percent === 100) {
    progress.served += 1;
    persistJson(STORAGE_KEYS.progress, progress);
    servedCount.textContent = String(progress.served);
    serviceResult.textContent = "Perfekt bestilling";
    serviceMessage.textContent = `${currentOrder.name} fikk akkurat det som ble bestilt.`;
    currentOrder = createOrder();
    persistJson(STORAGE_KEYS.order, currentOrder);
    renderOrder();
    matchScore.textContent = "0";
    return;
  }

  serviceResult.textContent = result.percent >= 67 ? "Nesten riktig" : "Trenger mer jobbing";
  serviceMessage.textContent = result.message;
});

renderAvatarControls();
renderDrinkControls();
renderAvatar();
renderDrink();
renderOrder();
servedCount.textContent = String(progress.served);
serviceResult.textContent = progress.started ? "Klar for neste kunde" : "Venter pa start";

if (progress.started) {
  unlockService();
}

function renderAvatar() {
  avatarPreview.dataset.bg = avatarState.background;
  avatarNameInput.value = avatarState.name;
  avatarNameplate.textContent = avatarState.name;
  avatarImage.src = buildAvatarUrl(512);
  serviceAvatarImage.src = buildAvatarUrl(256);
  serviceAvatarName.textContent = avatarState.name;
  avatarScore.textContent = String(calculateAvatarScore());
  persistJson(STORAGE_KEYS.avatar, avatarState);
}

function renderAvatarControls() {
  document.querySelectorAll("[data-avatar-setting]").forEach((group) => {
    const setting = group.dataset.avatarSetting;
    const selected = avatarState[setting];
    group.querySelectorAll("button[data-value]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.value === selected);
    });
  });
}

function renderDrink() {
  const visual = DRINK_VISUALS[drinkState.drink];
  drinkPreview.dataset.serve = drinkState.serve;
  drinkPreview.dataset.topping = drinkState.topping;
  drinkPreview.style.setProperty("--drink-liquid", visual.liquid);
  drinkPreview.style.setProperty("--drink-foam", visual.foam);
  drinkPreview.style.setProperty("--drink-accent", visual.accent);
  cupLiquid.style.background = `linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 14%), linear-gradient(180deg, ${mixColor(visual.liquid, "#ffffff", 0.1)} 0%, ${visual.liquid} 100%)`;
  cupFoam.style.background = `radial-gradient(circle at 20% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 18%), radial-gradient(circle at 48% 35%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0) 22%), linear-gradient(180deg, ${visual.foam} 0%, rgba(255,255,255,0.92) 100%)`;
  cupLabel.textContent = visual.label;
  cupTopping.setAttribute("aria-label", DRINK_LABELS.topping[drinkState.topping]);
  drinkSummary.textContent = `${DRINK_LABELS.size[drinkState.size]} ${visual.label}, ${DRINK_LABELS.serve[drinkState.serve].toLowerCase()}, ${DRINK_LABELS.milk[drinkState.milk].toLowerCase()}, ${DRINK_LABELS.syrup[drinkState.syrup].toLowerCase()}.`;
  drinkScore.textContent = String(calculateDrinkScore());
  persistJson(STORAGE_KEYS.drink, drinkState);
}

function renderDrinkControls() {
  document.querySelectorAll("[data-drink-setting]").forEach((group) => {
    const setting = group.dataset.drinkSetting;
    const selected = drinkState[setting];
    group.querySelectorAll("button[data-value]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.value === selected);
    });
  });
}

function renderOrder() {
  customerName.textContent = currentOrder.name;
  customerIntro.textContent = currentOrder.intro;
  orderList.innerHTML = "";

  [
    ["Drikke", DRINK_LABELS.drink[currentOrder.order.drink]],
    ["Storrelse", DRINK_LABELS.size[currentOrder.order.size]],
    ["Servering", DRINK_LABELS.serve[currentOrder.order.serve]],
    ["Melk", DRINK_LABELS.milk[currentOrder.order.milk]],
    ["Smak", DRINK_LABELS.syrup[currentOrder.order.syrup]],
    ["Topping", DRINK_LABELS.topping[currentOrder.order.topping]]
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "order-item";
    item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    orderList.appendChild(item);
  });
}

function unlockService() {
  serviceSection.classList.remove("is-locked");
}

function buildAvatarUrl(size) {
  const params = new URLSearchParams({
    seed: avatarState.seed,
    size: String(size),
    radius: "0",
    clip: "false",
    randomizeIds: "true",
    beardProbability: "0",
    hairProbability: "100",
    rearHairProbability: "100",
    backgroundColor: "transparent",
    body: "body",
    head: "head",
    hair: avatarState.hairStyle,
    rearHair: avatarState.rearHair,
    hairColor: AVATAR_OPTIONS.hairColor[avatarState.hairColor],
    skinColor: AVATAR_OPTIONS.skin[avatarState.skin],
    eyes: avatarState.eyes,
    eyebrows: avatarState.eyebrows,
    mouth: avatarState.mouth,
    clothes: avatarState.clothes,
    clothesColor: AVATAR_OPTIONS.clothesColor[avatarState.clothesColor]
  });

  return `${AVATAR_API_BASE}?${params.toString()}`;
}

function calculateAvatarScore() {
  let total = 76;

  if (avatarState.hairStyle === "bun" || avatarState.hairStyle === "sideComed") {
    total += 4;
  }
  if (avatarState.rearHair === "longStraight" || avatarState.rearHair === "shoulderHigh") {
    total += 3;
  }
  if (avatarState.clothes === "turtleNeck" || avatarState.clothes === "openJacket") {
    total += 5;
  }
  if (avatarState.background === "sunrise" || avatarState.background === "latte") {
    total += 5;
  }
  if (avatarState.mouth === "smile" || avatarState.eyes === "happy") {
    total += 4;
  }
  if (avatarState.clothesColor === "rose" || avatarState.clothesColor === "espresso") {
    total += 3;
  }

  return total;
}

function calculateDrinkScore() {
  let total = 80;

  if (drinkState.drink === "latte" || drinkState.drink === "cappuccino") {
    total += 4;
  }
  if (drinkState.serve === "hot") {
    total += 3;
  }
  if (drinkState.milk === "oat" || drinkState.milk === "whole") {
    total += 3;
  }
  if (drinkState.syrup !== "none") {
    total += 4;
  }
  if (drinkState.topping !== "none") {
    total += 4;
  }

  return total;
}

function evaluateDrink(selected, target) {
  const fields = ["drink", "size", "serve", "milk", "syrup", "topping"];
  const matched = fields.filter((field) => selected[field] === target[field]);
  const percent = Math.round((matched.length / fields.length) * 100);
  const missing = fields.filter((field) => selected[field] !== target[field]);

  if (percent === 100) {
    return { percent, message: "Perfekt!" };
  }

  const hints = missing
    .slice(0, 3)
    .map((field) => {
      return `${fieldToLabel(field)} burde v\u00e6re ${labelFor(field, target[field]).toLowerCase()}`;
    })
    .join(". ");

  return {
    percent,
    message: hints ? `${hints}.` : "Pr\u00f8v igjen med noen justeringer."
  };
}

function createOrder() {
  const template = randomFrom(ORDER_TEMPLATES);
  return {
    name: randomFrom(CUSTOMER_NAMES),
    intro: template.intro,
    order: { ...template.order }
  };
}

function normalizeAvatarState(value) {
  const next = { ...AVATAR_DEFAULT_STATE, ...(value || {}) };

  if (!AVATAR_OPTIONS.skin[next.skin]) {
    next.skin = AVATAR_DEFAULT_STATE.skin;
  }
  if (!AVATAR_OPTIONS.hairColor[next.hairColor]) {
    next.hairColor = AVATAR_DEFAULT_STATE.hairColor;
  }
  if (!AVATAR_OPTIONS.clothesColor[next.clothesColor]) {
    next.clothesColor = AVATAR_DEFAULT_STATE.clothesColor;
  }
  if (!["bun", "sideComed", "spiky", "undercut"].includes(next.hairStyle)) {
    next.hairStyle = AVATAR_DEFAULT_STATE.hairStyle;
  }
  if (!["longStraight", "longWavy", "shoulderHigh", "neckHigh"].includes(next.rearHair)) {
    next.rearHair = AVATAR_DEFAULT_STATE.rearHair;
  }
  if (!["wide", "happy", "humble", "wink"].includes(next.eyes)) {
    next.eyes = AVATAR_DEFAULT_STATE.eyes;
  }
  if (!["happy", "neutral", "raised", "sad"].includes(next.eyebrows)) {
    next.eyebrows = AVATAR_DEFAULT_STATE.eyebrows;
  }
  if (!["smile", "laugh", "agape", "sad"].includes(next.mouth)) {
    next.mouth = AVATAR_DEFAULT_STATE.mouth;
  }
  if (!["dress", "openJacket", "tShirt", "turtleNeck"].includes(next.clothes)) {
    next.clothes = AVATAR_DEFAULT_STATE.clothes;
  }
  if (!["sunrise", "latte", "berry", "mint"].includes(next.background)) {
    next.background = AVATAR_DEFAULT_STATE.background;
  }

  next.name = typeof next.name === "string" && next.name.trim() ? next.name.trim() : AVATAR_DEFAULT_STATE.name;
  next.seed = typeof next.seed === "string" && next.seed.trim() ? next.seed.trim() : AVATAR_DEFAULT_STATE.seed;
  return next;
}

function normalizeDrinkState(value) {
  const next = { ...DRINK_DEFAULT_STATE, ...(value || {}) };
  const fields = {
    drink: Object.keys(DRINK_VISUALS),
    size: ["small", "medium", "large"],
    serve: ["hot", "iced", "frozen"],
    milk: ["whole", "oat", "almond", "none"],
    syrup: ["none", "vanilla", "caramel", "hazelnut", "chocolate"],
    topping: ["none", "cinnamon", "foam", "cream", "sprinkles"]
  };

  Object.entries(fields).forEach(([field, values]) => {
    if (!values.includes(next[field])) {
      next[field] = DRINK_DEFAULT_STATE[field];
    }
  });

  return next;
}

function normalizeOrder(value) {
  if (!value || typeof value !== "object" || !value.order) {
    return null;
  }

  return {
    name: typeof value.name === "string" && value.name.trim() ? value.name.trim() : randomFrom(CUSTOMER_NAMES),
    intro: typeof value.intro === "string" && value.intro.trim() ? value.intro.trim() : "Kan du lage noe godt til meg?",
    order: normalizeDrinkState(value.order)
  };
}

function normalizeProgress(value) {
  const next = value && typeof value === "object" ? value : {};
  return {
    served: Number.isFinite(next.served) && next.served >= 0 ? Math.floor(next.served) : 0,
    started: Boolean(next.started)
  };
}

function syncButtons(group, activeButton) {
  group.querySelectorAll("button[data-value]").forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

function randomFrom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function randomKey(object) {
  return randomFrom(Object.keys(object));
}

function createSeed(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function fieldToLabel(field) {
  const labels = {
    drink: "Drikke",
    size: "Storrelse",
    serve: "Servering",
    milk: "Melk",
    syrup: "Smak",
    topping: "Topping"
  };

  return labels[field] || field;
}

function labelFor(field, value) {
  return DRINK_LABELS[field][value];
}

function loadJson(key, fallback, normalizer) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return normalizer ? normalizer(fallback) : fallback;
    }

    const parsed = JSON.parse(raw);
    return normalizer ? normalizer(parsed) : parsed;
  } catch {
    return normalizer ? normalizer(fallback) : fallback;
  }
}

function persistJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mixColor(base, mixWith, ratio) {
  const rgbA = hexToRgb(base);
  const rgbB = hexToRgb(mixWith);

  const mixed = {
    r: Math.round(rgbA.r * (1 - ratio) + rgbB.r * ratio),
    g: Math.round(rgbA.g * (1 - ratio) + rgbB.g * ratio),
    b: Math.round(rgbA.b * (1 - ratio) + rgbB.b * ratio)
  };

  return `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((part) => part + part).join("")
    : clean;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

async function downloadAvatarImage() {
  const safeName = (avatarState.name || "barista-avatar").trim().replace(/[^\w\-]+/g, "-").toLowerCase();
  const response = await fetch(buildAvatarUrl(1024));
  if (!response.ok) {
    throw new Error("Avatar request failed");
  }

  const svgText = await response.text();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 1180;
    const context = canvas.getContext("2d");

    drawPosterBackground(context, canvas.width, canvas.height, avatarState.background);
    drawContainImage(context, image, 100, 80, canvas.width - 200, canvas.height - 260);
    drawNameplate(context, canvas.width, canvas.height, avatarState.name);

    triggerDownload(canvas.toDataURL("image/png"), `${safeName || "barista-avatar"}.png`);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function drawPosterBackground(context, width, height, background) {
  const palettes = {
    sunrise: ["#fff1e3", "#f6c7aa"],
    latte: ["#f2dfc8", "#d8b28c"],
    berry: ["#f2c7d0", "#cd8793"],
    mint: ["#dff0dd", "#b8d2b7"]
  };

  const selected = palettes[background] || palettes.sunrise;
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, selected[0]);
  gradient.addColorStop(1, selected[1]);
  context.fillStyle = gradient;
  roundRect(context, 0, 0, width, height, 44);
  context.fill();

  drawGlow(context, width * 0.22, height * 0.16, width * 0.16, "rgba(255,255,255,0.82)");
  drawGlow(context, width * 0.8, height * 0.14, width * 0.12, "rgba(255,255,255,0.34)");
}

function drawGlow(context, x, y, radius, color) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawContainImage(context, image, x, y, width, height) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawNameplate(context, width, height, label) {
  const text = label || AVATAR_DEFAULT_STATE.name;
  context.font = "700 36px Manrope, Arial, sans-serif";
  const textWidth = context.measureText(text).width;
  const plateWidth = Math.max(220, textWidth + 82);
  const x = (width - plateWidth) / 2;
  const y = height - 124;

  context.fillStyle = "rgba(53,32,22,0.78)";
  roundRect(context, x, y, plateWidth, 76, 38);
  context.fill();

  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, y + 40);
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function triggerDownload(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

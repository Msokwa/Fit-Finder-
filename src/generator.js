// src/generator.js
import { els } from "./els.js";
import { getT } from "./i18n.js";
import { getCurrentChat, saveToStorage } from "./store.js";
import { setPalette, setWardrobeIcons, captureCurrentUIIntoChat } from "./uiState.js";

function normalize(s){ return (s || "").toString().trim().toLowerCase(); }
function pickFrom(list){ return list[Math.floor(Math.random()*list.length)]; }

function moodPalette(mood){
  const m = normalize(mood);
  const palettes = {
    calm: ["#E8E3D5","#A8C7C7","#6B8BA4","#2F3E46"],
    cozy: ["#EFE6D1","#C7A27C","#8B5E3C","#2D2A26"],
    bold: ["#F7E3B2","#E63946","#1D3557","#2A9D8F"],
    confident: ["#F5F3F0","#0B1320","#C9A227","#2D6A4F"],
    romantic: ["#FFE5EC","#FFB3C6","#B5179E","#590D22"],
    sporty: ["#F1FAEE","#457B9D","#1D3557","#E63946"],
    edgy: ["#F2F2F2","#111111","#6D6D6D","#B00020"],
    default: ["#E6D6B8","#C73A34","#C18B45","#6ED2D0"]
  };

  for (const key of Object.keys(palettes)){
    if (key !== "default" && m.includes(key)) return palettes[key];
  }
  return palettes.default;
}

function occasionStyle(occasion){
  const o = normalize(occasion);
  if (o.includes("wedding") || o.includes("formal") || o.includes("ceremony")) return "formal";
  if (o.includes("office") || o.includes("work") || o.includes("meeting")) return "smart";
  if (o.includes("date")) return "date";
  if (o.includes("gym") || o.includes("training") || o.includes("sport")) return "sport";
  if (o.includes("party") || o.includes("club")) return "party";
  return "casual";
}

function weatherHints(weather){
  const w = normalize(weather);
  return {
    rainy: w.includes("rain") || w.includes("storm") || w.includes("wet"),
    windy: w.includes("wind"),
    snowy: w.includes("snow"),
    sunny: w.includes("sun") || w.includes("clear"),
    cloudy: w.includes("cloud") || w.includes("overcast"),
  };
}

function tempBand(temp){
  if (temp === null || Number.isNaN(temp)) return "unknown";
  if (temp <= 0) return "freezing";
  if (temp <= 8) return "cold";
  if (temp <= 16) return "mild";
  if (temp <= 24) return "warm";
  return "hot";
}

function buildOutfit({temp, season, weather, occasion, mood}){
  const band = tempBand(temp);
  const style = occasionStyle(occasion);
  const w = weatherHints(weather);
  const palette = moodPalette(mood);

  let top, bottom, shoes, accessory, topIcon, bottomIcon, shoesIcon, accIcon;

  const winterish = (season === "winter" || band === "freezing" || band === "cold");
  const summerish = (season === "summer" || band === "hot");

  if (style === "formal") {
    top = winterish ? "Wool blazer + shirt" : "Blazer + shirt";
    bottom = "Tailored trousers";
    shoes = "Leather shoes";
    accessory = "Watch + minimal belt";
    topIcon = "🧥"; bottomIcon = "👖"; shoesIcon = "👞"; accIcon = "⌚";
  } else if (style === "smart") {
    top = winterish ? "Knit sweater + overshirt" : "Button-up shirt";
    bottom = "Chinos / smart pants";
    shoes = "Loafers / clean sneakers";
    accessory = "Watch / tote";
    topIcon = "🧶"; bottomIcon = "👖"; shoesIcon = "👟"; accIcon = "👜";
  } else if (style === "sport") {
    top = winterish ? "Hoodie + base layer" : "Performance tee";
    bottom = "Joggers / shorts";
    shoes = "Trainers";
    accessory = "Cap / sport watch";
    topIcon = "🧢"; bottomIcon = "🩳"; shoesIcon = "👟"; accIcon = "⌚";
  } else if (style === "party") {
    top = winterish ? "Dark jacket + tee" : "Statement shirt";
    bottom = "Slim jeans / trousers";
    shoes = "Clean sneakers / boots";
    accessory = "Chain / watch";
    topIcon = "🧥"; bottomIcon = "👖"; shoesIcon = "🥾"; accIcon = "⛓️";
  } else if (style === "date") {
    top = winterish ? "Turtleneck + coat" : "Polo / clean tee + overshirt";
    bottom = "Dark jeans / chinos";
    shoes = "Chelsea boots / sleek sneakers";
    accessory = "Watch + subtle fragrance";
    topIcon = "🧥"; bottomIcon = "👖"; shoesIcon = "🥾"; accIcon = "⌚";
  } else {
    top = winterish ? "Sweater + jacket" : (summerish ? "Light tee" : "Hoodie / long sleeve");
    bottom = summerish ? "Shorts / light pants" : "Jeans / cargo";
    shoes = "Sneakers";
    accessory = "Cap / backpack";
    topIcon = "👕"; bottomIcon = summerish ? "🩳" : "👖"; shoesIcon = "👟"; accIcon = "🎒";
  }

  const notes = [];
  if (w.rainy){
    accessory = accessory.includes("umbrella") ? accessory : `${accessory} + umbrella`;
    notes.push("Rain: water-resistant layer recommended.");
  }
  if (w.windy){
    notes.push("Wind: prefer a tighter outer layer (bomber / coat).");
  }
  if (w.snowy){
    shoes = shoes.includes("boots") ? shoes : "Waterproof boots";
    notes.push("Snow: waterproof boots and warm socks.");
    shoesIcon = "🥾";
  }
  if (w.sunny && (band === "warm" || band === "hot")){
    notes.push("Sun: sunglasses + breathable fabric.");
    accIcon = "🕶️";
  }

  if (band === "freezing") notes.push("Layer: thermal base + knit + coat.");
  if (band === "cold") notes.push("Layer: long sleeve + jacket.");
  if (band === "hot") notes.push("Keep it light: linen/cotton, minimal layers.");

  return {
    top, bottom, shoes, accessory,
    icons: {topIcon, bottomIcon, shoesIcon, accIcon},
    palette,
    notes
  };
}

function localizeSuggestion(lang, outfit){
  const frames = {
    en: {
      pickHeader: `Recommended outfit:`,
      picks: `Top: <b>${outfit.top}</b><br/>Bottom: <b>${outfit.bottom}</b><br/>Shoes: <b>${outfit.shoes}</b><br/>Accessory: <b>${outfit.accessory}</b>`,
      why: `Why this works: it balances comfort, practicality, and style for your conditions.`,
      tipsHeader: `Quick tips:`
    },
    de: {
      pickHeader: `Empfohlenes Outfit:`,
      picks: `Oberteil: <b>${outfit.top}</b><br/>Unterteil: <b>${outfit.bottom}</b><br/>Schuhe: <b>${outfit.shoes}</b><br/>Accessoire: <b>${outfit.accessory}</b>`,
      why: `Warum es passt: Komfort, Funktion und Stil werden für deine Situation ausbalanciert.`,
      tipsHeader: `Kurztipps:`
    },
    kk: {
      pickHeader: `Ұсынылатын киім:`,
      picks: `Үсті: <b>${outfit.top}</b><br/>Асты: <b>${outfit.bottom}</b><br/>Аяқ киім: <b>${outfit.shoes}</b><br/>Аксессуар: <b>${outfit.accessory}</b>`,
      why: `Неге дұрыс: сіздің жағдайыңызға сай жайлылық, практикалық және стиль теңестірілді.`,
      tipsHeader: `Жылдам кеңестер:`
    },
    ru: {
      pickHeader: `Рекомендуемый образ:`,
      picks: `Верх: <b>${outfit.top}</b><br/>Низ: <b>${outfit.bottom}</b><br/>Обувь: <b>${outfit.shoes}</b><br/>Аксессуар: <b>${outfit.accessory}</b>`,
      why: `Почему это работает: баланс комфорта, практичности и стиля под ваши условия.`,
      tipsHeader: `Быстрые советы:`
    },
    es: {
      pickHeader: `Outfit recomendado:`,
      picks: `Superior: <b>${outfit.top}</b><br/>Inferior: <b>${outfit.bottom}</b><br/>Zapatos: <b>${outfit.shoes}</b><br/>Accesorio: <b>${outfit.accessory}</b>`,
      why: `Por qué funciona: equilibra comodidad, practicidad y estilo según tus condiciones.`,
      tipsHeader: `Consejos rápidos:`
    },
    ar: {
      pickHeader: `الزي المقترح:`,
      picks: `العلوي: <b>${outfit.top}</b><br/>السفلي: <b>${outfit.bottom}</b><br/>الحذاء: <b>${outfit.shoes}</b><br/>الإكسسوار: <b>${outfit.accessory}</b>`,
      why: `لماذا مناسب: يوازن بين الراحة والعملية والأناقة حسب ظروفك.`,
      tipsHeader: `نصائح سريعة:`
    }
  };

  const f = frames[lang] || frames.en;
  const tips = outfit.notes.length
    ? `<ul style="margin:8px 0 0 18px;padding:0;">${outfit.notes.map(n=>`<li>${n}</li>`).join("")}</ul>`
    : "";

  return `
    <div style="display:grid;gap:10px;">
      <div>
        <div style="font-weight:500;margin-bottom:4px;">${f.pickHeader}</div>
        <div>${f.picks}</div>
      </div>

      <div>${f.why}</div>

      <div>
        <div style="font-weight:500;margin-bottom:4px;">${f.tipsHeader}</div>
        ${tips || `<div style="color:#666;font-weight:500;">—</div>`}
      </div>
    </div>
  `;
}

export function generate(){
  const lang = els.lang.value || "en";
  const t = getT(lang);

  const tempRaw = els.temp.value;
  const temp = tempRaw === "" ? null : Number(tempRaw);

  const outfit = buildOutfit({
    temp,
    season: els.season.value,
    weather: els.weather.value,
    occasion: els.occasion.value,
    mood: els.mood.value
  });

  const tempTip = (temp === null || Number.isNaN(temp)) ? t.errors.tempMissing : "";
  if (tempTip) outfit.notes = [tempTip, ...outfit.notes];

  setWardrobeIcons(outfit.icons, {
    top: outfit.top,
    bottom: outfit.bottom,
    shoes: outfit.shoes,
    accessory: outfit.accessory
  });
  setPalette(outfit.palette);

  els.suggestBox.dataset.state = "filled";
  els.suggestBox.innerHTML = localizeSuggestion(lang, outfit);

  const chat = getCurrentChat();
  if (chat){
    captureCurrentUIIntoChat(chat);
    saveToStorage();
  }
}

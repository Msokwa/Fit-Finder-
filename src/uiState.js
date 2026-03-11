// src/uiState.js
import { els } from "./els.js";
import { getT } from "./i18n.js";
import { getCurrentChat } from "./store.js";
import { displayChatName } from "./names.js";

export function setRTLIfNeeded(lang){
  document.body.classList.toggle("rtl", lang === "ar");
}

export function setPalette(hexes){
  const [a,b,c,d] = hexes;
  els.c1.style.background = a; els.h1.textContent = a.toUpperCase();
  els.c2.style.background = b; els.h2.textContent = b.toUpperCase();
  els.c3.style.background = c; els.h3.textContent = c.toUpperCase();
  els.c4.style.background = d; els.h4.textContent = d.toUpperCase();
}

export function setWardrobeIcons(icons, titles){
  els.iconTop.textContent = icons.topIcon;
  els.iconBottom.textContent = icons.bottomIcon;
  els.iconShoes.textContent = icons.shoesIcon;
  els.iconAccessory.textContent = icons.accIcon;

  els.iconTop.title = titles.top || "";
  els.iconBottom.title = titles.bottom || "";
  els.iconShoes.title = titles.shoes || "";
  els.iconAccessory.title = titles.accessory || "";
}

export function applyChatUI(chat){
  const lang = els.lang.value || "en";
  const t = getT(lang);

  els.location.value = chat.ui.inputs.location || "";
  els.temp.value = chat.ui.inputs.temp ?? "";
  els.season.value = chat.ui.inputs.season || "";
  els.weather.value = chat.ui.inputs.weather || "";
  els.occasion.value = chat.ui.inputs.occasion || "";
  els.mood.value = chat.ui.inputs.mood || "";

  setPalette(chat.ui.palette || ["#XXXXXX","#XXXXXX","#XXXXXX","#XXXXXX"]);
  setWardrobeIcons(
    chat.ui.wardrobe?.icons || { topIcon:"🧥", bottomIcon:"👖", shoesIcon:"👟", accIcon:"⌚" },
    chat.ui.wardrobe?.titles || { top:"Top", bottom:"Bottom", shoes:"Shoes", accessory:"Accessory" }
  );

  if (chat.ui.suggestFilled && chat.ui.suggestHTML){
    els.suggestBox.dataset.state = "filled";
    els.suggestBox.innerHTML = chat.ui.suggestHTML;
  } else {
    els.suggestBox.dataset.state = "";
    els.suggestBox.innerHTML = `<em>${t.placeholder}</em>`;
  }
}

export function captureCurrentUIIntoChat(chat){
  if (!chat) return;

  chat.ui.inputs = {
    location: els.location.value,
    temp: els.temp.value,
    season: els.season.value,
    weather: els.weather.value,
    occasion: els.occasion.value,
    mood: els.mood.value
  };

  chat.ui.palette = [
    (els.h1.textContent || "#XXXXXX"),
    (els.h2.textContent || "#XXXXXX"),
    (els.h3.textContent || "#XXXXXX"),
    (els.h4.textContent || "#XXXXXX")
  ];

  chat.ui.wardrobe = {
    icons: {
      topIcon: els.iconTop.textContent || "🧥",
      bottomIcon: els.iconBottom.textContent || "👖",
      shoesIcon: els.iconShoes.textContent || "👟",
      accIcon: els.iconAccessory.textContent || "⌚"
    },
    titles: {
      top: els.iconTop.title || "",
      bottom: els.iconBottom.title || "",
      shoes: els.iconShoes.title || "",
      accessory: els.iconAccessory.title || ""
    }
  };

  const filled = els.suggestBox.dataset.state === "filled";
  chat.ui.suggestFilled = filled;
  chat.ui.suggestHTML = filled ? els.suggestBox.innerHTML : "";
}

export function refreshCrumb(){
  const lang = els.lang.value || "en";
  const current = getCurrentChat();
  if (!current) return;
  els.chatCrumb.textContent = displayChatName(current, lang);
}

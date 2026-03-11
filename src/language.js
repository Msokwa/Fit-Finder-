// src/language.js
import { els } from "./els.js";
import { getT } from "./i18n.js";
import { setRTLIfNeeded, refreshCrumb } from "./uiState.js";
import { renderChatList } from "./chats.js";
import { getCurrentChat } from "./store.js";

export function applyLanguage(lang){
  const t = getT(lang);
  setRTLIfNeeded(lang);

  els.btnShare.textContent = t.share;
  els.btnDelete.textContent = t.del;

  els.titleGenerate.textContent = t.generateTitle;
  els.titleWardrobe.textContent = t.wardrobe;
  els.titleColors.textContent = t.colors;
  els.titleAI.textContent = t.ai;

  els.lblLocation.textContent = t.location;
  els.lblTemp.textContent = t.temp;
  els.lblSeason.textContent = t.season;
  els.lblWeather.textContent = t.weather;
  els.lblOccasion.textContent = t.occasion;
  els.lblMood.textContent = t.mood;

  els.btnGenerate.textContent = t.btn;

  els.labTop.textContent = t.top;
  els.labBottom.textContent = t.bottom;
  els.labAccessory.textContent = t.accessory;
  els.labShoes.textContent = t.shoes;

  els.navNewChat.textContent     = t.sidebar.newChat;
  els.navSearchChats.textContent = t.sidebar.searchChats;
  els.navYourChats.textContent   = t.sidebar.yourChats;

  // Replace season option labels while keeping values
  const seasonValue = els.season.value;
  [...els.season.options].forEach(opt => {
    if (t.seasonOpts[opt.value]) opt.textContent = t.seasonOpts[opt.value];
    if (opt.value === "") opt.textContent = "-";
  });
  els.season.value = seasonValue;

  // If placeholder, localize it
  const current = getCurrentChat();
  const hasFilled = current?.ui?.suggestFilled;
  if (!hasFilled){
    els.suggestBox.innerHTML = `<em>${t.placeholder}</em>`;
  }

  renderChatList();
  refreshCrumb();
}

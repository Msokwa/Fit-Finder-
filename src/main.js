// src/main.js

console.log("main.js loaded");

import { els } from "./els.js";
import { initStore, currentChatId, saveToStorage, getCurrentChat } from "./store.js";
import { renderChatList, openChat, newChat } from "./chats.js";
import { applyLanguage } from "./language.js";
import { generate } from "./generator.js";
import { openSearchModal, attachModalEvents } from "./modal.js";
import { onShare, onDelete } from "./actions.js";

(function init(){
  // default language
  els.lang.value = "en";

  initStore();
  renderChatList();
  openChat(currentChatId, { skipSaveCurrent: true });
  applyLanguage("en");

  // main events
  els.btnGenerate.addEventListener("click", generate);
  els.navNewChat.addEventListener("click", newChat);
  els.navSearchChats.addEventListener("click", openSearchModal);

  els.btnShare.addEventListener("click", onShare);
  els.btnDelete.addEventListener("click", onDelete);

  attachModalEvents();

  els.lang.addEventListener("change", () => {
    applyLanguage(els.lang.value);

    // If already generated, re-generate in new language for current chat
    const current = getCurrentChat();
    if (current && current.ui?.suggestFilled){
      generate();
      saveToStorage();
    }
  });
})();

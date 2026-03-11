// src/chats.js
import { els } from "./els.js";
import { chats, currentChatId, setCurrentChatId, getCurrentChat, getNextChatNumber, makeChat, saveToStorage } from "./store.js";
import { applyChatUI, captureCurrentUIIntoChat, refreshCrumb } from "./uiState.js";
import { displayChatName } from "./names.js";

export function renderChatList(){
  const lang = els.lang.value || "en";
  els.chatList.innerHTML = "";

  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "navItem" + (chat.id === currentChatId ? " active" : "");
    item.dataset.chatId = chat.id;
    item.textContent = displayChatName(chat, lang);

    // double click -> rename
    item.addEventListener("dblclick", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (item.querySelector("input")) return;

      const input = document.createElement("input");
      input.className = "chatRenameInput";
      input.value = (chat.name && chat.name.trim()) ? chat.name : displayChatName(chat, lang);

      item.textContent = "";
      item.appendChild(input);
      input.focus();
      input.select();

      const commit = () => {
        const v = input.value.trim();
        chat.name = v.length ? v : null;
        saveToStorage();
        renderChatList();
        refreshCrumb();
      };
      const cancel = () => renderChatList();

      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") commit();
        if (ev.key === "Escape") cancel();
      });
      input.addEventListener("blur", commit);
    });

    item.addEventListener("click", () => {
      if (chat.id === currentChatId) return;
      openChat(chat.id);
    });

    els.chatList.appendChild(item);
  });
}

function setActiveChatInSidebar(){
  [...els.chatList.querySelectorAll(".navItem")].forEach(node => {
    node.classList.toggle("active", node.dataset.chatId === currentChatId);
  });
}

export function openChat(chatId, opts = {}){
  const { skipSaveCurrent = false } = opts;

  const current = getCurrentChat();
  if (current && !skipSaveCurrent){
    captureCurrentUIIntoChat(current);
  }

  setCurrentChatId(chatId);
  setActiveChatInSidebar();
  refreshCrumb();

  const next = getCurrentChat();
  if (next) applyChatUI(next);

  saveToStorage();
}

export function newChat(){
  const current = getCurrentChat();
  if (current) captureCurrentUIIntoChat(current);

  const num = getNextChatNumber();
  const chat = makeChat(num);
  chats.push(chat);

  setCurrentChatId(chat.id);
  saveToStorage();
  renderChatList();
  openChat(chat.id, { skipSaveCurrent: true });
}

export function deleteCurrentChat(){
  if (chats.length <= 1) return { ok: false, reason: "last" };

  const idx = chats.findIndex(c => c.id === currentChatId);
  if (idx === -1) return { ok: false, reason: "missing" };

  chats.splice(idx, 1);
  const next = chats[idx] || chats[idx - 1] || chats[0];
  setCurrentChatId(next.id);

  saveToStorage();
  renderChatList();
  openChat(next.id, { skipSaveCurrent: true });
  return { ok: true };
}

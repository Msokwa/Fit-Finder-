// src/modal.js
import { els } from "./els.js";
import { getT } from "./i18n.js";
import { chats } from "./store.js";
import { openChat } from "./chats.js";
import { displayChatName } from "./names.js";

export function openSearchModal(){
  const lang = els.lang.value || "en";
  const t = getT(lang);

  els.searchError.style.display = "none";
  els.searchError.textContent = "";
  els.searchInput.value = "";

  els.searchTitle.textContent = t.modal.title;
  els.searchLabel.textContent = t.modal.label;
  els.searchHint.textContent = t.modal.hint;
  els.searchCancel.textContent = t.modal.cancel;
  els.searchGo.textContent = t.modal.search;

  els.searchOverlay.classList.add("show");
  els.searchOverlay.setAttribute("aria-hidden", "false");
  setTimeout(()=>els.searchInput.focus(), 0);
}

export function closeSearchModal(){
  els.searchOverlay.classList.remove("show");
  els.searchOverlay.setAttribute("aria-hidden", "true");
}

export function searchChats(){
  const q = (els.searchInput.value || "").trim().toLowerCase();
  const lang = els.lang.value || "en";
  const t = getT(lang);

  if (!q){
    els.searchError.style.display = "block";
    els.searchError.textContent = t.modal.notFound;
    return;
  }

  const found = chats.find(c => {
    const custom = (c.name || "").toLowerCase();
    const name1 = displayChatName(c, lang).toLowerCase();
    const name2 = `chat - ${c.num}`.toLowerCase();
    const name3 = (lang === "ar" ? `محادثة - ${c.num}` : "").toLowerCase();
    return custom.includes(q) || name1.includes(q) || name2.includes(q) || (name3 && name3.includes(q));
  });

  if (!found){
    els.searchError.style.display = "block";
    els.searchError.textContent = t.modal.notFound;
    return;
  }

  closeSearchModal();
  openChat(found.id);
}

export function attachModalEvents(){
  els.searchClose.addEventListener("click", closeSearchModal);
  els.searchCancel.addEventListener("click", closeSearchModal);
  els.searchGo.addEventListener("click", searchChats);

  // click outside closes
  els.searchOverlay.addEventListener("click", (e) => {
    if (e.target === els.searchOverlay) closeSearchModal();
  });

  // esc closes, enter searches
  document.addEventListener("keydown", (e) => {
    if (els.searchOverlay.classList.contains("show")){
      if (e.key === "Escape") closeSearchModal();
      if (e.key === "Enter" && document.activeElement === els.searchInput) searchChats();
    }
  });
}

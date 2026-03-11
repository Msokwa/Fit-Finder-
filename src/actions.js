// src/actions.js
import { els } from "./els.js";
import { getT } from "./i18n.js";
import { toast } from "./toasts.js";
import { deleteCurrentChat } from "./chats.js";

export function onShare(){
  const lang = els.lang.value || "en";
  const t = getT(lang);
  const text = els.suggestBox.textContent.trim();
  navigator.clipboard?.writeText(text).catch(()=>{});
  toast(t.toast.copied);
}

export function onDelete(){
  const lang = els.lang.value || "en";
  const t = getT(lang);

  const res = deleteCurrentChat();
  if (!res.ok && res.reason === "last"){
    toast(t.toast.cannotDeleteLast);
  }
}

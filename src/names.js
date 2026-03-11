// src/names.js
import { getT } from "./i18n.js";

export function chatLabel(lang, num){
  const t = getT(lang);
  const key = `chat${num}`;
  if (t.sidebar && t.sidebar[key]) return t.sidebar[key];
  if (lang === "ar") return `محادثة - ${num}`;
  return `Chat - ${num}`;
}

export function displayChatName(chat, lang){
  if (!chat) return "";
  if (chat.name && chat.name.trim()) return chat.name.trim();
  return chatLabel(lang, chat.num);
}

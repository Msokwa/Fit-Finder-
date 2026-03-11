// src/store.js
export const STORAGE_KEY = "fitfinder_chats_v1";

export let chats = [];
export let currentChatId = null;

export function defaultChatUI(){
  return {
    inputs: { location:"", temp:"", season:"", weather:"", occasion:"", mood:"" },
    suggestHTML: "",
    suggestFilled: false,
    palette: ["#XXXXXX","#XXXXXX","#XXXXXX","#XXXXXX"],
    wardrobe: {
      icons: { topIcon:"🧥", bottomIcon:"👖", shoesIcon:"👟", accIcon:"⌚" },
      titles: { top:"Top", bottom:"Bottom", shoes:"Shoes", accessory:"Accessory" }
    }
  };
}

export function makeChat(num){
  return {
    id: `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    num,
    name: null,
    ui: defaultChatUI()
  };
}

export function setCurrentChatId(id){
  currentChatId = id;
}

export function getCurrentChat(){
  return chats.find(c => c.id === currentChatId) || null;
}

export function getNextChatNumber(){
  const maxNum = chats.reduce((m,c)=>Math.max(m, Number(c.num)||0), 0);
  return maxNum + 1;
}

export function saveToStorage(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats, currentChatId }));
  }catch(e){}
}

export function loadFromStorage(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.chats) || data.chats.length === 0) return false;

    chats = data.chats;
    currentChatId = data.currentChatId || (chats[0] && chats[0].id);

    chats.forEach(c => {
      if (!c.ui) c.ui = defaultChatUI();
      if (!("name" in c)) c.name = null;
    });

    return true;
  }catch(e){
    return false;
  }
}

/**
 * Requirement: first-ever open => create 4 chats and open Chat-1 by default.
 */
export function initStore(){
  const restored = loadFromStorage();

  if (!restored){
    chats = [makeChat(1), makeChat(2), makeChat(3), makeChat(4)];
    currentChatId = chats[0].id;
    saveToStorage();
  } else {
    if (!currentChatId || !chats.some(c => c.id === currentChatId)){
      currentChatId = chats[0].id;
    }
  }
}

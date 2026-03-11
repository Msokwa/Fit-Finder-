# Fit Finder - Outfit Planner 👔
A multilingual, chat-based outfit recommendation web app. Users enter context (location, temperature, season, weather, occasion, mood) and the app generates a recommended outfit, a color palette, and a short explanation.

> **Course:** Software Engineering 2

---

## Features

- **Outfit generation** based on user inputs:
  - Location, temperature, season, weather, occasion, mood
- **AI-style explanation** describing why the outfit fits the conditions
- **Color palette** suggestions (4 colors with hex labels)
- **Chat system**
  - Multiple chats stored locally (per browser)
  - Switch between chats
  - Create new chat
  - Search chats
  - Rename chat (double click)
- **Multi-language UI**
  - English, German, Kazakh, Russian, Spanish, Arabic
  - RTL support for Arabic
- **Share** generated recommendation (copy to clipboard)
- **Delete** current chat (keeps at least 1 chat)

---

## Tech Stack

- **HTML / CSS / JavaScript**
- **ES Modules** (`type="module"`)
- **LocalStorage** for saving chats locally (no backend required **YET**)

---

## Project Structure

```
fit-finder/
├─ index.html
├─ styles.css
├─ assets/
│  └─ logo.png
├─ src/
│  ├─ main.js        # App bootstrap + events
│  ├─ els.js         # DOM element references
│  ├─ i18n.js        # Translations + helpers
│  ├─ language.js    # Apply language to UI
│  ├─ store.js       # LocalStorage + chat persistence
│  ├─ chats.js       # Chat list / create / open / delete
│  ├─ modal.js       # Search
│  ├─ generator.js   # Outfit + palette generation
│  ├─ uiState.js     # Read/write UI state per chat
│  ├─ actions.js     # Share/Delete 
│  └─ toasts.js      # Notifications
├─ .gitignore
└─ README.md
```

---

## Getting Started

### 1) Requirements
- Any modern browser (Chrome / Edge / Firefox)
- A local HTTP server (because ES Modules do not reliably work via `file://`)

### 2) Run locally

#### VS Code Live Server
Install the **Live Server** extension
```bash
python -m http.server 5500
```

Open:

- `http://localhost:5500`

---

## Usage

1. Open the site
2. Choose your **language** from the selector
3. Fill in your context (location, temperature, season, weather, occasion, mood)
4. Press **Generate**
5. Use:
   - **New chat** to create a new conversation
   - **Search chats** to find chats by name
   - **Share** to copy the recommendation
   - **Delete** to remove the current chat

---

## Data & Persistence

- Chats are stored in **LocalStorage** under a versioned key (example: `fitfinder_chats_v1`).
- Data is saved automatically when switching chats or generating results.
- This is **client-side only** (no server/database **YET**).

---

## Roadmap (Planned)

- User accounts (sign-in)
- Cloud chat sync (database-backed)
- Real AI integration (API-based generation)
- Mobile-friendly layout improvements
- More detailed wardrobe constraints (budget, dress code, brands, colors to avoid)



## 👥 Project Team
* Alexandr Chevychalov
* Shako Nareman Salam
* Beatrice Raphael Msokwa
* Roudi Al Asmar
* Arhan Arda Ergül

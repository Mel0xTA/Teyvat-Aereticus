import { loadGameData } from "./data-loader.js";
import {
  renderCharacters,
  renderWeapons,
  renderArtifacts,
  renderEntityDetail
} from "./renderer.js";

/* =========================
   SELECTORES DOM
========================= */
const gameMenu = document.querySelector(".game-selector");
const contextMenu = document.getElementById("context-menu");
const content = document.getElementById("content");
const breadcrumbs = document.getElementById("breadcrumbs");

/* =========================
   ESTADO GLOBAL
========================= */
let currentGame = null;
let currentView = null;
let currentEntityId = null;
let gameData = null;

/* =========================
   LABELS POR JUEGO
========================= */
const VIEW_LABELS = {
  gi: {
    characters: "Personajes",
    weapons: "Armas",
    artifacts: "Artefactos"
  },
  hsr: {
    characters: "Personajes",
    weapons: "Conos de Luz",
    artifacts: "Reliquias"
  },
  zzz: {
    characters: "Agentes",
    weapons: "Amplificadores",
    artifacts: "Pista de Discos"
  }
};

/* =========================
   EVENTOS
========================= */

// Selector de videojuego
gameMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  document
    .querySelectorAll(".game-selector button")
    .forEach(b => b.classList.remove("active"));

  button.classList.add("active");

  const game = button.dataset.game;
  location.hash = `#${game}/characters`;
});

// Menú contextual
contextMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !currentGame) return;

  const view = button.dataset.view;
  location.hash = `#${currentGame}/${view}`;
});

// Breadcrumbs
document.addEventListener("click", (event) => {
  const crumb = event.target.closest(".crumb.clickable");
  if (!crumb) return;

  location.hash = crumb.dataset.hash || "";
});

/* =========================
   ROUTER
========================= */
async function routeFromHash() {
  const hash = location.hash.replace("#", "");
  if (!hash) return;

  const [game, view, entityId] = hash.split("/");
  if (!game || !view) return;

  currentGame = game;
  currentView = view;
  currentEntityId = entityId || null;

  content.innerHTML = "<p>Cargando datos...</p>";
  contextMenu.classList.remove("visible");
  contextMenu.hidden = true;

  try {
    gameData = await loadGameData(game);

    renderContextMenu();

    contextMenu.hidden = false;
    requestAnimationFrame(() => {
      contextMenu.classList.add("visible");
    });

    renderBreadcrumbs();
    renderCurrentView();

  } catch (error) {
    content.innerHTML = "<p>Error cargando datos</p>";
    console.error(error);
  }
}

window.addEventListener("hashchange", routeFromHash);
window.addEventListener("load", routeFromHash);

/* =========================
   RENDERERS
========================= */
function renderCurrentView() {
  content.innerHTML = "";

  if (currentEntityId) {
    const entity = getCurrentEntity();
    if (!entity) {
      content.innerHTML = "<p>Entidad no encontrada</p>";
      return;
    }
    renderEntityDetail(entity);
    return;
  }

  switch (currentView) {
    case "characters":
      renderCharacters(gameData.characters, currentGame);
      break;
    case "weapons":
      renderWeapons(gameData.weapons);
      break;
    case "artifacts":
      renderArtifacts(gameData.artifacts);
      break;
    default:
      content.innerHTML = "<p>Vista no disponible</p>";
  }
}

function renderContextMenu() {
  const labels = VIEW_LABELS[currentGame];
  contextMenu.innerHTML = "";

  for (const view in labels) {
    const btn = document.createElement("button");
    btn.dataset.view = view;
    btn.textContent = labels[view];
    contextMenu.appendChild(btn);
  }
}

function renderBreadcrumbs() {
  if (!currentGame || !currentView) {
    breadcrumbs.innerHTML = "";
    return;
  }

  const viewLabel = VIEW_LABELS[currentGame]?.[currentView] ?? currentView;

  let html = `
    <span class="crumb clickable" data-hash="">Inicio</span>
    <span class="separator">›</span>
    <span class="crumb clickable" data-hash="#${currentGame}/characters">
      ${currentGame.toUpperCase()}
    </span>
    <span class="separator">›</span>
    <span class="crumb clickable" data-hash="#${currentGame}/${currentView}">
      ${viewLabel}
    </span>
  `;

  if (currentEntityId) {
    const entity = getCurrentEntity();
    if (entity) {
      html += `
        <span class="separator">›</span>
        <span class="crumb active">${entity.name}</span>
      `;
    }
  }

  breadcrumbs.innerHTML = html;
}

/* =========================
   UTILIDADES
========================= */
function getCurrentEntity() {
  if (!gameData || !currentEntityId) return null;

  if (currentView === "characters") {
    return gameData.characters.find(e => e.id === currentEntityId);
  }
  if (currentView === "weapons") {
    return gameData.weapons.find(e => e.id === currentEntityId);
  }
  if (currentView === "artifacts") {
    return gameData.artifacts.find(e => e.id === currentEntityId);
  }
  return null;
}

import { loadGameData } from "./data-loader.js";
import {
  renderCharacters,
  renderEquipment,
  renderProgression
} from "./renderer.js";

<nav id="breadcrumbs" class="breadcrumbs"></nav>

const gameMenu = document.querySelector(".game-selector");
const sideMenu = document.getElementById("side-menu");
const content = document.getElementById("content");

let currentGame = null;
let currentView = null;
let gameData = null;

gameMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const game = button.dataset.game;
  location.hash = `#${game}/characters`;
});


sideMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const view = button.dataset.view;
  location.hash = `#${currentGame}/${view}`;
});

function renderCurrentView() {
  if (currentEntityId) {
    renderEntityDetail(getCurrentEntity());
    return;
  }

  if (currentView === "characters") {
    renderCharacters(gameData.characters);
  }

  if (currentView === "weapons") {
    renderWeapons(gameData.weapons);
  }

  if (currentView === "artifacts") {
    renderArtifacts(gameData.artifacts);
  }
}



async function routeFromHash() {
  const hash = location.hash.replace("#", "");
  if (!hash) return;

  const parts = hash.split("/");
  const [game, view, entityId] = parts;

  if (!game || !view) return;

  currentGame = game;
  currentView = view;
  currentEntityId = entityId || null;

  content.innerHTML = "<p>Cargando datos...</p>";

  try {
    gameData = await loadGameData(game);
    sideMenu.hidden = false;

    renderBreadcrumbs();   // sigue siendo genérico
    renderCurrentView();   // decide lista vs detalle
  } catch (error) {
    content.innerHTML = "<p>Error cargando datos</p>";
    console.error(error);
  }
}

window.addEventListener("hashchange", routeFromHash);
window.addEventListener("load", routeFromHash);

function renderBreadcrumbs() {
  const breadcrumbs = document.getElementById("breadcrumbs");
  if (!currentGame || !currentView) {
    breadcrumbs.innerHTML = "";
    return;
  }

  const gameLabel = currentGame.toUpperCase();
  const viewLabelMap = {
    characters: "Personajes",
    weapons: "Armas",
    artifacts: "Artefactos"
  };

  let html = `
    <span class="crumb clickable" data-hash="">Inicio</span>
    <span class="separator">›</span>
    <span class="crumb clickable" data-hash="#${currentGame}/characters">${gameLabel}</span>
    <span class="separator">›</span>
    <span class="crumb clickable" data-hash="#${currentGame}/${currentView}">
      ${viewLabelMap[currentView] || currentView}
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

document.addEventListener("click", (event) => {
  const crumb = event.target.closest(".crumb.clickable");
  if (!crumb) return;

  const hash = crumb.dataset.hash;
  location.hash = hash || "";
});

function getCurrentEntity() {
  if (!gameData || !currentEntityId) return null;

  if (currentView === "characters") {
    return gameData.characters.find(c => c.id === currentEntityId);
  }

  if (currentView === "weapons") {
    return gameData.weapons.find(w => w.id === currentEntityId);
  }

  if (currentView === "artifacts") {
    return gameData.artifacts.find(a => a.id === currentEntityId);
  }

  return null;
}

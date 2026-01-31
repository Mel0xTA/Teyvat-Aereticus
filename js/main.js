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
  content.innerHTML = "";

  switch (currentView) {
    case "characters":
      renderCharacters(gameData.characters);
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


async function routeFromHash() {
  const hash = location.hash.replace("#", "");
  if (!hash) return;

  const [game, view] = hash.split("/");
  if (!game || !view) return;

  currentGame = game;
  currentView = view;

  content.innerHTML = "<p>Cargando datos...</p>";

  try {
    gameData = await loadGameData(game);
    sideMenu.hidden = false;
    renderBreadcrumbs();     // 👈 aquí
    renderCurrentView();
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

  breadcrumbs.innerHTML = `
    <span class="crumb clickable" data-hash="">Inicio</span>
    <span class="separator">›</span>
    <span class="crumb clickable" data-hash="#${currentGame}/characters">${gameLabel}</span>
    <span class="separator">›</span>
    <span class="crumb active">${viewLabelMap[currentView] || currentView}</span>
  `;
}

document.addEventListener("click", (event) => {
  const crumb = event.target.closest(".crumb.clickable");
  if (!crumb) return;

  const hash = crumb.dataset.hash;
  location.hash = hash || "";
});

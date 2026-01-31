import { loadGameData } from "./data-loader.js";
import {
  renderCharacters,
  renderEquipment,
  renderProgression
} from "./renderer.js";

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
    renderCurrentView();
  } catch (error) {
    content.innerHTML = "<p>Error cargando datos</p>";
    console.error(error);
  }
}

window.addEventListener("hashchange", routeFromHash);
window.addEventListener("load", routeFromHash);


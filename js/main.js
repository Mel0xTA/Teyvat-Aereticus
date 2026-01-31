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
let currentView = "characters";
let gameData = null;

gameMenu.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const game = button.dataset.game;
  if (!game) return;

  currentGame = game;
  currentView = "characters";

  content.innerHTML = "<p>Cargando datos...</p>";

  try {
    gameData = await loadGameData(game);
    sideMenu.hidden = false;
    renderCurrentView();
  } catch (error) {
    content.innerHTML = "<p>Error cargando datos</p>";
    console.error(error);
  }
});

sideMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const view = button.dataset.view;
  if (!view) return;

  currentView = view;
  renderCurrentView();
});

function renderCurrentView() {
  content.innerHTML = "";

  switch (currentView) {
    case "characters":
      renderCharacters(gameData.characters);
      break;

    case "equipment":
      renderEquipment(gameData.equipment);
      break;

    case "progression":
      renderProgression(gameData.progression);
      break;
  }
}

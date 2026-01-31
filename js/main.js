import { loadGameData } from "./data-loader.js";
import { renderCharacters } from "./renderer.js";

const menu = document.querySelector(".game-selector");
const content = document.getElementById("content");

menu.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const game = button.dataset.game;
  if (!game) return;

  content.innerHTML = "<p>Cargando datos...</p>";

  try {
    const data = await loadGameData(game);
    renderCharacters(data.characters);
  } catch (error) {
    content.innerHTML = "<p>Error cargando datos</p>";
    console.error(error);
  }
});

// main.js

// Variables globales
let currentGame = 'gi'; // Valor por defecto
let gameData = null;

// Función para inicializar la web
async function init() {
  await loadAndRender(currentGame);

  // Configurar botones de selección de juego
  document.getElementById('btn-gi').addEventListener('click', () => switchGame('gi'));
  document.getElementById('btn-hsr').addEventListener('click', () => switchGame('hsr'));
  document.getElementById('btn-zzz').addEventListener('click', () => switchGame('zzz'));
}

// Función para cargar datos y renderizar todo
async function loadAndRender(game) {
  gameData = await loadGameData(game);
  if (!gameData) {
    document.getElementById('content').innerHTML = `<p>Error cargando datos del juego: ${game}</p>`;
    return;
  }

  const { characters, skills, progression, equipment } = gameData;

  // Render de todos los personajes
  const container = document.getElementById('content');
  container.innerHTML = ''; // limpiar previo

  characters.forEach(char => {
    const charSkills = getCharacterSkills(skills, char.id);
    const charProg = getCharacterProgression(progression, char.id);
    const charEquip = getEquipmentByRole(equipment, char.role[0] || '');
    renderCharacterFull(char, charSkills, charProg, charEquip);
  });
}

// Cambiar de juego
async function switchGame(game) {
  currentGame = game;
  await loadAndRender(currentGame);
}

// Iniciar la web
window.addEventListener('DOMContentLoaded', init);

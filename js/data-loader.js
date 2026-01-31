// data-loader.js

/**
 * Carga los JSON de un juego específico
 * @param {string} game - 'gi', 'hsr', 'zzz'
 * @returns {Promise<object>} - Contiene characters, skills, progression, equipment
 */
async function loadGameData(game) {
  try {
    // Cargar meta.json
    const metaRes = await fetch(`data/${game}/meta.json`);
    const meta = await metaRes.json();

    // Cargar personajes
    const charactersRes = await fetch(`data/${game}/characters.json`);
    const characters = await charactersRes.json();

    // Cargar habilidades
    const skillsRes = await fetch(`data/${game}/skills.json`);
    const skills = await skillsRes.json();

    // Cargar progresión
    const progressionRes = await fetch(`data/${game}/progression.json`);
    const progression = await progressionRes.json();

    // Cargar equipamiento
    const equipmentRes = await fetch(`data/${game}/equipment.json`);
    const equipment = await equipmentRes.json();

    return {
      meta,
      characters,
      skills,
      progression,
      equipment
    };
  } catch (error) {
    console.error("Error cargando datos del juego:", error);
    return null;
  }
}

/**
 * Función auxiliar: obtener habilidades de un personaje
 * @param {object} skillsJSON 
 * @param {string} characterId 
 */
function getCharacterSkills(skillsJSON, characterId) {
  return skillsJSON[characterId] || {};
}

/**
 * Función auxiliar: obtener progresión de un personaje
 * @param {object} progressionJSON 
 * @param {string} characterId 
 */
function getCharacterProgression(progressionJSON, characterId) {
  return progressionJSON.find(p => p.characterId === characterId) || null;
}

/**
 * Función auxiliar: obtener equipamiento filtrado
 * @param {array} equipmentJSON 
 * @param {string} role
 */
function getEquipmentByRole(equipmentJSON, role) {
  return equipmentJSON.filter(e => !e.roleRestriction.length || e.roleRestriction.includes(role));
}

// renderer.js

/**
 * Render principal: recibe character y todos sus datos asociados
 * @param {object} character 
 * @param {object} characterSkills 
 * @param {object} characterProgression 
 * @param {array} characterEquipment 
 */
function renderCharacterFull(character, characterSkills, characterProgression, characterEquipment) {
  const container = document.getElementById('content');
  container.innerHTML = ''; // Limpiar contenido previo

  renderCharacterCard(character, container);
  renderSkills(characterSkills, container);
  renderProgression(characterProgression, container);
  renderEquipment(characterEquipment, container);
}

/**
 * Render de tarjeta de personaje
 */
function renderCharacterCard(character, container) {
  const card = document.createElement('div');
  card.className = 'character-card';

  card.innerHTML = `
    <img src="${character.media?.portrait || ''}" alt="${character.name}" class="portrait">
    <h2>${character.name} (${character.rarity}★)</h2>
    <p>Elemento: ${character.attributes?.element || 'N/A'}</p>
    <p>Rol: ${character.role.join(', ')}</p>
    <p>Facción: ${character.faction || 'N/A'}</p>
  `;

  container.appendChild(card);
}

/**
 * Render de habilidades
 */
function renderSkills(skills, container) {
  const skillContainer = document.createElement('div');
  skillContainer.className = 'skills-container';

  Object.values(skills).forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill';
    div.innerHTML = `<strong>${skill.name}</strong> (${skill.type})`;

    // Tooltip con efectos
    div.title = skill.effects?.map(e => {
      let s = `Tipo: ${e.effectType}`;
      if (e.stat) s += ` | Stat: ${e.stat} +${e.value || ''}`;
      if (e.scaling?.multiplier) s += ` | Mult: ${e.scaling.multiplier.join(', ')}`;
      return s;
    }).join('\n') || '';

    skillContainer.appendChild(div);
  });

  container.appendChild(skillContainer);
}

/**
 * Render de progresión
 */
function renderProgression(progression, container) {
  if (!progression) return;

  const progContainer = document.createElement('div');
  progContainer.className = 'progression-container';

  progression.levels.forEach(level => {
    const div = document.createElement('div');
    div.className = 'progression-level';
    div.innerHTML = `<h3>${level.unlock}: ${level.name}</h3>`;

    level.effects.forEach(e => {
      const p = document.createElement('p');
      p.textContent = `${e.effectType}${e.stat ? ` → ${e.stat}` : ''}${e.value ? ` +${e.value}` : ''}`;
      div.appendChild(p);
    });

    progContainer.appendChild(div);
  });

  container.appendChild(progContainer);
}

/**
 * Render de equipamiento
 */
function renderEquipment(equipmentList, container) {
  const eqContainer = document.createElement('div');
  eqContainer.className = 'equipment-container';

  equipmentList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'equipment-card';
    div.innerHTML = `
      <h3>${item.name} (${item.rarity}★)</h3>
      <p>Substat: ${item.subStat?.stat || 'N/A'} +${item.subStat?.value || 0}</p>
      <p>Base ATK: ${item.baseStats?.atk || 0}</p>
    `;

    // Pasivas por refinamiento
    if (item.passive?.effectsByRefine?.length) {
      const ul = document.createElement('ul');
      item.passive.effectsByRefine.forEach(ref => {
        ref.effects.forEach(e => {
          const li = document.createElement('li');
          li.textContent = `${e.effectType}${e.stat ? ` → ${e.stat}` : ''}${e.value ? ` +${e.value}` : ''}`;
          ul.appendChild(li);
        });
      });
      div.appendChild(ul);
    }

    eqContainer.appendChild(div);
  });

  container.appendChild(eqContainer);
}

export function renderCharacters(characters) {
  const content = document.getElementById("content");
  content.innerHTML = ""; // Limpiar previo

  characters.forEach(char => {
    const div = document.createElement("div");
    div.className = "character-card";

    div.innerHTML = `
      <img src="${char.media.portrait}" alt="${char.name}" class="portrait">
      <h2>${char.name}</h2>
      <p>${char.attributes.element} · ${char.attributes.weaponType}</p>
    `;

    content.appendChild(div);
  });
}

export function renderEquipment(equipment) {
  equipment.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<h2>${item.name}</h2>`;
    document.getElementById("content").appendChild(div);
  });
}

export function renderProgression(progression) {
  progression.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<h2>${p.type}</h2>`;
    document.getElementById("content").appendChild(div);
  });
}

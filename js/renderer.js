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
  card.addEventListener("click", () => {
  location.hash = `#${currentGame}/characters/${character.id}`;
  });
}

export function renderWeapons(weapons) {
  weapons.forEach(w => {
    const div = document.createElement("div");
    div.className = "equipment-card";
    div.innerHTML = `<h2>${w.name}</h2>`;
    document.getElementById("content").appendChild(div);
  });
}

export function renderArtifacts(artifacts) {
  artifacts.forEach(a => {
    const div = document.createElement("div");
    div.className = "equipment-card";
    div.innerHTML = `<h2>${a.name}</h2>`;
    document.getElementById("content").appendChild(div);
  });
}
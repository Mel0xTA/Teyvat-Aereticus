export function renderCharacters(characters, game) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <img src="${char.media.portrait}" alt="${char.name}" class="portrait">
      <h2>${char.name}</h2>
      <p>${char.attributes.element} · ${char.attributes.weaponType}</p>
    `;

    card.addEventListener("click", () => {
      location.hash = `#${game}/characters/${char.id}`;
    });

    content.appendChild(card);
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

export function renderEntityDetail(entity) {
  const content = document.getElementById("content");

  content.innerHTML = `
    <section class="character-profile">
      <img src="${entity.media.portrait}" alt="${entity.name}" class="portrait">
      <h2>${entity.name}</h2>
      <p>${entity.attributes.element} · ${entity.attributes.weaponType}</p>
    </section>
  `;
}

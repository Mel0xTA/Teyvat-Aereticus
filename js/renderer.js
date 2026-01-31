export function renderCharacters(characters) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <h2>${char.name}</h2>
      <p>${char.attributes.element} · ${char.attributes.weaponType}</p>
    `;

    content.appendChild(card);
  });
}

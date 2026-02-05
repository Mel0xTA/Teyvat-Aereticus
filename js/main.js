let charactersData = [];
let currentGame = "gi";

function normalizeText(text) {
  return String(text)
    .trim()
    .normalize("NFD")                     // Descompone acentos
    .replace(/[\u0300-\u036f]/g, "")      // Elimina diacríticos
    .replace(/ñ/g, "n")                   // Reemplaza ñ por n
    .replace(/Ñ/g, "N")                   // Reemplaza Ñ por N si aplica
    .replace(/\./g, "")                   // Elimina puntos
    .toLowerCase()
    .replace(/\s+/g, "-");                // Reemplaza espacios por guion
}

/**
 * Carga JSON del juego seleccionado
 */
async function loadCharacters(game) {
  currentGame = game;

  const res = await fetch(`data/${game}.json`);
  if (!res.ok) {
    console.error(`No se pudo cargar ${game}.json`, res.status);
    charactersData = [];
    renderCharacters();
    return;
  }

  const data = await res.json();

  // Para ZZZ usamos 'agents', para los demás 'characters'
  if (game === "zzz") {
    charactersData = data.agents ?? [];
  } else {
    charactersData = data.characters ?? [];
  }

  renderCharacters();
}

/**
 * Render principal
 */
function renderCharacters() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (!charactersData.length) {
    content.innerHTML = `
      <p class="col-span-6 text-center text-gray-400">
        No hay personajes disponibles.
      </p>`;
    return;
  }

  charactersData.forEach(char => {
    const avatarPath = `assets/images/${currentGame}/avatar/${char.id}.png`;
    const rarityPath = `assets/images/${currentGame}/rarity/${char.rarity}.png`;

    let iconsHTML = "";

    /* ========= HSR ========= */
    if (currentGame === "hsr") {
      const element = normalizeText(char.attributes?.element ?? "");
      const pathType = normalizeText(char.attributes?.pathType ?? "");
      if (element && pathType) {
        iconsHTML = `
          <img data-icon src="assets/images/hsr/element/${element}.png" style="width:auto;">
          <img data-icon src="assets/images/hsr/pathType/${pathType}.png" style="width:auto;">
        `;
      }
    }

    /* ========= GENSHIN IMPACT ========= */
    if (currentGame === "gi") {
      const element = normalizeText(char.attributes?.element ?? "");
      const region = normalizeText(char.region ?? "");
      const arkhe = normalizeText(char.attributes?.arkhe ?? "");
      const weapon = normalizeText(char.attributes?.weaponType ?? "");

      let visionFile = "";
      if (element && region) {
        visionFile = `${element}-${region}`;
        if (region === "fontaine" && arkhe) visionFile += `-${arkhe}`;
      }

      iconsHTML = `
        ${visionFile ? `<img data-icon src="assets/images/gi/vision/${visionFile}.png" style="width:auto;">` : ""}
        ${weapon ? `<img data-icon src="assets/images/gi/weaponType/${weapon}.png" style="width:auto;">` : ""}
      `;
    }

    /* ========= ZZZ ========= */
    if (currentGame === "zzz") {
      const element = normalizeText(char.attributes?.element ?? "");
      const role = normalizeText(char.attributes?.class ?? "");
      const faction = normalizeText(char.faction ?? "");

      if (element && role) {
        iconsHTML = `
          <img data-icon src="assets/images/zzz/element/${element}.png" style="width:auto;">
          <img data-icon src="assets/images/zzz/role/${role}.png" style="width:auto;">
          ${faction ? `<img data-icon src="assets/images/zzz/faction/${faction}.png" style="width:auto;">` : ""}
        `;
      }
    }

// Construcción de tarjeta
const card = document.createElement("div");
card.className =
  "bg-slate-800 rounded-2xl overflow-hidden flex flex-col aspect-[3/5] shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_25px_5px_rgba(255,255,255,0.2)]";

card.style.cursor = "pointer";
card.addEventListener("click", () => {
  window.location.href = `characters/character.html?game=${currentGame}&id=${char.id}`;
});

card.innerHTML = `
  <div class="relative w-full flex-[0_0_65%] aspect-square overflow-hidden avatar-container">
    <img src="${avatarPath}" class="w-full h-full object-cover avatar-img">
    <img src="${rarityPath}" class="rarity-img" style="width:auto; position:absolute;">
  </div>

  <div class="flex-1 flex flex-col items-center justify-center text-center px-3 py-4">
    <h3 class="char-name font-bold mb-2">${char.name}</h3>
    <div class="flex justify-center gap-2 icons-container mb-2">
      ${iconsHTML}
    </div>
  </div>
`;

    content.appendChild(card);

    const avatarDiv = card.querySelector(".avatar-container");
    const avatarImg = avatarDiv.querySelector(".avatar-img");
    const iconContainer = card.querySelector(".icons-container");
    const nameElem = card.querySelector(".char-name");
    const rarityImg = card.querySelector(".rarity-img");

    // Función de escalado dinámico
    const scaleElements = () => {
      const avatarHeight = avatarDiv.clientHeight;
      const avatarWidth = avatarDiv.clientWidth;

      // ----- Nombre del personaje -----
      nameElem.style.whiteSpace = "nowrap";
      nameElem.style.overflow = "hidden";
      nameElem.style.textOverflow = "ellipsis";

      let fontSize = Math.min(avatarHeight * 0.12, 32); // máximo 32px
      nameElem.style.fontSize = `${fontSize}px`;
      while (nameElem.scrollWidth > avatarWidth - 8 && fontSize > 8) {
        fontSize -= 1;
        nameElem.style.fontSize = `${fontSize}px`;
      }

      // ----- Íconos -----
      const iconElements = iconContainer.querySelectorAll("img[data-icon]");
      const iconHeight = avatarHeight * 0.25;
      const gap = avatarHeight * 0.08;

      iconElements.forEach(img => {
        img.style.height = `${iconHeight}px`;
        img.style.width = "auto";
      });
      iconContainer.style.gap = `${gap}px`;

      // ----- Rareza -----
      if (currentGame === "zzz") {
        rarityImg.style.bottom = "0.5em";
        rarityImg.style.right = "0.5em";
        rarityImg.style.left = "auto";
        const rarityHeight = avatarHeight * 0.2; // tamaño independiente
        rarityImg.style.height = `${rarityHeight}px`;
        rarityImg.style.width = "auto";
      } else {
        rarityImg.style.bottom = "0.5em";
        rarityImg.style.left = "50%";
        rarityImg.style.transform = "translateX(-50%)";
        rarityImg.style.height = `${avatarHeight * 0.15}px`;
        rarityImg.style.width = "auto";
      }
    };

    // Escalado después de cargar la imagen
    avatarImg.addEventListener("load", scaleElements);

    // Escalado dinámico al cambiar el tamaño de la ventana
    window.addEventListener("resize", scaleElements);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Eventos de botones
  document.querySelectorAll("button[data-game]").forEach(btn => {
    btn.addEventListener("click", () => {
      loadCharacters(btn.dataset.game);
    });
  });

  // Init
  loadCharacters(currentGame);
});

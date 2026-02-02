// =========================
// Normaliza texto para rutas
// =========================
function normalizeText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// =========================
// Renderizado de personajes
// =========================
export function renderCharacters(list, game) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  list.forEach(entity => {
    const data = normalizeCharacter(entity, game);
    if (!data) return;

    const card = document.createElement("div");
    card.className = "character-card";
    card.onclick = () => window.location.href = `#${game}/characters/${data.id}`;

    // --- Contenedor portrait con fondo ---
    const portraitContainer = document.createElement("div");
    portraitContainer.className = "portrait-container";

    const portraitId = normalizeText(data.id);
    const portrait = document.createElement("img");
    portrait.src = `assets/images/${game}/avatar/${portraitId}.png`;
    portrait.alt = data.name;
    portrait.className = "portrait";

    portraitContainer.appendChild(portrait);

    // --- Rareza ---
    if (data.rarity) {
      const rarityImg = document.createElement("img");
      rarityImg.className = `rarity-icon rarity-${game}`;
      rarityImg.src = `assets/images/${game.toUpperCase()}/rarity/${data.rarity}.png`;
      rarityImg.alt = `Rarity ${data.rarity}`;
      rarityImg.onerror = () => rarityImg.remove();
      portraitContainer.appendChild(rarityImg);
    }

    // Nombre
    const name = document.createElement("h3");
    name.textContent = data.name;

    // Contenedor de iconos
    const elementContainer = document.createElement("div");
    elementContainer.className = "element-container";

    if (game === "gi") {
      const visionPath = getVisionPath(entity);
      if (visionPath) addIcon(elementContainer, visionPath, data.element);

      const weaponType = normalizeText(entity.attributes?.weaponType);
      if (weaponType) addIcon(elementContainer, `assets/images/gi/weaponType/${weaponType}.png`, entity.attributes?.weaponType);

    } else if (game === "hsr") {
      const element = normalizeText(entity.attributes?.element);
      if (element) addIcon(elementContainer, `assets/images/hsr/element/${element}.png`, entity.attributes?.element);

      const pathType = normalizeText(entity.attributes?.pathType);
      if (pathType) addIcon(elementContainer, `assets/images/hsr/pathType/${pathType}.png`, entity.attributes?.pathType);

    } else if (game === "zzz") {
      const element = normalizeText(entity.attributes?.element);
      if (element) addIcon(elementContainer, `assets/images/zzz/element/${element}.png`, entity.attributes?.element);

      const classType = normalizeText(entity.attributes?.class);
      if (classType) addIcon(elementContainer, `assets/images/zzz/class/${classType}.png`, entity.attributes?.class);

      const faction = normalizeText(data.faction);
      if (faction) addIcon(elementContainer, `assets/images/zzz/faction/${faction}.png`, data.faction);
    }

    // Ajuste dinámico de iconos a la mitad del portrait
    portrait.onload = () => {
      const iconSize = portrait.width / 2;
      elementContainer.querySelectorAll("img").forEach(img => {
        img.style.width = `${iconSize}px`;
        img.style.height = `${iconSize}px`;
      });
    };

    // --- Append final ---
    card.appendChild(portraitContainer);
    card.appendChild(name);
    card.appendChild(elementContainer);
    container.appendChild(card);
  });
}

// =========================
// Función auxiliar para agregar un icono
// =========================
function addIcon(container, src, title) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = title || "—";
  img.title = title || "—";
  img.className = "element-icon";

  img.onerror = () => {
    const fallback = document.createElement("span");
    fallback.textContent = title || "—";
    fallback.title = title || "—";
    container.appendChild(fallback);
  };

  container.appendChild(img);
}

// =========================
// Función para visión GI
// =========================
function getVisionPath(character) {
  if (!character || character.game !== "gi") return null;

  const element = normalizeText(character.attributes?.element);
  const region = normalizeText(character.region);
  if (!element || !region) return null;

  if (region === "fontaine") {
    const arkhe = normalizeText(character.attributes?.arkhe || "pneuma");
    return `assets/images/GI/vision/${element}-${region}-${arkhe}.png`;
  }

  return `assets/images/GI/vision/${element}-${region}.png`;
}

// =========================
// Normaliza personajes
// =========================
function normalizeCharacter(entity, game) {
  switch (game) {
    case "gi":
      return {
        id: entity.id,
        name: entity.name,
        element: entity.attributes?.element,
        role: entity.attributes?.weaponType,
        faction: entity.region,
        rarity: entity.rarity,
        game: "gi",
      };
    case "hsr":
      return {
        id: entity.id,
        name: entity.name,
        element: entity.attributes?.element,
        role: entity.attributes?.pathType,
        rarity: entity.rarity,
        game: "hsr",
      };
    case "zzz":
      return {
        id: entity.id,
        name: entity.name,
        element: entity.attributes?.element,
        role: entity.attributes?.class,
        faction: entity.faction,
        rarity: entity.rarity,
        game: "zzz",
      };
    default:
      return null;
  }
}

// =========================
// Weapons
// =========================
export function renderWeapons(weapons) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  weapons.forEach(w => {
    const div = document.createElement("div");
    div.className = "equipment-card";
    div.innerHTML = `<h2>${w.name}</h2>`;
    container.appendChild(div);
  });
}

// =========================
// Artifacts
// =========================
export function renderArtifacts(artifacts) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  artifacts.forEach(a => {
    const div = document.createElement("div");
    div.className = "equipment-card";
    div.innerHTML = `<h2>${a.name}</h2>`;
    container.appendChild(div);
  });
}

// =========================
// Entity Detail
// =========================
export function renderEntityDetail(entity) {
  const content = document.getElementById("content");
  const element = entity.attributes?.element || "—";
  const weapon = entity.attributes?.weaponType || "—";
  const portrait = entity.media?.portrait || "";

  content.innerHTML = `
    <section class="character-profile">
      <img src="${portrait}" alt="${entity.name}" class="portrait">
      <h2>${entity.name}</h2>
      <p>${element} · ${weapon}</p>
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const game = params.get("game");
  const id = params.get("id");

  const kitContainer = document.getElementById("kit-container");

  if (!game || !id) {
    kitContainer.innerHTML =
      "<p class='text-red-400'>Parámetros inválidos.</p>";
    return;
  }

  function normalizeText(text) {
    return String(text ?? "")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  /* ================= FETCH ================= */

  fetch(`/data/${game}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Fetch error");
      return res.json();
    })
    .then(data => {
      const list =
        game === "zzz"
          ? data.agents ?? []
          : data.characters ?? [];

      const character = list.find(c => c.id === id);

      if (!character) {
        kitContainer.innerHTML =
          "<p class='text-red-400'>Personaje no encontrado.</p>";
        return;
      }

      renderHeader(character);
      renderKit(character);
    })
    .catch(err => {
      console.error(err);
      kitContainer.innerHTML =
        "<p class='text-red-400'>Error cargando datos.</p>";
    });

  /* ================= HEADER ================= */

  function renderHeader(char) {
    document.getElementById("character-name").textContent = char.name;

    document.getElementById("character-portrait").src =
      `/assets/images/${game}/avatar/${char.id}.png`;

    const icons = document.getElementById("character-icons");
    icons.innerHTML = "";

    if (game === "gi") {
      const element = normalizeText(char.attributes?.element);
      const region = normalizeText(char.region);
      const arkhe = normalizeText(char.attributes?.arkhe);

      let visionFile = "";
      if (element && region) {
        visionFile = `${element}-${region}`;
        if (region === "fontaine" && arkhe) {
          visionFile += `-${arkhe}`;
        }
      }

      if (visionFile) {
        icons.innerHTML += `
          <img src="/assets/images/gi/vision/${visionFile}.png" class="h-7">
        `;
      }

      const weapon = normalizeText(char.attributes?.weaponType);
      if (weapon) {
        icons.innerHTML += `
          <img src="/assets/images/gi/weaponType/${weapon}.png" class="h-7">
        `;
      }

      document.getElementById("character-meta").textContent =
        char.region ?? "";
    }

    if (game === "hsr") {
      const element = normalizeText(char.attributes?.element);
      const path = normalizeText(char.attributes?.pathType);

      if (element) {
        icons.innerHTML += `
          <img src="/assets/images/hsr/element/${element}.png" class="h-7">
        `;
      }
      if (path) {
        icons.innerHTML += `
          <img src="/assets/images/hsr/pathType/${path}.png" class="h-7">
        `;
      }
    }

    if (game === "zzz") {
      const element = normalizeText(char.attributes?.element);
      const role = normalizeText(char.attributes?.class);
      const faction = normalizeText(char.faction);

      if (element) {
        icons.innerHTML += `
          <img src="/assets/images/zzz/element/${element}.png" class="h-7">
        `;
      }
      if (role) {
        icons.innerHTML += `
          <img src="/assets/images/zzz/role/${role}.png" class="h-7">
        `;
      }
      if (faction) {
        icons.innerHTML += `
          <img src="/assets/images/zzz/faction/${faction}.png" class="h-7">
        `;
      }
    }
  }

  /* ================= KIT ================= */

  function renderKit(char) {
    kitContainer.innerHTML = "";

    const skills =
      char.skills ??
      char.talents ??
      char.abilities ??
      [];

    if (!skills.length) {
      kitContainer.innerHTML =
        "<p class='text-slate-400'>Este personaje no tiene kit definido.</p>";
      return;
    }

    skills.forEach(skill => {
      const block = document.createElement("article");
      block.className =
        "bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4";

      block.innerHTML = `
        <header class="flex items-center gap-4 border-b border-slate-600 pb-3">
          ${
            skill.icon
              ? `<img src="${skill.icon}" class="w-10 h-10 object-contain">`
              : ""
          }
          <h2 class="text-lg font-semibold">${skill.name}</h2>
        </header>

        <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          ${skill.description}
        </p>
      `;

      kitContainer.appendChild(block);
    });
  }
});

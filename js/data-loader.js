export async function loadGameData(game) {
  const response = await fetch(`data/${game}.json`);
  if (!response.ok) {
    throw new Error(`No se pudo cargar data/${game}.json`);
  }

  const rawData = await response.json();

  switch (game) {
    case "gi":
      return {
        characters: rawData.characters ?? [],
        weapons: rawData.weapons ?? [],
        artifacts: rawData.artifacts ?? []
      };

    case "hsr":
      return {
        characters: rawData.characters ?? [],
        weapons: rawData.lightcones ?? [],
        artifacts: rawData.relics ?? []
      };

    case "zzz":
      return {
        characters: rawData.agents ?? [],
        weapons: rawData["w-engine"] ?? [],
        artifacts: rawData["drive-disks"] ?? []
      };

    default:
      throw new Error(`Juego no soportado: ${game}`);
  }
}

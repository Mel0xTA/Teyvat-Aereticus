export async function loadGameData(game) {
  const base = `data/${game}`;

  const [characters, skills, progression, equipment] = await Promise.all([
    fetch(`${base}/characters.json`).then(r => r.json()),
    fetch(`${base}/skills.json`).then(r => r.json()),
    fetch(`${base}/progression.json`).then(r => r.json()),
    fetch(`${base}/equipment.json`).then(r => r.json())
  ]);

  return { characters, skills, progression, equipment };
}

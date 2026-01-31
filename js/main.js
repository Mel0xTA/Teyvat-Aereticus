document.querySelectorAll('nav button').forEach(button => {
  button.addEventListener('click', () => {
    const game = button.dataset.game;
    loadGame(game);
  });
});

function loadGame(game) {
  fetch(`data/${game}/characters.json`)
    .then(res => res.json())
    .then(data => renderCharacters(data))
    .catch(err => console.error(err));
}

function renderCharacters(characters) {
  const container = document.getElementById('content');
  container.innerHTML = '';

  characters.forEach(char => {
    const div = document.createElement('div');
    div.textContent = char.name;
    container.appendChild(div);
  });
}

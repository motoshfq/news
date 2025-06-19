export async function renderNews(fileNames, containerId = 'news-container') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const promises = fileNames.map(name =>
    fetch(`./articles/${name}`)
      .then(res => res.json())
      .catch(() => null)
  );

  const articles = (await Promise.all(promises)).filter(Boolean);

  for (const { title, date, preview, image } of articles) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${image}" alt="${title}" />
      <div class="text">
        <h2>${title}</h2>
        <p>${preview}</p>
        <span class="date">${date}</span>
      </div>
    `;
    container.appendChild(card);
  }
}

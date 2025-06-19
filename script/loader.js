import { renderNews } from './render.js';
import { initPagination } from './paginate.js';

async function fetchArticleList() {
  // Эмуляция файловой системы (список файлов, в реальности нужно API)
  const response = await fetch('./articles/index.json');
  return await response.json(); // [ "news-1.json", "news-2.json", ... ]
}

async function loadArticles() {
  const files = await fetchArticleList();
  initPagination(files);
}

loadArticles();

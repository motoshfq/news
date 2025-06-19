import { renderNews } from './render.js';

let currentPage = 1;
const perPage = 6;
let totalPages = 0;
let allFiles = [];

export function initPagination(files) {
  allFiles = files;
  totalPages = Math.ceil(allFiles.length / perPage);

  document.getElementById('prevBtn').onclick = () => changePage(-1);
  document.getElementById('nextBtn').onclick = () => changePage(1);

  updatePage();
}

function changePage(delta) {
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    updatePage();
  }
}

function updatePage() {
  const start = (currentPage - 1) * perPage;
  const pageFiles = allFiles.slice(start, start + perPage);
  renderNews(pageFiles);
  document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
}

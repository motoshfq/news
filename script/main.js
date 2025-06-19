// script/main.js

import { ArticleService } from './ArticleService.js'; // Убедитесь, что используете ES Modules

const articleService = new ArticleService();
const ARTICLES_PER_PAGE = 6; // Количество новостей на одной "плашке"

// --- Функции для рендеринга на клиенте (пример) ---

/**
 * Рендерит список статей на странице.
 * @param {Array} articles - Массив объектов статей.
 * @param {HTMLElement} container - DOM-элемент, куда рендерить статьи.
 */
function renderArticles(articles, container) {
    container.innerHTML = ''; // Очищаем контейнер перед рендерингом
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-card'); // Класс для стилизации
        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <p class="article-meta">${article.date} | ${article.category}</p>
            <a href="article.html?id=${article.id}">Читать далее</a>
        `;
        container.appendChild(articleElement);
    });
}

/**
 * Рендерит элементы пагинации.
 * @param {Object} paginationData - Объект с данными пагинации ({ totalPages, currentPage }).
 * @param {HTMLElement} container - DOM-элемент, куда рендерить пагинацию.
 * @param {Function} onPageChange - Callback-функция, вызываемая при изменении страницы.
 */
function renderPagination(paginationData, container, onPageChange) {
    container.innerHTML = '';
    const { totalPages, currentPage } = paginationData;

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        container.appendChild(pageLink);
    }
}

// --- Основная логика загрузки и отображения ---

document.addEventListener('DOMContentLoaded', async () => {
    const newsContainer = document.getElementById('news-list');
    const paginationContainer = document.getElementById('pagination');
    const categoryFilter = document.getElementById('category-filter'); // Предполагаемый select/ul для фильтра категорий

    let currentPage = 1;
    let currentCategory = 'Все'; // Для фильтрации по категории

    // Загружаем и рендерим категории для фильтра
    const categories = await articleService.getUniqueCategories();
    // Добавляем опцию "Все" для сброса фильтра
    const allOption = document.createElement('option');
    allOption.value = 'Все';
    allOption.textContent = 'Все';
    categoryFilter.appendChild(allOption);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', async (event) => {
        currentCategory = event.target.value;
        currentPage = 1; // Сбрасываем страницу при смене категории
        await loadAndRenderNews(currentPage, currentCategory);
    });


    // Функция для загрузки и отображения новостей
    async function loadAndRenderNews(page, category) {
        let data;
        if (category === 'Все') {
            data = await articleService.getArticlesPaginated(page, ARTICLES_PER_PAGE);
        } else {
            data = await articleService.getArticlesByCategory(category, page, ARTICLES_PER_PAGE);
        }

        renderArticles(data.articles, newsContainer);
        renderPagination(data, paginationContainer, (newPage) => {
            currentPage = newPage;
            loadAndRenderNews(currentPage, currentCategory);
        });
    }

    // Инициализация: загрузка первой страницы новостей
    await loadAndRenderNews(currentPage, currentCategory);
});
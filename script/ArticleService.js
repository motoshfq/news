// script/ArticleService.js

/**
 * Имитирует загрузку данных статей.
 * В реальном приложении это были бы запросы к бэкенду.
 * Здесь мы просто "загружаем" статические JSON-файлы.
 */
class ArticleService {
    constructor() {
        this.articlesData = []; // Здесь будут храниться все загруженные статьи
        this.articleSlugs = [ // Список "slug" файлов статей. Замените на реальные имена ваших файлов.
            "news-1",
            "news-2",
            "news-3",
            "news-4",
            "news-5",
            "news-6",
            "news-7",
            "news-8",
            "news-9",
            "news-10",
            "news-11",
            "news-12",
            // Добавьте больше, по мере создания новых статей
        ];
    }

    /**
     * Загружает все статьи из JSON-файлов.
     * @returns {Promise<Array>} Промис, который разрешается массивом объектов статей.
     */
    async loadAllArticles() {
        if (this.articlesData.length > 0) {
            return this.articlesData; // Если статьи уже загружены, возвращаем их
        }

        const fetchPromises = this.articleSlugs.map(slug =>
            fetch(`/articles/${slug}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Не удалось загрузить статью ${slug}.json: ${response.statusText}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`Ошибка при загрузке статьи ${slug}.json:`, error);
                    return null; // Возвращаем null, чтобы не прерывать загрузку остальных
                })
        );

        this.articlesData = (await Promise.all(fetchPromises)).filter(article => article !== null);
        // Сортируем статьи по дате, от новой к старой
        this.articlesData.sort((a, b) => new Date(b.date) - new Date(a.date));
        return this.articlesData;
    }

    /**
     * Получает статью по её ID (slug).
     * @param {string} id - ID статьи.
     * @returns {Promise<Object|null>} Промис, который разрешается объектом статьи или null, если не найдена.
     */
    async getArticleById(id) {
        await this.loadAllArticles(); // Убеждаемся, что все статьи загружены
        return this.articlesData.find(article => article.id === id) || null;
    }

    /**
     * Получает пагинированный список статей.
     * @param {number} page - Номер страницы (начиная с 1).
     * @param {number} limit - Количество статей на странице.
     * @returns {Promise<Object>} Промис, который разрешается объектом с { articles: [], totalPages: number, currentPage: number }.
     */
    async getArticlesPaginated(page = 1, limit = 6) {
        await this.loadAllArticles();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const articlesOnPage = this.articlesData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.articlesData.length / limit);

        return {
            articles: articlesOnPage,
            totalPages: totalPages,
            currentPage: page
        };
    }

    /**
     * Получает список уникальных категорий.
     * @returns {Promise<Array<string>>} Промис, который разрешается массивом уникальных категорий.
     */
    async getUniqueCategories() {
        await this.loadAllArticles();
        const categories = new Set(this.articlesData.map(article => article.category));
        return Array.from(categories);
    }

    /**
     * Получает статьи по категории.
     * @param {string} category - Категория статьи.
     * @param {number} page - Номер страницы (начиная с 1).
     * @param {number} limit - Количество статей на странице.
     * @returns {Promise<Object>} Промис, который разрешается объектом с { articles: [], totalPages: number, currentPage: number }.
     */
    async getArticlesByCategory(category, page = 1, limit = 6) {
        await this.loadAllArticles();
        const filteredArticles = this.articlesData.filter(article => article.category === category);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const articlesOnPage = filteredArticles.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredArticles.length / limit);

        return {
            articles: articlesOnPage,
            totalPages: totalPages,
            currentPage: page
        };
    }
}
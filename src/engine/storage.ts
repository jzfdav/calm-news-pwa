import type { Article, Section } from './types';

const ARTICLES_KEY = 'calm_news_articles';
const SECTIONS_KEY = 'calm_news_sections';

export function saveArticles(articles: Article[]): void {
    try {
        const existing = loadArticles();
        const map = new Map(existing.map(a => [a.id, a]));
        articles.forEach(a => map.set(a.id, a));
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(Array.from(map.values())));
    } catch (e) {
        console.error('Failed to save articles to localStorage', e);
    }
}

export function loadArticles(): Article[] {
    try {
        const data = localStorage.getItem(ARTICLES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load articles from localStorage', e);
        return [];
    }
}

export function saveSections(sections: Section[]): void {
    try {
        localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
    } catch (e) {
        console.error('Failed to save sections to localStorage', e);
    }
}

export function loadSections(): Section[] {
    try {
        const data = localStorage.getItem(SECTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load sections from localStorage', e);
        return [];
    }
}

export function clearStorage(): void {
    localStorage.removeItem(ARTICLES_KEY);
    localStorage.removeItem(SECTIONS_KEY);
}

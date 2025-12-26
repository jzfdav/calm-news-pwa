import type { Article, Section } from './types';

const ARTICLES_KEY = 'calm_news_articles';
const SECTIONS_KEY = 'calm_news_sections';
const CUSTOM_FEEDS_KEY = 'calm_news_custom_feeds';
const LOCATION_KEY = 'calm_news_location_tracking';
const COMPANY_KEY = 'calm_news_company_tracking';
const READ_ARTICLES_KEY = 'calm_news_read_articles';

export function saveReadArticles(ids: string[]): void {
    try {
        localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(ids));
    } catch (e) {
        console.error('Failed to save read articles', e);
    }
}

export function loadReadArticles(): string[] {
    try {
        const data = localStorage.getItem(READ_ARTICLES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load read articles', e);
        return [];
    }
}

export function saveArticles(articles: Article[]): void {
    try {
        const existing = loadArticles();
        const map = new Map(existing.map(a => [a.id, a]));
        articles.forEach(a => map.set(a.id, a));

        // Prune articles older than 7 days (giving some buffer beyond the 3-day view limit)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() - 7);

        const freshArticles = Array.from(map.values()).filter(a => {
            try {
                return new Date(a.pubDate) > expiryDate;
            } catch {
                return false; // Remove if date is invalid
            }
        });

        // Keep only the most recent 100 articles total for performance
        const sorted = freshArticles.sort((a, b) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        ).slice(0, 100);

        localStorage.setItem(ARTICLES_KEY, JSON.stringify(sorted));
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

export interface CustomFeed {
    id: string;
    name: string;
    url: string;
}

export function saveCustomFeeds(feeds: CustomFeed[]): void {
    try {
        localStorage.setItem(CUSTOM_FEEDS_KEY, JSON.stringify(feeds));
    } catch (e) {
        console.error('Failed to save custom feeds to localStorage', e);
    }
}

export function loadCustomFeeds(): CustomFeed[] {
    try {
        const data = localStorage.getItem(CUSTOM_FEEDS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load custom feeds from localStorage', e);
        return [];
    }
}

export function clearStorage(): void {
    localStorage.removeItem(ARTICLES_KEY);
    localStorage.removeItem(SECTIONS_KEY);
    localStorage.removeItem(CUSTOM_FEEDS_KEY);
    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(COMPANY_KEY);
    localStorage.removeItem(READ_ARTICLES_KEY);
}

export function savePersonalization(key: 'location' | 'company', query: string): void {
    try {
        localStorage.setItem(key === 'location' ? LOCATION_KEY : COMPANY_KEY, query);
    } catch (e) {
        console.error(`Failed to save ${key} personalization`, e);
    }
}

export function loadPersonalization(key: 'location' | 'company'): string {
    try {
        return localStorage.getItem(key === 'location' ? LOCATION_KEY : COMPANY_KEY) || '';
    } catch (e) {
        console.error(`Failed to load ${key} personalization`, e);
        return '';
    }
}

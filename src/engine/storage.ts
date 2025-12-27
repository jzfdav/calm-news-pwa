import type { Article, Section, AppSettings } from './types';

const ARTICLES_KEY = 'calm_news_articles';
const SECTIONS_KEY = 'calm_news_sections';
const CUSTOM_FEEDS_KEY = 'calm_news_custom_feeds';
const LOCATION_KEY = 'calm_news_location_tracking';
const COMPANY_KEY = 'calm_news_company_tracking';
const TOPICS_KEY = 'calm_news_topics';
const READ_ARTICLES_KEY = 'calm_news_read_articles';
const THEME_KEY = 'calm_news_theme';
const FONT_SIZE_KEY = 'calm_news_font_size';
const SETTINGS_KEY = 'calm_news_settings';

export const DEFAULT_SETTINGS: AppSettings = {
    retentionDays: 7,
    maxArticlesPerSection: 10
};

// Helpers
const lsGet = (key: string) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const lsSet = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Storage error for ${key}:`, e);
    }
};

export function saveReadArticles(ids: string[]): void {
    lsSet(READ_ARTICLES_KEY, ids);
}

export function loadReadArticles(): string[] {
    return lsGet(READ_ARTICLES_KEY) || [];
}

export function saveArticles(articles: Article[]): void {
    const existing = loadArticles();
    const map = new Map(existing.map(a => [a.id, a]));
    articles.forEach(a => map.set(a.id, a));

    const settings = loadSettings();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - settings.retentionDays);

    const freshArticles = Array.from(map.values()).filter(a => {
        try {
            return new Date(a.pubDate) > expiryDate;
        } catch {
            return false;
        }
    });

    // Increased global limit to 500 to support longer history
    const sorted = freshArticles.sort((a, b) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    ).slice(0, 500);

    lsSet(ARTICLES_KEY, sorted);
}

export function loadArticles(): Article[] {
    return lsGet(ARTICLES_KEY) || [];
}

export function saveSections(sections: Section[]): void {
    lsSet(SECTIONS_KEY, sections);
}

export function loadSections(): Section[] {
    return lsGet(SECTIONS_KEY) || [];
}

export interface CustomFeed {
    id: string;
    name: string;
    url: string;
}

export function saveCustomFeeds(feeds: CustomFeed[]): void {
    lsSet(CUSTOM_FEEDS_KEY, feeds);
}

export function loadCustomFeeds(): CustomFeed[] | null {
    return lsGet(CUSTOM_FEEDS_KEY);
}

export function clearStorage(): void {
    localStorage.removeItem(ARTICLES_KEY);
    localStorage.removeItem(SECTIONS_KEY);
    localStorage.removeItem(CUSTOM_FEEDS_KEY);
    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(COMPANY_KEY);
    localStorage.removeItem(TOPICS_KEY);
    localStorage.removeItem(READ_ARTICLES_KEY);
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(FONT_SIZE_KEY);
}

// Topics System (v12.0)
export function saveTopics(topics: string[]): void {
    lsSet(TOPICS_KEY, topics);
}

export function loadTopics(): string[] | null {
    try {
        const stored = localStorage.getItem(TOPICS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }

        // Migration: Check for legacy location/company data
        const legacyLoc = localStorage.getItem(LOCATION_KEY);
        const legacyComp = localStorage.getItem(COMPANY_KEY);

        let initialTopics: string[] = [];

        if (legacyLoc) {
            try {
                const parsed = JSON.parse(legacyLoc);
                if (Array.isArray(parsed)) initialTopics.push(...parsed);
                else initialTopics.push(legacyLoc); // Handle even older single string
            } catch {
                initialTopics.push(legacyLoc);
            }
        }

        if (legacyComp) {
            try {
                const parsed = JSON.parse(legacyComp);
                if (Array.isArray(parsed)) initialTopics.push(...parsed);
                else initialTopics.push(legacyComp);
            } catch {
                initialTopics.push(legacyComp);
            }
        }

        if (initialTopics.length > 0) {
            // Save migrated data and clear old keys
            const unique = [...new Set(initialTopics)]; // Dedupe
            saveTopics(unique);
            localStorage.removeItem(LOCATION_KEY);
            localStorage.removeItem(COMPANY_KEY);
            return unique;
        }

        return [];
    } catch (e) {
        console.error('Failed to load topics', e);
        return [];
    }
}

// Cleanup: Remove legacy tracking keys
export function pruneLegacyKeys(): void {
    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(COMPANY_KEY);
}

export function saveTheme(theme: string): void {
    localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): string | null {
    return localStorage.getItem(THEME_KEY);
}

export function saveFontSize(size: string): void {
    localStorage.setItem(FONT_SIZE_KEY, size);
}

export function loadFontSize(): string | null {
    return localStorage.getItem(FONT_SIZE_KEY);
}

export function saveSettings(settings: AppSettings): void {
    lsSet(SETTINGS_KEY, settings);
}

export function loadSettings(): AppSettings {
    return lsGet(SETTINGS_KEY) || DEFAULT_SETTINGS;
}

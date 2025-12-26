import type { CustomFeed } from './storage'

export const DEFAULT_FEEDS: CustomFeed[] = [
    { id: 'guardian-world', name: 'The Guardian', url: 'https://www.theguardian.com/world/rss' },
    { id: 'ars-technica', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    { id: 'npr-news', name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
    { id: 'nyt-world', name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
    { id: 'hn', name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
    { id: 'reuters-intl', name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews' }
];

export const PROXY_URL = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

export const GOOGLE_NEWS_SEARCH = (query: string, region: 'IN' | 'US' = 'IN') => {
    const params = region === 'IN'
        ? 'hl=en-IN&gl=IN&ceid=IN:en'
        : 'hl=en-US&gl=US&ceid=US:en';
    return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${params}`;
};

export const APP_CONFIG = {
    maxArticlesPerSection: 30,
    maxTotalArticles: 200,
    pruneHistoryDays: 5,
};

import type { CustomFeed } from './storage'

export const DEFAULT_FEEDS: CustomFeed[] = [
    { id: 'hn', name: 'Tech & Ideas', url: 'https://news.ycombinator.com/rss' },
    { id: 'bbc', name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { id: 'reuters-intl', name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews' },
    { id: 'reuters-in', name: 'Reuters India', url: 'https://feeds.reuters.com/reuters/INtopNews' },
    { id: 'hindu-in', name: 'The Hindu India', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
    { id: 'express-in', name: 'Indian Express', url: 'https://indianexpress.com/section/india/feed/' },
    { id: 'hindu-all', name: 'The Hindu All', url: 'https://www.thehindu.com/feeder/default.rss' }
];

export const PROXY_URL = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

export const APP_CONFIG = {
    maxArticlesPerSection: 30,
    maxTotalArticles: 200,
    pruneHistoryDays: 5,
};

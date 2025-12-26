import type { CustomFeed } from './storage'

export const DEFAULT_FEEDS: CustomFeed[] = [
    { id: 'ani-india', name: 'ANI India', url: 'https://www.aninews.in/rss/feed/category/national/' },
    { id: 'ani-world', name: 'ANI World', url: 'https://www.aninews.in/rss/feed/category/world-news/' },
    { id: 'ani-sports', name: 'ANI Sports', url: 'https://www.aninews.in/rss/feed/category/sports/' },
    { id: 'ani-tech', name: 'ANI Tech', url: 'https://www.aninews.in/rss/feed/category/science-technology/' },

    { id: 'reuters-india', name: 'Reuters India', url: 'https://news.google.com/rss/search?q=Reuters+India&hl=en-IN&gl=IN&ceid=IN:en' },
    { id: 'reuters-sports', name: 'Reuters Sports', url: 'https://news.google.com/rss/search?q=Reuters+Sports&hl=en-US&gl=US&ceid=US:en' },
    { id: 'reuters-tech', name: 'Reuters Tech', url: 'https://news.google.com/rss/search?q=Reuters+Technology&hl=en-US&gl=US&ceid=US:en' },

    { id: 'the-conversation', name: 'The Conversation', url: 'https://theconversation.com/global/articles.atom' },
    { id: 'dw-news', name: 'DW News', url: 'https://rss.dw.com/xml/rss-en-all' },

    { id: 'ars-technica', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
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

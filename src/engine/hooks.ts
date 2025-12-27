import { useQuery } from '@tanstack/react-query';
import { refreshSections, createDailyDigest } from './digest';
import { loadSections } from './storage';
import { PROXY_URL, GOOGLE_NEWS_SEARCH } from './config';
import type { Section } from './types';
import type { CustomFeed } from './storage';

// Helper to reconstruct the full list of sections including personalized ones
const buildSectionsToFetch = (feeds: CustomFeed[], topics: string[]): Section[] => {
    // Hydrate with existing articles from storage to allow merging
    const savedSections = loadSections();
    const sectionMap = new Map(savedSections.map(s => [s.id, s.articles]));

    const sections: Section[] = feeds.map(f => ({
        id: f.id,
        name: f.name,
        rssUrl: PROXY_URL(f.url),
        articles: sectionMap.get(f.id) || []
    }));

    topics.forEach(topic => {
        if (topic) {
            const id = `topic-${topic}`;
            sections.unshift({
                id,
                name: topic,
                rssUrl: PROXY_URL(GOOGLE_NEWS_SEARCH(topic)),
                articles: sectionMap.get(id) || []
            });
        }
    });

    return sections;
};

export function useNewsFeed(customFeeds: CustomFeed[], topics: string[], isOnline: boolean) {
    return useQuery({
        queryKey: ['digest', customFeeds, topics],
        queryFn: async () => {
            const sections = buildSectionsToFetch(customFeeds, topics);
            const updated = await refreshSections(sections);
            return createDailyDigest(updated);
        },
        // Load initial data from local storage if available to show something immediately
        initialData: () => {
            const savedSections = loadSections();
            if (savedSections.length > 0 && savedSections.some(s => s.articles.length > 0)) {
                return createDailyDigest(savedSections);
            }
            return undefined;
        },
        enabled: (customFeeds.length > 0 || topics.length > 0) && isOnline,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24h
        placeholderData: (prev) => prev, // Keep old data while refetching or offline
    });
}

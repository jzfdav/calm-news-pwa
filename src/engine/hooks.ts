import { useQuery } from '@tanstack/react-query';
import { refreshSections, createDailyDigest } from './digest';
import { loadSections } from './storage';
import { PROXY_URL, GOOGLE_NEWS_SEARCH } from './config';
import type { Section } from './types';
import type { CustomFeed } from './storage';

// Helper to reconstruct the full list of sections including personalized ones
// Helper to reconstruct the full list of sections including personalized ones
// Helper to reconstruct the full list of sections including personalized ones
const buildSectionsToFetch = (feeds: CustomFeed[], topics: string[]): Section[] => {
    const sections: Section[] = feeds.map(f => ({
        id: f.id,
        name: f.name,
        rssUrl: PROXY_URL(f.url),
        articles: []
    }));

    topics.forEach(topic => {
        if (topic) {
            sections.unshift({
                id: `topic-${topic}`,
                name: topic,
                rssUrl: PROXY_URL(GOOGLE_NEWS_SEARCH(topic)), // Uses default 'US' for global reach
                articles: []
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
        enabled: customFeeds.length > 0 && isOnline,
        staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    });
}

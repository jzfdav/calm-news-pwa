import { useQuery } from '@tanstack/react-query';
import { refreshSections, createDailyDigest } from './digest';
import { loadSections } from './storage';
import { PROXY_URL, GOOGLE_NEWS_SEARCH } from './config';
import type { Section } from './types';
import type { CustomFeed } from './storage';

// Helper to reconstruct the full list of sections including personalized ones
// Helper to reconstruct the full list of sections including personalized ones
const buildSectionsToFetch = (feeds: CustomFeed[], locations: string[], companies: string[]): Section[] => {
    const sections: Section[] = feeds.map(f => ({
        id: f.id,
        name: f.name,
        rssUrl: PROXY_URL(f.url),
        articles: []
    }));

    locations.forEach(loc => {
        if (loc) {
            sections.unshift({
                id: `personal-loc-${loc}`,
                name: `Around ${loc}`,
                rssUrl: PROXY_URL(GOOGLE_NEWS_SEARCH(loc, 'IN')),
                articles: []
            });
        }
    });

    companies.forEach(comp => {
        if (comp) {
            sections.unshift({
                id: `personal-comp-${comp}`,
                name: comp.toUpperCase(),
                rssUrl: PROXY_URL(GOOGLE_NEWS_SEARCH(comp, 'US')),
                articles: []
            });
        }
    });

    return sections;
};

export function useNewsFeed(customFeeds: CustomFeed[], locations: string[], companies: string[], isOnline: boolean) {
    return useQuery({
        queryKey: ['digest', customFeeds, locations, companies],
        queryFn: async () => {
            const sections = buildSectionsToFetch(customFeeds, locations, companies);
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

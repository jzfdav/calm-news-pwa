import { useQuery } from '@tanstack/react-query';
import { fetchRSS, parseRSS } from './rss';
import { GOOGLE_NEWS_SEARCH, PROXY_URL } from './config';
import type { Article } from './types';

export interface DiscoveryResult {
    name: string;
    url: string;
    preview: Article[];
}

export function useDiscovery(query: string) {
    return useQuery({
        queryKey: ['discovery', query],
        queryFn: async (): Promise<DiscoveryResult | null> => {
            if (!query.trim()) return null;

            // Use Google News RSS search as the discovery engine
            const rssUrl = GOOGLE_NEWS_SEARCH(query);
            const proxiedUrl = PROXY_URL(rssUrl);

            try {
                const xml = await fetchRSS(proxiedUrl);
                const articles = parseRSS(xml, query);

                return {
                    name: query,
                    url: rssUrl, // This is a high-quality functional feed
                    preview: articles.slice(0, 3) // Show top 3 for preview
                };
            } catch (e) {
                console.error('Discovery failed', e);
                throw new Error('Failed to find a valid feed for this source.');
            }
        },
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 60, // Cache results for 1 hour
    });
}

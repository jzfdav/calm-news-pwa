import type { Section, DailyDigest } from './types';
import { fetchRSS, parseRSS } from './rss';
import { saveArticles, saveSections } from './storage';

export async function refreshSections(sections: Section[]): Promise<Section[]> {
    const updatedSections = await Promise.all(
        sections.map(async (section) => {
            try {
                const xml = await fetchRSS(section.rssUrl);
                const parsed = parseRSS(xml, section.name);

                // Prune old articles (older than 3 days)
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

                const fresh = parsed.filter(a => new Date(a.pubDate) > threeDaysAgo);

                // Limit articles per section for calm experience
                const articlesToSave = fresh.slice(0, 5);

                saveArticles(articlesToSave);

                return {
                    ...section,
                    articles: articlesToSave,
                    lastUpdated: new Date().toISOString()
                };
            } catch (e) {
                console.error(`Failed to refresh section ${section.name} with URL ${section.rssUrl}:`, e);
                return section;
            }
        })
    );

    saveSections(updatedSections);
    return updatedSections;
}

export function createDailyDigest(sections: Section[]): DailyDigest {
    return {
        date: new Date().toISOString().split('T')[0],
        sections: sections.map(s => ({
            ...s,
            // Limit articles per section for calm experience
            articles: s.articles.slice(0, 5)
        }))
    };
}

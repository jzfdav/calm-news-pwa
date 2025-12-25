import type { Section, DailyDigest } from './types';
import { fetchRSS, parseRSS } from './rss';
import { saveArticles, saveSections } from './storage';

export async function refreshSections(sections: Section[]): Promise<Section[]> {
    const updatedSections = await Promise.all(
        sections.map(async (section) => {
            try {
                const xml = await fetchRSS(section.rssUrl);
                const articles = parseRSS(xml, section.name);

                saveArticles(articles);

                return {
                    ...section,
                    articles,
                    lastUpdated: new Date().toISOString()
                };
            } catch (e) {
                console.error(`Failed to refresh section ${section.name}`, e);
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

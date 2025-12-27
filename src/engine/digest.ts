import type { Article, Section, DailyDigest } from './types';
import { fetchRSS, parseRSS } from './rss';
import { saveArticles, saveSections, loadSettings } from './storage';
import { isReadable } from './utils';

export async function refreshSections(sections: Section[]): Promise<Section[]> {
    const allArticlesToSave: Article[] = [];
    const settings = loadSettings();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - settings.retentionDays);

    const updatedSections = await Promise.all(
        sections.map(async (section) => {
            try {
                const xml = await fetchRSS(section.rssUrl);
                const fetched = parseRSS(xml, section.name);

                // Merge fetched with existing to prevent loss
                const articleMap = new Map<string, Article>();

                // 1. Add existing articles first
                section.articles.forEach(a => articleMap.set(a.id, a));

                // 2. Overwrite/Add newly fetched articles
                fetched.forEach(a => articleMap.set(a.id, a));

                // 3. Convert back to array, prune by date, and sort
                // Sort Priority: 1. Full Text (Readable) first, 2. Most recent first
                const merged = Array.from(articleMap.values())
                    .filter(a => {
                        try {
                            return new Date(a.pubDate) > expiryDate;
                        } catch {
                            return false;
                        }
                    })
                    .sort((a, b) => {
                        const scoreA = isReadable(a.content) ? 1 : 0;
                        const scoreB = isReadable(b.content) ? 1 : 0;
                        if (scoreA !== scoreB) return scoreB - scoreA;
                        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
                    });

                // 4. Cap per section based on settings
                const sectionArticles = merged.slice(0, settings.maxArticlesPerSection);
                allArticlesToSave.push(...sectionArticles);

                return {
                    ...section,
                    articles: sectionArticles,
                    lastUpdated: new Date().toISOString()
                };
            } catch (e) {
                console.error(`Failed to refresh section ${section.name}:`, e);
                return section;
            }
        })
    );

    saveArticles(allArticlesToSave);
    saveSections(updatedSections);
    return updatedSections;
}

export function createDailyDigest(sections: Section[]): DailyDigest {
    const settings = loadSettings();
    return {
        date: new Date().toISOString().split('T')[0],
        sections: sections.map(s => {
            // Re-sort just in case sections were modified elsewhere
            const sorted = [...s.articles].sort((a, b) => {
                const scoreA = isReadable(a.content) ? 1 : 0;
                const scoreB = isReadable(b.content) ? 1 : 0;
                if (scoreA !== scoreB) return scoreB - scoreA;
                return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
            });
            return {
                ...s,
                articles: sorted.slice(0, settings.maxArticlesPerSection)
            };
        })
    };
}

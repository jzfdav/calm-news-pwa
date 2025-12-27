import type { Article } from './types';

export async function fetchRSS(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }
    return await response.text();
}

import { decodeHTMLEntities } from './utils'

function cleanHTML(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove unwanted elements
    const unwanted = doc.querySelectorAll('script, style, iframe, object, embed, video, audio');
    unwanted.forEach(el => el.remove());

    // Clean attributes from remaining elements
    const all = doc.querySelectorAll('*');
    all.forEach(el => {
        // Keep only essential attributes
        const attributes = Array.from(el.attributes);
        attributes.forEach(attr => {
            if (!['src', 'href', 'alt', 'title'].includes(attr.name)) {
                el.removeAttribute(attr.name);
            }
        });
    });

    return doc.body.innerHTML;
}

export function parseRSS(xml: string, sourceName: string): Article[] {
    if (!xml) return [];
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');

        // Check for parser errors
        const parserError = doc.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
            console.error('RSS Parsing Error:', parserError[0].textContent);
            return [];
        }

        // Support both RSS (item) and Atom (entry)
        const items = Array.from(doc.querySelectorAll('item, entry'));

        return items.map((item) => {
            const getTagContent = (selectors: string[]) => {
                for (const selector of selectors) {
                    const el = item.querySelector(selector.replace(':', '\\:'));
                    if (el && el.textContent) return el.textContent;

                    const elements = item.getElementsByTagName(selector);
                    if (elements.length > 0 && elements[0].textContent) return elements[0].textContent;
                }
                return null;
            };

            const title = decodeHTMLEntities(getTagContent(['title']) || 'No Title');

            let link = getTagContent(['link']) || '';
            if (!link) {
                const linkEl = item.querySelector('link');
                if (linkEl) link = linkEl.getAttribute('href') || linkEl.textContent || '';
            }

            const description = getTagContent(['description', 'summary', 'atom:summary']) || '';
            const contentRaw = getTagContent(['content:encoded', 'content', 'body', 'atom:content']) || description;

            let thumbnail = '';
            const mediaContent = item.querySelector('media\\:content, content');
            const mediaThumb = item.querySelector('media\\:thumbnail, thumbnail');
            const enclosure = item.querySelector('enclosure[type^="image"]');

            if (mediaContent) thumbnail = mediaContent.getAttribute('url') || '';
            if (!thumbnail && mediaThumb) thumbnail = mediaThumb.getAttribute('url') || '';
            if (!thumbnail && enclosure) thumbnail = enclosure.getAttribute('url') || '';

            const content = contentRaw ? cleanHTML(contentRaw) : '';

            const pubDate = getTagContent(['pubDate', 'published', 'updated', 'dc:date']) || new Date().toISOString();

            // Validate date to prevent sorting crashes
            let finalPubDate = pubDate;
            try {
                if (isNaN(new Date(pubDate).getTime())) {
                    finalPubDate = new Date().toISOString();
                }
            } catch {
                finalPubDate = new Date().toISOString();
            }

            const author = getTagContent(['dc:creator', 'author', 'creator']) || undefined;

            // Stable ID Generation: use link if available, otherwise hash title + source
            let id = link;
            if (!id) {
                const str = `${title}-${sourceName}`;
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                id = `fallback-${Math.abs(hash).toString(36)}`;
            }

            return {
                id,
                title,
                link,
                content,
                pubDate: finalPubDate,
                source: sourceName,
                author,
                thumbnail: thumbnail || undefined,
            };
        });
    } catch (e) {
        console.error('RSS parse crash prevented:', e);
        return [];
    }
}

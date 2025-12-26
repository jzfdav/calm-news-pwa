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
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    // Support both RSS (item) and Atom (entry)
    const items = Array.from(doc.querySelectorAll('item, entry'));

    return items.map((item) => {
        const getTagContent = (selectors: string[]) => {
            for (const selector of selectors) {
                // Try with escaped colon first
                const el = item.querySelector(selector.replace(':', '\\:'));
                if (el && el.textContent) return el.textContent;

                // Fallback: search by tag name
                const elements = item.getElementsByTagName(selector);
                if (elements.length > 0 && elements[0].textContent) return elements[0].textContent;
            }
            return null;
        };

        const title = decodeHTMLEntities(getTagContent(['title']) || 'No Title');

        // Link extraction (Atom links are in href attribute of <link>)
        let link = getTagContent(['link']) || '';
        if (!link) {
            const linkEl = item.querySelector('link');
            if (linkEl) link = linkEl.getAttribute('href') || linkEl.textContent || '';
        }

        const description = getTagContent(['description', 'summary', 'atom:summary']) || '';
        const contentRaw = getTagContent(['content:encoded', 'content', 'body', 'atom:content']) || description;

        // Final fallback: if content is truly empty, show a message
        const content = contentRaw ? cleanHTML(contentRaw) : '';

        const pubDate = getTagContent(['pubDate', 'published', 'updated', 'dc:date']) || new Date().toISOString();
        const author = getTagContent(['dc:creator', 'author', 'creator']) || undefined;

        return {
            id: link || Math.random().toString(36).substring(7),
            title,
            link,
            content,
            pubDate,
            source: sourceName,
            author,
        };
    });
}

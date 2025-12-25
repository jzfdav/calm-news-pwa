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
    const items = doc.querySelectorAll('item');

    return Array.from(items).map((item) => {
        const getTagContent = (selector: string) => {
            // Try with escaped colon first (standard for querySelector)
            const el = item.querySelector(selector.replace(':', '\\:'));
            if (el) return el.textContent;

            // Fallback: search by local name or prefixed name in tag search
            const elements = item.getElementsByTagName(selector);
            if (elements.length > 0) return elements[0].textContent;

            return null;
        };

        const title = decodeHTMLEntities(getTagContent('title') || 'No Title');
        const link = getTagContent('link') || '';
        const description = getTagContent('description') || '';
        const content = getTagContent('content:encoded') || description;
        const pubDate = getTagContent('pubDate') || new Date().toISOString();
        const author = getTagContent('dc:creator') || undefined;

        return {
            id: link || Math.random().toString(36).substring(7),
            title,
            link,
            content: cleanHTML(content),
            pubDate,
            source: sourceName,
            author,
        };
    });
}

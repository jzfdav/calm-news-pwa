import { describe, it, expect } from 'vitest';
import { parseRSS } from './rss';

const MOCK_RSS = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mock Feed</title>
    <item>
      <title>Article 1</title>
      <link>https://example.com/1</link>
      <description>Description 1</description>
      <pubDate>Thu, 25 Dec 2025 12:00:00 GMT</pubDate>
      <dc:creator>Author 1</dc:creator>
    </item>
    <item>
      <title>Article 2</title>
      <link>https://example.com/2</link>
      <content:encoded>Full content 2</content:encoded>
      <pubDate>Thu, 25 Dec 2025 13:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
`.trim();

describe('RSS Ingestion', () => {
    it('should parse simple RSS feed correctly', () => {
        const articles = parseRSS(MOCK_RSS, 'Mock Source');

        expect(articles).toHaveLength(2);

        expect(articles[0].title).toBe('Article 1');
        expect(articles[0].link).toBe('https://example.com/1');
        expect(articles[0].source).toBe('Mock Source');
        expect(articles[0].author).toBe('Author 1');

        expect(articles[1].title).toBe('Article 2');
        expect(articles[1].content).toBe('Full content 2');
    });

    it('should handle missing fields gracefully', () => {
        const emptyRss = '<rss><channel><item></item></channel></rss>';
        const articles = parseRSS(emptyRss, 'Empty');

        expect(articles).toHaveLength(1);
        expect(articles[0].title).toBe('No Title');
        expect(articles[0].source).toBe('Empty');
    });
});

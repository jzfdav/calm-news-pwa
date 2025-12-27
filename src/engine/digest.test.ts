import { describe, it, expect } from 'vitest';
import { createDailyDigest } from './digest';
import type { Section } from './types';

describe('Digest Engine', () => {
    it('should create a daily digest and limit articles', () => {
        const sections: Section[] = [
            {
                id: '1',
                name: 'Section 1',
                rssUrl: '',
                articles: Array(10).fill({ id: 'a', title: 'A', link: '', content: '', pubDate: '', source: 'S' })
            }
        ];

        const digest = createDailyDigest(sections);

        expect(digest.sections[0].articles).toHaveLength(10);
        expect(digest.date).toBe(new Date().toISOString().split('T')[0]);
    });

    it('should prioritize readable articles over snippets', () => {
        const sections: Section[] = [
            {
                id: '1',
                name: 'Section 1',
                rssUrl: '',
                articles: [
                    { id: '1', title: 'Snippet', link: '', content: 'Short', pubDate: '2023-01-02', source: 'S' },
                    { id: '2', title: 'Full', link: '', content: 'A'.repeat(1000), pubDate: '2023-01-01', source: 'S' }
                ]
            }
        ];

        const digest = createDailyDigest(sections);

        // Even though 'Snippet' is newer, 'Full' should be first
        expect(digest.sections[0].articles[0].id).toBe('2');
        expect(digest.sections[0].articles[1].id).toBe('1');
    });
});

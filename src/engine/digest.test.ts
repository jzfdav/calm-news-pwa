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
});

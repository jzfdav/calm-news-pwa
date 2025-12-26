import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveTopics, loadTopics } from './storage';

const TOPICS_KEY = 'calm_news_topics';
const LOCATION_KEY = 'calm_news_location_tracking';
const COMPANY_KEY = 'calm_news_company_tracking';

describe('Storage Engine (Topics & Migration)', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should save and load topics correctly', () => {
        const topics = ['London', 'SpaceX', 'Tennis'];
        saveTopics(topics);

        const loaded = loadTopics();
        expect(loaded).toEqual(topics);
        expect(JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]')).toEqual(topics);
    });

    it('should migrate legacy location and company data', () => {
        // Setup legacy data
        localStorage.setItem(LOCATION_KEY, JSON.stringify(['Reading']));
        localStorage.setItem(COMPANY_KEY, JSON.stringify(['IBM']));

        // Trigger load (which handles migration)
        const loaded = loadTopics();

        // Verify combined result
        expect(loaded).toContain('Reading');
        expect(loaded).toContain('IBM');
        expect(loaded).toHaveLength(2);

        // Verify persistence of new format
        const stored = JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
        expect(stored).toContain('Reading');
        expect(stored).toContain('IBM');

        // Verify cleanup of old keys
        expect(localStorage.getItem(LOCATION_KEY)).toBeNull();
        expect(localStorage.getItem(COMPANY_KEY)).toBeNull();
    });

    it('should handle duplicates during migration', () => {
        localStorage.setItem(LOCATION_KEY, JSON.stringify(['Same']));
        localStorage.setItem(COMPANY_KEY, JSON.stringify(['Same']));

        const loaded = loadTopics();
        expect(loaded).toEqual(['Same']);
    });

    it('should handle legacy string data (pre-array format)', () => {
        localStorage.setItem(LOCATION_KEY, 'OldLocation'); // Not JSON stringified string

        const loaded = loadTopics();
        expect(loaded).toContain('OldLocation');
    });
});

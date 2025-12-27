import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppActions } from './useAppActions';

describe('useAppActions', () => {
    const mockSetCustomFeeds = vi.fn();
    const mockSetTopics = vi.fn();
    const mockSetSettings = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const initialProps = {
        customFeeds: [],
        setCustomFeeds: mockSetCustomFeeds,
        topics: [],
        setTopics: mockSetTopics,
        settings: { retentionDays: 7 },
        setSettings: mockSetSettings
    };

    it('should add a unique topic', () => {
        const { result } = renderHook(() => useAppActions(initialProps));

        act(() => {
            result.current.handleAddTopic('Tech');
        });

        expect(mockSetTopics).toHaveBeenCalledWith(['Tech']);
    });

    it('should not add a duplicate topic', () => {
        const props = { ...initialProps, topics: ['Tech'] };
        const { result } = renderHook(() => useAppActions(props));

        act(() => {
            result.current.handleAddTopic('Tech');
        });

        expect(mockSetTopics).not.toHaveBeenCalled();
    });

    it('should validate empty feed addition', () => {
        const { result } = renderHook(() => useAppActions(initialProps));

        act(() => {
            result.current.handleAddFeed(' ', '');
        });

        expect(mockSetCustomFeeds).not.toHaveBeenCalled();
    });
});

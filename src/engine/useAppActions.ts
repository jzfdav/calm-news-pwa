import { useCallback } from 'react';
import { saveCustomFeeds, saveTopics, saveSettings, type CustomFeed } from './storage';
import { DEFAULT_FEEDS } from './config';

interface AppActionsProps {
    customFeeds: CustomFeed[];
    setCustomFeeds: (feeds: CustomFeed[]) => void;
    topics: string[];
    setTopics: (topics: string[]) => void;
    settings: any;
    setSettings: (settings: any) => void;
}

export function useAppActions({
    customFeeds,
    setCustomFeeds,
    topics,
    setTopics,
    settings,
    setSettings
}: AppActionsProps) {

    const handleAddFeed = useCallback((name: string, url: string) => {
        const trimmedName = name.trim();
        const trimmedUrl = url.trim();

        if (!trimmedName || !trimmedUrl) return;

        // Duplicate prevention by URL
        if (customFeeds.some(f => f.url === trimmedUrl)) {
            console.warn('Feed already exists');
            return;
        }

        const updated = [...customFeeds, {
            name: trimmedName,
            url: trimmedUrl,
            id: Math.random().toString(36).substring(7)
        }];
        setCustomFeeds(updated);
        saveCustomFeeds(updated);
    }, [customFeeds, setCustomFeeds]);

    const handleRemoveFeed = useCallback((id: string) => {
        const updated = customFeeds.filter(f => f.id !== id);
        setCustomFeeds(updated);
        saveCustomFeeds(updated);
    }, [customFeeds, setCustomFeeds]);

    const handleAddTopic = useCallback((topic: string) => {
        const trimmed = topic.trim();
        if (!trimmed) return;

        // Duplicate prevention
        if (topics.includes(trimmed)) {
            console.warn('Topic already exists');
            return;
        }

        const updated = [...topics, trimmed];
        setTopics(updated);
        saveTopics(updated);
    }, [topics, setTopics]);

    const handleRemoveTopic = useCallback((topic: string) => {
        const updated = topics.filter(t => t !== topic);
        setTopics(updated);
        saveTopics(updated);
    }, [topics, setTopics]);

    const handleUpdateSettings = useCallback((newSettings: Partial<typeof settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        saveSettings(updated);
    }, [settings, setSettings]);

    const handleRestoreDefaults = useCallback(() => {
        if (confirm('Restore curated default sources? This will append them to your current library.')) {
            const existingUrls = new Set(customFeeds.map(f => f.url));
            const toAdd = DEFAULT_FEEDS.filter(f => !existingUrls.has(f.url));

            const updated = [...customFeeds, ...toAdd];
            setCustomFeeds(updated);
            saveCustomFeeds(updated);
        }
    }, [customFeeds, setCustomFeeds]);

    return {
        handleAddFeed,
        handleRemoveFeed,
        handleAddTopic,
        handleRemoveTopic,
        handleUpdateSettings,
        handleRestoreDefaults
    };
}

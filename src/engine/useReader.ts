import { useState, useCallback } from 'react';
import {
    loadReadArticles,
    saveReadArticles,
    saveTheme,
    loadTheme,
    saveFontSize,
    loadFontSize
} from './storage';

export type Theme = 'light' | 'dark';
export type FontSize = 's' | 'm' | 'l';

export function useReader() {
    // Default to 'light'
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = loadTheme() as Theme;
        return (saved === 'light' || saved === 'dark') ? saved : 'light';
    });

    const [fontSize, setFontSizeState] = useState<FontSize>(() => (loadFontSize() as FontSize) || 'm');
    const [readArticles, setReadArticles] = useState<Set<string>>(() => new Set(loadReadArticles()));


    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        saveTheme(newTheme);
    }, []);

    const setFontSize = useCallback((newSize: FontSize) => {
        setFontSizeState(newSize);
        saveFontSize(newSize);
    }, []);

    const toggleRead = useCallback((id: string) => {
        setReadArticles(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            saveReadArticles(Array.from(updated));
            return updated;
        });
    }, []);

    return {
        theme,
        setTheme,
        fontSize,
        setFontSize,
        readArticles,
        toggleRead
    };
}

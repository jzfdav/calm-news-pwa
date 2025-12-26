import { useState, useEffect, useCallback } from 'react';
import { loadReadArticles, saveReadArticles } from './storage';

export type Theme = 'light' | 'sepia' | 'dark';
export type FontSize = 's' | 'm' | 'l';

export function useReader() {
    const [theme, setTheme] = useState<Theme>('light');
    const [fontSize, setFontSize] = useState<FontSize>('m');
    const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

    // Load initial read state
    useEffect(() => {
        const saved = loadReadArticles();
        if (saved.length > 0) {
            setReadArticles(new Set(saved));
        }
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

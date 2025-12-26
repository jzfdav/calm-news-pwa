import { useState } from 'react'
import type { Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities } from '../engine/utils'

interface ReaderOverlayProps {
    article: Article;
    theme: 'light' | 'sepia' | 'dark';
    fontSize: 's' | 'm' | 'l';
    setTheme: (t: 'light' | 'sepia' | 'dark') => void;
    setFontSize: (s: 's' | 'm' | 'l') => void;
    onClose: () => void;
    onMarkDone: () => void;
}

export function ReaderOverlay({
    article,
    theme,
    fontSize,
    setTheme,
    setFontSize,
    onClose,
    onMarkDone
}: ReaderOverlayProps) {
    const [showFontMenu, setShowFontMenu] = useState(false);

    const cycleTheme = () => {
        if (theme === 'light') setTheme('sepia');
        else if (theme === 'sepia') setTheme('dark');
        else setTheme('light');
    };

    return (
        <div className={`reader-overlay theme-${theme}`}>
            <div className="reader-content">
                <header className="reader-header">
                    <h1 className="reader-title">{decodeHTMLEntities(article.title)}</h1>
                    <div className="reader-meta">
                        {article.author && <span>{article.author} • </span>}
                        <span>{getReadingTime(article.content)} • </span>
                        <span> • <a href={article.link} target="_blank" rel="noopener noreferrer">Source</a></span>
                    </div>
                </header>

                {article.content ? (
                    <div
                        className={`full-content font-size-${fontSize}`}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                ) : (
                    <div className="empty-content-fallback">
                        <p>We couldn't load the full content for this article.</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="button-primary">
                            Read at Source
                        </a>
                    </div>
                )}

                <div style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '2rem' }}>
                    <button className="button-primary" onClick={onMarkDone}>
                        Mark as Done & Close
                    </button>
                </div>
            </div>

            {showFontMenu && (
                <div className="font-settings-modal">
                    <button
                        className={`font-option ${fontSize === 's' ? 'active' : ''}`}
                        onClick={() => setFontSize('s')}
                    >
                        A-
                    </button>
                    <button
                        className={`font-option ${fontSize === 'm' ? 'active' : ''}`}
                        onClick={() => setFontSize('m')}
                    >
                        A
                    </button>
                    <button
                        className={`font-option ${fontSize === 'l' ? 'active' : ''}`}
                        onClick={() => setFontSize('l')}
                    >
                        A+
                    </button>
                </div>
            )}

            <div className="reader-toolbar">
                <button
                    className="toolbar-btn theme-btn"
                    onClick={cycleTheme}
                    aria-label="Switch Theme"
                >
                    {theme === 'light' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>}
                    {theme === 'sepia' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>}
                    {theme === 'dark' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 1 0 10 10" /></svg>}
                </button>

                <button
                    className={`toolbar-btn font-btn ${showFontMenu ? 'active' : ''}`}
                    onClick={() => setShowFontMenu(!showFontMenu)}
                    aria-label="Font Settings"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v13" /><path d="M12 9v10" />
                    </svg>
                </button>

                <button
                    className="toolbar-btn close-btn"
                    onClick={onClose}
                    aria-label="Close Article"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react'
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
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const cycleTheme = () => {
        if (theme === 'light') setTheme('sepia');
        else if (theme === 'sepia') setTheme('dark');
        else setTheme('light');
    };

    // Handle Image Clicks for Zoom
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                e.preventDefault();
                const img = target as HTMLImageElement;
                setZoomImage(img.src);
            }
        };

        container.addEventListener('click', handleImageClick);
        return () => container.removeEventListener('click', handleImageClick);
    }, [article.content]);

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
                        ref={contentRef}
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

            {/* Image Zoom Modal */}
            {zoomImage && (
                <div className="image-zoom-overlay" onClick={() => setZoomImage(null)}>
                    <button className="zoom-close-btn" onClick={() => setZoomImage(null)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div className="image-zoom-scroll-area">
                        <img
                            src={zoomImage}
                            alt="Zoomed view"
                            className="zoom-image"
                            onClick={(e) => e.stopPropagation()} // Allow panning/clicking image without closing
                        />
                    </div>
                </div>
            )}

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
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>Aa</span>
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

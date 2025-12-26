import type { Article } from '../engine/types'
import { getReadingTime } from '../engine/utils'

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

    return (
        <div className={`reader-overlay theme-${theme}`}>
            <div className="reader-toolbar">
                <div className="reader-controls">
                    <button
                        className={`control-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                    >
                        Light
                    </button>
                    <button
                        className={`control-btn ${theme === 'sepia' ? 'active' : ''}`}
                        onClick={() => setTheme('sepia')}
                    >
                        Sepia
                    </button>
                    <button
                        className={`control-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                    >
                        Dark
                    </button>
                    <span style={{ margin: '0 0.2rem', color: 'var(--secondary-text)', opacity: 0.5 }}>|</span>
                    <button
                        className={`control-btn ${fontSize === 's' ? 'active' : ''}`}
                        onClick={() => setFontSize('s')}
                    >
                        A-
                    </button>
                    <button
                        className={`control-btn ${fontSize === 'm' ? 'active' : ''}`}
                        onClick={() => setFontSize('m')}
                    >
                        A
                    </button>
                    <button
                        className={`control-btn ${fontSize === 'l' ? 'active' : ''}`}
                        onClick={() => setFontSize('l')}
                    >
                        A+
                    </button>
                </div>
                <button className="close-reader" onClick={onClose}>Close</button>
            </div>

            <div className="reader-content">
                <div className="reader-header">
                    <h1>{article.title}</h1>
                    <div className="meta">
                        {article.author ? `${article.author} • ` : ''}
                        {getReadingTime(article.content)} •
                        <a href={article.link} target="_blank" rel="noopener noreferrer">Source</a>
                    </div>
                </div>

                {article.content ? (
                    <div
                        className={`full-content font-size-${fontSize}`}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                ) : (
                    <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                        <p>This article's content isn't available in the feed.</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="button-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                            Read Full Article at Source
                        </a>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
                    <button
                        className="button-primary"
                        onClick={onMarkDone}
                    >
                        Mark as Done & Close
                    </button>
                </div>
            </div>
        </div>
    );
}

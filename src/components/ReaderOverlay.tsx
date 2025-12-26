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
            <div className="reader-content">
                <header className="reader-header">
                    <h1>{article.title}</h1>
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

            <div className="reader-toolbar">
                <div className="reader-controls">
                    <div className="control-group">
                        <button
                            className={`control-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                            aria-label="Light Theme"
                        >
                            L
                        </button>
                        <button
                            className={`control-btn ${theme === 'sepia' ? 'active' : ''}`}
                            onClick={() => setTheme('sepia')}
                            aria-label="Sepia Theme"
                        >
                            S
                        </button>
                        <button
                            className={`control-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                            aria-label="Dark Theme"
                        >
                            D
                        </button>
                    </div>

                    <div className="control-group">
                        <button
                            className={`control-btn ${fontSize === 's' ? 'active' : ''}`}
                            onClick={() => setFontSize('s')}
                            aria-label="Small Font"
                        >
                            A-
                        </button>
                        <button
                            className={`control-btn ${fontSize === 'm' ? 'active' : ''}`}
                            onClick={() => setFontSize('m')}
                            aria-label="Medium Font"
                        >
                            A
                        </button>
                        <button
                            className={`control-btn ${fontSize === 'l' ? 'active' : ''}`}
                            onClick={() => setFontSize('l')}
                            aria-label="Large Font"
                        >
                            A+
                        </button>
                    </div>
                </div>
                <button className="close-reader" onClick={onClose}>Done</button>
            </div>
        </div>
    );
}

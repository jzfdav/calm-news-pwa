import { useState } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities } from '../engine/utils'

const getSourceName = (article: Article) => {
    if (article.source && article.source.trim().length > 0) return article.source;
    try {
        const url = new URL(article.link);
        return url.hostname.replace(/^www\./, '');
    } catch {
        return 'Source';
    }
};

interface DigestViewProps {
    sections: Section[];
    loading: boolean;
    onSelectArticle: (article: Article) => void;
    onToggleRead: (id: string) => void;
}

export function DigestView({ sections, loading, onSelectArticle, onToggleRead }: DigestViewProps) {
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

    const handleDone = (id: string) => {
        setExitingIds(prev => new Set(prev).add(id));
        setTimeout(() => {
            onToggleRead(id);
            setExitingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 600);
    };

    if (loading && sections.length === 0) {
        return <div className="loading">Gathering stories for you...</div>;
    }

    if (sections.length === 0 && !loading) {
        return (
            <div className="empty-state">
                <h2>You are all caught up.</h2>
                <p>Stay calm. Your next update is just a refresh away.</p>
            </div>
        );
    }

    return (
        <main className="digest-view">
            {sections.map((section) => (
                <section key={section.id}>
                    <h2 className="section-title">{section.name}</h2>
                    {section.articles.map((article) => (
                        <article
                            key={article.id}
                            className={`article-card ${exitingIds.has(article.id) ? 'article-exit' : ''}`}
                        >
                            <h3 className="article-card-title">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="article-title-btn"
                                    onClick={() => onSelectArticle(article)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onSelectArticle(article);
                                        }
                                    }}
                                >
                                    {decodeHTMLEntities(article.title)}
                                </div>
                            </h3>
                            <div className="article-card-meta">
                                <span className="meta-time">{getReadingTime(article.content)}</span>
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="meta-source"
                                >
                                    {getSourceName(article)}
                                </a>
                                <button
                                    className="article-action-btn article-done-link"
                                    onClick={() => handleDone(article.id)}
                                >
                                    Done
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            ))}
        </main>
    );
}

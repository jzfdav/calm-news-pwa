import { useState } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime, isReadable, decodeHTMLEntities } from '../engine/utils'

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
        <main>
            {sections.map((section) => (
                <section key={section.id}>
                    <h2>{section.name}</h2>
                    {section.articles.map((article) => (
                        <article
                            key={article.id}
                            className={`article-card ${exitingIds.has(article.id) ? 'article-exit' : ''}`}
                        >
                            <h3 className="article-card-title">
                                <button
                                    className="nav-link"
                                    onClick={() => onSelectArticle(article)}
                                >
                                    {decodeHTMLEntities(article.title)}
                                </button>
                            </h3>
                            <div className="article-card-meta">
                                <div className="article-meta-info">
                                    {isReadable(article.content) && <span className="readability-badge" title="Can be read in-app">Reader</span>}
                                    {article.author && <span className="article-author">{article.author} • </span>}
                                    <span>{getReadingTime(article.content)} • </span>
                                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                                        Source
                                    </a>
                                </div>
                                <button
                                    className="nav-link article-done-link"
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

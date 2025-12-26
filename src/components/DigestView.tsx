import { useState } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime } from '../engine/utils'

interface DigestViewProps {
    sections: Section[];
    loading: boolean;
    onSelectArticle: (article: Article) => void;
    onToggleRead: (id: string) => void;
    onRefresh: () => void;
    isOffline: boolean;
}

export function DigestView({ sections, loading, onSelectArticle, onToggleRead, onRefresh, isOffline }: DigestViewProps) {
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
                <p>"The best time to plant a tree was 20 years ago. The second best time is now."</p>
                <button className="refresh" style={{ marginTop: '2rem' }} onClick={onRefresh} disabled={isOffline}>
                    Check for new stories
                </button>
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
                                    {article.title}
                                </button>
                            </h3>
                            <div className="article-card-meta">
                                {article.author && <span>{article.author} • </span>}
                                <span>{getReadingTime(article.content)} min read • </span>
                                <a href={article.link} target="_blank" rel="noopener noreferrer">
                                    Source
                                </a>
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

import { useState, useEffect } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities } from '../engine/utils'

const getSourceName = (article: Article) => {
    try {
        const url = new URL(article.link);
        return url.hostname.replace(/^www\./, '');
    } catch {
        return article.source || 'Source';
    }
};

interface DigestViewProps {
    sections: Section[];
    loading: boolean;
    onSelectArticle: (article: Article) => void;
}

function DigestSection({
    section,
    onSelectArticle,
    isOpen,
    onToggle
}: {
    section: Section;
    onSelectArticle: (article: Article) => void;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <section className="feed-section">
            <button
                className="section-header-btn"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="section-header-content">
                    <h2 className="section-title">{section.name}</h2>
                    <span className="section-count">{section.articles.length}</span>
                </div>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`chevron ${isOpen ? 'open' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="section-content">
                    {section.articles.map((article) => (
                        <article
                            key={article.id}
                            className="article-card"
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
                                {/* Done button removed to prevent accidental clicks */}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export function DigestView({ sections, loading, onSelectArticle }: DigestViewProps) {
    // State for which sections are open. Default all to true.
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // Initialize state when sections load
    useEffect(() => {
        if (sections.length > 0 && Object.keys(openSections).length === 0) {
            const initial: Record<string, boolean> = {};
            sections.forEach(s => initial[s.id] = true);
            setOpenSections(initial);
        }
    }, [sections]);

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleAll = () => {
        const allOpen = Object.values(openSections).every(v => v);
        const newState: Record<string, boolean> = {};
        sections.forEach(s => newState[s.id] = !allOpen);
        setOpenSections(newState);
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

    // Check if all are currently open to decide button text
    const areAllOpen = sections.length > 0 && sections.every(s => openSections[s.id]);

    return (
        <main className="digest-view">
            <div className="feed-controls">
                <button onClick={toggleAll} className="text-btn">
                    {areAllOpen ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            {sections.map((section) => (
                <DigestSection
                    key={section.id}
                    section={section}
                    onSelectArticle={onSelectArticle}
                    isOpen={!!openSections[section.id]}
                    onToggle={() => toggleSection(section.id)}
                />
            ))}
        </main>
    );
}

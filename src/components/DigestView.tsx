import { useState, useEffect, memo } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities, isReadable } from '../engine/utils'
import { WelcomeCard } from './WelcomeCard'

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
    onGoToSettings: () => void;
}

const ArticleCard = memo(({
    article,
    onSelectArticle
}: {
    article: Article;
    onSelectArticle: (article: Article) => void;
}) => (
    <article className="article-card">
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
            <div className="meta-info-left">
                <span className="meta-time">{getReadingTime(article.content)}</span>
                {isReadable(article.content) ? (
                    <span className="read-badge badge-full">FULL ARTICLE</span>
                ) : (
                    <span className="read-badge badge-snippet">SNIPPET</span>
                )}
            </div>
            <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-source"
            >
                {getSourceName(article)}
            </a>
        </div>
    </article>
));

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
                className={`section-header-btn ${!isOpen ? 'collapsed' : ''}`}
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="section-title-wrapper">
                    <div className="section-header-content">
                        <h2 className="section-title">{section.name}</h2>
                        <span className="section-count">{section.articles.length}</span>
                    </div>
                    {!isOpen && section.articles.length > 0 && (
                        <div className="section-title-peeks">
                            {section.articles.slice(0, 3).map(a => decodeHTMLEntities(a.title)).join(' • ')}
                        </div>
                    )}
                </div>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
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
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onSelectArticle={onSelectArticle}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

const MemoizedDigestSection = memo(DigestSection);

export function DigestView({ sections, loading, onSelectArticle, onGoToSettings }: DigestViewProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // Sync open state when new sections are added (e.g. newly added feed)
    useEffect(() => {
        setOpenSections(prev => {
            const next = { ...prev };
            let changed = false;
            sections.forEach(s => {
                if (!(s.id in next)) {
                    next[s.id] = true; // Default new sections to open
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
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
                <div className="empty-state-content">
                    <h2>You are all caught up.</h2>
                    <p>Stay calm. Your next update is just a refresh away.</p>
                    <div className="empty-state-actions">
                        <button onClick={onGoToSettings} className="outline-btn">
                            Manage Topics & Sources
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Check if all are currently open to decide button text
    const areAllOpen = sections.length > 0 && sections.every(s => openSections[s.id]);

    return (
        <main className="digest-view">
            <WelcomeCard />
            <div className="feed-controls">
                <span className="feed-branding">TODAY'S NEWS</span>
                <button onClick={toggleAll} className="text-btn">
                    {areAllOpen ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            {sections.map((section) => (
                <MemoizedDigestSection
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

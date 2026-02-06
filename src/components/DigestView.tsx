import { useState, useEffect, memo } from 'react'
import type { Section, Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities, isReadable } from '../engine/utils'
import { WelcomeCard } from './WelcomeCard'
import { SwipeableArticle } from './SwipeableArticle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
    onDismissArticle: (article: Article) => void;
    onGoToSettings: () => void;
}

const ArticleCard = memo(({
    article,
    onSelectArticle,
    onDismissArticle
}: {
    article: Article;
    onSelectArticle: (article: Article) => void;
    onDismissArticle: (article: Article) => void;
}) => (
    <SwipeableArticle onDismiss={() => onDismissArticle(article)}>
        <Card className="mb-5 border-border/60 bg-transparent shadow-none">
            <CardContent className="px-0">
                <h3 className="mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto w-full justify-start px-0 py-0 text-left text-base font-bold leading-snug text-foreground hover:opacity-70 sm:text-lg font-[var(--font-serif)]"
                        onClick={() => onSelectArticle(article)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectArticle(article);
                            }
                        }}
                    >
                        {decodeHTMLEntities(article.title)}
                    </Button>
                </h3>
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground sm:text-sm">
                    <div className="flex items-center gap-3">
                        <span>{getReadingTime(article.content)}</span>
                        {isReadable(article.content) ? (
                            <Badge variant="secondary" className="text-[0.65rem] font-bold uppercase tracking-wide">FULL ARTICLE</Badge>
                        ) : (
                            <Badge variant="outline" className="text-[0.65rem] font-bold uppercase tracking-wide">SNIPPET</Badge>
                        )}
                    </div>
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-[15rem] truncate text-muted-foreground/80 underline decoration-1 underline-offset-2"
                    >
                        {getSourceName(article)}
                    </a>
                </div>
            </CardContent>
        </Card>
    </SwipeableArticle>
));

function DigestSection({
    section,
    onSelectArticle,
    onDismissArticle,
    isOpen,
    onToggle
}: {
    section: Section;
    onSelectArticle: (article: Article) => void;
    onDismissArticle: (article: Article) => void;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <section className="feed-section">
            <Accordion type="single" collapsible value={isOpen ? section.id : ''} onValueChange={() => onToggle()}>
                <AccordionItem value={section.id} className="border-0">
                    <AccordionTrigger
                        className="w-full rounded-none border-b border-border/60 px-0 py-2 text-left hover:no-underline data-[state=closed]:rounded-xl data-[state=closed]:border-transparent data-[state=closed]:bg-muted/20 data-[state=closed]:px-4 data-[state=closed]:py-3"
                    >
                        <div className="flex flex-1 flex-col items-start gap-1">
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-xs font-bold uppercase tracking-[0.12rem] text-muted-foreground/80 font-[var(--font-serif)]">{section.name}</h2>
                                <span className="text-xs text-muted-foreground/60">{section.articles.length}</span>
                            </div>
                            {!isOpen && section.articles.length > 0 && (
                                <div className="max-w-[90%] truncate text-xs text-muted-foreground/60">
                                    {section.articles.slice(0, 3).map(a => decodeHTMLEntities(a.title)).join(' • ')}
                                </div>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        {section.articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onSelectArticle={onSelectArticle}
                                onDismissArticle={onDismissArticle}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}

const MemoizedDigestSection = memo(DigestSection);

export function DigestView({ sections, loading, onSelectArticle, onDismissArticle, onGoToSettings }: DigestViewProps) {
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
                    <Button variant="outline" onClick={onGoToSettings}>
                        Manage Topics & Sources
                    </Button>
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
            <div className="flex items-center justify-between pb-4">
                <span className="pl-2 text-xs font-bold uppercase tracking-[0.1rem] text-muted-foreground/70">TODAY'S NEWS</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAll}
                    className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                    {areAllOpen ? 'Collapse All' : 'Expand All'}
                </Button>
            </div>

            {sections.map((section) => (
                <MemoizedDigestSection
                    key={section.id}
                    section={section}
                    onSelectArticle={onSelectArticle}
                    onDismissArticle={onDismissArticle}
                    isOpen={!!openSections[section.id]}
                    onToggle={() => toggleSection(section.id)}
                />
            ))}
        </main>
    );
}

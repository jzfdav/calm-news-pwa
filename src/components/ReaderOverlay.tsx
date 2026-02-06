import { useState, useEffect, useRef } from 'react'
import type { Article } from '../engine/types'
import { getReadingTime, decodeHTMLEntities } from '../engine/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReaderOverlayProps {
    article: Article;
    theme: 'light' | 'dark';
    fontSize: 's' | 'm' | 'l';
    setTheme: (t: 'light' | 'dark') => void;

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
        setTheme(theme === 'light' ? 'dark' : 'light');
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
        <div className="fixed inset-0 z-[1000] h-[100dvh] overflow-y-auto bg-background px-5 pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(10rem+env(safe-area-inset-bottom))] text-foreground">
            <div>
                <header className="mx-auto mb-12 max-w-[700px] text-center">
                    <h1 className="font-[var(--font-serif)] text-3xl font-bold leading-tight text-foreground">{decodeHTMLEntities(article.title)}</h1>
                    <div className="mt-4 text-sm text-muted-foreground font-medium">

                        {article.author && <span>{article.author} • </span>}
                        <span>{getReadingTime(article.content)}</span>
                        <span> • <a href={article.link} target="_blank" rel="noopener noreferrer">Source</a></span>
                    </div>
                </header>

                {article.content ? (
                    <div
                        ref={contentRef}
                        className={`mx-auto max-w-[700px] font-[var(--font-serif)] text-lg leading-relaxed font-size-${fontSize}`}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                ) : (
                    <div className="mx-auto max-w-[700px] rounded-xl border border-border/60 bg-muted/20 p-6 text-center">
                        <p>We couldn't load the full content for this article.</p>
                        <Button asChild className="rounded-full">
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                Read at Source
                            </a>
                        </Button>
                    </div>
                )}

                <div style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '2rem' }}>
                    <Button className="rounded-full" size="lg" onClick={onMarkDone}>
                        Mark as Done & Close
                    </Button>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {zoomImage && (
                <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setZoomImage(null)}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-white hover:bg-white/10"
                        onClick={() => setZoomImage(null)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </Button>
                    <div className="max-h-[85vh] max-w-[90vw] overflow-auto">
                        <img
                            src={zoomImage}
                            alt="Zoomed view"
                            className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Allow panning/clicking image without closing
                        />
                    </div>
                </div>
            )}

            {showFontMenu && (
                <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-1/2 z-[1003] flex -translate-x-1/2 gap-2 rounded-xl border border-border/60 bg-background p-2 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("rounded-lg px-4 font-semibold text-muted-foreground", fontSize === 's' && 'bg-foreground text-background')}
                        onClick={() => setFontSize('s')}
                    >
                        A-
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("rounded-lg px-4 font-semibold text-muted-foreground", fontSize === 'm' && 'bg-foreground text-background')}
                        onClick={() => setFontSize('m')}
                    >
                        A
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("rounded-lg px-4 font-semibold text-muted-foreground", fontSize === 'l' && 'bg-foreground text-background')}
                        onClick={() => setFontSize('l')}
                    >
                        A+
                    </Button>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-[1002] grid grid-cols-3 items-center justify-items-center border-t border-border/60 bg-[var(--nav-bg)] px-5 py-3 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground/80 hover:bg-muted/30"
                    onClick={cycleTheme}
                    aria-label="Switch Theme"
                >
                    {theme === 'light' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>}
                    {theme === 'dark' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>}

                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("rounded-full text-foreground/80 hover:bg-muted/30", showFontMenu && 'bg-muted/40')}
                    onClick={() => setShowFontMenu(!showFontMenu)}
                    aria-label="Font Settings"
                >
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>Aa</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground/80 hover:bg-muted/30"
                    onClick={onClose}
                    aria-label="Close Article"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

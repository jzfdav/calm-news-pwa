import React, { useState, useRef } from 'react';

interface SwipeableArticleProps {
    children: React.ReactNode;
    onDismiss: () => void;
    threshold?: number;
}

export function SwipeableArticle({ children, onDismiss, threshold = 0.3 }: SwipeableArticleProps) {
    const [startX, setStartX] = useState<number | null>(null);
    const [currentX, setCurrentX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isDismissing, setIsDismissing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isDismissing) return;
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null || isDismissing) return;
        const x = e.touches[0].clientX - startX;

        // Add resistance as we swipe further
        const resistance = 0.6;
        setCurrentX(x * resistance);
    };

    const handleTouchEnd = () => {
        if (startX === null || !containerRef.current || isDismissing) return;

        const width = containerRef.current.offsetWidth;
        const ratio = Math.abs(currentX) / width;

        if (ratio > threshold) {
            setIsDismissing(true);
            // Move completely out of view for the horizontal exit
            setCurrentX(currentX > 0 ? width + 50 : -width - 50);

            // Allow horizontal exit to finish before vertical collapse
            setTimeout(() => {
                onDismiss();
            }, 400);
        } else {
            setCurrentX(0);
        }

        setStartX(null);
        setIsSwiping(false);
    };

    const swipeRatio = containerRef.current
        ? Math.min(Math.abs(currentX) / (containerRef.current.offsetWidth * threshold), 1.2)
        : 0;

    const swipeDirection = currentX > 0 ? 'right' : 'left';
    const isPastThreshold = swipeRatio >= 1;

    return (
        <div
            ref={containerRef}
            className={`swipeable-container ${isSwiping ? 'swiping' : ''} ${isDismissing ? 'dismissing' : ''} ${isPastThreshold ? 'past-threshold' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                maxHeight: isDismissing ? '0' : '500px',
                opacity: isDismissing ? 0 : 1,
                transform: isDismissing ? 'scale(0.95)' : 'scale(1)',
                transition: isDismissing
                    ? 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.4s'
                    : isSwiping ? 'none' : 'max-height 0.3s, opacity 0.3s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div
                className={`swipe-background ${swipeDirection}`}
                style={{
                    opacity: isDismissing ? 0 : Math.min(swipeRatio, 1),
                }}
            >
                <div
                    className="swipe-indicator"
                    style={{
                        transform: `scale(${isPastThreshold ? 1 + (swipeRatio - 1) * 0.2 : swipeRatio})`,
                        transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    <div className="icon-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <span>DONE</span>
                </div>
            </div>

            <div
                className="swipe-content"
                style={{
                    transform: `translateX(${currentX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: isSwiping ? `grayscale(${Math.min(swipeRatio * 0.5, 0.5)})` : 'none'
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default SwipeableArticle;

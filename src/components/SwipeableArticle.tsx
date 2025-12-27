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
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null) return;
        const x = e.touches[0].clientX - startX;
        setCurrentX(x);
    };

    const handleTouchEnd = () => {
        if (startX === null || !containerRef.current) return;

        const width = containerRef.current.offsetWidth;
        const ratio = Math.abs(currentX) / width;

        if (ratio > threshold) {
            // Dismiss
            onDismiss();
        } else {
            // Reset
            setCurrentX(0);
        }

        setStartX(null);
        setIsSwiping(false);
    };

    // Calculate opacity based on swipe progress
    const opacity = Math.min(Math.abs(currentX) / 100, 0.6);
    const swipeDirection = currentX > 0 ? 'right' : 'left';

    return (
        <div
            ref={containerRef}
            className={`swipeable-container ${isSwiping ? 'swiping' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className={`swipe-background ${swipeDirection}`}
                style={{ opacity }}
            >
                <div className="swipe-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>DONE</span>
                </div>
            </div>

            <div
                className="swipe-content"
                style={{
                    transform: `translateX(${currentX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default SwipeableArticle;

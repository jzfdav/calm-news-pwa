import { useState, useEffect } from 'react';

export function WelcomeCard() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('calm_news_welcome_dismissed');
        if (!dismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('calm_news_welcome_dismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="welcome-card">
            <div className="welcome-card-header">
                <h3>Welcome to your quiet space</h3>
                <button className="dismiss-btn" onClick={handleDismiss} title="Dismiss">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div className="welcome-card-body">
                <div className="tip">
                    <span className="tip-icon">📰</span>
                    <p>Tap any headline to read the full article calmly.</p>
                </div>
                <div className="tip">
                    <span className="tip-icon">🔄</span>
                    <p>Refresh anytime for the latest curated stories.</p>
                </div>
                <div className="tip">
                    <span className="tip-icon">⚙️</span>
                    <p>Add your own sources and topics in Settings.</p>
                </div>
            </div>
        </div>
    );
}

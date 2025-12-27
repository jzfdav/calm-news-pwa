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
            <div className="welcome-card-content">
                <div className="welcome-header">
                    <h3>Welcome to your quiet space</h3>
                </div>

                <div className="welcome-body">
                    <div className="welcome-tip">
                        <p>Tap a headline to read calmly in reader mode.</p>
                    </div>
                    <div className="welcome-tip">
                        <p>Refresh anytime for the latest curated stories.</p>
                    </div>
                    <div className="welcome-tip">
                        <p>Customize your library and topics in Settings.</p>
                    </div>
                </div>

                <div className="welcome-footer">
                    <button className="dismiss-text-btn" onClick={handleDismiss}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

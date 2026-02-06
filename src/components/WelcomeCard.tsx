import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function WelcomeCard() {
    const [isVisible, setIsVisible] = useState(() => !localStorage.getItem('calm_news_welcome_dismissed'));



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
                    <Button
                        variant="ghost"
                        size="sm"
                        className="uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground"
                        onClick={handleDismiss}
                    >
                        Got it
                    </Button>
                </div>
            </div>
        </div>
    );
}

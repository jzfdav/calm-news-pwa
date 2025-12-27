import { SUGGESTED_TOPICS } from '../engine/config';

interface OnboardingModalProps {
    onAddTopic: (topic: string) => void;
    currentTopics: string[];
}

export function OnboardingModal({ onAddTopic, currentTopics }: OnboardingModalProps) {
    const availableSuggestions = SUGGESTED_TOPICS.filter(t => !currentTopics.includes(t));

    if (availableSuggestions.length === 0) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-container">
                <div className="onboarding-header">
                    <h2>Welcome to Calm News</h2>
                    <p className="meta">A quiet, focused space for the things you care about.</p>
                </div>

                <div className="onboarding-body">
                    <p className="onboarding-prompt">What would you like to read about today?</p>
                    <div className="topic-suggestions">
                        {availableSuggestions.map(topic => (
                            <button
                                key={topic}
                                className="suggestion-chip"
                                onClick={() => onAddTopic(topic)}
                            >
                                <span className="plus">+</span> {topic}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="onboarding-footer">
                    <p className="meta center">You can always add custom sources and topics later in settings.</p>
                </div>
            </div>
        </div>
    );
}

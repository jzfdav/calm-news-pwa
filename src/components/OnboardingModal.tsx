import { SUGGESTED_TOPICS } from '../engine/config';
import { Button } from '@/components/ui/button';

interface OnboardingModalProps {
    onAddTopic: (topic: string) => void;
    currentTopics: string[];
}

export function OnboardingModal({ onAddTopic, currentTopics }: OnboardingModalProps) {
    const availableSuggestions = SUGGESTED_TOPICS.filter(t => !currentTopics.includes(t));

    if (availableSuggestions.length === 0) return null;

    return (
        <div className="onboarding-view">
            <div className="onboarding-content">
                <div className="onboarding-header">
                    <h2>Welcome to Calm News</h2>
                    <p>A quiet space for the things you care about.</p>
                </div>

                <div className="onboarding-body">
                    <p className="onboarding-prompt">What's on your mind today?</p>
                    <div className="topic-suggestions">
                        {availableSuggestions.map(topic => (
                            <Button
                                variant="outline"
                                size="sm"
                                key={topic}
                                className="rounded-full px-5 py-2 text-sm font-normal transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                onClick={() => onAddTopic(topic)}
                            >
                                {topic}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="onboarding-footer">
                    <p className="meta center">You can add custom sources and topics in settings.</p>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react'
import type { CustomFeed } from '../engine/storage'

interface SettingsViewProps {
    customFeeds: CustomFeed[];
    topics: string[];
    onAddTopic: (val: string) => void;
    onRemoveTopic: (val: string) => void;
    onAddFeed: (name: string, url: string) => void;
    onRemoveFeed: (id: string) => void;
    onReset: () => void;
}

export function SettingsView({
    customFeeds,
    topics,
    onAddTopic,
    onRemoveTopic,
    onAddFeed,
    onRemoveFeed,
    onReset
}: SettingsViewProps) {
    const [newFeed, setNewFeed] = useState({ name: '', url: '' });
    const [topicInput, setTopicInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFeed.name && newFeed.url) {
            onAddFeed(newFeed.name, newFeed.url);
            setNewFeed({ name: '', url: '' });
        }
    };

    const handleAddTopic = () => {
        if (topicInput.trim()) {
            onAddTopic(topicInput);
            setTopicInput('');
        }
    };

    return (
        <main className="settings-view">
            <section className="settings-section">
                <div className="section-header">
                    <h2>My Library</h2>
                    <p className="meta">{customFeeds.length} source{customFeeds.length !== 1 ? 's' : ''} currently active</p>
                </div>

                <div className="feeds-grid">
                    {customFeeds.map(feed => (
                        <div key={feed.id} className="feed-card">
                            <div className="feed-card-main">
                                <span className="feed-name">{feed.name}</span>
                                <span className="feed-url" title={feed.url}>{feed.url}</span>
                            </div>
                            <button
                                className="button-icon-danger"
                                onClick={() => onRemoveFeed(feed.id)}
                                aria-label={`Remove ${feed.name}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    ))}
                </div>

                <form className="add-feed-card" onSubmit={handleSubmit}>
                    <h3>Add a new source</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="feed-name">Name</label>
                            <input
                                id="feed-name"
                                type="text"
                                value={newFeed.name}
                                onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                                placeholder="e.g. Science Daily"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="feed-url">RSS URL</label>
                            <input
                                id="feed-url"
                                type="url"
                                value={newFeed.url}
                                onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                                placeholder="https://example.com/rss"
                                required
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                        <button type="submit" className="button-primary">Add to Library</button>
                    </div>
                </form>
            </section>

            <section className="settings-section">
                <div className="section-header">
                    <h2>My Topics</h2>
                    <p className="meta">Track events, places, or companies</p>
                </div>

                <div className="feeds-grid">
                    {topics.map(topic => (
                        <div key={topic} className="feed-card">
                            <div className="feed-card-main">
                                <span className="feed-name">{topic}</span>
                                <span className="feed-url">Topic</span>
                            </div>
                            <button
                                className="button-icon-danger"
                                onClick={() => onRemoveTopic(topic)}
                                aria-label={`Remove ${topic}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="add-feed-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="track-topic">Add Topic</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    id="track-topic"
                                    type="text"
                                    value={topicInput}
                                    onChange={e => setTopicInput(e.target.value)}
                                    placeholder="e.g. Reading UK, IBM, Tennis"
                                    aria-label="Topic to track"
                                />
                                <button className="button-primary" onClick={handleAddTopic} style={{ padding: '0.8rem 1.2rem' }}>
                                    Add
                                </button>
                            </div>
                            <p className="input-hint">Search for news about anything within your global context.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="settings-section danger-section" style={{ marginTop: '6rem' }}>
                <div className="section-header">
                    <h2>Advanced</h2>
                    <p className="meta">Manage your local storage and cache</p>
                </div>
                <div className="danger-zone">
                    <p>Resetting will clear all your custom feeds and cached articles.</p>
                    <button className="button-danger" onClick={onReset}>Clear All Library Data</button>
                </div>
            </section>
        </main>
    );
}

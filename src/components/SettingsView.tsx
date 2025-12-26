import { useState } from 'react'
import type { CustomFeed } from '../engine/storage'

interface SettingsViewProps {
    customFeeds: CustomFeed[];
    onAddFeed: (name: string, url: string) => void;
    onRemoveFeed: (id: string) => void;
    onReset: () => void;
}

export function SettingsView({ customFeeds, onAddFeed, onRemoveFeed, onReset }: SettingsViewProps) {
    const [newFeed, setNewFeed] = useState({ name: '', url: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFeed.name && newFeed.url) {
            onAddFeed(newFeed.name, newFeed.url);
            setNewFeed({ name: '', url: '' });
        }
    };

    return (
        <main className="settings-container">
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
                                className="button-text-danger"
                                onClick={() => onRemoveFeed(feed.id)}
                                aria-label={`Remove ${feed.name}`}
                            >
                                Remove
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

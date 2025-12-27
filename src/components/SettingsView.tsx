import { useState } from 'react'
import type { CustomFeed } from '../engine/storage'
import type { AppSettings } from '../engine/types'

interface SettingsViewProps {
    customFeeds: CustomFeed[];
    topics: string[];
    settings: AppSettings;
    onAddTopic: (val: string) => void;
    onRemoveTopic: (val: string) => void;
    onAddFeed: (name: string, url: string) => void;
    onRemoveFeed: (id: string) => void;
    onUpdateSettings: (s: Partial<AppSettings>) => void;
    onRestoreDefaults: () => void;
    onReset: () => void;
}

export function SettingsView({
    customFeeds,
    topics,
    settings,
    onAddTopic,
    onRemoveTopic,
    onAddFeed,
    onRemoveFeed,
    onUpdateSettings,
    onRestoreDefaults,
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
                    <h2>Content & Retention</h2>
                    <p className="meta">Control how much and how long stories stay</p>
                </div>

                <div className="add-feed-card" style={{ marginBottom: '2rem' }}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label>Story Retention</label>
                            <span className="value-label">{settings.retentionDays} Days</span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="14"
                            step="1"
                            value={settings.retentionDays}
                            onChange={(e) => onUpdateSettings({ retentionDays: parseInt(e.target.value) })}
                            className="slider"
                        />
                        <p className="input-hint">Keep news history for a calm look-back experience.</p>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label>Section Density</label>
                            <span className="value-label">{settings.maxArticlesPerSection} Stories</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="20"
                            step="5"
                            value={settings.maxArticlesPerSection}
                            onChange={(e) => onUpdateSettings({ maxArticlesPerSection: parseInt(e.target.value) })}
                            className="slider"
                        />
                        <p className="input-hint">Maximum number of stories visible per section on the landing page.</p>
                    </div>
                </div>
            </section>

            <section className="settings-section">
                <div className="section-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <div>
                            <h2>My Library</h2>
                            <p className="meta">{customFeeds.length} source{customFeeds.length !== 1 ? 's' : ''} currently active</p>
                        </div>
                        <button className="text-btn active" onClick={onRestoreDefaults} style={{ fontSize: '0.8rem', paddingBottom: '0.2rem' }}>
                            Restore Defaults
                        </button>
                    </div>
                </div>

                <div className="feeds-grid">
                    {customFeeds.map(feed => (
                        <div key={feed.id} className="feed-card">
                            <div className="feed-card-main">
                                <span className="feed-name">{feed.name}</span>
                                <span className="feed-url">{feed.url}</span>
                            </div>
                            <div className="feed-action-bar">
                                <button
                                    className="button-text-danger"
                                    onClick={() => onRemoveFeed(feed.id)}
                                >
                                    Remove Source
                                </button>
                            </div>
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
                            <div className="feed-action-bar">
                                <button
                                    className="button-text-danger"
                                    onClick={() => onRemoveTopic(topic)}
                                >
                                    Remove Topic
                                </button>
                            </div>
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

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
        <main>
            <section>
                <h2>My Feeds</h2>
                <ul className="settings-list">
                    {customFeeds.map(feed => (
                        <li key={feed.id} className="settings-item">
                            <div className="settings-item-info">
                                <span className="settings-item-name">{feed.name}</span>
                                <span className="settings-item-url">{feed.url}</span>
                            </div>
                            <button className="button-danger" onClick={() => onRemoveFeed(feed.id)}>Remove</button>
                        </li>
                    ))}
                </ul>

                <form className="add-feed-form" onSubmit={handleSubmit}>
                    <h3>Add New Feed</h3>
                    <div className="form-group">
                        <label>Feed Name</label>
                        <input
                            type="text"
                            value={newFeed.name}
                            onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                            placeholder="e.g. My Favorite Blog"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>RSS URL</label>
                        <input
                            type="url"
                            value={newFeed.url}
                            onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                            placeholder="https://example.com/rss"
                            required
                        />
                    </div>
                    <button type="submit" className="button-primary">Add Feed</button>
                </form>
            </section>

            <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h2>System</h2>
                <button className="button-danger" onClick={onReset}>Reset All Data (Danger Zone)</button>
            </section>
        </main>
    );
}

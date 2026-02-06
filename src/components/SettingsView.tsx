import { useState } from 'react'
import { DiscoverModal } from './DiscoverModal'
import type { CustomFeed } from '../engine/storage'
import type { AppSettings } from '../engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

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
    const [showDiscover, setShowDiscover] = useState(false);

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
                    <h2>My Topics</h2>
                    <p className="meta">Track events, places, or companies</p>
                </div>

                <div className="feeds-grid">
                    {topics.map(topic => (
                        <Card key={topic} className="feed-card border-border/60 bg-transparent shadow-none">
                            <CardContent className="feed-card-main px-0">
                                <span className="feed-name">{topic}</span>
                                <span className="feed-url">Topic</span>
                            </CardContent>
                            <div className="feed-action-bar">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="uppercase tracking-widest text-xs text-destructive hover:text-destructive"
                                    onClick={() => onRemoveTopic(topic)}
                                >
                                    Remove Topic
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="add-feed-card border-border/60">
                    <CardContent className="form-grid px-0">
                        <div className="form-group">
                            <label htmlFor="track-topic">Add Topic</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Input
                                    id="track-topic"
                                    type="text"
                                    value={topicInput}
                                    onChange={e => setTopicInput(e.target.value)}
                                    placeholder="e.g. Reading UK, IBM, Tennis"
                                    aria-label="Topic to track"
                                />
                                <Button className="rounded-full" size="lg" onClick={handleAddTopic}>
                                    Add
                                </Button>
                            </div>
                            <p className="input-hint">Search for news about anything within your global context.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="settings-section">
                <div className="section-header">
                    <h2>Content & Retention</h2>
                    <p className="meta">Control how much and how long stories stay</p>
                </div>

                <Card className="add-feed-card border-border/60" style={{ marginBottom: '2rem' }}>
                    <CardContent className="px-0">
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label>Story Retention</label>
                            <span className="value-label">{settings.retentionDays} Days</span>
                        </div>
                        <Slider
                            min={3}
                            max={14}
                            step={1}
                            value={[settings.retentionDays]}
                            onValueChange={(value) => onUpdateSettings({ retentionDays: value[0] ?? settings.retentionDays })}
                            className="slider"
                        />
                        <p className="input-hint">Keep news history for a calm look-back experience.</p>
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label>Section Density</label>
                            <span className="value-label">{settings.maxArticlesPerSection} Stories</span>
                        </div>
                        <Slider
                            min={5}
                            max={20}
                            step={5}
                            value={[settings.maxArticlesPerSection]}
                            onValueChange={(value) => onUpdateSettings({ maxArticlesPerSection: value[0] ?? settings.maxArticlesPerSection })}
                            className="slider"
                        />
                        <p className="input-hint">Maximum number of stories visible per section on the landing page.</p>
                    </div>
                    </CardContent>
                </Card>
            </section>

            <section className="settings-section">
                <div className="section-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <div>
                            <h2>My Library</h2>
                            <p className="meta">{customFeeds.length} source{customFeeds.length !== 1 ? 's' : ''} currently active</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => setShowDiscover(true)}
                            >
                                Discover Sources
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground opacity-60"
                                onClick={onRestoreDefaults}
                            >
                                Restore Defaults
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="feeds-grid">
                    {customFeeds.map(feed => (
                        <Card key={feed.id} className="feed-card border-border/60 bg-transparent shadow-none">
                            <CardContent className="feed-card-main px-0">
                                <span className="feed-name">{feed.name}</span>
                                <span className="feed-url">{feed.url}</span>
                            </CardContent>
                            <div className="feed-action-bar">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="uppercase tracking-widest text-xs text-destructive hover:text-destructive"
                                    onClick={() => onRemoveFeed(feed.id)}
                                >
                                    Remove Source
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="add-feed-card border-border/60">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle>Add a new source</CardTitle>
                        <CardDescription>Provide a name and RSS URL to add it to your library.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form className="form-grid" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="feed-name">Name</label>
                                <Input
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
                                <Input
                                    id="feed-url"
                                    type="url"
                                    value={newFeed.url}
                                    onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                                    placeholder="https://example.com/rss"
                                    required
                                />
                            </div>
                            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                <Button type="submit" className="rounded-full" size="lg">Add to Library</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>


            <section className="settings-section danger-section" style={{ marginTop: '6rem' }}>
                <div className="section-header">
                    <h2>Advanced</h2>
                    <p className="meta">Manage your local storage and cache</p>
                </div>
                <Card className="danger-zone border-border/60">
                    <CardContent className="space-y-4 px-0">
                    <p>Resetting will clear all your custom feeds and cached articles.</p>
                    <Button variant="destructive" className="rounded-full" onClick={onReset}>Clear All Library Data</Button>
                    </CardContent>
                </Card>
            </section>

            {showDiscover && (
                <DiscoverModal
                    onClose={() => setShowDiscover(false)}
                    onAddFeed={onAddFeed}
                />
            )}
        </main>
    );
}

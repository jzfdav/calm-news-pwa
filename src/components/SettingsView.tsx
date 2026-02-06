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
        <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6">
            <section className="mb-24">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-foreground">My Topics</h2>
                    <p className="meta">Track events, places, or companies</p>
                </div>

                <div className="flex flex-col gap-2 mb-16">
                    {topics.map(topic => (
                        <Card key={topic} className="border-0 border-b border-border/60 bg-transparent shadow-none rounded-none py-6">
                            <CardContent className="px-0">
                                <span className="block text-lg font-semibold mb-1">{topic}</span>
                                <span className="block text-sm text-muted-foreground/80">Topic</span>
                            </CardContent>
                            <div className="flex justify-start">
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

                <Card className="mt-12 rounded-2xl border-border/60 bg-muted/20 shadow-inner">
                    <CardContent className="px-0">
                        <div>
                            <label htmlFor="track-topic" className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Topic</label>
                            <div className="flex gap-2">
                                <Input
                                    id="track-topic"
                                    type="text"
                                    value={topicInput}
                                    onChange={e => setTopicInput(e.target.value)}
                                    placeholder="e.g. Reading UK, IBM, Tennis"
                                    aria-label="Topic to track"
                                    className="bg-muted/20 border-border/60"
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

            <section className="mb-24">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-foreground">Content & Retention</h2>
                    <p className="meta">Control how much and how long stories stay</p>
                </div>

                <Card className="rounded-2xl border-border/60 bg-muted/20 shadow-inner">
                    <CardContent className="px-0">
                    <div className="mb-8">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Story Retention</label>
                            <span className="text-sm font-bold text-primary">{settings.retentionDays} Days</span>
                        </div>
                        <Slider
                            min={3}
                            max={14}
                            step={1}
                            value={[settings.retentionDays]}
                            onValueChange={(value) => onUpdateSettings({ retentionDays: value[0] ?? settings.retentionDays })}
                            className="py-2"
                        />
                        <p className="input-hint">Keep news history for a calm look-back experience.</p>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Section Density</label>
                            <span className="text-sm font-bold text-primary">{settings.maxArticlesPerSection} Stories</span>
                        </div>
                        <Slider
                            min={5}
                            max={20}
                            step={5}
                            value={[settings.maxArticlesPerSection]}
                            onValueChange={(value) => onUpdateSettings({ maxArticlesPerSection: value[0] ?? settings.maxArticlesPerSection })}
                            className="py-2"
                        />
                        <p className="input-hint">Maximum number of stories visible per section on the landing page.</p>
                    </div>
                    </CardContent>
                </Card>
            </section>

            <section className="mb-24">
                <div className="mb-10">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">My Library</h2>
                            <p className="meta">{customFeeds.length} source{customFeeds.length !== 1 ? 's' : ''} currently active</p>
                        </div>
                        <div className="flex gap-3">
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

                <div className="flex flex-col gap-2 mb-16">
                    {customFeeds.map(feed => (
                        <Card key={feed.id} className="border-0 border-b border-border/60 bg-transparent shadow-none rounded-none py-6">
                            <CardContent className="px-0">
                                <span className="block text-lg font-semibold mb-1">{feed.name}</span>
                                <span className="block text-sm text-muted-foreground/80 break-words">{feed.url}</span>
                            </CardContent>
                            <div className="flex justify-start">
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

                <Card className="mt-12 rounded-2xl border-border/60 bg-muted/20 shadow-inner">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-lg">Add a new source</CardTitle>
                        <CardDescription>Provide a name and RSS URL to add it to your library.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="feed-name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                                <Input
                                    id="feed-name"
                                    type="text"
                                    value={newFeed.name}
                                    onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                                    placeholder="e.g. Science Daily"
                                    required
                                    className="bg-muted/20 border-border/60"
                                />
                            </div>
                            <div>
                                <label htmlFor="feed-url" className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">RSS URL</label>
                                <Input
                                    id="feed-url"
                                    type="url"
                                    value={newFeed.url}
                                    onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                                    placeholder="https://example.com/rss"
                                    required
                                    className="bg-muted/20 border-border/60"
                                />
                            </div>
                            <div className="text-right">
                                <Button type="submit" className="rounded-full" size="lg">Add to Library</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>


            <section className="mt-24">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-foreground">Advanced</h2>
                    <p className="meta">Manage your local storage and cache</p>
                </div>
                <Card className="border-dashed border-border/60 bg-destructive/5 text-center">
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

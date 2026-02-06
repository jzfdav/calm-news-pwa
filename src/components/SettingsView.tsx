import { useState } from 'react'
import { DiscoverModal } from './DiscoverModal'
import type { CustomFeed } from '../engine/storage'
import type { AppSettings } from '../engine/types'
import type { Theme } from '../engine/useReader'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    onUpdateSettings: (updates: Partial<AppSettings>) => void;
    onRestoreDefaults: () => void;
    onReset: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
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
    onReset,
    theme,
    onThemeChange
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
        <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">

            <section className="mb-12">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">My Topics</h2>
                    <p className="text-sm text-muted-foreground tracking-tight">Track events, places, or companies</p>
                </div>


                <div className="flex flex-wrap gap-2 mb-6">
                    {topics.map(topic => (
                        <div key={topic} className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 transition-colors hover:bg-muted/60">

                            <span className="text-sm font-medium">{topic}</span>
                            <button
                                onClick={() => onRemoveTopic(topic)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label={`Remove ${topic}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {topics.length === 0 && (
                        <p className="text-sm text-muted-foreground/40 italic">No topics tracked yet.</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Input
                        id="track-topic"
                        type="text"
                        value={topicInput}
                        onChange={e => setTopicInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                        placeholder="e.g. Reading UK, IBM, Tennis"
                        aria-label="Topic to track"
                        className="bg-muted/20 border-border/60 h-10"
                    />
                    <Button className="rounded-full shadow-sm shadow-primary/20" size="sm" onClick={handleAddTopic}>
                        Add
                    </Button>
                </div>
            </section>


            <section className="mb-12">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Appearance</h2>
                    <p className="text-sm text-muted-foreground tracking-tight">Choose your preferred theme</p>
                </div>

                <div className="relative inline-flex w-full rounded-full bg-muted/30 p-1 shadow-inner">
                    <div
                        className="absolute top-1 bottom-1 left-1 transition-transform duration-200 ease-out"
                        style={{
                            transform: theme === 'dark' ? 'translateX(calc(100% + 2px))' : 'translateX(0)',
                            width: 'calc(50% - 2px)'
                        }}

                    >
                        <div className="h-full w-full rounded-full bg-primary shadow-sm" />
                    </div>
                    <button
                        onClick={() => onThemeChange('light')}
                        className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            theme === 'light' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                            </svg>
                            Light
                        </span>
                    </button>
                    <button
                        onClick={() => onThemeChange('dark')}
                        className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            theme === 'dark' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                            Dark
                        </span>
                    </button>
                </div>
            </section>




            <section className="mb-12">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Content & Retention</h2>
                    <p className="text-sm text-muted-foreground tracking-tight">Control how long stories stay and how many you see</p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-border/60 bg-muted/30 p-6 shadow-sm">

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Retention</label>
                            <span className="text-sm font-bold text-primary">{settings.retentionDays} Days</span>
                        </div>
                        <Slider
                            min={3}
                            max={14}
                            step={1}
                            value={[settings.retentionDays]}
                            onValueChange={(value) => onUpdateSettings({ retentionDays: value[0] ?? settings.retentionDays })}
                            className="py-1"
                        />
                        <p className="text-[0.7rem] text-muted-foreground font-medium leading-tight">Keep news history for a calm look-back experience.</p>
</div>


                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Density</label>
                            <span className="text-sm font-bold text-primary">{settings.maxArticlesPerSection} Stories</span>
                        </div>
                        <Slider
                            min={5}
                            max={20}
                            step={5}
                            value={[settings.maxArticlesPerSection]}
                            onValueChange={(value) => onUpdateSettings({ maxArticlesPerSection: value[0] ?? settings.maxArticlesPerSection })}
                            className="py-1"
                        />
                        <p className="text-[0.7rem] text-muted-foreground font-medium leading-tight">Max stories visible per section on the landing page.</p>
                    </div>
                </div>
            </section>



            <section className="mb-12">
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">My Library</h2>
                            <p className="text-sm text-muted-foreground tracking-tight">{customFeeds.length} source{customFeeds.length !== 1 ? 's' : ''} active</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full border-border/60 px-3 text-[0.7rem] font-bold uppercase tracking-wider"
                                onClick={() => setShowDiscover(true)}
                            >
                                Discover
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full px-3 text-[0.7rem] font-bold uppercase tracking-wider opacity-60"
                                onClick={onRestoreDefaults}
                            >
                                Defaults
                            </Button>
                        </div>
                    </div>
                </div>


                <div className="divide-y divide-border/40 mb-8 border-t border-border/40">
                    {customFeeds.map(feed => (
                        <div key={feed.id} className="flex items-center justify-between py-4 group">
                            <div className="min-w-0 pr-4">
                                <span className="block text-base font-semibold truncate leading-tight mb-0.5">{feed.name}</span>
                                <span className="block text-[0.75rem] text-muted-foreground/70 truncate tracking-tight">{feed.url}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={() => onRemoveFeed(feed.id)}
                                aria-label={`Remove ${feed.name}`}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                                </svg>
                            </Button>
                        </div>
                    ))}
                    {customFeeds.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground/40 italic">Your library is empty.</p>
                    )}
                </div>


                <Card className="rounded-2xl border-border/60 bg-muted/30 shadow-sm border shadow-border/10">
                    <CardHeader className="pt-4 pb-3">
                        <CardTitle className="text-base font-bold">Add Source</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">

                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label htmlFor="feed-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                                <Input
                                    id="feed-name"
                                    type="text"
                                    value={newFeed.name}
                                    onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                                    placeholder="e.g. Science Daily"
                                    required
                                    className="bg-muted/20 border-border/60 h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="feed-url" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">RSS URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        id="feed-url"
                                        type="url"
                                        value={newFeed.url}
                                        onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                                        placeholder="https://..."
                                        required
                                        className="bg-muted/20 border-border/60 h-10"
                                    />
                                    <Button type="submit" className="rounded-full shrink-0 shadow-sm shadow-primary/20" size="sm">Add</Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>



            <section className="mt-8 border-t border-border/60 pt-8">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Advanced</h2>
                    <p className="text-sm text-muted-foreground tracking-tight">Manage your local storage and cache</p>
                </div>
                <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-4 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground font-medium mb-3 italic">Resetting will clear all your custom feeds and cached articles.</p>


                    <Button variant="destructive" size="sm" className="rounded-full shadow-sm shadow-destructive/20" onClick={onReset}>Clear All Library Data</Button>
                </div>
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

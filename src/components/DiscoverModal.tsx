import { useState, useEffect, useRef } from 'react';
import { useDiscovery } from '../engine/useDiscovery';
import { decodeHTMLEntities } from '../engine/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface DiscoverModalProps {
    onClose: () => void;
    onAddFeed: (name: string, url: string) => void;
}

export function DiscoverModal({ onClose, onAddFeed }: DiscoverModalProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const { data: result, isLoading, isError, error } = useDiscovery(debouncedQuery);

    const handleAdd = () => {
        if (result) {
            onAddFeed(result.name, result.url);
            onClose();
        }
    };

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Discover Sources</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by publication name (e.g. Wired)"
                            aria-label="Search by publication name"
                        />
                        {isLoading && <div className="spinner-small" />}
                    </div>

                    <div className="space-y-4">
                        {isLoading && <p className="meta center">Looking for feeds...</p>}

                        {isError && (
                            <div className="error-state">
                                <p className="meta">{(error as Error).message}</p>
                            </div>
                        )}

                        {result && !isLoading && (
                            <Card className="border-border/60">
                                <CardHeader className="flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>{result.name}</CardTitle>
                                        <p className="meta truncate">{result.url}</p>
                                    </div>
                                    <Button onClick={handleAdd}>Add to Library</Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="preview-label">LATEST HEADLINES</p>
                                    <ul className="preview-list">
                                        {result.preview.map(article => (
                                            <li key={article.id} className="preview-item">
                                                {decodeHTMLEntities(article.title)}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {!query && !isLoading && (
                            <div className="empty-state-mini">
                                <p className="meta">Type a publication name to find its feed instantly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

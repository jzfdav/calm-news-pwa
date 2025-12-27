import { useState, useEffect, useRef } from 'react';
import { useDiscovery } from '../engine/useDiscovery';
import { decodeHTMLEntities } from '../engine/utils';

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container discover-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Discover Sources</h2>
                    <button className="icon-btn" onClick={onClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="search-box">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by publication name (e.g. Wired)"
                            className="search-input"
                        />
                        {isLoading && <div className="spinner-small" />}
                    </div>

                    <div className="discovery-results">
                        {isLoading && <p className="meta center">Looking for feeds...</p>}

                        {isError && (
                            <div className="error-state">
                                <p className="meta">{(error as Error).message}</p>
                            </div>
                        )}

                        {result && !isLoading && (
                            <div className="discovery-card">
                                <div className="discovery-header">
                                    <div>
                                        <h3>{result.name}</h3>
                                        <p className="meta truncate">{result.url}</p>
                                    </div>
                                    <button className="button-primary" onClick={handleAdd}>
                                        Add to Library
                                    </button>
                                </div>

                                <div className="discovery-preview">
                                    <p className="preview-label">LATEST HEADLINES</p>
                                    <ul className="preview-list">
                                        {result.preview.map(article => (
                                            <li key={article.id} className="preview-item">
                                                {decodeHTMLEntities(article.title)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {!query && !isLoading && (
                            <div className="empty-state-mini">
                                <p className="meta">Type a publication name to find its feed instantly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

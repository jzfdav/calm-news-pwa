export interface HeaderProps {
    view: 'digest' | 'settings';
    setView: (view: 'digest' | 'settings') => void;
    isOffline: boolean;
    loading: boolean;
    onRefresh: () => void;
}

export function Header({ view, setView, isOffline, loading, onRefresh }: HeaderProps) {
    return (
        <header>
            {isOffline && <div className="offline-badge">Reading from your local library</div>}
            <h1>Calm News</h1>
            <p className="subtitle">Your daily understanding, once a day.</p>

            <nav className="nav-bar">
                <button className={`nav-link ${view === 'digest' ? 'active' : ''}`} onClick={() => setView('digest')}>Digest</button>
                <button className={`nav-link ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>Settings</button>

                {view === 'digest' && (
                    <button className="refresh" onClick={onRefresh} disabled={loading || isOffline}>
                        {loading ? 'Fetching...' : isOffline ? 'Offline' : 'Refresh'}
                    </button>
                )}
            </nav>
        </header>
    );
}

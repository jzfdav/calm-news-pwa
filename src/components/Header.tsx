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
                <div>
                    <button className={`nav-link ${view === 'digest' ? 'active' : ''}`} onClick={() => setView('digest')}>Digest</button>
                    <button style={{ marginLeft: '1.5rem' }} className={`nav-link ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>Settings</button>
                </div>
                {view === 'digest' && (
                    <button className="refresh" onClick={onRefresh} disabled={loading || isOffline}>
                        {loading ? 'Fetching...' : isOffline ? 'Offline' : 'Refresh Digest'}
                    </button>
                )}
            </nav>
        </header>
    );
}

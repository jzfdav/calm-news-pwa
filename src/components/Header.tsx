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
            {isOffline && <div className="offline-badge">Library Mode</div>}
            <h1>Calm News</h1>
            <p className="subtitle">Your daily understanding, once a day.</p>

            <nav className="nav-bar">
                <button
                    className={`nav-link ${view === 'digest' ? 'active' : ''}`}
                    onClick={() => setView('digest')}
                >
                    Digest
                </button>
                <button
                    className={`nav-link ${view === 'settings' ? 'active' : ''}`}
                    onClick={() => setView('settings')}
                >
                    Settings
                </button>

                <div className="nav-divider"></div>

                <button
                    className="btn-refresh-pill"
                    onClick={onRefresh}
                    disabled={loading || isOffline}
                >
                    {loading ? '...' : 'Refresh'}
                </button>
            </nav>
        </header>
    );
}

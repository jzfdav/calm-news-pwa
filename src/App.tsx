import { useState, useEffect } from 'react'
import './styles/App.css'
import type { Section, DailyDigest } from './engine/types'
import { refreshSections, createDailyDigest } from './engine/digest'
import { loadSections, clearStorage, loadCustomFeeds, saveCustomFeeds, type CustomFeed } from './engine/storage'

const DEFAULT_FEEDS: CustomFeed[] = [
  {
    id: 'hn',
    name: 'Tech & Ideas',
    url: 'https://news.ycombinator.com/rss'
  },
  {
    id: 'bbc',
    name: 'World News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
  }
];

const proxyUrl = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

function App() {
  const [view, setView] = useState<'digest' | 'settings'>('digest');
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customFeeds, setCustomFeeds] = useState<CustomFeed[]>([]);
  const [newFeed, setNewFeed] = useState({ name: '', url: '' });
  const [selectedArticle, setSelectedArticle] = useState<Section['articles'][0] | null>(null);

  useEffect(() => {
    let feeds = loadCustomFeeds();
    if (feeds.length === 0) {
      feeds = DEFAULT_FEEDS;
      saveCustomFeeds(feeds);
    }
    setCustomFeeds(feeds);

    const savedSections = loadSections();
    if (savedSections.length > 0 && savedSections.some(s => s.articles.length > 0)) {
      setDigest(createDailyDigest(savedSections));
    } else {
      handleRefresh(feeds);
    }
  }, []);

  const handleReset = () => {
    if (confirm('Clear all saved data and refresh?')) {
      clearStorage();
      window.location.reload();
    }
  };

  const handleRefresh = async (feedsToUse = customFeeds) => {
    if (feedsToUse.length === 0) {
      setError('No feeds configured. Add some in Settings.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const sectionsToFetch: Section[] = feedsToUse.map(f => ({
        id: f.id,
        name: f.name,
        rssUrl: proxyUrl(f.url),
        articles: []
      }));

      const updated = await refreshSections(sectionsToFetch);
      setDigest(createDailyDigest(updated));

      const failedCount = updated.filter(s => s.articles.length === 0).length;
      if (failedCount > 0) {
        setError(`Failed to fetch ${failedCount} section(s). Check your connection.`);
      }
    } catch (e) {
      console.error('Refresh failed', e);
      setError('A critical error occurred while refreshing the feed.');
    } finally {
      setLoading(false);
    }
  };

  const addFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.name || !newFeed.url) return;

    const updated = [...customFeeds, { ...newFeed, id: Math.random().toString(36).substring(7) }];
    setCustomFeeds(updated);
    saveCustomFeeds(updated);
    setNewFeed({ name: '', url: '' });
  };

  const removeFeed = (id: string) => {
    const updated = customFeeds.filter(f => f.id !== id);
    setCustomFeeds(updated);
    saveCustomFeeds(updated);
  };

  return (
    <div className="container">
      <header>
        <h1>Calm News</h1>
        <p className="subtitle">Your daily understanding, once a day.</p>

        <nav className="nav-bar">
          <div>
            <button
              className={`nav-link ${view === 'digest' ? 'active' : ''}`}
              onClick={() => setView('digest')}
            >
              Digest
            </button>
            <button
              style={{ marginLeft: '1.5rem' }}
              className={`nav-link ${view === 'settings' ? 'active' : ''}`}
              onClick={() => setView('settings')}
            >
              Settings
            </button>
          </div>
          {view === 'digest' && (
            <button
              className="refresh"
              onClick={() => handleRefresh()}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Refresh Digest'}
            </button>
          )}
        </nav>
      </header>

      {error && <div className="meta" style={{ color: '#c33', textAlign: 'center', marginBottom: '2rem' }}>{error}</div>}

      {view === 'digest' ? (
        <main>
          {loading && !digest && <div className="loading">Gathering stories for you...</div>}

          {digest && (
            <>
              {digest.sections.map((section) => (
                <section key={section.id}>
                  <h2>{section.name}</h2>
                  {section.articles.length === 0 && <p className="meta">No articles found in this section.</p>}
                  {section.articles.map((article) => (
                    <article key={article.id}>
                      <h3>
                        <button
                          className="nav-link"
                          style={{ fontSize: '1.3rem', textAlign: 'left', lineHeight: '1.3', fontWeight: 'bold' }}
                          onClick={() => setSelectedArticle(article)}
                        >
                          {article.title}
                        </button>
                      </h3>
                      <div className="meta">
                        {article.author ? `${article.author} • ` : ''}
                        <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {section.name} (Source)
                        </a>
                      </div>
                      {article.content && (
                        <div
                          className="excerpt"
                          dangerouslySetInnerHTML={{
                            __html: article.content.substring(0, 200) + (article.content.length > 200 ? '...' : '')
                          }}
                        />
                      )}
                    </article>
                  ))}
                </section>
              ))}
            </>
          )}
        </main>
      ) : (
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
                  <button className="button-danger" onClick={() => removeFeed(feed.id)}>Remove</button>
                </li>
              ))}
            </ul>

            <form className="add-feed-form" onSubmit={addFeed}>
              <h3>Add New Feed</h3>
              <div className="form-group">
                <label>Feed Name</label>
                <input
                  type="text"
                  value={newFeed.name}
                  onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                  placeholder="e.g. My Favorite Blog"
                />
              </div>
              <div className="form-group">
                <label>RSS URL</label>
                <input
                  type="url"
                  value={newFeed.url}
                  onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                  placeholder="https://example.com/rss"
                />
              </div>
              <button type="submit" className="button-primary">Add Feed</button>
            </form>
          </section>

          <section style={{ marginTop: '4rem', textAlign: 'center' }}>
            <h2>System</h2>
            <button className="button-danger" onClick={handleReset}>Reset All Data (Danger Zone)</button>
          </section>
        </main>
      )}

      {selectedArticle && (
        <div className="reader-overlay">
          <button className="close-reader" onClick={() => setSelectedArticle(null)}>Close</button>
          <div className="reader-content">
            <div className="reader-header">
              <h1>{selectedArticle.title}</h1>
              <div className="meta">
                {selectedArticle.author ? `${selectedArticle.author} • ` : ''}
                <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer">Original Source</a>
              </div>
            </div>
            <div
              className="full-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      )}

      <footer>
        <p className="meta" style={{ textAlign: 'center', marginTop: '4rem' }}>
          This is a calm space. You are done for now when you finish reading.
        </p>
      </footer>
    </div>
  )
}

export default App

import { useState, useEffect, useMemo, useCallback } from 'react'
import './styles/App.css'
import type { Section, DailyDigest, Article } from './engine/types'
import { refreshSections, createDailyDigest } from './engine/digest'
import { loadSections, clearStorage, loadCustomFeeds, saveCustomFeeds, type CustomFeed } from './engine/storage'

// Components
import { Header } from './components/Header'
import { DigestView } from './components/DigestView'
import { SettingsView } from './components/SettingsView'
import { ReaderOverlay } from './components/ReaderOverlay'

import { DEFAULT_FEEDS, PROXY_URL } from './engine/config'

function App() {
  const [view, setView] = useState<'digest' | 'settings'>('digest');
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customFeeds, setCustomFeeds] = useState<CustomFeed[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Reader Settings
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'s' | 'm' | 'l'>('m');
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let feeds = loadCustomFeeds();
    if (feeds.length === 0) {
      feeds = DEFAULT_FEEDS;
      saveCustomFeeds(feeds);
    }
    setCustomFeeds(feeds);

    const savedSections = loadSections();
    if (savedSections.length > 0 && savedSections.some(s => s.articles.length > 0)) {
      setDigest(createDailyDigest(savedSections));
    } else if (navigator.onLine) {
      handleRefreshAction(feeds);
    }

    const savedRead = localStorage.getItem('calm_news_read_articles');
    if (savedRead) setReadArticles(new Set(JSON.parse(savedRead)));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefreshAction = useCallback(async (feedsToUse = customFeeds) => {
    if (!navigator.onLine || isOffline) {
      setError('Cannot refresh while offline. Enjoy what you have.');
      return;
    }
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
        rssUrl: PROXY_URL(f.url),
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
  }, [customFeeds, isOffline]);

  const handleToggleRead = useCallback((id: string) => {
    setReadArticles(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      localStorage.setItem('calm_news_read_articles', JSON.stringify(Array.from(updated)));
      return updated;
    });
  }, []);

  const handleAddFeed = useCallback((name: string, url: string) => {
    const updated = [...customFeeds, { name, url, id: Math.random().toString(36).substring(7) }];
    setCustomFeeds(updated);
    saveCustomFeeds(updated);
  }, [customFeeds]);

  const handleRemoveFeed = useCallback((id: string) => {
    const updated = customFeeds.filter(f => f.id !== id);
    setCustomFeeds(updated);
    saveCustomFeeds(updated);
  }, [customFeeds]);

  const handleReset = useCallback(() => {
    if (confirm('Clear all saved data and refresh?')) {
      clearStorage();
      localStorage.removeItem('calm_news_read_articles');
      window.location.reload();
    }
  }, []);

  const unreadSections = useMemo(() => {
    if (!digest) return [];
    return digest.sections.map(s => ({
      ...s,
      articles: s.articles.filter(a => !readArticles.has(a.id))
    })).filter(s => s.articles.length > 0);
  }, [digest, readArticles]);

  return (
    <div className={`container ${selectedArticle ? `theme-${theme}` : ''}`}>
      <Header
        view={view}
        setView={setView}
        isOffline={isOffline}
        loading={loading}
        onRefresh={() => handleRefreshAction()}
      />

      {error && <div className="meta" style={{ color: '#c33', textAlign: 'center', marginBottom: '2rem' }}>{error}</div>}

      {view === 'digest' ? (
        <DigestView
          sections={unreadSections}
          loading={loading}
          onSelectArticle={setSelectedArticle}
          onToggleRead={handleToggleRead}
          onRefresh={() => handleRefreshAction()}
          isOffline={isOffline}
        />
      ) : (
        <SettingsView
          customFeeds={customFeeds}
          onAddFeed={handleAddFeed}
          onRemoveFeed={handleRemoveFeed}
          onReset={handleReset}
        />
      )}

      {selectedArticle && (
        <ReaderOverlay
          article={selectedArticle}
          theme={theme}
          fontSize={fontSize}
          setTheme={setTheme}
          setFontSize={setFontSize}
          onClose={() => setSelectedArticle(null)}
          onMarkDone={() => { handleToggleRead(selectedArticle.id); setSelectedArticle(null); }}
        />
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

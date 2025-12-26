import { useState, useEffect, useMemo, useCallback } from 'react'
import './styles/App.css'
import type { Article } from './engine/types'
import { clearStorage, loadCustomFeeds, saveCustomFeeds, type CustomFeed, loadPersonalization, savePersonalization } from './engine/storage'
import { useNewsFeed } from './engine/hooks'

// Components
import { Header } from './components/Header'
import { DigestView } from './components/DigestView'
import { SettingsView } from './components/SettingsView'
import { ReaderOverlay } from './components/ReaderOverlay'

import { DEFAULT_FEEDS } from './engine/config'

function App() {
  const [view, setView] = useState<'digest' | 'settings'>('digest');
  // const [digest, setDigest] = useState<DailyDigest | null>(null); // Removed in favor of React Query
  // const [loading, setLoading] = useState(false); // Removed
  // const [error, setError] = useState<string | null>(null); // Removed
  const [customFeeds, setCustomFeeds] = useState<CustomFeed[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Reader Settings
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'s' | 'm' | 'l'>('m');
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  // Personalization
  const [locationQuery, setLocationQuery] = useState(loadPersonalization('location'));
  const [companyQuery, setCompanyQuery] = useState(loadPersonalization('company'));

  const { data: digest, isLoading, error: queryError, refetch } = useNewsFeed(customFeeds, locationQuery, companyQuery, !isOffline);

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

    const savedRead = localStorage.getItem('calm_news_read_articles');
    if (savedRead) setReadArticles(new Set(JSON.parse(savedRead)));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefreshAction = useCallback(() => {
    if (isOffline) return;
    refetch();
  }, [isOffline, refetch]);

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

  const handleUpdatePersonalization = useCallback((key: 'location' | 'company', val: string) => {
    if (key === 'location') setLocationQuery(val);
    else setCompanyQuery(val);
    savePersonalization(key, val);
  }, []);

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
        loading={isLoading}
        onRefresh={handleRefreshAction}
      />

      {queryError && <div className="meta" style={{ color: '#c33', textAlign: 'center', marginBottom: '2rem' }}>Failed to refresh feed.</div>}

      {view === 'digest' ? (
        <DigestView
          sections={unreadSections}
          loading={isLoading}
          onSelectArticle={setSelectedArticle}
        />
      ) : (
        <SettingsView
          customFeeds={customFeeds}
          locationQuery={locationQuery}
          companyQuery={companyQuery}
          onUpdatePersonalization={handleUpdatePersonalization}
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

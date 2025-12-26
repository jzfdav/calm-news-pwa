import { useState, useEffect, useMemo, useCallback } from 'react'
import './styles/App.css'
import type { Article } from './engine/types'
import { clearStorage, loadCustomFeeds, saveCustomFeeds, type CustomFeed, loadTopics, saveTopics } from './engine/storage'
import { useNewsFeed } from './engine/hooks'
import { useReader } from './engine/useReader'

// Components
import { Header } from './components/Header'
import { DigestView } from './components/DigestView'
import { SettingsView } from './components/SettingsView'
import { ReaderOverlay } from './components/ReaderOverlay'

import { DEFAULT_FEEDS } from './engine/config'

function App() {
  const [view, setView] = useState<'digest' | 'settings'>('digest');
  const [customFeeds, setCustomFeeds] = useState<CustomFeed[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Reader State
  const { theme, setTheme, fontSize, setFontSize, readArticles, toggleRead } = useReader();

  // Apply theme globally
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Personalization
  const [topics, setTopics] = useState<string[]>([]);

  const { data: digest, isLoading, error: queryError, refetch } = useNewsFeed(customFeeds, topics, !isOffline);

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

    setTopics(loadTopics());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefreshAction = useCallback(() => {
    if (isOffline) return;
    refetch();
  }, [isOffline, refetch]);


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

  const handleAddTopic = useCallback((topic: string) => {
    if (!topic.trim()) return;
    const updated = [...topics, topic.trim()];
    setTopics(updated);
    saveTopics(updated);
  }, [topics]);

  const handleRemoveTopic = useCallback((topic: string) => {
    const updated = topics.filter(t => t !== topic);
    setTopics(updated);
    saveTopics(updated);
  }, [topics]);

  const handleReset = useCallback(() => {
    if (confirm('Clear all saved data and refresh?')) {
      clearStorage();
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
    <div className={`container`}>
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
          topics={topics}
          onAddTopic={handleAddTopic}
          onRemoveTopic={handleRemoveTopic}
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
          onMarkDone={() => { toggleRead(selectedArticle.id); setSelectedArticle(null); }}
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

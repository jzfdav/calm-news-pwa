import { useState, useEffect, useMemo, useCallback } from 'react'
import './styles/App.css'
import type { Article } from './engine/types'
import { clearStorage, loadCustomFeeds, type CustomFeed, loadTopics, loadSettings } from './engine/storage'
import { useNewsFeed } from './engine/hooks'
import { useReader } from './engine/useReader'
import { useAppActions } from './engine/useAppActions'
import { Header } from './components/Header'
import { ToastContainer, useToast } from './components/Toast'
import { DigestView } from './components/DigestView'
import { SettingsView } from './components/SettingsView'
import { ReaderOverlay } from './components/ReaderOverlay'

import { OnboardingModal } from './components/OnboardingModal'

function App() {
  const [view, setView] = useState<'digest' | 'settings'>('digest');
  const [customFeeds, setCustomFeeds] = useState<CustomFeed[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastReadId, setLastReadId] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [settings, setSettings] = useState(loadSettings());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { messages, showToast, removeToast } = useToast();

  // Reader State
  const { theme, setTheme, fontSize, setFontSize, readArticles, toggleRead } = useReader();

  // Apply theme globally
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Personalization
  const [topics, setTopics] = useState<string[]>([]);

  const { data: digest, isLoading, isFetching, error: queryError, refetch } = useNewsFeed(customFeeds, topics, !isOffline);

  useEffect(() => {
    if (digest && !isFetching) {
      setLastUpdated(new Date());
    }
  }, [digest, isFetching]);

  // App Actions (Refactored Logic)
  const {
    handleAddFeed,
    handleRemoveFeed,
    handleAddTopic,
    handleRemoveTopic,
    handleUpdateSettings,
    handleRestoreDefaults
  } = useAppActions({
    customFeeds,
    setCustomFeeds,
    topics,
    setTopics,
    settings,
    setSettings
  });

  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => setShowUndo(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showUndo, lastReadId]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const feeds = loadCustomFeeds() || [];
    setCustomFeeds(feeds);

    const savedTopics = loadTopics() || [];
    setTopics(savedTopics);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefreshAction = useCallback(() => {
    if (isOffline) return;
    refetch();
  }, [isOffline, refetch]);

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
        loading={isFetching}
        onRefresh={handleRefreshAction}
        lastUpdated={lastUpdated}
      />

      {queryError && <div className="meta" style={{ color: '#c33', textAlign: 'center', marginBottom: '2rem' }}>Failed to refresh feed.</div>}

      <ToastContainer messages={messages} onRemove={removeToast} />

      {view === 'digest' ? (
        topics.length === 0 && !isLoading ? (
          <OnboardingModal
            onAddTopic={handleAddTopic}
            currentTopics={topics}
          />
        ) : (
          <DigestView
            sections={unreadSections}
            loading={isLoading}
            onSelectArticle={setSelectedArticle}
            onGoToSettings={() => setView('settings')}
          />
        )
      ) : (
        <SettingsView
          customFeeds={customFeeds}
          topics={topics}
          onAddTopic={(t) => { handleAddTopic(t); showToast(`Added ${t}`); }}
          onRemoveTopic={(t) => { handleRemoveTopic(t); showToast(`Removed ${t}`); }}
          onAddFeed={(n, u) => { handleAddFeed(n, u); showToast(`Added ${n}`); }}
          onRemoveFeed={(id) => { handleRemoveFeed(id); showToast('Feed removed'); }}
          onRestoreDefaults={() => { handleRestoreDefaults(); showToast('Defaults restored'); }}
          onReset={handleReset}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
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
          onMarkDone={() => {
            setLastReadId(selectedArticle.id);
            setShowUndo(true);
            toggleRead(selectedArticle.id);
            setSelectedArticle(null);
          }}
        />
      )}

      {showUndo && (
        <div className="undo-toast">
          <span>Article marked as done</span>
          <button
            className="undo-btn"
            onClick={() => {
              if (lastReadId) {
                toggleRead(lastReadId);
                setShowUndo(false);
              }
            }}
          >
            Undo
          </button>
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

import { useState, useEffect } from 'react'
import './styles/App.css'
import type { Section, DailyDigest } from './engine/types'
import { refreshSections, createDailyDigest } from './engine/digest'
import { loadSections } from './engine/storage'

const INITIAL_SECTIONS: Section[] = [
  {
    id: 'hn',
    name: 'Tech & Ideas',
    rssUrl: 'https://news.ycombinator.com/rss',
    articles: []
  },
  {
    id: 'bbc',
    name: 'World News',
    rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    articles: []
  }
];

// Helper to wrap URLs with a CORS proxy for development
const proxyUrl = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

function App() {
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadSections();
    if (saved.length > 0) {
      setDigest(createDailyDigest(saved));
    } else {
      handleRefresh();
    }
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const proxiedSections = INITIAL_SECTIONS.map(s => ({
        ...s,
        rssUrl: proxyUrl(s.rssUrl)
      }));

      const updated = await refreshSections(proxiedSections);

      // Restore original URLs before creating digest/saving if needed, 
      // but here we just want to show the content.
      setDigest(createDailyDigest(updated));
    } catch (e) {
      console.error('Refresh failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Calm News</h1>
        <p className="subtitle">Your daily understanding, once a day.</p>
        <button
          className="refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Refresh Digest'}
        </button>
      </header>

      {loading && !digest && <div className="loading">Gathering stories for you...</div>}

      {digest && (
        <main>
          {digest.sections.map((section) => (
            <section key={section.id}>
              <h2>{section.name}</h2>
              {section.articles.length === 0 && <p className="meta">No articles found in this section.</p>}
              {section.articles.map((article) => (
                <article key={article.id}>
                  <h3>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  <div className="meta">
                    {article.author ? `${article.author} • ` : ''}
                    {section.name}
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
        </main>
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

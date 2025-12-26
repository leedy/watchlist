import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="settings-page">
      <header>
        <h1>Settings</h1>
        <a href="/">Back to Watchlist</a>
      </header>

      <div className="settings-section">
        <h2>TMDB Integration</h2>
        <p className="settings-description">
          TMDB (The Movie Database) provides movie and TV show information including posters, descriptions, and release dates.
        </p>

        <div className="setting-item">
          <label>API Key Status</label>
          {settings?.tmdbConfigured ? (
            <div className="status-ok">
              Configured ({settings.tmdbKeyPreview})
            </div>
          ) : (
            <div className="status-error">
              Not configured
            </div>
          )}
        </div>

        <div className="setting-info">
          <p>To configure the TMDB API key:</p>
          <ol>
            <li>Sign up at <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer">themoviedb.org</a></li>
            <li>Go to Settings &rarr; API &rarr; Create API Key</li>
            <li>Add <code>TMDB_API_KEY=your_key</code> to the backend .env file</li>
            <li>Restart the backend server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

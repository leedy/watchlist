import { useState, useEffect, useRef } from 'react';
import { searchTMDB } from '../services/api';

export default function AddItemForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const justSelected = useRef(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Skip search if user just selected a result
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (title.length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [title]);

  const performSearch = async () => {
    setSearching(true);
    try {
      // Use 'multi' to search both movies and TV shows
      const res = await searchTMDB(title, 'multi');
      setSearchResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error('Search failed', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (result) => {
    justSelected.current = true;
    setTitle(result.title);
    setType(result.type === 'tv' ? 'tv' : 'movie');
    setYear(result.year || '');
    setDescription(result.description || '');
    setPosterUrl(result.posterUrl || '');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      type,
      year: year ? parseInt(year) : undefined,
      description: description || undefined,
      posterUrl: posterUrl || undefined,
      isPrivate
    });
  };

  return (
    <div className="modal-overlay">
      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Add to Watchlist</h2>

        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a movie or TV show..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            required
          />
          {searching && <span className="search-spinner">Searching...</span>}

          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="search-result"
                  onClick={() => selectResult(result)}
                >
                  {result.posterUrl ? (
                    <img src={result.posterUrl} alt="" className="result-poster" />
                  ) : (
                    <div className="result-poster no-poster">No Image</div>
                  )}
                  <div className="result-info">
                    <div className="result-title">{result.title}</div>
                    <div className="result-meta">
                      <span className="result-type">{result.type.toUpperCase()}</span>
                      {result.year && <span className="result-year">{result.year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
        </select>

        <input
          type="number"
          placeholder="Year (optional)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private (hide from family)
        </label>

        {posterUrl && (
          <div className="poster-preview">
            <img src={posterUrl} alt="Poster preview" />
          </div>
        )}

        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

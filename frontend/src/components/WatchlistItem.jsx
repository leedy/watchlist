import { useState } from 'react';

export default function WatchlistItem({ item, onUpdate, onDelete }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={`watchlist-card ${item.status}`}>
      <div className="card-poster">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt={item.title} />
        ) : (
          <div className="no-poster">No Poster</div>
        )}
        <div className="card-overlay">
          <button
            className={`privacy-badge ${item.isPrivate ? 'private' : 'public'}`}
            onClick={() => onUpdate(item._id, { isPrivate: !item.isPrivate })}
            title={item.isPrivate ? 'Private' : 'Shared with family'}
          >
            {item.isPrivate ? '🔒' : '👨‍👩‍👧‍👦'}
          </button>
          <span className="type-badge">{item.type}</span>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title" title={item.title}>{item.title}</h3>
        {item.year && <span className="card-year">{item.year}</span>}

        <div className="card-actions">
          <select
            value={item.status}
            onChange={(e) => onUpdate(item._id, { status: e.target.value })}
          >
            <option value="want_to_watch">Want to Watch</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
          </select>

          {item.status === 'watched' && (
            <select
              value={item.rating || ''}
              onChange={(e) => onUpdate(item._id, { rating: parseInt(e.target.value) || null })}
            >
              <option value="">Rate</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}/10</option>
              ))}
            </select>
          )}
        </div>

        <div className="card-buttons">
          {item.description && (
            <button className="info-btn" onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? 'Hide' : 'Info'}
            </button>
          )}
          <button className="delete-btn" onClick={() => onDelete(item._id)}>Delete</button>
        </div>

        {showInfo && item.description && (
          <p className="card-description">{item.description}</p>
        )}
      </div>
    </div>
  );
}

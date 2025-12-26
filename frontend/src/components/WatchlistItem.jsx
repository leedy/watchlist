import { useState } from 'react';

export default function WatchlistItem({ item, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
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
              <button className="info-btn" onClick={() => setShowModal(true)}>Info</button>
            )}
            {confirmDelete ? (
              <>
                <button className="confirm-yes" onClick={() => onDelete(item._id)}>Yes</button>
                <button className="confirm-no" onClick={() => setConfirmDelete(false)}>No</button>
              </>
            ) : (
              <button className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete</button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="info-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="info-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="info-modal-content">
              {item.posterUrl && (
                <img src={item.posterUrl} alt={item.title} className="info-modal-poster" />
              )}
              <div className="info-modal-details">
                <h2>{item.title}</h2>
                <div className="info-modal-meta">
                  <span className="type-badge">{item.type}</span>
                  {item.year && <span className="info-modal-year">{item.year}</span>}
                  {item.rating && <span className="info-modal-rating">{item.rating}/10</span>}
                </div>
                <p className="info-modal-description">{item.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWatchlist, addToWatchlist, updateWatchlistItem, deleteWatchlistItem, getRandomPick } from '../services/api';
import AddItemForm from '../components/AddItemForm';
import WatchlistItem from '../components/WatchlistItem';

export default function Home() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [sort, setSort] = useState('title');
  const [showAdd, setShowAdd] = useState(false);
  const [randomPick, setRandomPick] = useState(null);

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.status) params.status = filter.status;
      const res = await getWatchlist(params);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load watchlist', err);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default: date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleAdd = async (item) => {
    try {
      await addToWatchlist(item);
      setShowAdd(false);
      loadItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updateWatchlistItem(id, updates);
      loadItems();
    } catch (err) {
      console.error('Failed to update item', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWatchlistItem(id);
      loadItems();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleRandomPick = async () => {
    try {
      const res = await getRandomPick();
      setRandomPick(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'No items to pick from');
    }
  };

  return (
    <div className="home">
      <header>
        <h1>My Watchlist</h1>
        <div className="header-actions">
          <span>Hi, {user?.name}</span>
          <a href="/family">Family</a>
          <a href="/settings">Settings</a>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="controls">
        <button onClick={() => setShowAdd(true)}>+ Add</button>
        <button onClick={handleRandomPick}>Random Pick</button>
        <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="want_to_watch">Want to Watch</option>
          <option value="watching">Watching</option>
          <option value="watched">Watched</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Newest First</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {randomPick && (
        <div className="random-pick-overlay" onClick={() => setRandomPick(null)}>
          <div className="random-pick-modal" onClick={(e) => e.stopPropagation()}>
            <button className="random-pick-close" onClick={() => setRandomPick(null)}>&times;</button>
            <div className="random-pick-header">Random Pick</div>
            <div className="random-pick-content">
              {randomPick.posterUrl && (
                <img src={randomPick.posterUrl} alt={randomPick.title} className="random-pick-poster" />
              )}
              <div className="random-pick-details">
                <h2>{randomPick.title}</h2>
                <div className="random-pick-meta">
                  <span className="type-badge">{randomPick.type}</span>
                  {randomPick.year && <span className="random-pick-year">{randomPick.year}</span>}
                  <span className="random-pick-added">Added by: {randomPick.user?.name || 'You'}</span>
                </div>
                {randomPick.description && (
                  <p className="random-pick-description">{randomPick.description}</p>
                )}
                <div className="random-pick-actions">
                  <button className="pick-again-btn" onClick={handleRandomPick}>Pick Again</button>
                  <button className="dismiss-btn" onClick={() => setRandomPick(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddItemForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      )}

      <div className="watchlist">
        {sortedItems.length === 0 ? (
          <p className="empty">No items yet. Add something to watch!</p>
        ) : (
          sortedItems.map((item) => (
            <WatchlistItem
              key={item._id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

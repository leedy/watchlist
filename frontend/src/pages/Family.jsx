import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFamily, createFamily, joinFamily, leaveFamily, getFamilyWatchlist, getRandomPick } from '../services/api';
import { Link } from 'react-router-dom';

export default function Family() {
  const { user, setUser } = useAuth();
  const [family, setFamily] = useState(null);
  const [familyItems, setFamilyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [randomPick, setRandomPick] = useState(null);

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async () => {
    try {
      const res = await getFamily();
      setFamily(res.data);
      const itemsRes = await getFamilyWatchlist();
      setFamilyItems(itemsRes.data);
    } catch {
      setFamily(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createFamily(groupName);
      setFamily(res.data);
      setShowCreate(false);
      setUser({ ...user, familyGroup: res.data });
      loadFamily();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create group');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await joinFamily(inviteCode);
      setFamily(res.data);
      setShowJoin(false);
      setUser({ ...user, familyGroup: res.data });
      loadFamily();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join group');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await leaveFamily();
      setFamily(null);
      setFamilyItems([]);
      setUser({ ...user, familyGroup: null });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to leave group');
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="family-page">
      <header>
        <h1>Family Group</h1>
        <Link to="/">Back to Watchlist</Link>
      </header>

      {!family ? (
        <div className="no-family">
          <p>You're not in a family group yet.</p>
          <div className="family-actions">
            <button onClick={() => setShowCreate(true)}>Create Group</button>
            <button onClick={() => setShowJoin(true)}>Join Group</button>
          </div>

          {showCreate && (
            <form onSubmit={handleCreate} className="family-form">
              <h3>Create Family Group</h3>
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
            </form>
          )}

          {showJoin && (
            <form onSubmit={handleJoin} className="family-form">
              <h3>Join Family Group</h3>
              <input
                type="text"
                placeholder="Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <button type="submit">Join</button>
              <button type="button" onClick={() => setShowJoin(false)}>Cancel</button>
            </form>
          )}
        </div>
      ) : (
        <div className="family-info">
          <h2>{family.name}</h2>
          <p><strong>Invite Code:</strong> {family.inviteCode}</p>

          <h3>Members</h3>
          <ul>
            {family.members?.map((member) => (
              <li key={member._id}>
                {member.name} {member._id === family.owner?._id && '(Owner)'}
              </li>
            ))}
          </ul>

          <div className="family-actions">
            <button onClick={handleRandomPick}>Random Pick from Group</button>
            <button onClick={handleLeave} className="danger">Leave Group</button>
          </div>

          {randomPick && (
            <div className="random-pick">
              <h3>Random Pick: {randomPick.title}</h3>
              <p>Added by: {randomPick.user?.name}</p>
              <button onClick={() => setRandomPick(null)}>Dismiss</button>
            </div>
          )}

          <h3>Family Watchlist ({familyItems.length} items)</h3>
          <div className="family-watchlist">
            {familyItems.map((item) => (
              <div key={item._id} className="family-item">
                <span className="type-badge">{item.type}</span>
                <strong>{item.title}</strong>
                {item.year && <span>({item.year})</span>}
                <span className="added-by">- {item.user?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

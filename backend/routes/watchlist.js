const express = require('express');
const WatchlistItem = require('../models/WatchlistItem');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = { user: req.userId };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const items = await WatchlistItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get watchlist' });
  }
});

// Add item to watchlist
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, year, posterUrl, description, isPrivate } = req.body;

    // Check for duplicate
    const existing = await WatchlistItem.findOne({
      user: req.userId,
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ error: 'This title is already in your watchlist' });
    }

    const item = new WatchlistItem({
      title,
      type,
      year,
      posterUrl,
      description,
      isPrivate: isPrivate || false,
      user: req.userId
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Update item
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, rating, notes, isPrivate } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (rating !== undefined) updates.rating = rating;
    if (notes !== undefined) updates.notes = notes;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;

    const item = await WatchlistItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await WatchlistItem.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get random pick from family group
router.get('/random', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('familyGroup');

    if (!user.familyGroup) {
      // Just pick from user's own list
      const count = await WatchlistItem.countDocuments({
        user: req.userId,
        status: 'want_to_watch'
      });

      if (count === 0) {
        return res.status(404).json({ error: 'No items to pick from' });
      }

      const random = Math.floor(Math.random() * count);
      const item = await WatchlistItem.findOne({
        user: req.userId,
        status: 'want_to_watch'
      }).skip(random).populate('user', 'name');

      return res.json(item);
    }

    // Pick from all family members' lists (excluding private items)
    const memberIds = user.familyGroup.members;

    const count = await WatchlistItem.countDocuments({
      user: { $in: memberIds },
      status: 'want_to_watch',
      isPrivate: { $ne: true }
    });

    if (count === 0) {
      return res.status(404).json({ error: 'No items to pick from' });
    }

    const random = Math.floor(Math.random() * count);
    const item = await WatchlistItem.findOne({
      user: { $in: memberIds },
      status: 'want_to_watch',
      isPrivate: { $ne: true }
    }).skip(random).populate('user', 'name');

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get random pick' });
  }
});

module.exports = router;

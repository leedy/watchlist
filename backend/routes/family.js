const express = require('express');
const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const WatchlistItem = require('../models/WatchlistItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Create family group
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.userId);
    if (user.familyGroup) {
      return res.status(400).json({ error: 'Already in a family group' });
    }

    const group = new FamilyGroup({
      name,
      owner: req.userId,
      members: [req.userId]
    });

    await group.save();

    user.familyGroup = group._id;
    await user.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family group' });
  }
});

// Get family group details
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.familyGroup) {
      return res.status(404).json({ error: 'Not in a family group' });
    }

    const group = await FamilyGroup.findById(user.familyGroup)
      .populate('members', 'name email')
      .populate('owner', 'name email');

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get family group' });
  }
});

// Join family group with invite code
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const user = await User.findById(req.userId);
    if (user.familyGroup) {
      return res.status(400).json({ error: 'Already in a family group' });
    }

    const group = await FamilyGroup.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!group) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    group.members.push(req.userId);
    await group.save();

    user.familyGroup = group._id;
    await user.save();

    const populatedGroup = await FamilyGroup.findById(group._id)
      .populate('members', 'name email')
      .populate('owner', 'name email');

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join family group' });
  }
});

// Leave family group
router.post('/leave', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.familyGroup) {
      return res.status(400).json({ error: 'Not in a family group' });
    }

    const group = await FamilyGroup.findById(user.familyGroup);

    // If owner, delete the group
    if (group.owner.toString() === req.userId) {
      // Remove familyGroup from all members
      await User.updateMany(
        { familyGroup: group._id },
        { familyGroup: null }
      );
      await group.deleteOne();
      return res.json({ message: 'Family group deleted' });
    }

    // Otherwise just remove from members
    group.members = group.members.filter(m => m.toString() !== req.userId);
    await group.save();

    user.familyGroup = null;
    await user.save();

    res.json({ message: 'Left family group' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave family group' });
  }
});

// Get all family members' watchlists
router.get('/watchlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('familyGroup');

    if (!user.familyGroup) {
      return res.status(404).json({ error: 'Not in a family group' });
    }

    const memberIds = user.familyGroup.members;

    const items = await WatchlistItem.find({
      user: { $in: memberIds },
      status: 'want_to_watch',
      isPrivate: { $ne: true }
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get family watchlist' });
  }
});

module.exports = router;

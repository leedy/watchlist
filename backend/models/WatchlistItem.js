const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['want_to_watch', 'watching', 'watched'],
    default: 'want_to_watch'
  },
  year: {
    type: Number
  },
  posterUrl: {
    type: String
  },
  description: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: {
    type: String
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
watchlistItemSchema.index({ user: 1, status: 1 });
watchlistItemSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);

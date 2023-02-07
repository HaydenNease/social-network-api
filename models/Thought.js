const { Schema, model } = require('mongoose');

const reactionSchema = require('./Reaction');

const timeSince = require('../utils/timeSince')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => timeSince(date)
    },
    username: {
      type: String,
      trim: true,
    },
    userId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    reactions: [reactionSchema],    
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
  return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;

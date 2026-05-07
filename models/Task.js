const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Med', 'High'],
      default: 'Med',
    },
    estimated_pomos: {
      type: Number,
      default: 1,
      min: [1, 'Estimated pomos must be at least 1'],
    },
    completed_pomos: {
      type: Number,
      default: 0,
      min: [0, 'Completed pomos cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Todo', 'In-Progress', 'Done'],
      default: 'Todo',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);

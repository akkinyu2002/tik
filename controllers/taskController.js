const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      error: error.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, estimated_pomos } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title',
      });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description: description || '',
      priority: priority || 'Med',
      estimated_pomos: estimated_pomos || 1,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
      error: error.message,
    });
  }
};

// @desc    Update a task
// @route   PUT /tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    // Update allowed fields
    const { title, description, priority, estimated_pomos, completed_pomos, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (estimated_pomos) task.estimated_pomos = estimated_pomos;
    if (completed_pomos !== undefined) task.completed_pomos = completed_pomos;
    if (status) task.status = status;

    task = await task.save();

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating task',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      error: error.message,
    });
  }
};

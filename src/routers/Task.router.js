const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTasksByStatus,
  updateTask,
  deleteTask,
  deleteTaskAssignment,
  getTaskCompletionRates,
  getTotalTimeSpent,
  getProductivityTrends
} = require('../models/Task.model');

// Create a new task
router.post('/', (req, res, next) => {
  const { name, statusId, assignedPersonId, dueDate , priority} = req.body;
  createTask(name, statusId, assignedPersonId, priority, dueDate)
    .then((task) => res.status(201).json(task))
    .catch(next);
});


// Retrieve all tasks
router.get('/', (req, res, next) => {
  getAllTasks()
    .then((tasks) => res.status(200).json(tasks))
    .catch(next);
});

// Retrieve tasks by status
router.get('/status/:statusId', (req, res, next) => {
  const { statusId } = req.params;
  getTasksByStatus(parseInt(statusId))
    .then((tasks) => res.status(200).json(tasks))
    .catch(next);
});

// Update a task
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const data = req.body; // should include dueDate if being updated
  updateTask(parseInt(id), data)
    .then((task) => res.status(200).json(task))
    .catch(next);
});


// Delete a task
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  deleteTask(parseInt(id))
    .then((task) => res.status(200).json(task))
    .catch(next);
});

router.delete('/:taskId/assignee/:personId', (req, res, next) => {
  const { taskId, personId } = req.params;
  deleteTaskAssignment(+taskId, +personId)
    .then((taskAssignment) => res.status(200).json(taskAssignment))
    .catch(next);
});

// NEW FEATURE: ANALYTICS AND REPORTS 

router.get('/analytics/completion-rates', (req, res, next) => {
  getTaskCompletionRates()
    .then((data) => res.status(200).json(data))
    .catch(next);
});

router.get('/analytics/total-time-spent', (req, res, next) => {
  getTotalTimeSpent()
    .then((data) => res.status(200).json(data))
    .catch(next);
});

router.get('/analytics/productivity-trends/:userId?', (req, res, next) => {
  const { userId } = req.params;
  getProductivityTrends(userId ? parseInt(userId) : null)
    .then((data) => res.status(200).json(data))
    .catch(next);
});

module.exports = router;

const prisma = require('./prismaClient');

module.exports.createTask = function createTask(name, statusId, assignedPersonId = [], dueDate, priority) {
  console.log('Priority received from form:', priority); // Log to see what priority is passed

  return prisma.task
    .create({
      data: {
        name,
        statusId,
        dueDate: dueDate ? new Date(dueDate) : null, // Ensure dueDate is a Date object
        priority,
        persons: {
          create: assignedPersonId.map((personId) => ({
            person: { connect: { id: personId } },
          })),
        },
      },
    })
    .then((task) => {
      console.log('Task created:', task);
      return task;
    });
};

module.exports.getAllTasks = function getAllTasks() {
  return prisma.task
    .findMany({
      include: {
        status: true,
        persons: {
          include: {
            person: true,
          },
        },
      },
    })
    .then((tasks) => {
      console.log('All tasks:', tasks);
      return tasks;
    });
};

module.exports.getTasksByStatus = function getTasksByStatus(statusId) {
  return prisma.task
    .findMany({
      where: { statusId },
      include: {
        status: true,
        persons: {
          include: {
            person: true,
          },
        },
      },
    })
    .then((tasks) => {
      console.log(`Tasks with status ID ${statusId}:`, tasks);
      return tasks;
    });
};

module.exports.updateTask = function updateTask(id, data) {
  return prisma.task
    .update({
      where: { id },
      data,
    })
    .then((task) => {
      console.log('Task updated:', task);
      return task;
    });
};


module.exports.deleteTask = function deleteTask(id) {
  return prisma.task
    .delete({
      where: { id },
    })
    .then((task) => {
      console.log('Task deleted:', task);
      return task;
    });
};

module.exports.deleteTaskAssignment = function deleteTaskAssignment(taskId, personId) {
  return prisma.taskAssignment
    .delete({
      where: {
        // Reference: https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints
        assignmentId: { taskId: taskId, personId: personId },
      },
    })
    .then((assignment) => {
      console.log('Assignment deleted:', assignment);
      return assignment;
    });
};
// NEW FEATURE: ANALYTICS AND REPORTS

// Function to calculate task completion rates
module.exports.getTaskCompletionRates = function getTaskCompletionRates() {
  return prisma.task
    .findMany()
    .then((tasks) => {
      const completedTasks = tasks.filter(task => task.statusId === 3).length;
      const totalTasks = tasks.length;
      const completionRate = (completedTasks / totalTasks) * 100;
      return { completedTasks, totalTasks, completionRate };
    });
};

// Function to calculate total time spent on tasks
module.exports.getTotalTimeSpent = function getTotalTimeSpent() {
  return prisma.task
    .findMany()
    .then((tasks) => {
      const totalTimeSpent = tasks.reduce((total, task) => total + Number(task.timeSpent || 0), 0);
      return { totalTimeSpent };
    });
};

// Function to calculate productivity trends
module.exports.getProductivityTrends = function getProductivityTrends(userId) {
  const whereClause = userId ? { persons: { some: { personId: userId } } } : {};
  return prisma.task
    .findMany({
      where: whereClause,
      include: {
        persons: true,
        status: true //including the status 
      }
    })
    .then((tasks) => {
      const trends = tasks.filter(task => task.persons.some(person => person.personId === userId))
        .map(task => ({
          id: task.id,
          name: task.name,
          timeSpent: task.timeSpent || 0,
          status: task.status.text,
          completedAt: !!task.completedAt,
        }));
      return { trends };
    });
};
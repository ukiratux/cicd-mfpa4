const apiUrl = '.'; // Adjust this URL if your API is hosted elsewhere
let productivityTrendsChart = null; // Variable to store the productivity trends chart instance

// Function to populate the status options
function populateStatusOptions() {
  fetch(`${apiUrl}/statuses`)
    .then((response) => response.json())
    .then((statuses) => {
      console.log('Fetched statuses:', statuses); // Log the statuses
      const taskStatus = document.getElementById('taskStatus');
      statuses.forEach((status) => {
        const option = document.createElement('option');
        option.value = status.id;
        option.textContent = status.text;
        taskStatus.appendChild(option);
      });
    })
    .catch((error) => console.error('Error fetching statuses:', error));
}

// Function to populate the assignees options
function populateAssigneesOptions() {
  fetch(`${apiUrl}/persons`)
    .then((response) => response.json())
    .then((statuses) => {
      const assignee = document.getElementById('assignees');
      statuses.forEach((status) => {
        console.log(status.name); // Log each name
        const option = document.createElement('option');
        option.value = status.id;
        option.textContent = status.name;
        assignee.appendChild(option);
      });
    })
    .catch((error) => console.error('Error fetching assignees:', error));
}

// Function to populate the tasks table
function populateTasksTable() {
  fetch(`${apiUrl}/tasks`)
    .then((response) => response.json())
    .then((tasks) => {
      const tasksTableBody = document.getElementById('tasksTableBody');
      const rowTemplate = document.getElementById('taskRowTemplate').content;
      const assigneeLiTemplate =
        document.getElementById('assigneeLiTemplate').content;
      tasksTableBody.innerHTML = ''; // Clear existing rows

      tasks.forEach((task) => {
        const row = document.importNode(rowTemplate, true);
        row.querySelector('.task-id').textContent = task.id;
        row.querySelector('.task-name').textContent = task.name;

       const priorityCell = row.querySelector('.task-priority');

       // Create a new div for the priority
       const priorityDiv = document.createElement('div');
       
       // Check the task priority and set the text and style accordingly
       if (task.priority === 1) {
         priorityDiv.textContent = 'Low';  
         priorityDiv.classList.add('priority-low'); 
       } else if (task.priority === 2) {
         priorityDiv.textContent = 'Medium';
         priorityDiv.classList.add('priority-medium'); 
       } else {
         priorityDiv.textContent = 'High';  
         priorityDiv.classList.add('priority-high'); 
       }
       
       // Clear any existing content in the cell
       priorityCell.innerHTML = '';  // Clear the existing content
       
       // Append the new div to the priority cell
       priorityCell.appendChild(priorityDiv);
       
       
              row.querySelector('.task-due-date').textContent = task.dueDate || "No Due Date";

        // Create a div for the status with appropriate class
        const statusDiv = document.createElement('div');
        statusDiv.textContent = task.status.text;
        statusDiv.classList.add('status-' + task.status.text.toLowerCase().replace(' ', '-'));
        statusDiv.style.borderRadius = '50px';
        statusDiv.style.width = 'fit-content';
        statusDiv.style.padding = '3px 15px';
        row.querySelector('.task-status').innerHTML = ''; // Clear existing content
        row.querySelector('.task-status').appendChild(statusDiv);

        row.querySelector('.delete-button').onclick = function () {
          deleteTask(task.id);
        };

        const assigneeUl = row.querySelector('.task-assignees');
        task.persons.forEach((person) => {
          const assigneeLi = createAssigneeLi(assigneeLiTemplate, task, person);
          assigneeUl.appendChild(assigneeLi);
        });

        tasksTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error('Error fetching tasks:', error));
}

function createAssigneeLi(assigneeLiTemplate, task, assignment) {
  const assigneeLi = document.importNode(assigneeLiTemplate, true);
  assigneeLi.querySelector('.assigneeName').textContent =
    assignment.person.name;
  assigneeLi.querySelector('.unassignButton').onclick = function () {
    fetch(`${apiUrl}/tasks/${task.id}/assignee/${assignment.person.id}`, {
      method: 'DELETE',
    }).then(populateTasksTable);
  };
  return assigneeLi;
}

// Function to add a new task
function addTask() {
  const taskName = document.getElementById('taskName').value;
  const taskDueDate = document.getElementById('taskDueDate').value;
  const taskStatus = document.getElementById('taskStatus').value;
  const selectedAssigneeIds = Array.from(document.getElementById('assignees').selectedOptions).map(option => +option.value); // Convert to integers
  console.log("SELECTED PEOPLE", selectedAssigneeIds)
  const taskPriority = document.getElementById('taskPriority').value;
  // const selectedAssigneeIds = Array.from(selectedAssigneesOptions).map(
  //   (option) => +option.value,
  // );

  const requestBody = {
    assignedPersonId: selectedAssigneeIds,
    dueDate: taskDueDate,
    name: taskName,
    priority: +taskPriority,
    statusId: +taskStatus,
  };

  console.log('Request Body:', requestBody);

  fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then(() => {
      populateTasksTable(); // Refresh the table
      document.getElementById('taskForm').reset(); // Reset the form
      Swal.fire({
        icon: 'success',
        title: 'Task Added',
        text: 'The task has been successfully added.',
      });
      
    })
    .catch((error) => {
      console.error('Error adding task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the task. Please try again.',
      });
    });
}

// Function to delete a task
function deleteTask(id) {
  fetch(`${apiUrl}/tasks/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      populateTasksTable(); // Refresh the table
    })
    .catch((error) => console.error('Error deleting task:', error));
}

// NEW FEATURE: ANALYTICS AND REPORTS

// Function to fetch and display analytics data
// function fetchAnalyticsData() {
//   fetch(`${apiUrl}/tasks/analytics/completion-rates`)
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById('completion-rate-value').textContent = `${data.completionRate}%`;
//     })
//     .catch((error) => console.error('Error fetching completion rates:', error));

//   fetch(`${apiUrl}/tasks/analytics/total-time-spent`)
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById('time-spent-value').textContent = `${data.totalTimeSpent} minutes`;
//     })
//     .catch((error) => console.error('Error fetching time spent:', error));
// }

// NEW FEATURE: ANALYTICS AND REPORTS

// Function to fetch and display analytics data
function fetchAnalyticsData() {
  console.log('Fetching task completion rates...');
  fetch(`${apiUrl}/tasks/analytics/completion-rates`)
    .then((response) => {
      console.log('Received response for completion rates:', response);
      return response.json();
    })
    .then((data) => {
      console.log('Parsed JSON data for completion rates:', data);
      document.getElementById('completion-rate-value').textContent = `${data.completionRate}%`;
      console.log('Updated completion rate value in the DOM');
    })
    .catch((error) => {
      console.error('Error fetching completion rates:', error);
    });

  console.log('Fetching total time spent on tasks...');
  fetch(`${apiUrl}/tasks/analytics/total-time-spent`)
    .then((response) => {
      console.log('Received response for total time spent:', response);
      return response.json();
    })
    .then((data) => {
      console.log('Parsed JSON data for total time spent:', data);
      document.getElementById('time-spent-value').textContent = `${data.totalTimeSpent} minutes`;
      console.log('Updated total time spent value in the DOM');
    })
    .catch((error) => {
      console.error('Error fetching time spent:', error);
    });
}

// Function to populate the users dropdown for productivity trends
function populateUsersDropdown() {
  fetch(`${apiUrl}/persons`)
    .then((response) => response.json())
    .then((users) => {
      const userSelect = document.getElementById('userSelect');
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
      });
    })
    .catch((error) => console.error('Error fetching users:', error));
}

// Helper function to get the background color from a CSS class
function getBackgroundColorFromClass(className) {
  const div = document.createElement('div');
  div.className = className;
  document.body.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  document.body.removeChild(div);
  return color;
}

function loadTrends(userId = null) {
  const url = userId && userId !== 'all' ? `${apiUrl}/tasks/analytics/productivity-trends/${userId}` : `${apiUrl}/tasks/analytics/productivity-trends`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched trends data:', data); // Log the trends data
      if (!data.trends) {
        throw new Error('Trends data is undefined');
      }
      const ctx = document.getElementById('productivityTrendsChart').getContext('2d');
      if (productivityTrendsChart) {
        productivityTrendsChart.destroy(); // Destroy the previous chart instance
      }
      const backgroundColors = data.trends.map(trend => {
        switch (trend.status.toLowerCase()) {
          case 'pending':
            return getBackgroundColorFromClass('status-pending');
          case 'in progress':
            return getBackgroundColorFromClass('status-in-progress');
          case 'completed':
            return getBackgroundColorFromClass('status-completed');
          case 'on hold':
            return getBackgroundColorFromClass('status-on-hold');
          default:
            return 'rgba(201, 203, 207, 0.6)'; // Grey for unknown status
        }
      });
      productivityTrendsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.trends.map(trend => trend.name),
          datasets: [{
            label: 'Time Spent (minutes)',
            data: data.trends.map(trend => trend.timeSpent),
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch((error) => console.error('Error fetching productivity trends:', error));
}

// Helper function to get the background color from a CSS class
function getBackgroundColorFromClass(className) {
  const div = document.createElement('div');
  div.className = className;
  document.body.appendChild(div);
  const color = window.getComputedStyle(div).backgroundColor;
  document.body.removeChild(div);
  return color;
}

function loadTrends(userId = null) {
  const url = userId && userId !== 'all' ? `${apiUrl}/tasks/analytics/productivity-trends/${userId}` : `${apiUrl}/tasks/analytics/productivity-trends`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched trends data:', data); // Log the trends data
      if (!data.trends) {
        throw new Error('Trends data is undefined');
      }
      const ctx = document.getElementById('productivityTrendsChart').getContext('2d');
      if (productivityTrendsChart) {
        productivityTrendsChart.destroy(); // Destroy the previous chart instance
      }
      const backgroundColors = data.trends.map(trend => {
        switch (trend.status.toLowerCase()) {
          case 'pending':
            return getBackgroundColorFromClass('status-pending');
          case 'in progress':
            return getBackgroundColorFromClass('status-in-progress');
          case 'completed':
            return getBackgroundColorFromClass('status-completed');
          case 'on hold':
            return getBackgroundColorFromClass('status-on-hold');
          default:
            return 'rgba(201, 203, 207, 0.6)'; // Grey for unknown status
        }
      });
      productivityTrendsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.trends.map(trend => trend.name),
          datasets: [{
            label: 'Time Spent (minutes)',
            data: data.trends.map(trend => trend.timeSpent),
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Tasks'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time Spent (minutes)'
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false // Ensure the chart is responsive
        }
      });
    })
    .catch((error) => console.error('Error fetching productivity trends:', error));
}


document.addEventListener('DOMContentLoaded', () => {
  // Populate the status options on page load
  // populateStatusOptions();

  // Populate the assignees options on page load
  // populateAssigneesOptions();

  // Event listener for form submission
  // document.getElementById('taskForm').addEventListener('submit', addTask);

  // Populate the tasks table on page load
  populateTasksTable();

  // NEW FEATURE: ANALYTICS AND REPORTS

  // Populate the users dropdown for productivity trends on page load
  populateUsersDropdown();

  // Load analytics for all users on page load
  loadTrends(); 

  fetchAnalyticsData();
});
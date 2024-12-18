function checkToken() {
    fetch(`auth/check-token`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("data", data)
        if (data.message === "Token is valid") {
            console.log('Token is valid:', data.user);
        } 
        if (data.message != "Token is valid") {
            console.error('Invalid token:', data.message);
            window.location.href = '/login.html'; // Redirect to login.html if token is invalid
        }
    })
    .catch(error => {
        console.error('Error checking token:', error);
        // window.location.href = '/login.html'; // Redirect to login.html on error
    });
}

checkToken(); // Call the function to check the token


document.addEventListener('DOMContentLoaded', function() {
    const addNewTaskButton = document.getElementById('addNewTask');

    if (addNewTaskButton) {
        addNewTaskButton.addEventListener('click', function() {
            // Prefetch data for status and assignees
            let statusOptions = [];
            let assigneeOptions = [];

            function prefetchData() {
                return Promise.all([
                    fetch(`${apiUrl}/statuses`)
                        .then((response) => response.json())
                        .then((statuses) => {
                            statusOptions = statuses;
                        }),
                    fetch(`${apiUrl}/persons`)
                        .then((response) => response.json())
                        .then((persons) => {
                            assigneeOptions = persons;
                        })
                ]);
            }

            // Show loading screen
            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we fetch the data.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            prefetchData().then(() => {
                Swal.close(); // Close loading screen
                Swal.fire({
                    title: 'Add New Task',
                    html: `
                        <form id="taskForm" class="mt-2">
                            <div>
                                <p style="display: flex; flex-direction: column;margin-bottom: 20px;">
                                    <label for="taskName">Task Name</label>
                                    <input type="text" id="taskName" name="taskName" class="swal2-input" required />
                                </p>
                                <p style="display: flex; flex-direction: column;margin-bottom: 20px;">
                                    <label for="taskDueDate">Due Date:</label>
                                    <input type="date" id="taskDueDate" name="taskDueDate" class="swal2-input" required />
                                </p>
                                <p style="display: flex; flex-direction: column;margin-bottom: 20px;">
                                    <label for="taskStatus">Status:</label>
                                    <select id="taskStatus" name="taskStatus" class="swal2-select" required>
                                        ${statusOptions.map(status => `<option value="${status.id}">${status.text}</option>`).join('')}
                                    </select>
                                </p>

                        
                                <p style="display: flex; flex-direction: column;margin-bottom: 20px;">
                                <label for="taskPriority">Priority:</label>
                                 <select id="taskPriority" name="taskPriority" class="swal2-select" required>
                                  <option value="1">Low</option>
                                   <option value="2">Medium</option>
                                  <option value="3">High</option>
                                 </select>
                                 </p>

                                <p class="assignto" style="display: flex; flex-direction: column;">
                                    <label for="assignees">Assign To:</label>
                                    <select id="assignees" name="assignees" class="swal2-select" multiple required>
                                        ${assigneeOptions.map(person => `<option value="${person.id}">${person.name}</option>`).join('')}
                                    </select>
                                </p>
                                <button class="button mt-2" type="submit">
                                    <span class="button-content">Add Task</span>
                                </button>
                            </div>
                        </form>
                    `,
                    showConfirmButton: false, // Remove the OK button
                    showCloseButton: true,
                    focusConfirm: false,
                    didOpen: () => {
                        document.getElementById('taskForm').addEventListener('submit', function(event) {
                            event.preventDefault();
                            const taskName = document.getElementById('taskName').value;
                            const taskDueDate = document.getElementById('taskDueDate').value;
                            const taskStatus = document.getElementById('taskStatus').value;
                            const selectedAssigneeIds = Array.from(document.getElementById('assignees').selectedOptions).map(option => +option.value); // Convert to integers
                            const taskPriority = document.getElementById('taskPriority').value;
                          
                            if (!taskName || !taskDueDate || !taskStatus || selectedAssigneeIds.length === 0 || !taskPriority) {
                              Swal.showValidationMessage('Please fill out all fields');
                              return;
                            }
                          
                            addTask();
                          });
                          
                    }
                });
            });
        });
    }
});

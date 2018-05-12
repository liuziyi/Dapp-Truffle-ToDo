pragma solidity ^0.4.2;

contract ToDo {
	// Model a Task
	struct Task {
		uint id;
		string name;
		string category;
	}

	// Store Tasks
	// Fetch Task
	mapping(uint => Task) public tasks;
	// Store Tasks Count
	uint public tasksCount;
	
	// add task event
	event addTaskEvent(
		uint indexed _taskId
	);

	// Constructor
	function ToDo() public {
		addTask("Task 1", "Work");
		addTask("Task 2", "Personal");
	}

	// Add Task
	function addTask(string _name, string _category) public {
		tasksCount++;
		tasks[tasksCount] = Task(tasksCount, _name, _category);

		// trigger add task event
		addTaskEvent(tasksCount);
	}
}


var ToDo = artifacts.require("./ToDo.sol");

contract("ToDo", function(accounts){
	var todoInstance;

	it("initializes with two tasks", function(){
		return ToDo.deployed().then(function(instance){
			return instance.tasksCount();
		}).then(function(count){
			assert.equal(count,2);
		});
	});

	it("initializes the tasks with the correct values", function(){
		return ToDo.deployed().then(function(instance){
			todoInstance = instance;
			return todoInstance.tasks(1);
		}).then(function(task){
			assert.equal(task[0], 1, "contains the correct id");
			assert.equal(task[1], "Task 1", "contains the correct name");
			assert.equal(task[2], "Work", "contains the correct category");
			return todoInstance.tasks(2);
		}).then(function(task){
			assert.equal(task[0], 2, "contains the correct id");
			assert.equal(task[1], "Task 2", "contains the correct name");
			assert.equal(task[2], "Personal", "contains the correct category");
		});
	});

	it("can add a task", function(){
		return ToDo.deployed().then(function(instance){
			todoInstance = instance;
			return todoInstance.addTask("Task 3", "Personal")
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, "an event was triggered");
      		assert.equal(receipt.logs[0].event, "addTaskEvent", "the event type is correct");
			return todoInstance.tasksCount();
		}).then(function(count){
			assert.equal(count,3);
		});
	});

});
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint256 id;
        string description;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 id, string description, bool completed);

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _description) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _description, false);
        emit TaskCreated(taskCount, _description, false);
    }

    function toggleTask(uint256 _taskId) public {
        Task storage task = tasks[_taskId];
        task.completed = !task.completed;
    }
}

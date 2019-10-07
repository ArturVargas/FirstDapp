
pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

//Definimos una estructura para las tareas.
// Las estructuras 
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    mapping(uint => Task) public tasks;

    constructor() public {
        createTask("Mi First Dapp");
    }

    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}
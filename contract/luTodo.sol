// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title On-chain Todo List
/// @notice Each address has its own todo array. Todos are small structs stored on-chain.
contract TodoList {
    uint256 public constant MAX_TEXT_LENGTH = 200;

    struct Todo {
        uint256 id;         // index within the user's array
        string text;
        bool completed;
        bool deleted;      // soft-delete to preserve indices
        uint256 timestamp;
    }

    // mapping from user -> their todos
    mapping(address => Todo[]) private todos;

    // events
    event TodoCreated(address indexed user, uint256 indexed id, string text, uint256 timestamp);
    event TodoToggled(address indexed user, uint256 indexed id, bool completed, uint256 timestamp);
    event TodoDeleted(address indexed user, uint256 indexed id, uint256 timestamp);
    event TodoEdited(address indexed user, uint256 indexed id, string newText, uint256 timestamp);

    /// @notice Create a new todo for caller
    function createTodo(string calldata text) external {
        uint256 len = bytes(text).length;
        require(len > 0, "Empty todo");
        require(len <= MAX_TEXT_LENGTH, "Todo too long");

        uint256 id = todos[msg.sender].length;
        todos[msg.sender].push(Todo({
            id: id,
            text: text,
            completed: false,
            deleted: false,
            timestamp: block.timestamp
        }));

        emit TodoCreated(msg.sender, id, text, block.timestamp);
    }

    /// @notice Toggle todo completed state (caller only)
    function toggleCompleted(uint256 id) external {
        require(id < todos[msg.sender].length, "Invalid id");
        Todo storage t = todos[msg.sender][id];
        require(!t.deleted, "Todo deleted");

        t.completed = !t.completed;
        t.timestamp = block.timestamp;

        emit TodoToggled(msg.sender, id, t.completed, block.timestamp);
    }

    /// @notice Soft-delete a todo (caller only)
    function deleteTodo(uint256 id) external {
        require(id < todos[msg.sender].length, "Invalid id");
        Todo storage t = todos[msg.sender][id];
        require(!t.deleted, "Already deleted");

        t.deleted = true;
        t.timestamp = block.timestamp;

        emit TodoDeleted(msg.sender, id, block.timestamp);
    }

    /// @notice Edit a todo's text (caller only)
    function editTodo(uint256 id, string calldata newText) external {
        uint256 len = bytes(newText).length;
        require(len > 0, "Empty text");
        require(len <= MAX_TEXT_LENGTH, "Todo too long");
        require(id < todos[msg.sender].length, "Invalid id");

        Todo storage t = todos[msg.sender][id];
        require(!t.deleted, "Todo deleted");

        t.text = newText;
        t.timestamp = block.timestamp;

        emit TodoEdited(msg.sender, id, newText, block.timestamp);
    }

    /// @notice Get number of todos for a user
    function getTodoCount(address user) external view returns (uint256) {
        return todos[user].length;
    }

    /// @notice Get all todos for a user (including deleted)
    /// @dev For large arrays this can be expensive; limit on frontend or implement paging if needed.
    function getTodos(address user) external view returns (Todo[] memory) {
        return todos[user];
    }

    /// @notice Get a single todo by id for a user
    function getTodo(address user, uint256 id) external view returns (Todo memory) {
        require(id < todos[user].length, "Invalid id");
        return todos[user][id];
    }
}

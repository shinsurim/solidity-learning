// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

abstract contract ManagedAccess {
    address public owner;
    address public manager;

    mapping(address => bool) public managers;
    address[] public managerList;

    mapping(address => bool) public confirmed;
    uint256 public confirmCount;

    constructor(address _owner, address _manager) {
        owner = _owner;
        manager = _manager;

        managers[_manager] = true;
        managerList.push(_manager);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "You are not authorized to manage this token");
        _;
    }

    modifier onlyAllConfirmed() {
        require(managers[msg.sender], "You are not a manager");
        require(confirmCount == managerList.length, "Not all confirmed yet");
        _;
    }

    function addManager(address _manager) external onlyOwner {
        require(_manager != address(0), "Invalid manager");
        require(!managers[_manager], "Already manager");

        managers[_manager] = true;
        managerList.push(_manager);
    }

    function confirm() external {
        require(managers[msg.sender], "You are not a manager");
        require(!confirmed[msg.sender], "Already confirmed");

        confirmed[msg.sender] = true;
        confirmCount++;
    }
}
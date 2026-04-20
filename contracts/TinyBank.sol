//staking
//deposit(MyToken): 예금 / withdraw(MyToken): 출금

// MyToken : token balance management
//  - the balance of TinyBank address
// TinyBank : deposit / withdraw vault
//  - users token management
//  - user --> deposit --> TinyBank --> transfer(user --> TinyBank)


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;
}

contract TinyBank{
    event Staked(address, uint256);

    IMyToken public stakingToken; //저금할 토큰 배포
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken){ //토큰의 주소를 파라미터로 
        stakingToken = _stakingToken;
    }

    function stake(uint256 _amount) external{
        require(_amount>=0, "cannot stake 0 amount");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        staked[msg.sender] += _amount;
        totalStaked += _amount;
        emit Staked(msg.sender, _amount);
    }
}
// Token : smart contract based
// BTC, ETH, XRP, KAIA : native token

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; // uint8 --> 8 bit unsigned int, uint16, ... , uint256 / 소수점 아래 몇 자리까지 허용할지

    //토큰이 몇 개 발행되어있는지 확인하는 변수
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint8 _decimal) {
        name = _name;
        symbol = _symbol;
        decimals = _decimal;
        //transaction: from, to, data, value, gas, ... 필드 있음
        _mint(1*10**uint256(decimals), msg.sender); //1MT
        //totalSupply는 첫 발행 이후 추가 발행이 안 돔
    }
    

    //internal 함수는 _를 붙여줌(우리만의 약속)
    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceOf[owner] += amount;
    }

    
    

    /*
    //토큰을 조회할 수 있는 함수
    //external: 외부에서 호출, view: 필드를 보기만 함
    function totalSupply() external view returns (uint256){
        return totalSupply;
    }

    function balanceOf(address owner) external view returns (uint256){
        return balanceOf[owner];
    }

    function name() external view returns (string memory){
        return name;
    }
    */
}
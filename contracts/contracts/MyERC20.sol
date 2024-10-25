// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract MyERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    event AddLiquidity(address indexed from, uint256 amount, uint256 ethAmount);

    mapping(address => uint256) public balances;

    // 流通性份额
    mapping(address => uint256) public liquidityBalances;

    mapping(address => mapping(address => uint256)) public allowance;

    uint256 public totalSupply = 0;

    uint256 public ethTotalSupply = 0;

    uint256 public totalLiquidity = 0;

    string public name;
    string public symbol; 

    address public owner;

    constructor(string memory _name, string memory _symbol, address _owner) {
        name = _name;
        symbol = _symbol;
        owner = _owner;
    }

    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y; 
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    receive() external payable {
    }

    function addLiquidity(uint256 amount) public payable returns(uint liquidity) {
        require(msg.sender == owner, "Only owner can add liquidity");
        uint ethAmount = msg.value;
        payable(address(this)).transfer(ethAmount);

        if (totalLiquidity == 0) {
            liquidity = sqrt(amount * ethAmount);
        } else {
            liquidity = min(amount * totalLiquidity / totalSupply, ethAmount * totalLiquidity / ethTotalSupply);
        }

        require(liquidity > 0, "Insufficient liquidity");

        totalSupply += amount;
        ethTotalSupply += ethAmount;

        // 更新流通性
        totalLiquidity += liquidity;
        liquidityBalances[msg.sender] += liquidity;

        emit AddLiquidity(msg.sender, amount, ethAmount);
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0, 'INSUFFICIENT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'INSUFFICIENT_LIQUIDITY');
        amountOut = amountIn * reserveOut / (reserveIn + amountIn);
    }


    function transfer(address recipient, uint256 amount) public returns (bool) {
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        balances[sender] -= amount;
        balances[recipient] += amount;
        // 实际忽略 allowance
        // allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }



    function mint(uint256 amountOutMin) external payable returns (uint amountOut) {
        // 使用 msg.value 的 eth 进行兑换
        uint amountIn = msg.value;
        uint balance0 = ethTotalSupply;
        uint balance1 = totalSupply;

        amountOut = getAmountOut(amountIn, balance0, balance1);
        require(amountOut > amountOutMin, "insufficient output amount");

        payable(address(this)).transfer(amountIn);
        ethTotalSupply += amountIn;
        balances[msg.sender] += amountOut;
        totalSupply += amountOut;
        emit Transfer(address(0), msg.sender, amountOut);

    }
}
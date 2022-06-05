// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

interface IERC20 
    {
        function transferFrom (
            address from,
            address to,
            uint256 amount
        ) external returns (bool);

        function balanceOf (
            address from
        ) external returns (uint256);

        function approve(
            address from, 
            uint256 balance
        ) external;
    }

contract uasMall is Ownable {

uint256 id;
address tokenAddress = 0xE00C7f2200aA3e4fe3240CEB13d29C346D493242;

    struct shoe 
    {
       string brand;
       string model;
       uint256 size;
       uint256 price;
       uint256 sku;
       bool sold;
       address buyer;
    }

    mapping(uint256 => shoe) public stock;

    function addShoe (string memory _brand, string memory _model, uint256 _size, uint256 _price) public onlyOwner
    {
       stock[id].brand = _brand; 
       stock[id].model = _model;
       stock[id].size = _size;
       stock[id].price = _price;
       stock[id].sold = false;
       stock[id].buyer = address(this);

       id++;
    }

    function buyShoe (uint256 _id) public 
    {
        uint256 balance = IERC20(tokenAddress).balanceOf(msg.sender);
        require( balance >= stock[_id].price, "Money not enuf");
        //IERC20(tokenAddress).approve(address(this), stock[_id].price);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), stock[_id].price);
        stock[_id].sold = true;
        stock[_id].buyer = msg.sender;
    }

    function getAllStock() public view returns (shoe[] memory){
        shoe[] memory getAllStocks = new shoe[](id);
        for(uint256 i=0; i<id; i++){
            getAllStocks[i] = stock[i];
        }

        return getAllStocks;
    }

}
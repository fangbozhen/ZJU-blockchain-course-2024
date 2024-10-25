// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./MyERC20.sol"; 

contract BuyMyRoom {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event HouseListed(uint256 tokenId, uint256 price, address owner);

    event HouseUnlisted(uint256 tokenId, address owner);

    event HouseSold(uint256 tokenId, uint256 price, address buyer, address seller);

    uint public totalHouse = 0;

    MyERC20 public myERC20; 

    address creater;

    // struct for houst information
    struct House {
        address owner;
        uint256 listedTimestamp;
        bool isListed;
        string name; 
        string description;
        uint256 price; 
    }

    struct HouseInfo {
        uint256 id;
        string name;
        string description;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => House) public houses; // A map from house-index to its information
    
    
    modifier onlyOwner(uint256 tokenId) {
        require(houses[tokenId].owner == msg.sender, "Only owner can call this function");
        _;
    }

    modifier onlyListedHouse(uint256 tokenId) {
        require(houses[tokenId].isListed, "House is not listed");
        _;
    }

    constructor() {
        myERC20 = new MyERC20("MyERC20", "MYT", msg.sender);
        creater = msg.sender;
        _mint(0, "House 1", "Description 1", msg.sender);
        _mint(1, "House 2", "Description 2", msg.sender);
    }

    function _mint(uint256 tokenId, string memory name, string memory desciption, address owner) private {
        totalHouse += 1;
        houses[tokenId] = House(owner, 0, false, name, desciption, 0);
    }

    function _listHouse(uint256 tokenId, uint256 price) onlyOwner(tokenId) private {
        require(price > 0, "Price should be greater than 0");

        houses[tokenId].isListed = true;
        houses[tokenId].listedTimestamp = block.timestamp;
        houses[tokenId].price = price;

        emit HouseListed(tokenId, price, msg.sender);
    }

    function _unlistHouse(uint256 tokenId) onlyOwner(tokenId) onlyListedHouse(tokenId) private {
        houses[tokenId].isListed = false;
        houses[tokenId].price = 0;

        emit HouseUnlisted(tokenId, msg.sender);
    }

    function updateHouseInfo(uint256 tokenId, string memory name, string memory description, uint256 price, bool isListed) onlyOwner(tokenId) public {
        if (isListed && !houses[tokenId].isListed) {
            _listHouse(tokenId, price);
        } else if (!isListed && houses[tokenId].isListed) {
            _unlistHouse(tokenId);
        }
        houses[tokenId].name = name;
        houses[tokenId].description = description;
    }

    function buyHouse(uint256 tokenId) onlyListedHouse(tokenId) public {
        require(myERC20.balances(msg.sender) >= houses[tokenId].price, "Insufficient balance");

        address seller = houses[tokenId].owner;
        myERC20.transferFrom(msg.sender, seller, houses[tokenId].price);

        uint256 poundage = (block.timestamp - houses[tokenId].listedTimestamp) / 100 * houses[tokenId].price / 100;
        myERC20.transferFrom(msg.sender, creater, poundage);

        houses[tokenId].owner = msg.sender;
        houses[tokenId].isListed = false;
        houses[tokenId].price = 0;

        emit HouseSold(tokenId, houses[tokenId].price, msg.sender, seller);
    }

    function getUserHouses(address user) external view returns (HouseInfo[] memory) {
        uint256 cnt = 0;
        for (uint256 i = 0; i < totalHouse; i++) {
            if (houses[i].owner == user) {
                cnt += 1;
            }
        }
        HouseInfo[] memory userHouses = new HouseInfo[](cnt);
        uint256 myHouseCount = 0;

        for (uint256 i = 0; i < totalHouse; i++) {
            if (houses[i].owner == user) {
                userHouses[myHouseCount].id = i;
                userHouses[myHouseCount].name = houses[i].name;
                userHouses[myHouseCount].description = houses[i].description;
                userHouses[myHouseCount].price = houses[i].price;
                userHouses[myHouseCount].isListed = houses[i].isListed;
                myHouseCount += 1;
            }
        }

        return userHouses;
    }

    function getAllListedHouses() public view returns (HouseInfo[] memory) {
        uint256 cnt = 0;
        for (uint256 i = 0; i < totalHouse; i++) {
            if (houses[i].isListed) {
                cnt += 1;
            }
        }
        HouseInfo[] memory listedHouses = new HouseInfo[](cnt);
        uint256 listedHouseCount = 0;

        for (uint256 i = 0; i < totalHouse; i++) {
            if (houses[i].isListed) {
                listedHouses[listedHouseCount].id = i;
                listedHouses[listedHouseCount].name = houses[i].name;
                listedHouses[listedHouseCount].description = houses[i].description;
                listedHouses[listedHouseCount].price = houses[i].price;
                listedHouses[listedHouseCount].isListed = houses[i].isListed;
                listedHouseCount += 1;
            }
        }

        return listedHouses;
    }
}
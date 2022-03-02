// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Hero is ERC721 {
    
    constructor() ERC721("StockAssetHero", "SAH") {
        console.log("Stock Asset Hero is ready!");
    }
}
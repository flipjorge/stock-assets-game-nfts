// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Hero is ERC721 {

    uint private _tokenId;

    constructor() ERC721("StockAssetHero", "SAH") {
        //
    }

    function mint() public {
        
        _tokenId += 1;
        _safeMint(msg.sender, _tokenId);
    }
}
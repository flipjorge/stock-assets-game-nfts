// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Hero is ERC721, Ownable {

    uint private _tokenId;

    constructor() ERC721("StockAssetHero", "SAH") {
        //
    }

    function mint(uint blueprintId) public payable {     
        require(blueprintId < blueprints.length, "Invalid blueprint id");
        require(msg.value == blueprints[blueprintId].price, "Value not matching item's price");

        _tokenId += 1;
        _safeMint(msg.sender, _tokenId);

        _tokenIdToBpId[_tokenId] = blueprintId;
    }

    //Blueprint
    event BlueprintAdded(uint index);

    struct Blueprint {
        uint id;
        string name;
        uint price;
    }

    Blueprint[] blueprints;
    mapping(uint => uint) private _tokenIdToBpId;

    function addBlueprint(string memory name, uint price) public onlyOwner {
        
        uint _index = blueprints.length;
        
        Blueprint memory blueprint = Blueprint({
            id: _index,
            name: name,
            price: price
        });
        
        blueprints.push(blueprint);

        emit BlueprintAdded(_index);
    }
    
    function getBlueprint(uint id) public view returns(Blueprint memory) {
        return blueprints[id];
    }

    function getBlueprints() public view returns(Blueprint[] memory) {
        return blueprints;
    }

    function getTokenBlueprint(uint tokenId) public view returns(Blueprint memory) {
        require(tokenId <= blueprints.length, "tokenId doesn't exists");
        return blueprints[_tokenIdToBpId[tokenId]];
    }
}
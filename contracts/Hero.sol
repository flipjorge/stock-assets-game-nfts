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

    //Blueprint
    event BlueprintAdded(uint index);

    struct Blueprint {
        string name;
    }

    Blueprint[] blueprints;

    function addBlueprint(string memory name) public {
        Blueprint memory blueprint = Blueprint({
            name: name
        });

        uint _index = blueprints.length;
        blueprints.push(blueprint);

        emit BlueprintAdded(_index);
    }
    
    function getBlueprint(uint index) public view returns(Blueprint memory) {
        return blueprints[index];
    }

    function getBlueprints() public view returns(Blueprint[] memory) {
        return blueprints;
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Hero is ERC721Enumerable, Ownable {

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

    //User tokens
    function getUserTokensIds(address user) public view returns(uint[] memory) {
        uint balance = balanceOf(user);
        uint[] memory tokenIds = new uint[](balance);

        for (uint256 i = 0; i < balance; i++)
            tokenIds[i] = tokenOfOwnerByIndex(user,i);

        return tokenIds;
    }

    function getUserTokensBlueprints(address user) public view returns(Blueprint[] memory) {
        uint[] memory tokenIds = getUserTokensIds(user);
        Blueprint[] memory tokenBlueprints = new Blueprint[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenBlueprints[i] = getTokenBlueprint(tokenIds[i]);
        }

        return tokenBlueprints;
    }
}
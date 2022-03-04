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

    //Template
    event TemplateAdded(uint index);

    struct Template {
        string name;
    }

    Template[] templates;

    function addTemplate(string memory name) public {
        Template memory template = Template({
            name: name
        });

        uint _index = templates.length;
        templates.push(template);

        emit TemplateAdded(_index);
    }
    
    function getTemplate(uint index) public view returns(Template memory) {
        return templates[index];
    }

    function getTemplates() public view returns(Template[] memory) {
        return templates;
    }
}
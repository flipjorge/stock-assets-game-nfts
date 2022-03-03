const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hero Tests", () => {

    let heroContract;
    let owner;

    beforeEach(async () => {
        const heroContractFactory = await ethers.getContractFactory("Hero");
        heroContract = await heroContractFactory.deploy();

        [owner] = await ethers.getSigners();
    });

    it("First mint should start with id 1", async () => {
        
        await expect(await heroContract.mint())
        .to.emit(heroContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, 1)
    });

    it("Each mint should increase token id", async () => {
        for(let i = 1; i <= 3; i++) {
            
            await expect(await heroContract.mint())
            .to.emit(heroContract, "Transfer")
            .withArgs(ethers.constants.AddressZero, owner.address, i)
        }
    });
});
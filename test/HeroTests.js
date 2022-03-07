const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hero Tests", () => {

    let heroContract;
    let owner;

    beforeEach(async () => {
        const heroContractFactory = await ethers.getContractFactory("Hero");
        heroContract = await heroContractFactory.deploy();

        [owner] = await ethers.getSigners();

        await heroContract.addBlueprint("Cratos");
        await heroContract.addBlueprint("Aloy");
    });

    it("First mint should start with id 1", async () => {
        
        await expect(heroContract.mint(0))
        .to.emit(heroContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, 1)
    });

    it("Each mint should increase token id", async () => {
        for(let i = 1; i <= 3; i++) {
            
            await expect(heroContract.mint(0))
            .to.emit(heroContract, "Transfer")
            .withArgs(ethers.constants.AddressZero, owner.address, i)
        }
    });

    it("Providing an invalid blueprint id should revert", async() => {
        await expect(heroContract.mint(11)).to.be.revertedWith("Invalid blueprint id");
    });

    it("Adding an hero blueprint should emit an event with its index as arg", async() => {
        
        await expect(heroContract.addBlueprint("Batman")).to.emit(heroContract, "BlueprintAdded").withArgs(2);
        await expect(heroContract.addBlueprint("Songoku")).to.emit(heroContract, "BlueprintAdded").withArgs(3);
    });

    it("Get all blueprints should match blueprints added ", async() => {

        const blueprints = await heroContract.getBlueprints();
        
        expect(blueprints.length).to.be.equal(2);
        expect(blueprints[0].name).to.be.equal("Cratos");
        expect(blueprints[1].name).to.be.equal("Aloy");
    });

    it("Get blueprint by index should match blueprints added", async() => {
        
        let blueprint = await heroContract.getBlueprint(0);
        expect(blueprint.name).to.be.equal("Cratos");

        blueprint = await heroContract.getBlueprint(1);
        expect(blueprint.name).to.be.equal("Aloy");
    });

    it("Get token's blueprint should match id and name", async() => {

        await heroContract.mint(0);
        let blueprint = await heroContract.getTokenBlueprint(1);

        expect(blueprint.id).to.be.equal(0);
        expect(blueprint.name).to.be.equal("Cratos");

        await heroContract.mint(1);
        blueprint = await heroContract.getTokenBlueprint(2);

        expect(blueprint.id).to.be.equal(1);
        expect(blueprint.name).to.be.equal("Aloy");
    });

    it("Get blueprint with a invalid token id should revert", async() => {
        
        await expect(heroContract.getTokenBlueprint(10)).to.be.revertedWith("tokenId doesn't exists");
    });

});
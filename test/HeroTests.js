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

    it("Adding an hero blueprint should emit an event with its index as arg", async() => {
        
        await expect(await heroContract.addBlueprint("Cratos")).to.emit(heroContract, "BlueprintAdded").withArgs(0);
        await expect(await heroContract.addBlueprint("Alloy")).to.emit(heroContract, "BlueprintAdded").withArgs(1);
    });

    it("Get all blueprints should match blueprints added ", async() => {

        await heroContract.addBlueprint("Cratos");
        await heroContract.addBlueprint("Alloy");

        const blueprints = await heroContract.getBlueprints();
        
        expect(blueprints.length).to.be.equal(2);
        expect(blueprints[0].name).to.be.equal("Cratos");
        expect(blueprints[1].name).to.be.equal("Alloy");
    });

    it("Get blueprint by index should match blueprints added", async() => {
        
        await heroContract.addBlueprint("Cratos");
        await heroContract.addBlueprint("Alloy");

        let blueprint = await heroContract.getBlueprint(0);
        expect(blueprint.name).to.be.equal("Cratos");

        blueprint = await heroContract.getBlueprint(1);
        expect(blueprint.name).to.be.equal("Alloy");
    });

});
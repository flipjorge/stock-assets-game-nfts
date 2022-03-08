const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hero Tests", () => {

    let heroContract;
    const price1 = ethers.utils.parseEther("0.001");
    const price2 = ethers.utils.parseEther("0.002");
    const heroNames = ["Cratos", "Aloy", "Axel"];

    beforeEach(async () => {
        
        const heroContractFactory = await ethers.getContractFactory("Hero");
        heroContract = await heroContractFactory.deploy();

        [owner, user1, user2] = await ethers.getSigners();

        await heroContract.addBlueprint(heroNames[0], price1);
        await heroContract.addBlueprint(heroNames[1], price2);
    });

    it("First mint should start with id 1", async () => {
        
        await expect(heroContract.mint(0, {value:price1}))
        .to.emit(heroContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, 1)
    });

    it("Each mint should increase token id", async () => {
        
        for(let i = 1; i <= 3; i++) {
            await expect(heroContract.mint(0, {value:price1}))
            .to.emit(heroContract, "Transfer")
            .withArgs(ethers.constants.AddressZero, owner.address, i)
        }
    });

    it("Each mint should increase smart contracts value", async () => {
        
        for(let i = 1; i <= 5; i++) {
            await heroContract.mint(0, {value:price1});
        }

        const value = await heroContract.provider.getBalance(heroContract.address);
        expect(value).to.be.equal(ethers.utils.parseEther("0.005"));
    });

    it("Providing an invalid blueprint id should revert", async() => {
        
        await expect(heroContract.mint(11)).to.be.revertedWith("Invalid blueprint id");
    });

    it("Minting with wrong value should revert", async () => {
        
        await expect(heroContract.mint(0, {value:ethers.utils.parseEther("0.42")}))
        .to.be.revertedWith("Value not matching item's price");
    });

    it("Adding an hero blueprint should emit an event with its index as arg", async() => {
        
        await expect(heroContract.addBlueprint("Batman", price1)).to.emit(heroContract, "BlueprintAdded").withArgs(2);
        await expect(heroContract.addBlueprint("Songoku", price2)).to.emit(heroContract, "BlueprintAdded").withArgs(3);
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

        await heroContract.mint(0, {value:price1});
        let blueprint = await heroContract.getTokenBlueprint(1);

        expect(blueprint.id).to.be.equal(0);
        expect(blueprint.name).to.be.equal("Cratos");

        await heroContract.mint(1, {value:price2});
        blueprint = await heroContract.getTokenBlueprint(2);

        expect(blueprint.id).to.be.equal(1);
        expect(blueprint.name).to.be.equal("Aloy");
    });

    it("Get blueprint with a invalid token id should revert", async() => {
        
        await expect(heroContract.getTokenBlueprint(10)).to.be.revertedWith("tokenId doesn't exists");
    });

    it("Calling addBlueprint method from not owner address should revert", async () => {
        
        await expect(heroContract.connect(user1).addBlueprint("Axel", price1))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Getting user token balance", async () => {

        await heroContract.mint(0, {value:price1});
        await heroContract.mint(1, {value:price2});

        await expect(await heroContract.balanceOf(owner.address)).to.be.equal(2);
    });

    it("Getting user tokens ids", async () => {

        await heroContract.mint(0, {value:price1});
        await heroContract.mint(1, {value:price2});

        const tokenIds = await heroContract.getUserTokensIds(owner.address);

        expect(tokenIds.length).to.be.equal(2);

        for(let i = 0; i < tokenIds.length; i++) {
            expect(tokenIds[i]).to.be.equal(i+1);
        }
    });

    it("Getting user tokens blueprints", async () => {

        await heroContract.mint(0, {value:price1});
        await heroContract.mint(1, {value:price2});

        const tokenBps = await heroContract.getUserTokensBlueprints(owner.address);

        expect(tokenBps.length).to.be.equal(2);

        for(let i = 0; i < tokenBps.length; i++) {
            expect(tokenBps[i].name).to.be.equal(heroNames[i]);
        }
    });

});
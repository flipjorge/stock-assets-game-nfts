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

    it("Adding an hero template should emit an event with its index as arg", async() => {
        
        await expect(await heroContract.addTemplate("Cratos")).to.emit(heroContract, "TemplateAdded").withArgs(0);
        await expect(await heroContract.addTemplate("Alloy")).to.emit(heroContract, "TemplateAdded").withArgs(1);
    });

    it("Get all templates should match templates added ", async() => {

        await heroContract.addTemplate("Cratos");
        await heroContract.addTemplate("Alloy");

        const templates = await heroContract.getTemplates();
        
        expect(templates.length).to.be.equal(2);
        expect(templates[0].name).to.be.equal("Cratos");
        expect(templates[1].name).to.be.equal("Alloy");
    });

    it("Get template by index should match templates added", async() => {
        
        await heroContract.addTemplate("Cratos");
        await heroContract.addTemplate("Alloy");

        let template = await heroContract.getTemplate(0);
        expect(template.name).to.be.equal("Cratos");

        template = await heroContract.getTemplate(1);
        expect(template.name).to.be.equal("Alloy");
    });

});
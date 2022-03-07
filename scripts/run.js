async function main() {  
  const heroContractFactory = await hre.ethers.getContractFactory("Hero");
  const heroContract = await heroContractFactory.deploy();

  await heroContract.deployed();

  console.log("Hero deployed to:", heroContract.address);

  await heroContract.addBlueprint("Cratos", ethers.utils.parseEther("0.001"));
  await heroContract.addBlueprint("Aloy", ethers.utils.parseEther("0.002"));

  let mintTx = await heroContract.mint(0, {value:ethers.utils.parseEther("0.001")});
  await mintTx.wait();
  mintTx = await heroContract.mint(1, {value:ethers.utils.parseEther("0.002")});
  await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
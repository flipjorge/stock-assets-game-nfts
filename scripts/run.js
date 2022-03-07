async function main() {  
  const heroContractFactory = await hre.ethers.getContractFactory("Hero");
  const heroContract = await heroContractFactory.deploy();

  await heroContract.deployed();

  console.log("Hero deployed to:", heroContract.address);

  await heroContract.addBlueprint("Cratos");
  await heroContract.addBlueprint("Aloy");

  let mintTx = await heroContract.mint(0);
  await mintTx.wait();
  mintTx = await heroContract.mint(1);
  await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
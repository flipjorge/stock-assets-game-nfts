async function main() {  
  const heroContractFactory = await hre.ethers.getContractFactory("Hero");
  const heroContract = await heroContractFactory.deploy();

  await heroContract.deployed();

  console.log("Hero deployed to:", heroContract.address);

  let mintTx = await heroContract.mint();
  const receipt = await mintTx.wait();

  mintTx = await heroContract.mint();
  await mintTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
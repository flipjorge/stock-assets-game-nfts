async function main() {  
  const heroContractFactory = await hre.ethers.getContractFactory("Hero");
  const heroContract = await heroContractFactory.deploy();

  await heroContract.deployed();

  console.log("Hero deployed to:", heroContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
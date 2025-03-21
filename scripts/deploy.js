const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const InsurancePolicy = await hre.ethers.getContractFactory(
    "InsurancePolicy"
  );
  // Deploy the contract
  const insurance = await InsurancePolicy.deploy();
  await insurance.deployed();
  console.log("InsurancePolicy deployed to:", insurance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

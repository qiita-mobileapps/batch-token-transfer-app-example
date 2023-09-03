require('dotenv').config(); // Load environment variables from a .env file.

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy a contract named 'BatchTokenTransfer' with the specified parameters.
  const contract = await hre.ethers.deployContract('BatchTokenTransfer', [process.env.PARAM_DEPLOY_TOKEN_ADDRESS]);
  await contract.waitForDeployment();

  // Print the deployment information, including the endpoint and contract address.
  console.log("Deployed Batch code to:", process.env.PARAM_ENDPOINT);
  console.log("Batch code Address:", contract.target);
};

main()
  .then(() => process.exit(0)) // Exit with a status code of 0 on success.
  .catch((error) => {
    console.error(error); // Print any errors that occur during execution.
    process.exit(1); // Exit with a status code of 1 on failure.
});

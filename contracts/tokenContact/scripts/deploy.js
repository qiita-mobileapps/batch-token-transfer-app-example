require('dotenv').config(); // Load environment variables from a .env file.

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy a contract : main token
  const contractToken = await hre.ethers.deployContract('PassageToken');
  await contractToken.waitForDeployment();
  
  console.log("Deployed Token code to:", process.env.PARAM_ENDPOINT);
  console.log("Token code Address:", contractToken.target);

};

main()
  .then(() => process.exit(0)) // Exit with a status code of 0 on success.
  .catch((error) => {
    console.error(error); // Print any errors that occur during execution.
    process.exit(1); // Exit with a status code of 1 on failure.
});

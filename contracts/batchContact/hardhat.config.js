require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: '0.8.19',
  paths: {
    sources: './contracts',
    artifacts: '../../artifacts',
  },
  networks: {
    testnet: {
      url: process.env.PARAM_ENDPOINT,
      chainId:  parseInt(process.env.PARAM_ENDPOINT_CHAINID,10),
      accounts: [process.env.PARAM_DEPLOY_PRIVATE_KEY],
    },
  }
}

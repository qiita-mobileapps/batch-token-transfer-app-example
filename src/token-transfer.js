// Authors: Hiren Kavad. Modified by Qiita-Mobileapps Application Development Team.

// Import required modules and libraries
require('dotenv').config(); // Load environment variables from a .env file
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('../artifacts/contracts/BatchTokenTransfer.sol/BatchTokenTransfer.json');
const fs = require('fs');
const csv = require('@fast-csv/parse');
const { Accounts } = require('web3-eth-accounts');

// Set the batch size and initialize arrays for data storage
let BATCH_SIZE = process.env.BATCH_SIZE;
let distribAddressData = new Array();
let distribAmountData = new Array();
let allocAddressData = new Array();
let allocAmountData = new Array();

let web3 = new Web3();
let myContract;

// Function to read data from a CSV file
async function readFile() {
  var stream = fs.createReadStream(__dirname + '/addressList.csv');
  let index = 0;

  csv.parseStream(stream)
    .on('error', error => {
      // Handle parsing errors
    })
    .on('data', row => {
      // Check if the row contains a valid Ethereum address
      let isAddress = web3.utils.isAddress(row[0]);
      if (isAddress && row[0] != null && row[0] != '') {

        // Store Ethereum addresses and amounts in arrays
        allocAddressData.push(row[0]);
        allocAmountData.push(web3.utils.toWei(row[1]));

        // console.log("allocAddressData  ", allocAddressData);
        // console.log("allocAmountData  ", allocAmountData);

        index++;
        if (index >= BATCH_SIZE) {
          distribAddressData.push(allocAddressData);
          distribAmountData.push(allocAmountData);
          allocAmountData = [];
          allocAddressData = [];
          index = 0;
        }
      }
    })
    .on('end', rowCount => {
      // Add the last remainder batch
      distribAddressData.push(allocAddressData);
      distribAmountData.push(allocAmountData);
      allocAmountData = [];
      allocAddressData = [];
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      tokenBatch();
    });

}

// Initialize Web3 and contract instance
const init3 = async () => {

  const privateKey = process.env.PRIVATE_KEY;
  const provider = new Web3.providers.HttpProvider(process.env.RPC_NODE);
  web3 = new Web3(provider);

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  console.log('renew accounts  ', account);

  myContract = new web3.eth.Contract(
    MyContract.abi,
    process.env.CONTRACT
  );
  web3.eth.defaultAccount = account.address;

}

const tokenBatch = async () => {

  await init3();
  let account = await myContract.methods.owner().call();
  console.log('From Token forwarding', await myContract.methods.owner().call());

  // Iterate through batches of addresses and amounts
  for (var i = 0; i < distribAddressData.length; i++) {

    /*
      Calculating gas fees.
      When determining gas fees, you can choose to set either a fixed value or 
      calculate dynamically using one of the following options.
    */
    // Static value for gas.
    let gPrice = process.env.GAS_PRICE;
    let gas = process.env.GAS;
    // Dynamically estimate gas.
    gas = await myContract.methods.dropTokens(distribAddressData[i], distribAmountData[i]).estimateGas({ from: account });
    gPrice = await web3.eth.getGasPrice();

    // console.log('Estimated Gas:', gas);
    // console.log('Current Gas Price:', gPrice);

    try {
      console.log('Token forwarding started')
      // Send a transaction to perform the Token transfer with calculated gas and gasPrice
      let r = await myContract.methods.dropTokens(distribAddressData[i], distribAmountData[i]).send({ from: account, gas: gas, gasPrice: gPrice });
      console.log('------------------------')
      console.log("Allocation + transfer was successful.", r.gasUsed, "gas used. Spent:", r.gasUsed * gPrice, "wei");

    } catch (err) {
      console.log(err);
    }
  }
  console.log('Token forwarding done.')
  return;
}

// Call the readFile function to start the process
readFile();

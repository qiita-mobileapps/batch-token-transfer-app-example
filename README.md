# Batch Token Transfer App Example
This is a sample application utilizing blockchain technology, enabling an administrator to perform bulk transfers of tokens they own to users.

## Key Features
Prepare a recipient list file containing destination addresses and transfer amounts, and execute JavaScript to perform bulk transfer operations.

## App sources
* src Directory : token-transfer.js (Token Transfer)
* contracts Directory : batchContact(Batch Contract), tokenContact(The contract for distributing tokens.)

## How to build and setup

### 1\. Deployment of the token contract
copy .env.example to .env
```shell
$ cd contracts/tokenContact
$ cp .env.example .env
```
modify the values of each directive in the .env file.
```
PARAM_ENDPOINT=<< set endpoint. RPC url. exp) testnet Fantom neetwork : https://rpc.testnet.fantom.network/>>
PARAM_ENDPOINT_CHAINID=<< Set endpoint chian id. exp) testnet Fantom neetwork : 4002 >>
PARAM_DEPLOY_PRIVATE_KEY=<< Enter the private key of the account to deploy. >>
```
To obtain tokens for the chain you are deploying to, you can acquire them from a Faucet, especially when deploying to a testnet.  
exp) Fantom Network : https://faucet.fantom.network/

```shell
$ npm install
$ npm run deploy
Token code Address: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Once deployed, it is necessary to make a note of the contract addresses for each token.


### 2\. Deployment of the batch contract
copy .env.example to .env
```shell
$ cd contracts/batchContact
$ cp .env.example .env
```
modify the values of each directive in the .env file.
```
PARAM_ENDPOINT=<< set endpoint. RPC url. exp) testnet Fantom neetwork : https://rpc.testnet.fantom.network/>>
PARAM_ENDPOINT_CHAINID=<< Set endpoint chian id. exp) testnet Fantom neetwork : 4002 >>
PARAM_DEPLOY_PRIVATE_KEY=<< Enter the private key of the account to deploy. >>
PARAM_DEPLOY_TOKEN_ADDRESS=<< Enter the token contract address. >>
```
Next, execute the command.
```shell
$ npm install
$ npm run deploy
Batch code Address: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Once deployed, it is necessary to make a note of the contract addresses for each token.

### 3\. Token Transfer settings
copy .env.example to .env
```shell
cd <Navigate to the root directory of the cloned folder>
cp .env.example .env
```
modify the values of each directive in the .env file.
```
PRIVATE_KEY=<< Specify Private key for your wallet account. >>
CONTRACT=<< Specify the deployment address for your Batch code contract address. >>
RPC_NODE=<< Specify the RPC node URL to use HTTPS.://***** . >>
BATCH_SIZE=<< Specify the number of items to be processed per request. >>
GAS_PRICE=<< Specify the number of gas price. >>
GAS=<< Specify the number of gas. >>
```

## How to run batch transfer
You will list addresses and transfer amounts in addressList.csv.
```shell
$ vi src/addressList.csv
```
The contents of addressList.csv include:
```
0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,2
0xYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY,3
0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ,5
```
Save addressList.csv and exit the editing.

Let's go ahead and execute it.
```
$ node src/token-transfer.js
From Token forwarding 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Estimated Gas: 174184
Current Gas Price: 5000000000
Token forwarding started
------------------------
Allocation + transfer was successful. 174184 gas used. Spent: 870920000000000 wei
Token forwarding done.
```
Once 'Token forwarding done.' is displayed, the transfer is complete. You can verify the recipient addresses on the BlockExplorer.

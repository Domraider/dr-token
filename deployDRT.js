"use strict";

let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const DRTCoin = require('./build/DRTCoin.json');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

console.log("abi = " + DRTCoin.abi)

// Smart contract EVM bytecode as hex
//let code = '0x' + DRTCoin.bytecode; 
let code = DRTCoin.bytecode;
//console.log("code = " + code)

// Create Contract proxy class
//const DRTContract = api.newContract(DRTCoin.abi);


let DRTContract = web3.eth.contract(DRTCoin.abi);

// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account (if not testrpc)");


var password = "drt18";  // NB parametre PASSWORD  drt18, 
try {
  web3.personal.unlockAccount(web3.eth.coinbase, password);
} catch(e) {
  console.log(e);
  return;
}

web3.eth.defaultAccount=web3.eth.accounts[0]


let ethBal = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), "ether");
console.log("ethBal = " + ethBal);

let estimatedGas = web3.eth.estimateGas({data: code});
console.log("estimatedGas = " + estimatedGas);
estimatedGas = estimatedGas + 50000;

let gasLimit = web3.eth.getBlock("pending").gasLimit;
console.log("gasLimit = " + gasLimit);

console.log("Deploying the contract from :" + web3.eth.coinbase);
let contract = DRTContract.new({from: web3.eth.coinbase, gas: estimatedGas, gasLimit: gasLimit, data: code});
                                                              
// Transaction has entered to geth memory pool
console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();

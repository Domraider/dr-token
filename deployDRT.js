"use strict";

const path = require('path');

// LOAD PARAMETERS --------------------------------
const ETHNODE_FILEPATH = path.resolve(__dirname) + '/PARAMS/ethereum_node.txt'
const PWD_FILEPATH = path.resolve(__dirname) + '/PARAMS/owner_pwd.txt'
var urlEthereumNode = require('fs').readFileSync(ETHNODE_FILEPATH, 'utf-8')
var ownerPassword = require('fs').readFileSync(PWD_FILEPATH, 'utf-8')
console.log('urlEthereumNode = ' + urlEthereumNode)
console.log('ownerPwd = ' + ownerPassword)


const SMARTCONTRACT_ADDRESS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/smart-contract-address.txt'

let fs = require("fs");
let net = require("net");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const DRTCoin = require('./build/DRTCoin.json');

let web3 = new Web3(new Web3.providers.IpcProvider('/Users/vincent/Library/Ethereum/geth.ipc', net));
//web3.setProvider(new web3.providers.IpcProvider(urlEthereumNode));

console.log("abi = " + DRTCoin.abi)

// Smart contract EVM bytecode as hex
let code = '0x' + DRTCoin.bytecode;

//console.log("code = " + code)

// Create Contract proxy class
let DRTContract = web3.eth.contract(DRTCoin.abi);

console.log(web3.eth.coinbase)
// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account (if not testrpc)");
try {
  web3.personal.unlockAccount(web3.eth.accounts[0], ownerPassword);
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
      var filewriter = fs.createWriteStream(SMARTCONTRACT_ADDRESS_FILEPATH);
      filewriter.write(receipt.contractAddress)
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();

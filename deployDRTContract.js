"use strict";

let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
let solc = require('solc');

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// compile sources
var inputSourceFiles = {
    'ERC20Basic.sol': fs.readFileSync('installed_contracts/zeppelin-solidity/contracts/token/ERC20Basic.sol', 'utf8'), 
    'ERC20.sol': fs.readFileSync('installed_contracts/zeppelin-solidity/contracts/token/ERC20.sol', 'utf8'),       
    'SafeMath.sol': fs.readFileSync('installed_contracts/zeppelin-solidity/contracts/math/SafeMath.sol', 'utf8'),   
    'BasicToken.sol': fs.readFileSync('installed_contracts/zeppelin-solidity/contracts/token/BasicToken.sol', 'utf8'),
    'StandardToken.sol': fs.readFileSync('installed_contracts/zeppelin-solidity/contracts/token/StandardToken.sol', 'utf8'),
    'ConvertLib.sol': fs.readFileSync('contracts/ConvertLib.sol', 'utf8'),
    'DRTCoin.sol': fs.readFileSync('contracts/DRTCoin.sol', 'utf8')
};

var output = solc.compile({sources : inputSourceFiles}, 1);  // 1 activates the optimiser
console.log("output = " + output )
console.log("END COMPILE ***************************************************" )
for (var contractNameX in output.contracts) {
  // code and ABI that are needed by web3
  console.log(contractNameX);
	//console.log(contractNameX + ': ' + output.contracts[contractNameX].bytecode);
	//console.log(contractNameX + '; ' + JSON.parse(output.contracts[contractNameX].interface));
	console.log("----------------------------------")
	//bytecode =  output.contracts[contractNameX].bytecode
}
let contractName = ':DRTCoin'   // NB les deux points

console.log("get bytecode <<<<----------------- ");
let bytecode = output.contracts[contractName].bytecode
console.log("bytecode = " + bytecode )

let abi = JSON.parse(output.contracts[contractName].interface);
console.log("abi = " + abi)


// Smart contract EVM bytecode as hex
let code = '0x' + bytecode; //output.contracts[contractName].bin;
console.log("code = " + code)

// Create Contract proxy class
let DRTContract = web3.eth.contract(abi);

// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account");

/*var password = "Abd48CourtAlb91";  // NB parametre PASSWORD
try {
  web3.personal.unlockAccount(web3.eth.coinbase, password);
} catch(e) {
  console.log(e);
  return;
}*/


console.log("Deploying the contract");
let contract = DRTContract.new({from: web3.eth.coinbase, gas: 1000000, data: code});

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

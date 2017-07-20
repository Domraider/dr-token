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

var compiledContract = solc.compile({sources : inputSourceFiles}, 1);  // 1 activates the optimiser
console.log("compiledContract = " + compiledContract )
console.log("END COMPILE ***************************************************" )
for (var contractNameX in compiledContract.contracts) {
  // code and ABI that are needed by web3
  console.log(contractNameX);
	//console.log(contractNameX + ': ' + output.contracts[contractNameX].bytecode);
	//console.log(contractNameX + '; ' + JSON.parse(output.contracts[contractNameX].interface));
	console.log("----------------------------------")
	//bytecode =  output.contracts[contractNameX].bytecode
}
let contractName = ':DRTCoin'   // NB les deux points

let abi0 = compiledContract.contracts['DRTCoin'].interface;
let bytecode0 = '0x'+compiledContract.contracts['DRTCoin.sol:DRTCoin'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode0});
let LMS = web3.eth.contract(JSON.parse(abi0));
console.log("abi0 = " + abi0)



console.log("get bytecode <<<<----------------- ");
let bytecode = compiledContract.contracts[contractName].bytecode
console.log("bytecode = " + bytecode )

let abi = JSON.parse(compiledContract.contracts[contractName].interface);
console.log("abi = " + abi)

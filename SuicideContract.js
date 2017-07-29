const path = require('path');
const fs = require('fs');

// LOAD PARAMETERS --------------------------------
const ETHNODE_FILEPATH = path.resolve(__dirname) + '/PARAMS/ethereum_node.txt'
const PWD_FILEPATH = path.resolve(__dirname) + '/PARAMS/owner_pwd.txt'
var urlEthereumNode = require('fs').readFileSync(ETHNODE_FILEPATH, 'utf-8')
var ownerPassword = require('fs').readFileSync(PWD_FILEPATH, 'utf-8')
console.log('urlEthereumNode = ' + urlEthereumNode)
console.log('ownerPwd = ' + ownerPassword)


const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider(urlEthereumNode))

const SMARTCONTRACT_ADDRESS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/smart-contract-address.txt'

var contractAddress = require('fs').readFileSync(SMARTCONTRACT_ADDRESS_FILEPATH, 'utf-8')
console.log('contractAddress = ' + contractAddress)

var drtCcontract = web3.eth.contract(DRTCoin.abi).at(contractAddress);

web3.personal.unlockAccount(web3.eth.accounts[0], ownerPassword)
console.log('unlockAccount')
web3.eth.defaultAccount = web3.eth.accounts[0];


drtCcontract.killContract(function(error, result){
        if (!error) {
            console.log("killContract OK:" + result);  // OK
        } else {
            console.log("Error: " + error); 
        }
 });

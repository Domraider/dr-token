
if (process.argv.length < 4) {
  console.log('Error : number of parametres mismatch');
  process.exit(1);
}

let datacoord = process.argv[2]
let datavalue = process.argv[3]

const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')

myABI = [{"constant":false,"inputs":[],"name":"pay","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"datacoord","type":"string"}],"name":"getHashDataFromcCoord","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"datacoord","type":"string"},{"name":"rec_data","type":"string"}],"name":"addRecordItem","outputs":[{"name":"bOk","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numRecords","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hashcv","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"isMain","type":"bool"}],"name":"NewRecordEvent","type":"event"}]
var mycontract = web3.eth.contract(myABI).at("0xe3f1CBE623CDD97a7695CfeAA4caC5B0EF6153AC");
console.log('mycontract')

console.log(web3.eth.accounts[0])

web3.personal.unlockAccount(web3.eth.accounts[0], "deep_13xZf4_block_test_4qNv8")
console.log('unlockAccount')

console.log(datacoord)
console.log(datavalue)

web3.eth.defaultAccount = web3.eth.accounts[0]

mycontract.addRecordItem(datacoord, datavalue, function(error, result){
        if (!error) {
            console.log(result);  // SEND THE DATA BACK TO GOLANG
        } else {
            console.log("Error: " + error);  // SEND ERROR BACK TO GOLANG
        }
 });

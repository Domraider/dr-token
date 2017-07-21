
if (process.argv.length < 3) {
  console.log('Error : number of parametres mismatch');
  process.exit(1);
}

let datacoord = process.argv[2]


const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))


myABI = [{"constant":false,"inputs":[],"name":"pay","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"datacoord","type":"string"}],"name":"getHashDataFromcCoord","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"datacoord","type":"string"},{"name":"rec_data","type":"string"}],"name":"addRecordItem","outputs":[{"name":"bOk","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numRecords","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hashcv","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"isMain","type":"bool"}],"name":"NewRecordEvent","type":"event"}]
var mycontract = web3.eth.contract(myABI).at("0xe3f1CBE623CDD97a7695CfeAA4caC5B0EF6153AC");

mycontract.getHashDataFromcCoord("userID33_assurID44", function(error, result){
        if (!error) {
            console.log(result);  // SEND THE DATA BACK TO GOLANG
        } else {
            console.log("Errore: " + error);  // SEND ERROR BACK TO GOLANG
        }
    });

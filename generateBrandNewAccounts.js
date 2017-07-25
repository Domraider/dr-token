const path = require('path');
const fs = require('fs');
var csv = require('ya-csv');
  
const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')

const NEW_ACCOUNTS_FILEPATH = path.resolve(__dirname) + '/generated_input_accounts.txt';

var writer = csv.createCsvStreamWriter(fs.createWriteStream(NEW_ACCOUNTS_FILEPATH));  

const MAXNUMACCOUNTS = 20000 
var numAccounts = 10

if(numAccounts > MAXNUMACCOUNTS)
{
  return;
}  

let global_password = "usrpwd123";
var arrayAccounts = []
for(var a = 0; a < numAccounts ;a++){
  // Generate a new account encrypted with a passphrase
  //var newAccount = web3.personal.newAccount(global_password);
  //console.log(a + " -> " + newAccount)
  arrayAccounts.push("newAccount.address")
}

writer.writeRecord(arrayAccounts);  





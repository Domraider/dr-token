const path = require('path');
const fs = require('fs');
var csv = require('ya-csv');
var crypto = require('crypto');

const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')

const TEST_ACCOUNTS_FILEPATH = path.resolve(__dirname) + '/generated_input_accounts_amounts.txt';

//var writer = csv.createCsvStreamWriter(fs.createWriteStream(TEST_ACCOUNTS_FILEPATH));  

var numAccounts2Create = 1000
var arrayAccounts = []

//function code taken from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

function randomValueInt () {
    var low =  1;
    var high = 100000;
    return parseInt(Math.random() * (high - low) + low)
}


var separator =','
cnt=0;
cntTrueAdded=0;
sumAmounts=0;
for(var a = 0; a < web3.eth.accounts.length ;a++){
  
  if(cnt>0){ // skip first one    
    console.log(cnt + " - true account: " +  web3.eth.accounts[a])
    amount = randomValueInt()
    var strline = web3.eth.accounts[a] +separator +amount
    arrayAccounts.push(strline)
    sumAmounts+=amount;
    cntTrueAdded++;
  }
  cnt++
}

for(var k = cntTrueAdded; k < numAccounts2Create ;k++){    
    console.log(cnt + " - fake account: " + fakeAccount)
    amount = randomValueInt()
    var fakeAccount = '0x'+ randomValueHex(40);
    var strline = fakeAccount + separator+ amount
    arrayAccounts.push(strline)
    sumAmounts+=amount;
    cnt++
}

var filewriter = fs.createWriteStream(TEST_ACCOUNTS_FILEPATH);


arrayAccounts.forEach(  
    function addLine(value) { 
      filewriter.write(value+'\n')
  }  
);  

console.log('sumAmounts = ' + sumAmounts)






const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')

var drtCcontract = web3.eth.contract(DRTCoin.abi).at("0x1bb9fdd9d0683459d06d9586239df7c633796e41");

//web3.personal.unlockAccount(web3.eth.accounts[0], "drt18")
console.log('unlockAccount')
web3.eth.defaultAccount = web3.eth.accounts[0];


var vaddr = []
var vamounts = []

var lines = require('fs').readFileSync('input_accounts_amounts.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);


for (var i=0; i<lines.length; i++) {
  var vv = lines[i].split(",");
  if(vv.length == 2){
    var vv = lines[i].split(",");
    vaddr.push(vv[0]);
    vamounts.push(parseInt(vv[1]));
  }
}

console.log('vaddr   = ' + vaddr);
console.log('vamounts   = ' +vamounts);


dataparam = drtCcontract.batchAssignTokens2Arrays.getData(vaddr, vamounts )
//console.log("dataparam = " + dataparam );
var estimatedGas = web3.eth.estimateGas({data: dataparam})
console.log("estimate = " + estimatedGas );

gasLimit = web3.eth.getBlock("latest").gasLimit
console.log("gasLimit = " + gasLimit);


gasOk=0
if(estimatedGas  < gasLimit){
	gasOk=estimatedGas;
}else{
	gasOk=gasLimit;
}
console.log("gasOk = " + gasOk );


drtCcontract.batchAssignTokens2Arrays(vaddr, vamounts, { gas: gasOk },  function(error, result){
        if (!error) {
            console.log("batchAssignTokens2Arrays OK:" + result);  // OK
        } else {
            console.log("MyError: " + error); 
        }
 });


const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')


var drtCcontract = web3.eth.contract(DRTCoin.abi).at("0xa4c9b26a807d41f74f358e844d70f190633fb85b");

web3.personal.unlockAccount(web3.eth.accounts[0], "drt18")
console.log('unlockAccount')
web3.eth.defaultAccount = web3.eth.accounts[0];


drtCcontract.getAddressBalance(web3.eth.accounts[0], function(error, result){
        if (!error) {
            console.log("OWNER: getAddressBalance worked : " + result);          
        } else {
            console.log(error);
        }
    });


var vaddr = []
var vamounts = []
var lines = require('fs').readFileSync('input_accounts_amounts.txt', 'utf-8')
    .split('\n');

    

var dict = []; // create an empty array

var totalAssigned = parseInt(0)
for (var i=0; i<lines.length; i++) {
  var vv = lines[i].split(",");
  if(vv.length == 2){   
    var userAddress = vv[0];
    var userAmount = parseInt(vv[1]);
    dict[userAddress] = userAmount;
    drtCcontract.getAddressAndBalance(userAddress, function(error, result){
            if (!error) {
                retAddress = result[0];
                retAmount = parseInt(result[1]);
                //console.log("USER getAddressBalance worked : " + retAmount + " for " + retAddress + " ----"); 
                if( retAmount === parseInt(dict[retAddress]) ){
                    console.log(retAddress + "  -  amount MATCH OK = " + retAmount);
                    totalAssigned +=retAmount
                }else{
                    console.log(retAddress + "  -  amount MISMATCH ERROR = " + retAmount);
                }
            } else {
                console.log(error);
            }
        });
  }
}


console.log('totalAssigned = ' + totalAssigned);
//console.log('vamounts   = ' +vamounts);

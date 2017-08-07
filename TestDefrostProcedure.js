const path = require('path');
const fs = require('fs');
  

// LOAD PARAMETERS --------------------------------
const ETHNODE_FILEPATH = path.resolve(__dirname) + '/PARAMS/ethereum_node.txt'
const PWD_FILEPATH = path.resolve(__dirname) + '/PARAMS/owner_pwd.txt'
const ACCOUNTSAMOUNTS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/generated_input_accounts_amounts.txt'
const CONTRACTADDRESS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/smart-contract-address.txt'

const DEFROSTED_LOG_ROOT = path.resolve(__dirname) + '/DEFROSTED/'


// set parameters -------------------------------------------------
var urlEthereumNode = require('fs').readFileSync(ETHNODE_FILEPATH, 'utf-8')
var ownerPassword = require('fs').readFileSync(PWD_FILEPATH, 'utf-8')
var contractAddress = require('fs').readFileSync(CONTRACTADDRESS_FILEPATH, 'utf-8')
console.log('urlEthereumNode = ' + urlEthereumNode)
console.log('ownerPwd = ' + ownerPassword)
console.log('filePathAccountsAmounts = ' + ACCOUNTSAMOUNTS_FILEPATH)
console.log('contractAddress = ' + contractAddress)



const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(urlEthereumNode))

// PROGRAM VARIABLES (local)
var cntTimer = parseInt(0)
var defrostTimerId = -1
var drtContract;

// FROM FILES VARIABLES
var objAssignParams;
var vAccounts;        // accounts/amounts from txt file

// init ethereum DRT smart contract ----------------------------------------------------------
drtCcontract =web3.eth.contract(DRTCoin.abi).at(contractAddress);

// unlock ethereum base account
web3.personal.unlockAccount(web3.eth.accounts[0], ownerPassword)
console.log('unlockAccount OK')
web3.eth.defaultAccount = web3.eth.accounts[0];

// read account/amounts file to assign -------------------------------------------------
vAccounts  = require('fs').readFileSync(ACCOUNTSAMOUNTS_FILEPATH).toString().split('\n')
console.log('NUM ACCOUNTS = ' + vAccounts.length)


var vaddr = []
var vamounts = []
var viced = []
for(i=0;i<vAccounts.length;i++){
    var vv = vAccounts[i].split(",");
    if(vv.length == 3){
        vaddr.push(vv[0]);
        vamounts.push(parseInt(vv[1]));
        viced.push(parseInt(vv[2])===0);
    }
    else if(vAccounts[i].length>0){
        console.log('Fatal error: item size mismatch  !!!!!!!!!!!!!!!!!!!!!!! ' + vAccounts[i])
    }
}

console.log('_____________________________________________________________________________')
// launch assign timer  ----------------------------------------------------------------
var defrostIntervalSec = parseInt(120) 
console.log('intervalSec = ' + defrostIntervalSec)
defrostTimerId = setInterval(timerDefrostFunction, defrostIntervalSec * 1000);

var cntTimer = parseInt(0)
function timerDefrostFunction() {

        console.log('timerDefrostFunction scheduler call ........  cntTimer = ' + cntTimer)
 
        /*if( ENDofDEFROST ){
            console.log('timer stopped //////////////////////////////////');
            clearInterval(defrostTimerId);
        }*/

        tryDefrostAdvisors();

        cntTimer++;
        console.log('.......................................................................')
}


function tryDefrostAdvisors() {

    	var bCanDefrost  = drtCcontract.canDefrost();
	console.log("=======>   bCanDefrost = " + bCanDefrost);
                    if(bCanDefrost === true){

			
    			dataparam = drtCcontract.defrostToken.getData()
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

    			drtCcontract.defrostToken( { gas: gasOk },  function(error, result){
            			if (!error) {
                			console.log("defrostToken OK:" + result);  // OK

                			waitForBlock(result);

            			} else {
                			console.log("Error: calling defrostToken => " + error); 
            			}
    		        });
		   }                        
}

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function mySleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitForBlock(txhash) {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(txhash);
    if (receipt && receipt.blockNumber) {
      console.log("Your defrostToken call has been mined in block " + receipt.blockNumber);
      console.log("Note that it might take 30 - 90 seconds for the block to propagate before it's visible in etherscan.io");

      checkDefrostedAdvisors();

      break;
    }
    console.log("Waiting a mined block including your defrostToken call ... currently in block " + web3.eth.blockNumber);
    await mySleep(5000);
  }
}


function checkDefrostedAdvisors() {
    
    var blockTimestamp = drtCcontract.getBlockTimestamp();
    var defrostedLogFile = DEFROSTED_LOG_ROOT + 'defrosted_' + blockTimestamp +'_' + cntTimer   + '.txt'
    fs.appendFileSync(defrostedLogFile, blockTimestamp + '\n');

    for(i=0;i<vAccounts.length;i++){
        var isIced = viced[i];
        if(isIced){
            var addr = vaddr[i];
            drtCcontract.getIcedInfos(addr, function(error, result){
                if (!error)
                {
		    icedaddr = result[0];
                    balance = parseInt(result[1]);
                    frosted = parseInt(result[2]);
                    defrosted = parseInt(result[3]);
                    console.log(icedaddr + " => bal: " + balance + " - frosted: " + frosted + " - defrosted: " + defrosted);     
		    var strlog = icedaddr + ";balance=" + balance + ";frosted=" + frosted + ";defrosted=" + defrosted;
		    fs.appendFileSync(defrostedLogFile, strlog + '\n');
                }
                else
                {
                    console.log("Error: calling getIcedInfos => " + error); 
                }
            })
        }
    }
}







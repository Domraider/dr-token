const path = require('path');
const fs = require('fs');
  

// LOAD PARAMETERS --------------------------------
const ETHNODE_FILEPATH = path.resolve(__dirname) + '/PARAMS/ethereum_node.txt'
const PWD_FILEPATH = path.resolve(__dirname) + '/PARAMS/owner_pwd.txt'
const CHUNKSIZE_FILEPATH = path.resolve(__dirname) + '/PARAMS/chunk_size.txt'
const ACCOUNTSAMOUNTS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/generated_input_accounts_amounts.txt'
const INTERVALSEC_FILEPATH = path.resolve(__dirname) + '/PARAMS/assign_interval_sec.txt'
const CONTRACTADDRESS_FILEPATH = path.resolve(__dirname) + '/OUTPUTS/smart-contract-address.txt'


// set parameters -------------------------------------------------
var urlEthereumNode = require('fs').readFileSync(ETHNODE_FILEPATH, 'utf-8')
var ownerPassword = require('fs').readFileSync(PWD_FILEPATH, 'utf-8')
var chunkSize = require('fs').readFileSync(CHUNKSIZE_FILEPATH, 'utf-8')
var assignIntervalSec = parseInt(1000 * require('fs').readFileSync(INTERVALSEC_FILEPATH, 'utf-8'))
var contractAddress = require('fs').readFileSync(CONTRACTADDRESS_FILEPATH, 'utf-8')
console.log('urlEthereumNode = ' + urlEthereumNode)
console.log('ownerPwd = ' + ownerPassword)
console.log('chunkSize = ' + chunkSize)
console.log('filePathAccountsAmounts = ' + ACCOUNTSAMOUNTS_FILEPATH)
console.log('assignIntervalSec = ' + assignIntervalSec)
console.log('contractAddress = ' + contractAddress)


function AssignParamsObj(chunkSize, dir, fpath, interval, contractaddr, pwd, mode) {
    this.chunkSize = parseInt(chunkSize)
    this.filePath = fpath
    this.intervalSec = parseInt(interval)
    this.contractaddress = contractaddr
    this.accountpwd = pwd
}


const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(urlEthereumNode))

const ASSIGN_PARAMS_FILES = path.resolve(__dirname) + '/assignParams.json';

// ASSIGN PARAMETERS (from json file)


// PROGRAM VARIABLES (local)
var cntTimer = parseInt(0)
var assignTimerId = -1
var drtCcontract;

// FROM FILES VARIABLES
var objAssignParams;
var vAccounts;        // accounts/amounts from txt file

objAssignParams = new AssignParamsObj(chunkSize,ACCOUNTSAMOUNTS_FILEPATH,assignIntervalSec,contractAddress, ownerPassword);

// init ethereum DRT smart contract ----------------------------------------------------------
drtCcontract =web3.eth.contract(DRTCoin.abi).at(contractAddress);

// unlock ethereum base account
web3.personal.unlockAccount(web3.eth.accounts[0], ownerPassword)
console.log('unlockAccount OK')
web3.eth.defaultAccount = web3.eth.accounts[0];

// read account/amounts file to assign -------------------------------------------------
vAccounts  = require('fs').readFileSync(ACCOUNTSAMOUNTS_FILEPATH).toString().split('\n')
console.log('NUM ACCOUNTS = ' + vAccounts.length)

console.log('________')
console.log('________')
console.log('________')
// launch assign timer  ----------------------------------------------------------------
console.log('intervalSec = ' + assignIntervalSec)
assignTimerId = setInterval(timerAssignFunction, assignIntervalSec);

var cntTimer = parseInt(0)
function timerAssignFunction() {

        console.log('timerAssignFunction scheduler call .......................................')
        var numToSend = parseInt(0)
        var from = parseInt(cntTimer * objAssignParams.chunkSize)
        var to = parseInt(from) + parseInt(objAssignParams.chunkSize)
        console.log('from = ' + from + '  -  to = ' + to)

        if( from >= vAccounts.length){
            console.log('timer stopped //////////////////////////////////');
            clearInterval(assignTimerId);
        }
        // fill address/amounts arrays
        var vaddr = []
        var vamounts = []
        var viced = []
        for(i=from;i<to;i++){

            // check the end 
            if(i>=vAccounts.length){
                // stop timer
                console.log('timer stopped //////////////////////////////////');
                clearInterval(assignTimerId);
                break;

            }else{

                console.log('vAccounts[i] = ' + vAccounts[i] + '  - numToSend = ' + numToSend)
                var vv = vAccounts[i].split(",");
                if(vv.length == 3){
                    vaddr.push(vv[0]);
                    vamounts.push(parseInt(vv[1]));
                    viced.push(parseInt(vv[2])===0);
                    numToSend++;
                }/*else{
                    console.log('Fatal error in data format')
                    numToSend = -1;
                    break;
                }*/
            }
        }

        console.log('numToSend = ' + numToSend + '  - vaddr.length = '+vaddr.length + '  -  vamounts.length = '+  vamounts.length);
        if(numToSend === vaddr.length && numToSend === vamounts.length && numToSend == viced.length)
        {
              console.log('calling timerAssignFunction ....... ');
             
              var numSent = SendAssignFileToSmartContract(objAssignParams.contractaddress,objAssignParams.accountpwd,
                                                      vaddr, vamounts, viced, numToSend);
              console.log("...END -> cntTimer = " + cntTimer)
        }
        else{
          console.log('Fatal error: numToSend / size arrays mismatch ')
        }
        
        cntTimer++;
        console.log('.......................................................................')
}


function SendAssignFileToSmartContract(contractAddress, accountPwd, vaddr, vamounts, viced, numToSend) {

    dataparam = drtCcontract.batchAssignTokens.getData(vaddr, vamounts, viced)
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

    drtCcontract.batchAssignTokens(vaddr, vamounts, viced, { gas: gasOk },  function(error, result){
            if (!error) {
                console.log("batchAssignTokens2Arrays OK:" + result);  // OK
            } else {
                console.log("Error: " + error); 
            }
    });
}









const path = require('path');
const fs = require('fs');
  

function AssignParamsObj(chunkSize, dir, fpath, interval, contractaddr, pwd, mode) {
    this.chunkSize = chunkSize
    this.filePath = fpath
    this.intervalSec = interval
    this.contractaddress = contractaddr
    this.accountpwd = pwd
    this.mode = mode
}


const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')


const ASSIGN_PARAMS_FILES = path.resolve(__dirname) + '/assignParams.json';

// ASSIGN PARAMETERS (from json file)


// PROGRAM VARIAVBLES (local)
var cntTimer = parseInt(0)
var assignTimerId = -1
var drtCcontract;

// FROM FILES VARIABLES
var objAssignParams;  // parameters from json file
var vAccounts;        // accounts/amounts from txt file


require('fs').readFile(ASSIGN_PARAMS_FILES, 'utf8', function (err, data) {
    if (err) {
      console.log('Error reading assign parameter file : ' + err)
    }else{
        var objParams = JSON.parse(data);    

        // set parameters -------------------------------------------------
        chunkSize = parseInt(objParams.chunkSize)
        filePath =objParams.filePath
        intervalSec = parseInt(objParams.intervalSec) * 1000
        contractaddress = objParams.contractaddress
        accountpwd = objParams.accountpwd
        mode = objParams.mode

        objAssignParams = new AssignParamsObj(chunkSize,filePath,intervalSec,contractaddress, accountpwd, mode);

        // init ethereum DRT smart contract ----------------------------------------------------------
        drtCcontract =web3.eth.contract(DRTCoin.abi).at(contractaddress);
        
        // unlock ethereum base account
        web3.personal.unlockAccount(web3.eth.accounts[0], accountpwd)
        console.log('unlockAccount')
        web3.eth.defaultAccount = web3.eth.accounts[0];

        // read account/amounts file to assign -------------------------------------------------
        vAccounts  = require('fs').readFileSync(filePath).toString().split('\n')

        // launch assign timer  ----------------------------------------------------------------
        console.log('intervalSec = ' + intervalSec)
        assignTimerId = setInterval(timerAssignFunction, intervalSec);
    }
});

var cntTimer = parseInt(0)
function timerAssignFunction() {

        var numToSend = parseInt(0)
        var from = parseInt(cntTimer * objAssignParams.chunkSize)
        var to = from + objAssignParams.chunkSize
        console.log('from = ' + cntTimer + '  -  to = ' + objAssignParams.chunkSize)

        // fill address/amounts arrays
        var vaddr = []
        var vamounts = []
        for(i=from;i<to;i++){

            // check the end 
            if(i>=vAccounts.length){
                // stop timer
                console.log('timer stopped');
                clearInterval(assignTimerId);
                break;
            }

            //console.log('vAccounts[i] = ' + vAccounts[i])
            var vv = vAccounts[i].split(",");
            if(vv.length == 2){
                vaddr.push(vv[0]);
                vamounts.push(parseInt(vv[1]));
                numToSend++;
            }else{
                console.log('Fatal error in data format')
                numToSend = -1;
                break;
            }
        }

        if(numToSend === vaddr.length && numToSend === vamounts.length)
        {
              console.log('calling timerAssignFunction ....... ');
              var numSent = SendAssignFileToSmartContract(objAssignParams.contractaddress,objAssignParams.accountpwd,
                                                      vaddr, vamounts, numToSend);
              console.log("END. cntTimer = " + cntTimer + " - SENT = " + numSent)
        }
        else{
          console.log('Fatal error: numToSend / size arrays mismatch ')
        }
       

        
        cntTimer++;
}


function SendAssignFileToSmartContract(contractAddress, accountPwd, vaddr, vamounts, numToSend) {


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
                return numToSend;
            } else {
                console.log("MyError: " + error); 
                return numToSend;
            }
    });

    
}










const DRTCoin = require('./build/DRTCoin.json');
const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
console.log('Web3')

var addr = '0xca761fd88e26935eb43f9fe7c056e94e3fa24088';
console.log('addr = ' + DRTCoin.abi);
console.log('------------------------------------------------------');

var bnAddress = web3.toBigNumber(addr);
//console.log(bnAddress);
console.log('bnAddress = '+bnAddress.toNumber());
//console.log(bnAddress.toString(10));

var amount = '1234567890';
var bnAmount = web3.toBigNumber(amount);
//console.log(bnAmount);
console.log('bnAmount = '+bnAmount.toNumber());
//console.log(bnAmount.toString(10));
console.log('------------------------------------------------------');

var D160 = 0x10000000000000000000000000000000000000000;
var D96 = 0x1000000000000000000000000;
var pow160 = web3.toBigNumber(D160); // 2^160 = 1.461501637330903e+48
var pow96 = web3.toBigNumber(D96); // 2^96 = 7.922816251426434e+28


var binStrAddress = bnAddress.toString(2)
var binStrAmountO  = bnAmount.toString(2)
var binStrAmount  = bnAmount.toString(2)
console.log('bnAddress = ' +binStrAddress);
console.log(binStrAddress.length)
console.log('bnAmount = ' +binStrAmount);
console.log(binStrAmount.length)

for(var k=binStrAmountO.length;k<96;k++){
    binStrAmount = '0'+binStrAmount
}
console.log('-> ' + binStrAmount.length)


console.log('------------------------------------------------------');
var strBinAll = binStrAmount+binStrAddress; // 96MSB=amount - 160LSB=address
console.log('strBinAll = '+strBinAll)
console.log('L strBinAll = '+strBinAll.length)

var bigintParam = parseInt(strBinAll, 2);
console.log('bigintParam = '+ bigintParam);
console.log('bigintParam HEX = '+ parseInt(strBinAll, 2).toString(16));
//var paramData = web3.toBigNumber(bigintParam);
//console.log('paramData = '+ paramData);*/

var drtCcontract = web3.eth.contract(DRTCoin.abi).at("0xa4c9b26a807d41f74f358e844d70f190633fb85b");

//console.log('main account = '+web3.eth.accounts[0])

//var aaa = bigintParam & (D160-1);
//console.log('aaa = '+ aaa)

web3.personal.unlockAccount(web3.eth.accounts[0], "drt18")
console.log('unlockAccount')
web3.eth.defaultAccount = web3.eth.accounts[0];

console.log('------------------------------------------------------');
console.log('testSplitUint addr   = ' +addr);
drtCcontract.testSplitUint(bigintParam, function(error, result){
        if (!error) {
            console.log("testSplitUint worked : " + result);  
            //console.log(web3.toBigNumber(result[1])- bnAddress);          
        } else {
            console.log("MyError: "+error);
        }
});


drtCcontract.testSplitUintWriteInTmp(bigintParam, function(error, result){
        if (!error) {
            console.log("testSplitUintWriteInTmp worked : " + result);  
            //console.log(web3.toBigNumber(result[1])- bnAddress);          
        } else {
            console.log("MyError: "+error);
        }
});


drtCcontract.getAddressBalance(web3.eth.accounts[0], function(error, result){
        if (!error) {
            console.log("getAddressBalance worked : " + result);          
        } else {
            console.log(error);
        }
});

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

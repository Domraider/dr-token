const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var blocknumber = web3.eth.blockNumber;
console.log('blockNumber = ' + blocknumber);

web3.eth.defaultAccount=web3.eth.accounts[0]
console.log('defaultAccount = ' + web3.eth.defaultAccount);

var lineReaderIced = require('readline').createInterface({
  input: require('fs').createReadStream('iced_accounts.txt')
});

lineReaderIced.on('line', function (line) {
  //console.log('Line from file:', line);
  var vv = line.split(";");
  user_address = vv[0]
  user_amount = parseInt(vv[1])
  console.log(user_address + " - "  + user_amount)
});
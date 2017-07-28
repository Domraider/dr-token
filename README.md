# ICO DOMRAIDER
Ethereum smart contract handling DOMRAIDER ICO
 
#Ensure you are using the latest stable node version
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
 
## Pre-requestite
npm install web3
npm install truffle-compile
npm install babel
npm install ethereumjs-keys
 
#Install project
npm install
 
#run part 1 - Launch ethereum node (testrpc/testnet/mainnet)
testrpc --rpcapi="db,eth,net,web3,personal"
OR
geth --testnet --fast --cache=1024 --rpc console --rpcapi="db,eth,net,web3,personal"
 
#run part 2 - Compile, Deploy and test an assignement of tokens
node compileDRT.js
node deployDRT.js
node callBatchAssign.js
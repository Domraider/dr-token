# ICO DOMRAIDER
Ethereum smart contract handling DOMRAIDER ICO

# Big Picture
La procédure se fait en 6 étapes
    1) générer un fichier avec N accounts (qui sont un mélange de vrais et de faux) et les tokens à assigner
    2) compiler le smart contract écrit en solidity
    3) déployer le smart contract dans ethereum (rpc, testnet ou mainnet) via le noeud en local
    4) lancer un script 'scheduler' qui assigne toutes les 'S' seconds des tokens à un array d'accounts  
    5) lancer le script de contrôle qui varifie que chaque account a bien ses tokens
    6) ouvrir EthereumWallet et controler N adresses choisit aléatoirement    


#Ensure you are using the latest stable node version
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
 
## Pre-requestite
npm install web3
npm install truffle-compile
npm install truffle-contract-schema
npm install babel
npm install ethereumjs-keys
avoir le compilateur solidity installé (solc-bin-gh-pages.zip)
 
#Install project
npm install
 
#run part 1 - Launch ethereum node (testrpc/testnet/mainnet)
testrpc --rpcapi="db,eth,net,web3,personal"
OR
geth --testnet --fast --cache=1024 --rpc console --rpcapi="db,eth,net,web3,personal"
 

#run part 2 - generate accounts + mine ethers
testrpc fournit accounts de test avec chacun 100 eth de test
pour testnet et main net vous devez gérer vos accounts
pour lancer le premier script on conseilel de créer 10 accounts en plus de l'account de base
CONVENTION: l'account de base, celui à l'index0, est par défault le owner du smart contract DRTCoin

#run part 2 - set parameters
You need to fullfill files in the '/PARAMS' directory to set your own parameters
    - ethereum_node.txt             ex: http://localhost:8545
    - num_accounts_2_create.txt     number of accounts to create
    - owner_pwd.txt                 main account password (the token owner) 
    - assign_interval_sec.txt       waint interval (in seconds) between two chunk-assign calls  
    - chunk_size.txt                number of accounts to which deliver tokens at each call


#run part 4 - Compile, Deploy and test an assignement of tokens
-- node generateBrandNewAccounts.js --------------------------------------------
Thid script generate 'numAccounts2Create' accounts. 
It reads all TRUE accounts that are in the ethereum node instance (typically few: less then 10), 
then it creates 'numAccounts2Create-N' FAKE ethereum addresses
It also assign a random number of tokens (between 1 and 100.000) at each addresse (TRUE or FAKE).
    PARAMS: numAccounts2Create = number of accounts you want to create
            urlEthereumNode = Ethereum node URL (from where TRUE accounts are read, likely http://localhost:8545)  
    OUTPUT: the 'generated_input_accounts_amounts.txt' file, which has this format :
                0x052d1291f7d121319d1f82d637f33867aa637e48,45489
                0xbd99de6e1ffeee38569fddee3434cb6c9db079c0,81855
                0x20d5e3da977dd185722a1c1bd7346a797a90ee6c,98488
                0x0dde0adde07b8f87a11c4852287e287a9d87a20b,86046
                ... 
            the 'generated_number_of_tokens.txt' file whit the total number of tokens assigned
    CONTRAINTES: you need at least one ethereum account (different from the base account) otherwise the script hangs in error.


-- node compileDRT.js --------------------------------------------
compile le smart contract


-- node deployDRT.js  --------------------------------------------
déploie le smart contract
    PARAMS: urlEthereumNode = Ethereum node location, where smart contract is deployed
            ownerPassword = ethereum account 0 password, conventionally the smart contract owner 
    OUTPUT: the "smart-contract-address.txt' file, specifying the smart contract address



-- node AssignScheduler.js  --------------------------------------------
    PARAMS: urlEthereumNode = Ethereum node location, where smart contract is called to assign tokens
            ownerPassword = ethereum account 0 password, conventionally the smart contract owner 
            chunkSize = size of accounts/amounts chunks 
            assignIntervalSec = waiting time in seconds between to smat-contract calls
            contractAddress = the "smart-contract-address.txt' file, specifying the smart contract address
            ACCOUNTSAMOUNTS_FILEPATH = file previously generated with accounts and amounts

-- node verifyBatchAssign.js  --------------------------------------------




-- node suicideContract.js  call this script to kill the contract in the blockchain



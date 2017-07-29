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
Ce script genère 'numAccounts2Create' accounts. 
Il prends d'abord les N VRAI accounts qui sont dans le compte ethereum, 
puis il crée 'numAccounts2Create-N' FAUX adresses ethereum
Il associe aussi une quantité de tokens aléatoire (entre 1 e 100.000) à chaque adresse, vrai ou faux.
    PARAMS: numAccounts2Create = numbre d'account qu'on veut créer
            urlEthereumNode = url du noeud Ethereum (d'où lire les VRAIS accounts, probablement http://localhost:8545)  
    OUTPUT: le file 'generated_input_accounts_amounts.txt', qui a ce format :
                0x052d1291f7d121319d1f82d637f33867aa637e48,45489
                0xbd99de6e1ffeee38569fddee3434cb6c9db079c0,81855
                0x20d5e3da977dd185722a1c1bd7346a797a90ee6c,98488
                0x0dde0adde07b8f87a11c4852287e287a9d87a20b,86046
                ... 
            le file 'generated_number_of_tokens.txt' qui contient le nombre total de tokens attribué
    CONTRAINTES: il faut avoir au moins un account ethereum (en plus de l'account de base) sinon le script s'arrête.


-- node compileDRT.js --------------------------------------------
compile le smart contract


-- node deployDRT.js  --------------------------------------------
déploie le smart contract
    PARAMS: urlEthereumNode = url du noeud Ethereum vers lequel faire le Deploy
            ownerPassword = password de l'account 0 ethereum qui est par convention l'owner du smart contract 
    OUTPUT: le ficher "smart-contract-address.txt', qui contint l'adresse ethereum du smart contract



-- node callBatchAssign.js  --------------------------------------------
    PARAMS: urlEthereumNode = url du noeud Ethereum (où appeler le smart contract pour assigner les tokens) 



-- node verifyBatchAssign.js  --------------------------------------------




-- node suicideContract.js  call this script to kill the contract in the blockchain



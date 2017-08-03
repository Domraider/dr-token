pragma solidity ^0.4.11;

import "./ConvertLib.sol";
import "./StandardToken.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DRTCoin is StandardToken, Ownable {

	/* Overriding some ERC20 variables */
	string public name      = "DomRaider Coin";
	string public symbol    = "DRT";
	uint256 public decimals = 18; //to be confirmed
	/* DRT specific variables */
	// Max amount of tokens minted - Exact value inputed avec strech goals and before deploying contract
	uint256 public constant MAX_SUPPLY_NBTOKEN    = 1000000000 * 10 ** decimals;
	// Freeze duration for advisors accounts
	uint256 public constant START_ICO_TIMESTAMP   = 1501595111 ; // 1st of august 2017 15h45 for testing
	uint public constant DEFROST_PERIOD           = 43200; // 1 month in minutes
	uint public constant DEFROST_MONTHLY_PERCENT  = 10 ; // 10% per month is automaticaly defrosted
	uint public constant DEFROST_INITIAL_PERCENT  = 20 ; // 80% locked
	// Fields that can be changed by functions
	address[] icedBalances ;
  // mapping (address => bool) icedBalances; //Initial implementation as a mapping
	mapping (address => uint256) icedBalances_frosted;
	mapping (address => uint256) icedBalances_defrosted;
	// Variable usefull for verifying that the assignedSupply matches that totalSupply
	uint256 public assignedSupply;
	//Boolean to allow or not the initial assignement of token (batch)
	bool public batchAssignStopped;

	/**
	* @dev Contructor that gives msg.sender all of existing tokens.
	*/
	function DRTCoin() {
      owner                = msg.sender;
      balances[owner]      = MAX_SUPPLY_NBTOKEN / 2;
			totalSupply          = MAX_SUPPLY_NBTOKEN;
			assignedSupply       = MAX_SUPPLY_NBTOKEN / 2;
	}

  function assignToken(address recipient, uint amount, bool isIced) onlyOwner {
			// for testing purpose
  }

	/**
   * @dev Transfer tokens in batches (of adresses)
   * @param _vaddr address The address which you want to send tokens from
   * @param _vamounts address The address which you want to transfer to
   */
  function batchAssignTokens(address[] _vaddr, uint[] _vamounts, bool[] _vIcedBalance ) onlyOwner {
			require ( batchAssignStopped == false );
			require ( _vaddr.length == _vamounts.length );
			//Looping into input arrays to assign target amount to each given address
      for (uint index=0; index<_vaddr.length; index++) {
          address toAddress = _vaddr[index];
          uint amount = _vamounts[index];
          if (balances[toAddress] == 0) {
						// In case it's filled two times, it only increments once
						// Assigns the balance
						assignedSupply += amount ;
						if (  _vIcedBalance[index] == false ) {
							// Normal account
							balances[toAddress] = amount;
							// TODO allowance ??
						}
						else {
							// Iced account. The balance is not affected here
							icedBalances.push(toAddress) ;
							balances[toAddress]               = amount * DEFROST_INITIAL_PERCENT / 100;
							icedBalances_frosted[toAddress]   = amount * (100 - DEFROST_INITIAL_PERCENT) / 100;
							icedBalances_defrosted[toAddress] = amount * DEFROST_INITIAL_PERCENT / 100;
						}
					}
			}
	}

	/**
   * @dev Defrost token (for advisors)
	 Method called by the owner once per defrost period (1 month)
   */
  function defrostToken() onlyOwner {
		// Looping into the iced accounts
		for (uint index=0; index<icedBalances.length; index++) {
			address currentAddress  = icedBalances[index];
			uint256 amountTotal     = icedBalances_frosted[currentAddress]+ icedBalances_defrosted[currentAddress];
			//uint256 amountToRelease = amountTotal * DEFROST_MONTHLY_PERCENT / 100;
			uint256 targetDeFrosted = (minimum(100,DEFROST_INITIAL_PERCENT + elapedMonthsFromICOStart()*DEFROST_MONTHLY_PERCENT))*amountTotal;
			uint256 amountToRelease = targetDeFrosted - icedBalances_defrosted[currentAddress] ;
			if ( amountToRelease > 0 ) {
				icedBalances_frosted[currentAddress]   -= amountToRelease;
				icedBalances_defrosted[currentAddress] += amountToRelease;
				balances[currentAddress]               += amountToRelease;
			}
		}
	}

	function elapedMonthsFromICOStart() constant returns (uint elapsed) {
		elapsed = ((now-START_ICO_TIMESTAMP)/60)/DEFROST_PERIOD ;
	}

  function stopBatchAssign() onlyOwner {
      	require ( batchAssignStopped == false);
      	batchAssignStopped = true;
  }

  function getAddressBalance(address addr) constant returns (uint256 balance)  {
      	balance = balances[addr];
  }

  function getIcedAddresses() constant returns (address[] vaddr)  {
      	vaddr = icedBalances;
  }

  function getIcedInfos(address addr) constant returns (uint256 balance, uint256 frosted, uint256 defrosted)  {
      	balance = icedBalances_frosted[addr];
		frosted = icedBalances_defrosted[addr];
		defrosted = balances[addr];
  }

  function killContract() onlyOwner {
      suicide(owner);
  }

	function minimum( uint a, uint b) returns ( uint result) {
		if ( a <= b ) {
			result = a;
		}
		else {
			result = b;
		}
	}

	/*
  modifier max_num_token_not_reached(uint amount) {
        assert(safeAdd(totalSupply, amount) <= MAX_SUPPLY_NBTOKEN);
        _;
  }
	*/

}

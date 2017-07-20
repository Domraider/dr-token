pragma solidity ^0.4.2;

import "./ConvertLib.sol";
import "../installed_contracts/zeppelin-solidity/contracts/token/StandardToken.sol";
// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DRTCoin is StandardToken {

	// FIELDS ---------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------
    // Constant token specific fields
	string public name = "DOMRaider Token";
	string public symbol = "DRT";
	uint256 public decimals = 18;
	//uint256 public INITIAL_SUPPLY = 1000000000;
	uint public constant DEFROST_DURATION = 2 years; // Time needed for iced tokens to thaw into liquid tokens
	//uint public constant MAX_NUM_TOKEN_OFFERED_TO_PUBLIC = 47222222 ** decimals; // Max amount of tokens offered to the public
    //uint public constant TOTAL_NUM_TOKEN = 55555556 ** decimals; // Max amount of total tokens raised during all contributions (includes stakes of patrons)
	//uint public constant MAX__NUM_TOKEN_PREVENTE = 55555556 ** decimals;

	// Fields that changed in constructor (then forever constant)
    address public minter; // Contribution contract(s)
    address public domraiderOwner; // Can change to other minting contribution contracts but only until total amount of token minted
    uint public startTime; // Contribution start time in seconds
    uint public endTime; // Contribution end time in seconds

	// Fields that can be changed by functions
    mapping (address => uint) icedBalances;
	// -------------------------------------------------------------------------------------------
	// end FIELDS ------------------------------------------------------------------------------------



	// MODIFIERS ---------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------
    modifier only_minter {
        assert(msg.sender == minter);
        _;
    }

    modifier only_domraider {
        assert(msg.sender == domraiderOwner);
        _;
    }

    modifier is_later_than(uint x) {
        assert(now > x);
        _;
    }

    /*modifier max_num_token_not_reached(uint amount) {
        assert(safeAdd(totalSupply, amount) <= MAX_TOTAL_TOKEN_AMOUNT);
        _;
    }*/
	// -------------------------------------------------------------------------------------------
	// end MODIFIERS -----------------------------------------------------------------------------
	

	// CONSTANT METHODS --------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------
    function lockedBalanceOf(address _owner) constant returns (uint balance) {
        return icedBalances[_owner];
    }
	// -------------------------------------------------------------------------------------------
	// end CONSTANT METHODS ----------------------------------------------------------------------------


	/**
	* @dev Contructor that gives msg.sender all of existing tokens.
	*/
	function DRTCoin(address setMinter, uint setStartTime, uint setEndTime) {
		totalSupply = 0;
		minter = setMinter;
        domraiderOwner = msg.sender;
        startTime = setStartTime;
        endTime = setEndTime;
	}

	function mintLiquidToken(address recipient, uint amount)
        external
        only_minter
    {
        balances[recipient] = balances[recipient].add(amount);
        totalSupply = totalSupply.add(amount);
    }


	function mintIcedToken(address recipient, uint amount)
        external
        only_minter
    {
        icedBalances[recipient] = icedBalances[recipient].add(amount);
        totalSupply = totalSupply.add(amount);
    }

   
	/// Pre: Prevent transfers until contribution period is over.
    /// Post: Transfer DMR from msg.sender
    /// Note: ERC20 interface
    function transfer(address recipient, uint amount)
        is_later_than(endTime)
    {
        return super.transfer(recipient, amount);
    }

    /// Pre: Prevent transfers until contribution period is over.
    /// Post: Transfer DMR from arbitrary address
    /// Note: ERC20 interface
    function transferFrom(address sender, address recipient, uint amount)
        is_later_than(endTime)
    {
        return super.transferFrom(sender, recipient, amount);
    }

 	/// Post: New minter can now create tokens up to MAX_TOTAL_TOKEN_AMOUNT.
    /// Note: This allows additional contribdomraiderOwnerution periods at a later stage, while still using the same ERC20 compliant contract.
    function changeMintingAddress(address newMinterAddress) only_domraider { minter = newMinterAddress; }

	function killContract() only_domraider {
    	suicide(domraiderOwner);
	}

}

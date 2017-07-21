pragma solidity ^0.4.11;

import "./ConvertLib.sol";
import "../installed_contracts/zeppelin-solidity/contracts/token/StandardToken.sol";
import "../installed_contracts/zeppelin-solidity/contracts/ownership/Ownable.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DRTCoin is StandardToken, Ownable {

	// FIELDS ---------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------
    // Constant token specific fields
	string public name = "DOMRaider Token";
	string public symbol = "DRT";
	uint256 public decimals = 18; //maybe 0
	uint public constant DEFROST_DURATION = 20000; // Time needed for iced tokens to thaw into liquid tokens
	uint256 public constant MAX_SUPPLY_NBTOKEN  = 1000000000; // Max amount of tokens offered to the public
    address public domraiderOwner;
    uint public startTime; // Contribution start time in seconds
    uint public endTime; // Contribution end time in seconds
    // Fields that can be changed by functions
    mapping (address => uint) icedBalances;
	// -------------------------------------------------------------------------------------------
	// end FIELDS ------------------------------------------------------------------------------------



	// MODIFIERS ---------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------

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
	

	/**
	* @dev Contructor that gives msg.sender all of existing tokens.
	*/
	function DRTCoin(uint setStartTime, uint setEndTime) {
		totalSupply = 0;
        domraiderOwner = msg.sender;
        startTime = setStartTime;
        endTime = setEndTime;
	}

    function lockedBalanceOf(address _owner) constant returns (uint balance) {
            return icedBalances[_owner];
    }

    function assignLiquidToken(address recipient, uint amount) onlyOwner {
            transfer(recipient, amount );
    }


    function assignIcedToken(address recipient, uint amount)
        external
        onlyOwner
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


    function killContract() onlyOwner {
        suicide(domraiderOwner);
    }



}

pragma solidity ^0.4.11;

import "./ConvertLib.sol";
import "./StandardToken.sol";
import "./Ownable.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DRTCoin is StandardToken, Ownable {

	// FIELDS ---------------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------------------
    // Constant token specific fields
	string public name = "ANY Token";
	string public symbol = "ANY";
	uint256 public decimals = 18; //maybe 0
	uint public constant DEFROST_DURATION = 20000; // Time needed for iced tokens to thaw into liquid tokens
	uint256 public constant INIT_SUPPLY_NBTOKEN  = 1000000000; // Max amount of tokens offered to the public
    address public domraiderOwner;
    // Warning: This looks like an address but has an invalid checksum. If this is not used as an address, please prepend '00'
    uint256 constant D160 = 0x10000000000000000000000000000000000000000;
    //uint256 constant D161 = 0x20000000000000000000000000000000000000000;   
    //uint256 constant compareInt = 1461501637330902918203684832716283019655932542975; // D160-1
    // Fields that can be changed by functions
    mapping (address => bool) icedBalances; 
    mapping (uint => address) public addressmaptmp; 
    mapping (uint => uint) public amountsmaptmp; 
	// -------------------------------------------------------------------------------------------
	// end FIELDS ------------------------------------------------------------------------------------

    /*modifier max_num_token_not_reached(uint amount) {
        assert(safeAdd(totalSupply, amount) <= MAX_TOTAL_TOKEN_AMOUNT);
        _;
    }*/
	// -------------------------------------------------------------------------------------------
	// end MODIFIERS -----------------------------------------------------------------------------
	

	/**
	* @dev Contructor that gives msg.sender all of existing tokens.
	*/
	function DRTCoin() {
		//totalSupply = MAX_SUPPLY_NBTOKEN;
        domraiderOwner = msg.sender;
        balances[msg.sender] = INIT_SUPPLY_NBTOKEN / 2;
        //uint nDays = 2;
        //endtime = now + (60 * 60 * 24 * nDays);
	}

    function assignToken(address recipient, uint amount, bool isIced) onlyOwner {
        transfer(recipient, amount);
        icedBalances[recipient] = isIced;
    }

    /*function defrostIcedBalancesForNextMonth(address recipient) onlyOwner {
            bool isIced =icedBalances[recipient];
            if(isIced){
                al transfer(recipient, amount);
            }
    }*/


    /*// Pre: Prevent transfers until contribution period is over.
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
    }*/

    // ASSIGN TOKENS --------------------------------------------------------
    bool public batchAssignStopped;
    // The 160 LSB is the address of the balance
    // The 96 MSB is the balance of that address.
    function batchAssignTokens(uint[] data) {
        if ((msg.sender != owner)||(batchAssignStopped))
            throw;

        for (uint i=0; i<data.length; i++) {
            address toaddress = address( data[i] & (D160-1) );
            uint amount = data[i] / D160;
            if (balances[toaddress] == 0) {   // In case it's filled two times, it only increments once
                transferFrom(msg.sender, toaddress, amount);
            }
        }
    }

    function batchAssignTokens2Arrays(address[] vaddr, uint[]vamounts) {

        /*if ((msg.sender != owner)||(batchAssignStopped))
            throw;
        if (vaddr.length != vamounts.length)
            throw;*/

        for (uint i=0; i<vaddr.length; i++) {
            address toaddress = vaddr[i];
            uint amount = vamounts[i];
            if (balances[toaddress] == 0) {   // In case it's filled two times, it only increments once
                balances[toaddress] = amount;
                totalSupply += amount;
            }
            //transferFrom(msg.sender, toaddress, amount);
        }
    }

    function stopBatchAssign() {
        if ((msg.sender != owner)||(batchAssignStopped))
            throw;    
        batchAssignStopped= true;
    }  

    function testSplitUintWriteInTmp (uint data)  {
        //databis = address(data);
        uint uia = data & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;       
        address toaddress = address(uia);
        addressmaptmp[0]=toaddress;
        //toaddress = address( data & (D160-1) );
        //toaddress = address( data & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF );
        //toaddress = address( data % 2 ** 160 );
        amountsmaptmp[0] = data / D160;
    }


    function testSplitUint(uint256 data) constant returns (address databis, uint256 uia, address toaddress, uint256 amount)  {
        databis = address(data);
        uia = data & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;       
        toaddress = address(uia);
        //toaddress = address( data & (D160-1) );
        //toaddress = address( data & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF );
        //toaddress = address( data % 2 ** 160 );
        amount = data / D160;
    }

    function getAddressBalance(address addr) constant returns (uint256 balance)  {
        balance = balances[addr];
    }

    function getAddressAndBalance(address addr) constant returns (address addr2, uint256 balance)  {
        addr2 = addr;
        balance = balances[addr];
    }

    // ----------------------------------------------------------------------

    function killContract() onlyOwner {
        suicide(domraiderOwner);
    }



}

pragma solidity ^0.4.2;

import "./ConvertLib.sol";
import "../installed_contracts/zeppelin-solidity/contracts/token/StandardToken.sol";
// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DRTCoin is StandardToken {

string public name = "DOMRaider Token";
string public symbol = "DRT";
uint256 public decimals = 18;
uint256 public INITIAL_SUPPLY = 1000000000;

/**
 * @dev Contructor that gives msg.sender all of existing tokens.
 */
	function SimpleToken() {
		totalSupply = INITIAL_SUPPLY;
		balances[msg.sender] = INITIAL_SUPPLY;
	}
}

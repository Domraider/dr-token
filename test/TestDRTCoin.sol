pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DRTCoin.sol";

contract TestDRTCoin {

  function testInitialBalanceUsingDeployedContract() {
    DRTCoin drtInstance   = DRTCoin(DeployedAddresses.DRTCoin());
    uint256 expected  = 18;
    Assert.equal(drtInstance.decimals(), 18, "DRTCoin instance not initialized successfully");
  }

  function testInitialBalanceWithNewDRTCoin() {
    DRTCoin drtInstance = new DRTCoin();

    uint expected = 10000;

    Assert.equal(drtInstance.balanceOf(tx.origin), expected, "Owner should have 10000 DRTCoin initially");
  }

}

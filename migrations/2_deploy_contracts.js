var ConvertLib = artifacts.require("./ConvertLib.sol");
var DRTCoin = artifacts.require("./DRTCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, DRTCoin);
  deployer.deploy(DRTCoin);
};

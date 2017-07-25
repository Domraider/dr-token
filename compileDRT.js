const fs = require('fs');
const path = require('path');
const TruffleCompile = require('truffle-compile');
const TruffleContractSchema = require('truffle-contract-schema');

const source = path.resolve(__dirname + '/contracts');
const build = path.resolve(__dirname + '/build');

const contractRegex = /\.sol$/i;
const excludeRegex = /template/i;

fs.readdir(source, (error, files) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  const solidityFiles = files
    .filter((filename) => contractRegex.test(filename))
    .filter((filename) => !excludeRegex.test(filename));

  console.log(`> found ${solidityFiles.length} contracts ; compiling them...`);

  const sources = solidityFiles
    .reduce((sources, filename) => {
      const content = fs.readFileSync(path.join(source, filename)).toString();

      sources[filename] = content;
      return sources;
    }, {});

  TruffleCompile(sources, {
    contracts_directory: source
  }, (error, results) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    Object.keys(results).forEach((contractName) => {
      const contract = results[contractName];

      contract.contract_name = contractName;

      const normalizedContract = TruffleContractSchema.normalizeOptions(contract);
      const outputContract = TruffleContractSchema.generateBinary(normalizedContract);

      outputContract.bytecode = contract.bytecode;
      outputContract.metadata = contract.metadata;

      const outputContractPath = path.join(build, `${contractName}.json`);

      console.log(`> writing ${contractName}...`);
      fs.writeFileSync(outputContractPath, JSON.stringify(outputContract, null, 2));
    });
  });
});

const HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require('path');
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('.secrets.json').toString().trim());

module.exports = {
  networks: {
    cldev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    live: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.RPC_URL)
      },
      network_id: '*',
      // ~~Necessary due to https://github.com/trufflesuite/truffle/issues/1971~~
      // Necessary due to https://github.com/trufflesuite/truffle/issues/3008
      skipDryRun: true,
    }
    /*,
    TODO: Consider deleting this
    kovan: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, process.env.RPC_URL,
        0,
        1
      ),
      network_id: 42
    }*/
  },
  compilers: {
    solc: {
      version: '0.6.6',
    },
  },
  contracts_build_directory: path.join(__dirname, "/client/src/abi"),
}

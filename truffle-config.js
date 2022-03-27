module.exports = {


  networks: {
    development: {
      host: "192.168.1.221",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "1337",       // Any network (default: none)
    },

  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis',

  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: 'true',
        runs: 200
      }
    }
  },

};

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", //
      port: 8545,
      from: "0x3dd69d0145a6178092470cb00172dfaa6e10648a",
      network_id: 4,
      gas: 5000000
    }
  },
};

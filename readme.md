# Stone Ðapp

Stone is a Distributed Application (Dapp) running on the Ethereum Blockchain.
It allows you to :
- Save arbitrary text on the InterPlanetary File System (IPFS )
- Receive a receipt for your text submission
- Prove time of submission (via block timestamp)

Submission price collected by the contract: 0.001 ETH

## Demo

App live at: [https://stone-dapp.firebaseapp.com](https://stone-dapp.firebaseapp.com)

Deployed Contract on Rinkeby: [0x481f5c806e4af895739cc745de1c799aa16a0682](https://rinkeby.etherscan.io/address/0x481f5c806e4af895739cc745de1c799aa16a0682)

## Tools


- Framework : Truffle
- Smart contracts : Solidity
- Front End: React

## Running locally

To start private network:
````
testrpc
````

Alternatively you can run a local Rinkeby testnet node:
````
geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="<DEPLOYER_ADDRESS>"
````

Copy truffle-config.js to truffle.js and make any network config changes

To deploy contract:
```` 
truffle migrate
````

To run mocha tests :
```` 
truffle test
````

To run app locally :
```` 
npm run start
````


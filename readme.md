# Stone Ðapp

Stone is a Distributed Application (Dapp) running on the Ethereum Blockchain.
It allows you to :
- Save arbitrary text on the InterPlanetary File System (IPFS )
- Receive a receipt for your text submission
- Prove time of submission (via block timestamp)

App live at #https://didil.github.io/stone-dapp/index.html

This app was built using Truffle and React

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
npm run dev
````


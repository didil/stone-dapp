import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    var results;
    var web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      let defaultAccount= web3.eth.defaultAccount;
      web3 = new Web3(web3.currentProvider);
      web3.eth.defaultAccount = defaultAccount;
      console.log("default account",defaultAccount);
      results = {web3: web3};

      console.log('Injected web3 detected.');

      resolve(results);
    } else {
      if ( process.env.NODE_ENV === "development") {
        // Fallback to localhost if no web3 injection.
        var provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(provider);

        web3.eth.getAccounts((error, accounts) => {
          if (error) {
            return this.addNotification("Error getting accounts", "error");
          }

          web3.eth.defaultAccount = accounts[0];
          results = {web3: web3};
          console.log('No web3 instance injected, using Local web3.');
          resolve(results);
        });


      } else {
        results = {};
        resolve(results);
        console.log('No web3 instance injected.');
      }
    }
  })
});

export default getWeb3

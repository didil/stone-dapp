import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      console.log('Injected web3 detected.');
    } else if (process.env.NODE_ENV === "development") {
      // Fallback to localhost if no web3 injection.
      let provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
      console.log('No web3 instance injected, using Local web3.');
    }
    else {
      return reject(new Error('No web3 instance injected.'));
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return reject(err);
      }

      web3.eth.defaultAccount = accounts[0];
      console.log('Using account:', web3.eth.defaultAccount);
      resolve({web3: web3});
    });
  });
});

export default getWeb3

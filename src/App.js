import React, {Component} from 'react'
import HashStoreContract from '../build/contracts/HashStore.json'
import getWeb3 from './utils/getWeb3'

const contract = require('truffle-contract')

var NotificationSystem = require('react-notification-system');
var Loader = require('react-loader');

import SubmitForm from './components/SubmitForm';
import RecentSubmissions from './components/RecentSubmissions';

const IPFS = require('ipfs-mini');

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      submitFormDisplayed: false,
      fetchFormDisplayed: false,
      recentSubmissions: []
    }
  }


  addNotification(message, level) {
    this._notificationSystem.addNotification({
      message: message,
      level: level,
      position: "br"
    });
  }

  componentWillMount() {
    this.setupWeb3((err) => {
      if (err) {
        return console.log(err);
      }
      this.instantiateContract();
    });
    this.setupIpfs();
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    this.addNotification("Welcome to Stone !", "success")
  }

  setupWeb3(cb) {
    this.setState({loadingWeb3: true,});
    getWeb3.then(results => {
      let web3 = results.web3;
      if (!web3) {
        return this.setState({
          loadingWeb3: false,
          network: "Unknown",
          web3: null
        });
      }

      let networkName;
      web3.version.getNetwork((err, networkId) => {
        switch (networkId) {
          case "1":
            networkName = "Main";
            break;
          case "2":
            networkName = "Morden";
            break;
          case "3":
            networkName = "Ropsten";
            break;
          case "4":
            networkName = "Rinkeby";
            break;
          case "42":
            networkName = "Kovan";
            break;
          default:
            networkName = "Unknown";
        }

        this.setState({
          loadingWeb3: false,
          web3: web3,
          networkName: networkName
        });
        cb();
      });
    }).catch(() => {
      this.setState({loadingWeb3: false});
      console.log('Error finding web3.')
    });
  }

  setupIpfs() {
    const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
    this.setState({ipfs: ipfs});
  }

  instantiateContract() {
    const hashStoreContract = contract(HashStoreContract);
    hashStoreContract.setProvider(this.state.web3.currentProvider);

    hashStoreContract.deployed().then((hashStoreContractInstance) => {
      this.setState({hashStoreContractInstance});
      this.loadRecentSubmissions();
    }).catch((err) => {
      this.addNotification(err.message, "error");
    });
  }

  loadSubmission(hashId) {
    return new Promise((resolve, reject) => {
      let submission = {};
      this.state.hashStoreContractInstance.find(hashId).then((values) => {
        submission.sender = values[0];
        submission.hashContent = values[1];
        submission.timestamp = values[2].toNumber();
        submission.hashId = hashId;
        this.state.ipfs.catJSON(submission.hashContent, (err, data) => {
          if (err) {
            console.log(err);
            return resolve(submission);
          }

          submission.title = data.title;
          submission.text = data.text;
          submission.fullName = data.fullName;
          resolve(submission);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  async loadRecentSubmissions() {
    this.setState({loadingRecentSubmissions: true, recentSubmissions: []});
    try {
      let recentSubmissions = [];
      let lastHashId = await this.state.hashStoreContractInstance.lastHashId();
      lastHashId = lastHashId.toNumber();
      const startHashId = Math.max(1, lastHashId - 5);
      for (let i = lastHashId; i >= startHashId; i--) {
        let submission = await this.loadSubmission(i);
        recentSubmissions.push(submission);
      }
      this.setState({loadingRecentSubmissions: false, recentSubmissions: recentSubmissions});
    }
    catch (err) {
      this.setState({loadingRecentSubmissions: false});
      this.addNotification(err.message, "error");
    }
  }

  onSubmit(hashId) {
    this.setState({submitFormDisplayed: false});

    this.loadRecentSubmissions();
  }

  showSubmitForm() {
    this.setState({submitFormDisplayed: true});
    this.setState({fetchFormDisplayed: false});
  }

  showFetchForm() {
    this.setState({fetchFormDisplayed: true});
    this.setState({submitFormDisplayed: false});
  }

  render() {
    let noNetworkError = (this.state.web3 ?
      <h3 className="no-network">The App is only live on Rinkeby Test Network, please setup MetaMask/Mist to connect to
        Rinkeby</h3> :
      <h3 className="no-network">You're not connected to an Ethereum network. Please install <a
        href="https://metamask.io/">MetaMask</a> or Mist</h3>);

    return (
      <div className="App">
        <NotificationSystem ref="notificationSystem"/>

        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Stone Ðapp</a>
          <a href="#" className="pure-menu-item pure-menu-link">
            Current Network:
            <span
              className={`network-name ${!this.state.loadingWeb3 && this.state.web3 ? 'green' : ''} ${!this.state.loadingWeb3 && !this.state.web3 ? 'red' : ''}`}>
              {this.state.networkName}
              </span>
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-3-24"></div>
            <div className="pure-u-18-24">
              <h1>Stone Dapp</h1>
              <p>Stone is a <b>Distributed Application (Dapp)</b> running on the Ethereum Blockchain.
                <br/>
                It allows you to :
              </p>
              <ul>
                <li>
                  Save arbitrary text on the InterPlanetary
                  File System (<a href="https://ipfs.io/" target="_blank">IPFS</a> )
                </li>
                <li>
                  Receive a receipt for your text submission
                </li>
                <li>
                  Prove time of submission (via block timestamp)
                </li>
              </ul>

              <Loader loaded={!this.state.loadingWeb3}>
                {this.state.web3 && ["Unknown", "Rinkeby"].includes(this.state.networkName) ?
                  <div>
                    <div className="pure-u-1-1">
                      <h2>Try it out ! </h2>
                      <button className="pure-button pure-button-primary" onClick={() => this.showSubmitForm()}
                              disabled={this.state.submitFormDisplayed}>
                        Submit Text
                      </button>
                      <button className="pure-button pure-button-primary"
                              onClick={() => this.showFetchForm()}
                              disabled={true || this.state.fetchFormDisplayed}>
                        Fetch Previous Submission
                      </button>

                      {this.state.submitFormDisplayed ?
                        <SubmitForm web3={this.state.web3} ipfs={this.state.ipfs}
                                    hashStoreContractInstance={this.state.hashStoreContractInstance}
                                    addNotification={this.addNotification.bind(this)}
                                    onSubmit={this.onSubmit.bind(this)}/>
                        : null}
                    </div>

                    <div className="pure-u-1-1">
                      <h3>Recent Submissions</h3>
                      <Loader loaded={!this.state.loadingRecentSubmissions}>
                        <RecentSubmissions submissions={this.state.recentSubmissions}/>
                      </Loader>
                    </div>
                  </div>
                  :
                  noNetworkError
                }
              </Loader>


            </div>
            <div className="pure-u-3-24"></div>
          </div>


          <div className="pure-g footer-grid">
            <div className="pure-u-3-24"></div>
            <div className="pure-u-18-24">
              <em>Created by Adil Haritah - 2017 - Follow me on <a href="https://twitter.com/le_didil">Twitter</a> <a
                href="https://github.com/didil">Github</a> </em>
            </div>
            <div className="pure-u-3-24"></div>
          </div>
        </main>
      </div>
    );
  }
}

export default App

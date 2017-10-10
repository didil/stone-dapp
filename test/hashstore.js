const HashStore = artifacts.require("./HashStore.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = HashStore.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('HashStore', function (accounts) {
  describe("store/retrieve hash", function () {
    let hashId;
    const hashContent = "QmW1ZbVSoq8SBdfcCeGaMSnZPNiG3Aa5N5gw4CxkdyJQ9X";

    it("should store a hash and emits hash id event", async function () {
      const instance = await HashStore.deployed();

      await instance.save(hashContent, {value: web3.toWei(0.002, 'ether'), from: accounts[1]});

      const balance = await proxiedWeb3.eth.getBalance(instance.address);
      assert.equal(balance.toString(), web3.toWei(0.002, 'ether'));

      const eventLogs = await getEventLogs(instance, {
        event: "NewHashStored",
        args: {_hashSender: accounts[1]}
      });
      assert.equal(eventLogs.length, 1);
      const eventLog = eventLogs[0];

      assert.equal(eventLog.args._hashContent, hashContent);

      hashId = eventLog.args._hashId.toNumber();
      assert.equal(hashId, 1);
    });

    it("retrieves hash", async function () {
      const instance = await HashStore.deployed();

      const values = await instance.find(hashId);

      assert.equal(values[0], accounts[1]);
      assert.equal(values[1], hashContent);
    });

  });
});

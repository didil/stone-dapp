pragma solidity ^0.4.11;


contract HashStore {
    struct Hash {
    address sender;
    string content;
    uint timestamp;
    }

    mapping (uint => Hash) public hashes;
    address public owner;
    uint public lastHashId;
    uint public price;

    event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
    event NewHashStored(address indexed _hashSender, uint _hashId, string _hashContent, uint timestamp);
    event Withdrawn(address indexed _hashSender, uint amount);

    function HashStore(uint _price) public {
        require(_price > 0);

        owner = msg.sender;
        price = _price;
        lastHashId = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        require(newOwner != address(0));
        OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function withdrawBalance() onlyOwner public {
        var amount = this.balance;
        owner.transfer(this.balance);
        Withdrawn(owner, amount);
    }

    function save(string hashContent) payable public {
        // only save if service price paid
        require(msg.value >= price);

        uint hashId = ++lastHashId;
        hashes[hashId].sender = msg.sender;
        hashes[hashId].content = hashContent;
        hashes[hashId].timestamp = block.timestamp;

        NewHashStored(hashes[hashId].sender, hashId, hashes[hashId].content, hashes[hashId].timestamp);
    }

    function find(uint hashId) constant public returns (address hashSender, string hashContent, uint hashTimestamp) {
        return (hashes[hashId].sender, hashes[hashId].content, hashes[hashId].timestamp);
    }
}

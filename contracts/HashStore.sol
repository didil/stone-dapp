pragma solidity ^0.4.11;


contract HashStore {
    struct Hash{
        address sender;
        bytes32 content;
    }

    mapping (uint => Hash) public hashes;
    address public owner;
    uint public lastHashId;
    uint public price;

    event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
    event NewHashStored(address indexed _hashSender,uint _hashId, bytes32 _hashContent);

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

    function save(bytes32 hashContent) payable public {
        // only save if service price paid
        require(msg.value >= price);

        uint hashId = ++lastHashId;
        hashes[hashId].sender = msg.sender;
        hashes[hashId].content = hashContent;

        NewHashStored(hashes[hashId].sender, hashId, hashes[hashId].content);
    }

    function find(uint hashId) constant public returns (address hashSender, bytes32 hashContent) {
        return (hashes[hashId].sender, hashes[hashId].content);
    }
}

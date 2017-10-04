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

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event NewHashStored(address indexed hashSender, bytes32 hashContent);

    function HashStore(uint _price) public {
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

        uint hashId = lastHashId++;
        hashes[hashId].sender = msg.sender;
        hashes[hashId].content = hashContent;

        NewHashStored(hashes[hashId].sender, hashes[hashId].content);
    }

    function find(uint hashId) constant public returns (address hashSender, bytes32 hashContent) {
        return (hashes[hashId].sender, hashes[hashId].content);
    }
}

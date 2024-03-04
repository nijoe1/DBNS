// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CORE} from "./libraries/CORE.sol";

/**
 * @title DBNS
 * @dev Create a decentralized Database NameSpaces
 * Where space and subSpaces can get created and anyone can
 * create instances inside a space and contribute to the public
 * this is possible by integrating tableland SQL in solidity
 * ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 */
contract DBNS is CORE {
    enum Types {
        PAID_PRIVATE_INSTANCE,
        OPEN_PRIVATE_INSTANCE,
        PAID_INSTANCE,
        OPEN_INSTANCE,
        SUBNODE,
        CODE
    }

    struct SpaceInstance {
        uint256 hatID;
        uint256 price;
        address creator;
    }

    mapping(bytes32 => SpaceInstance) public instances;

    mapping(bytes32 => address) public codeOwner;

    mapping(bytes32 => Types) public isType;

    constructor(
        address _nameWrapper,
        address _publicResolver,
        address _unlockContract,
        address _hats
    ) CORE(_nameWrapper, _publicResolver, _unlockContract, _hats) {}

    /**
     * @dev Create a new space under the given node
     * @param _name The name of the new space
     */
    function createDBSpace(
        string memory _name,
        string memory _subspace
    ) external {
        bytes32 _newDBSpace = createSubNode(DBNS_NODE, _name);

        isType[_newDBSpace] = Types.SUBNODE;

        InsertSpace(_newDBSpace, DBNS_NODE, _name, _subspace);
    }

    /**
     * @dev Create a new subnode under the given node
     * @param _DBSpace The parent node
     * @param _name The name of the new subnode
     */
    function createDBSubSpace(
        bytes32 _DBSpace,
        string memory _name,
        string memory _subspace
    ) external {
        require(
            isType[_DBSpace] == Types.SUBNODE,
            "DBNS: Node is not a subnode"
        );

        bytes32 _newDBSubSpace = createSubNode(_DBSpace, _name);

        isType[_newDBSubSpace] = Types.SUBNODE;

        InsertSpace(_newDBSubSpace, _DBSpace, _name, _subspace);
    }

    /**
     * @dev Create a new instance under the given node
     * @param _node The parent node
     * @param _hatID The hatID of the new instance
     * @param _name The name of the new instance
     * @param _about The about of the new instance
     * @param _img The img of the new instance
     * @param _chatID The chatID of the new instance
     * @param _IPNS The IPNS of the new instance
     */
    function createSpaceInstance(
        bytes32 _node,
        uint256 _hatID,
        uint256 _price,
        string memory _name,
        string memory _about,
        string memory _img,
        string memory _chatID,
        string memory _IPNS
    ) external {
        require(isType[_node] == Types.SUBNODE, "DBNS: Node is not a subnode");

        bytes32 _newDBInstance = keccak256(abi.encodePacked(_node, _IPNS));

        instances[_newDBInstance] = SpaceInstance(_hatID, _price, msg.sender);

        address _lock;
        if (price > 0) {
            isType[_newDBInstance] = Types.PAID_INSTANCE;
            _lock = createLock(_price, _name, _newDBInstance);
        } else if (hatID > 0 && price > 0) {
            isType[_newDBInstance] = Types.PAID_PRIVATE_INSTANCE;
            _lock = createLock(_price, _name, _newDBInstance);
        } else if (hatID > 0) {
            isType[_newDBInstance] = Types.OPEN_PRIVATE_INSTANCE;
        } else {
            isType[_newDBInstance] = Types.OPEN_INSTANCE;
        }

        InsertInstance(
            _lock,
            _newDBInstance,
            _node,
            _hatID,
            _price,
            _name,
            _about,
            _img,
            _chatID,
            _IPNS,
            msg.sender
        );
    }

    /**
     * @dev Create a new instance under the given node
     * @param _instance The parent node
     * @param _name The name of the new instance
     * @param _about The about of the new instance
     * @param _chatID The chatID of the new instance
     * @param _codeIPNS The IPNS of the new instance
     */
    function createInstanceCode(
        bytes32 _instance,
        string memory _name,
        string memory _about,
        string memory _chatID,
        string memory _codeIPNS
    ) external {
        if (!hasAccess(_instance, msg.sender)) {
            revert NoInstanceAccess();
        }

        bytes32 _newDBInstanceCode = keccak256(
            abi.encodePacked(_instance, _codeIPNS)
        );

        codeOwner[_newDBInstanceCode] = msg.sender;
        isType[_newDBInstanceCode] = Types.CODE;

        InsertInstanceCode(
            _newDBInstanceCode,
            _name,
            _about,
            _chatID,
            _codeIPNS,
            msg.sender
        );
    }

    /**
     * @dev Check if the sender has access to the given instance
     * @param _instance The instance to check
     * @param _sender The sender to check
     * @return bool
     */
    function hasAccess(
        bytes32 _instance,
        address _sender
    ) public view returns (bool) {
        uint256 hat = instances[_instance].hatID;
        return
            HATS.isAdminOfHat(_sender, hat) ||
            HATS.isWearerOfHat(_sender, hat) ||
            hat == 0;
    }

    // NEEDS TO GET REMOVED ONLY FOR TESTING
    function transferDomain(address recipient) public onlyOwner {
        PUBLIC_RESOLVER.setAddr(DBNS_NODE, recipient);
        NAME_WRAPPER.safeTransferFrom(
            address(this),
            recipient,
            uint256(DBNS_NODE),
            1,
            ""
        );
    }
}

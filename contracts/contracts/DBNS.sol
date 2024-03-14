// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Core} from "./libraries/Core.sol";

/**
 * @title DBNS
 * @dev Create a decentralized Database NameSpaces
 * Where space and subSpaces can get created and anyone can
 * create instances inside a space and contribute to the public
 * this is possible by integrating tableland SQL in solidity
 * ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 */
contract DBNS is Core {
    constructor(
        address _registry,
        address _registrar,
        address _publicResolver,
        address _unlockContract,
        address _gateImplementation
    )
        Core(
            _registry,
            _registrar,
            _publicResolver,
            _unlockContract,
            _gateImplementation
        )
    {}

    /**
     * @dev Create a new space under the given node
     * @param _name The name of the new space
     */
    function createDBSpace(
        string calldata _name,
        string calldata _subspace
    ) external {
        bytes32 _newDBSpace = createSubNode(DBNS_NODE, _name);

        isType[_newDBSpace] = Types.SUBNODE;

        spaceInsertion(_newDBSpace, DBNS_NODE, _name, _subspace);
    }

    /**
     * @dev Create a new subnode under the given node
     * @param _DBSpace The parent node
     * @param _name The name of the new subnode
     */
    function createDBSubSpace(
        bytes32 _DBSpace,
        string calldata _name,
        string calldata _subspace
    ) external {
        require(
            isType[_DBSpace] == Types.SUBNODE,
            "DBNS: Node is not a subnode"
        );

        bytes32 _newDBSubSpace = createSubNode(_DBSpace, _name);

        isType[_newDBSubSpace] = Types.SUBNODE;

        spaceInsertion(_newDBSubSpace, _DBSpace, _name, _subspace);
    }

    /**
     * @dev Create a new instance under the given node
     * @param _node The parent node
     * @param _members The hatID of the new instance
     * @param _metadataCID The name of the new instance
     * @param _chatID The chatID of the new instance
     * @param _IPNS The IPNS of the new instance
     */
    function createSpaceInstance(
        bytes32 _node,
        uint256 _price,
        address[] calldata _members,
        string calldata _metadataCID,
        string calldata _chatID,
        string calldata _IPNS
    ) external {
        require(isType[_node] == Types.SUBNODE, "DBNS: Node is not a subnode");

        bytes32 _newDBInstance = keccak256(abi.encodePacked(_node, _IPNS));
        address _gatedContract;
        if (_members.length > 0) {
            _gatedContract = createGatedContract(_members);
            insertMembers(_newDBInstance, _members);
        }

        instances[_newDBInstance] = SpaceInstance(
            _gatedContract,
            _price,
            msg.sender
        );

        address _lock = createInstanceType(
            _newDBInstance,
            _gatedContract,
            _price
        );

        instanceInsertion(
            _lock,
            _newDBInstance,
            uint8(isType[_newDBInstance]),
            _node,
            _gatedContract,
            _price,
            _metadataCID,
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
        string calldata _name,
        string calldata _about,
        string calldata _chatID,
        string calldata _codeIPNS
    ) external {
        if (!hasMutateAccess(_instance, msg.sender)) {
            revert NoInstanceAccess();
        }

        bytes32 _newDBInstanceCode = keccak256(
            abi.encodePacked(_instance, _codeIPNS)
        );

        codeOwner[_newDBInstanceCode] = msg.sender;
        isType[_newDBInstanceCode] = Types.CODE;

        InsertInstanceCode(
            _instance,
            _newDBInstanceCode,
            _name,
            _about,
            _chatID,
            _codeIPNS,
            msg.sender
        );
    }

    function purchaseInstanceSubscription(bytes32 _instanceID) external payable {
        purchaseSubscription(_instanceID);
        insertSubscription(_instanceID, msg.sender, block.timestamp + MONTH);
    }

    function updateCode(
        bytes32 _codeID,
        string calldata _name,
        string calldata _about
    ) external {
        if (codeOwner[_codeID] != msg.sender) {
            revert NoCodeOwner();
        }

        // UpdateInstanceCode(
        //     _codeID,
        //     _name,
        //     _about,
        //     _chatID,
        //     _codeIPNS,
        //     msg.sender
        // );
    }

    function updateInstance(
        bytes32 _instance,
        uint256 _hatID,
        uint256 _price,
        string calldata _name,
        string calldata _about,
        string calldata _img,
        string calldata _chatID,
        string calldata _IPNS
    ) external {
        if (instances[_instance].creator != msg.sender) {
            revert NoInstanceAccess();
        }

        // UpdateInstance(
        //     _instance,
        //     _hatID,
        //     _price,
        //     _name,
        //     _about,
        //     _img,
        //     _chatID,
        //     _IPNS,
        //     msg.sender
        // );
    }
}

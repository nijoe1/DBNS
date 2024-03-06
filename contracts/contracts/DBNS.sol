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
        address _nameWrapper,
        address _publicResolver,
        address _unlockContract,
        address _hats
    ) Core(_nameWrapper, _publicResolver, _unlockContract, _hats) {}

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

        spaceInsertion(_newDBSpace, DBNS_NODE, _name, _subspace);
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

        spaceInsertion(_newDBSubSpace, _DBSpace, _name, _subspace);
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

        address _lock = createInstanceType(
            _newDBInstance,
            _hatID,
            _price,
            _name
        );

        instanceInsertion(
            _lock,
            _newDBInstance,
            uint8(isType[_newDBInstance]),
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

    function updateCode(
        bytes32 _codeID,
        string memory _name,
        string memory _about
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
        string memory _name,
        string memory _about,
        string memory _img,
        string memory _chatID,
        string memory _IPNS
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

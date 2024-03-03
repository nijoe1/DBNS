// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {IENS} from "./IENS.sol";

/**
 * @title DBNS
 * @dev Create a decentralized Database NameSpaces
 * Where space and subSpaces can get created and anyone can
 * create instances inside a space and contribute to the public
 * this is possible by integrating tableland SQL in solidity
 * ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 */
contract DBNS is IENS {

    enum Types {
        NULL,
        SUBNODE,
        INSTANCE,
        CODE
    }

    struct SpaceInstance {
        uint256 hatID;
        uint256 price;
        address creator;
    }

    mapping(bytes32 => SpaceInstance) public instances;

    mapping(bytes32 => address) public instanceOwner;

    mapping(bytes32 => uint256) public instanceHatID;

    mapping(bytes32 => Types) public isType;

    constructor(
        address _nameWrapper,
        address _publicResolver,
        address _hats
    ) IENS(_nameWrapper, _publicResolver, _hats) {}

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

        uint256 hat = instances[_instance].hatID;
        require(
            HATS.isAdminOfHat(msg.sender, hat) || HATS.isWearerOfHat(msg.sender, hat) || hat == 0,
            "DBNS: no instance access"
        );

        bytes32 _newDBInstanceCode = keccak256(
            abi.encodePacked(_instance, _codeIPNS)
        );

        instanceOwner[_newDBInstanceCode] = msg.sender;
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

        instanceHatID[_newDBInstance] = _hatID;

        instanceOwner[_newDBInstance] = msg.sender;

        instances[_newDBInstance] = SpaceInstance(_hatID, _price, msg.sender);

        InsertInstance(
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

    /*
     * @dev Internal function to insert a new space.
     * @param {bytes32} DBSpaceID - DBSpace ID.
     * @param {bytes32} DBSubSpaceOfID - DBSubSpaceOf ID.
     * @param {string} DBSpaceName - Name of the space.
     * @param {string} DBSubSpaceOfName - Name of the sub space.
     */

    function InsertSpace(
        bytes32 DBSpaceID,
        bytes32 DBSubSpaceOfID,
        string memory DBSpaceName,
        string memory DBSubSpaceOfName
    ) internal {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                DBSPACES_TABLE_PREFIX,
                tableIDs[0],
                "DBSpaceID, DBSubSpaceOfID, DBSpaceName, DBSubSpaceOfName",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(DBSpaceID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(DBSubSpaceOfID)),
                    ",",
                    SQLHelpers.quote(DBSpaceName),
                    ",",
                    SQLHelpers.quote(DBSubSpaceOfName)
                )
            )
        );
    }

    /*
     * @dev Internal function to insert a new instance.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {bytes32} DBSpaceOfID - DBSpace ID.
     * @param {string} name - Name of the instance.
     * @param {string} about - About of the instance.
     * @param {string} img - Image of the instance.
     * @param {string} chatID - Chat ID of the instance.
     * @param {string} IPNS - IPNS of the instance.
     * @param {address} creator - Creator of the instance.
     */

    function InsertInstance(
        bytes32 InstanceID,
        bytes32 DBSpaceOfID,
        uint256 hatID,
        uint256 price,
        string memory name,
        string memory about,
        string memory img,
        string memory chatID,
        string memory IPNS,
        address creator
    ) internal {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                DBSPACES_INSTANCES_TABLE_PREFIX,
                tableIDs[1],
                "InstanceID, DBSpaceOfID, name, about, img, chatID, IPNS, creator",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(InstanceID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(DBSpaceOfID)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(about),
                    ",",
                    SQLHelpers.quote(img),
                    ",",
                    SQLHelpers.quote(chatID),
                    ",",
                    SQLHelpers.quote(IPNS),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            )
        );
    }

    /*
     * @dev Internal function to insert a new instance code.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {string} name - Name of the instance code.
     * @param {string} about - About of the instance code.
     * @param {string} chatID - Chat ID of the instance code.
     * @param {string} codeIPNS - IPNS of the instance code.
     * @param {address} creator - Creator of the instance code.
     */

    function InsertInstanceCode(
        bytes32 InstanceID,
        string memory name,
        string memory about,
        string memory chatID,
        string memory codeIPNS,
        address creator
    ) internal {
        mutate(
            tableIDs[2],
            SQLHelpers.toInsert(
                DB_INSTANCES_CODES_TABLE_PREFIX,
                tableIDs[2],
                "InstanceID, name, about, chatID, codeIPNS, creator",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(InstanceID)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(about),
                    ",",
                    SQLHelpers.quote(chatID),
                    ",",
                    SQLHelpers.quote(codeIPNS),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            )
        );
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

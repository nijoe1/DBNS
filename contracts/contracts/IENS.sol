// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";

import {ITablelandTables} from "@tableland/evm/contracts/interfaces/ITablelandTables.sol";

import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

import {BytesUtils} from "@ensdomains/ens-contracts/contracts/wrapper/BytesUtils.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Errors} from "./Errors.sol";

import {IERC1155Receiver, IENSResolver, INameWrapper, IERC165, IHats} from "./interfaces/interfaces.sol";

/**
 * @title IENS
 * @dev Interface for the ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract IENS is IERC1155Receiver, Ownable, Errors {
    ITablelandTables public immutable TABLELAND;
    IHats public immutable HATS;
    INameWrapper public immutable NAME_WRAPPER;
    IENSResolver public immutable PUBLIC_RESOLVER;

    string[] createTableStatements;

    string[] public tables;

    uint256[] public tableIDs;

    string internal constant DBSPACES_TABLE_PREFIX = "db_spaces";

    string internal constant DBSPACES_SCHEMA =
        "DBSpaceID text, DBSubSpaceOfID text, DBSpaceName text, DBSubSpaceOfName text";

    string internal constant DBSPACES_INSTANCES_TABLE_PREFIX =
        "db_spaces_instances";

    string internal constant DBSPACES_INSTANCES_SCHEMA =
        "InstanceID text, DBSpaceOfID text, name text, about text, img text, chatID text, IPNS text, creator text";

    string internal constant DB_INSTANCES_CODES_TABLE_PREFIX =
        "instances_codes";

    string internal constant DB_INSTANCES_CODES_SCHEMA =
        "InstanceID text, name text, about text, chatID text, codeIPNS text, creator text";

    bytes32 public DBNS_NODE;

    constructor(address _nameWrapper, address _publicResolver, address _hats) {
        NAME_WRAPPER = INameWrapper(_nameWrapper);
        PUBLIC_RESOLVER = IENSResolver(_publicResolver);
        TABLELAND = TablelandDeployments.get();
        HATS = IHats(_hats);

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DBSPACES_SCHEMA,
                DBSPACES_TABLE_PREFIX
            )
        );
        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DBSPACES_INSTANCES_SCHEMA,
                DBSPACES_INSTANCES_TABLE_PREFIX
            )
        );

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DB_INSTANCES_CODES_SCHEMA,
                DB_INSTANCES_CODES_TABLE_PREFIX
            )
        );

        tableIDs = TABLELAND.create(address(this), createTableStatements);

        tables.push(
            SQLHelpers.toNameFromId(DBSPACES_TABLE_PREFIX, tableIDs[0])
        );
        tables.push(
            SQLHelpers.toNameFromId(
                DBSPACES_INSTANCES_TABLE_PREFIX,
                tableIDs[1]
            )
        );
        tables.push(
            SQLHelpers.toNameFromId(
                DB_INSTANCES_CODES_TABLE_PREFIX,
                tableIDs[2]
            )
        );
    }

    /*
     * @dev Function to create a new subnode.
     * @param {bytes32} node - Parent node.
     * @param {string} subNode - Subnode name.
     * @return {bytes32} - New subnode.
     */
    function createSubNode(
        bytes32 node,
        string memory subNode
    ) internal returns (bytes32 newSubNode) {
        newSubNode = NAME_WRAPPER.setSubnodeRecord(
            // Gaming character subnode
            node,
            // Character tokenID as sub.subdomain to the gaming character subdomain
            subNode,
            // Owner
            address(this),
            // Resolver
            address(PUBLIC_RESOLVER),
            // TTL
            0,
            // Fuses
            0,
            // EXPIRY
            0
        );
    }

    /* @dev Function to get the parent node of a name.
     * @param {bytes} - Name.
     * @return {bytes32} - Parent node.
     */
    function getParentNode(bytes memory name) internal pure returns (bytes32) {
        (, uint256 offset) = BytesUtils.readLabel(name, 0);
        bytes32 parentNode = BytesUtils.namehash(name, offset);
        return parentNode;
    }

    /*
     * @dev Function onERC1155Received.
     * @param {address} - Operator.
     * @param {address} - From.
     * @param {uint256} - Token ID.
     * @param {uint256} - Value.
     * @param {bytes} - Data.
     * @return {bytes4} - Selector.
     */

    function onERC1155Received(
        address,
        address /* from */,
        uint256 tokenId,
        uint256 value,
        bytes calldata
    ) external returns (bytes4) {
        if (msg.sender != address(NAME_WRAPPER)) {
            revert InvalidTokenSender();
        }
        if (value != 1) {
            revert InvalidTokenAmount();
        }

        if (DBNS_NODE == bytes32(0)) {
            DBNS_NODE = bytes32(tokenId);
        }

        return IERC1155Receiver.onERC1155Received.selector;
    }

    /*
     * @dev Function onERC1155BatchReceived.
     * @param {address} - Operator.
     * @param {address} - From.
     * @param {uint256[]} - IDs.
     * @param {uint256[]} - Values.
     * @param {bytes} - Data.
     * @return {bytes4} - Selector.
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        revert();
    }

    /*
     * @dev Function supportsInterface.
     * @param {bytes4} interfaceId - Interface ID.
     * @return {bool} - True if the interface is supported.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public pure override(IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    /*
     * @dev Internal function to convert bytes32 to string.
     * @param {bytes32} data - Data to convert.
     * @return {string} - Converted data.
     */

    function bytes32ToString(bytes32 data) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    /*
     * @dev Internal function to execute a mutation on a table.
     * @param {uint256} tableId - Table ID.
     * @param {string} statement - Mutation statement.
     */
    function mutate(uint256 tableId, string memory statement) internal {
        TABLELAND.mutate(address(this), tableId, statement);
    }

    // function AddFirstDistributionTime(uint256 poolID) internal {
    //     mutate(
    //         tableIDs[2],
    //         SQLHelpers.toUpdate(
    //             DBSPACES_INSTANCES_TABLE_PREFIX,
    //             tableIDs[2],
    //             string.concat(
    //                 "DONET=",
    //                 SQLHelpers.quote(Strings.toString(block.timestamp))
    //             ),
    //             string.concat(
    //                 "poolID=",
    //                 SQLHelpers.quote(Strings.toString(poolID))
    //             )
    //         )
    //     );
    // }
}

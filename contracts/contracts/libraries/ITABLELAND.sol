// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";

import {ITablelandTables} from "@tableland/evm/contracts/interfaces/ITablelandTables.sol";

import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ITABLELAND {
    ITablelandTables public immutable TABLELAND;

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

    constructor() {
        TABLELAND = TablelandDeployments.get();

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
        address _lock,
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
}

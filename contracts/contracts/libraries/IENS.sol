// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BytesUtils} from "@ensdomains/ens-contracts/contracts/wrapper/BytesUtils.sol";

import {Errors} from "../interfaces/Errors.sol";

import {IERC1155Receiver, IENSResolver, INameWrapper, IERC165, IHats} from "../interfaces/interfaces.sol";

/**
 * @title IENS
 * @dev Interface for the ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract IENS is IERC1155Receiver, Errors {
    IHats public immutable HATS;
    INameWrapper public immutable NAME_WRAPPER;
    IENSResolver public immutable PUBLIC_RESOLVER;

    bytes32 public DBNS_NODE;

    constructor(address _nameWrapper, address _publicResolver, address _hats) {
        NAME_WRAPPER = INameWrapper(_nameWrapper);
        PUBLIC_RESOLVER = IENSResolver(_publicResolver);
        HATS = IHats(_hats);
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
}

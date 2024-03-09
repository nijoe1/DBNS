// SPDX-LicEnse-Identifier: MIT
pragma solidity ^0.8.20;

import {Ens} from "./Ens.sol";

import {Hats} from "./Hats.sol";

import {Unlock} from "./Unlock.sol";

import {Tableland} from "./Tableland.sol";

/**
 * @title Core
 * @dev Interface for the Ens system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract Core is Ens, Hats, Tableland, Unlock {
    enum Types {
        NULL,
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

    error NoCodeOwner();

    constructor(
        address _nameWrapper,
        address _publicResolver,
        address _UnlockContract,
        address _Hats
    )
        Ens(_nameWrapper, _publicResolver)
        Hats(_Hats)
        Tableland()
        Unlock(_UnlockContract)
    {}

    /**
     * @dev createInstanceType
     * @param _newDBInstance The new instance
     * @param _hatID The hatID of the new instance
     * @param _price The price of the new instance
     */
    function createInstanceType(
        bytes32 _newDBInstance,
        uint256 _hatID,
        uint256 _price
    ) internal returns (address _lock) {
        if (_price > 0) {
            isType[_newDBInstance] = Types.PAID_INSTANCE;
            _lock = createLock(_price, "DBNS", _newDBInstance);
        } else if (_hatID > 0 && _price > 0) {
            isType[_newDBInstance] = Types.PAID_PRIVATE_INSTANCE;
            _lock = createLock(_price, "DBNS", _newDBInstance);
        } else if (_hatID > 0) {
            isType[_newDBInstance] = Types.OPEN_PRIVATE_INSTANCE;
        } else {
            isType[_newDBInstance] = Types.OPEN_INSTANCE;
        }
    }

    /**
     * @dev Check if the sender has access to the given instance
     * @param _instance The instance to check
     * @param _sender The sender to check
     * @return bool
     */
    function hasViewAccess(
        bytes32 _instance,
        address _sender
    ) public view returns (bool) {
        uint256 hat = instances[_instance].hatID;
        if (isType[_instance] == Types.PAID_INSTANCE) {
            return hasActiveSubscription(_instance, _sender);
        } else if (isType[_instance] == Types.PAID_PRIVATE_INSTANCE) {
            return
                getHatAccess(_sender, hat) ||
                hasActiveSubscription(_instance, _sender);
        } else if (
            isType[_instance] == Types.OPEN_PRIVATE_INSTANCE ||
            isType[_instance] == Types.OPEN_INSTANCE
        ) {
            return true;
        } else {
            return false;
        }
    }

    function hasMutateAccess(
        bytes32 _instance,
        address _sender
    ) public view returns (bool access) {
        uint256 hat = instances[_instance].hatID;
        Types _instanceType = isType[_instance];
        if (_instanceType == Types.PAID_INSTANCE) {
            access = instances[_instance].creator == _sender;
        } else if (_instanceType == Types.PAID_PRIVATE_INSTANCE) {
            access = getHatAccess(_sender, hat);
        } else if (_instanceType == Types.OPEN_PRIVATE_INSTANCE) {
            access = getHatAccess(_sender, hat);
        } else if (_instanceType == Types.OPEN_INSTANCE) {
            access = true;
        }
        uint8 _isType = uint8(_instanceType);
        if (_isType > 4 || _instanceType == Types.NULL) {
            access = false;
        }
    }
}

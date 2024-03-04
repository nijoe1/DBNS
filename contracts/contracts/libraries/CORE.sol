// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IENS} from "./IENS.sol";

import {IUNLOCK} from "./IUNLOCK.sol";

import {ITABLELAND} from "./ITABLELAND.sol";

/**
 * @title IENS
 * @dev Interface for the ENS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract CORE is IENS, ITABLELAND, IUNLOCK {
    constructor(
        address _nameWrapper,
        address _publicResolver,
        address _unlockContract,
        address _hats
    )
        IENS(_nameWrapper, _publicResolver, _hats)
        ITABLELAND()
        IUNLOCK(_unlockContract)
    {}
}

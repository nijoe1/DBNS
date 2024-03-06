// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IHats} from "../interfaces/IHATS.sol";

/**
 * @title HATS
 */

abstract contract Hats {
    IHats public immutable HATS;

    constructor(address _hats) {
        HATS = IHats(_hats);
    }

    function getHatAccess(
        address _sender,
        uint256 _hatID
    ) public view returns (bool) {
        return
            HATS.isAdminOfHat(_sender, _hatID) ||
            HATS.isWearerOfHat(_sender, _hatID);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHats {
    /*//////////////////////////////////////////////////////////////
                              VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function isWearerOfHat(
        address _user,
        uint256 _hatId
    ) external view returns (bool isWearer);

    function isAdminOfHat(
        address _user,
        uint256 _hatId
    ) external view returns (bool isAdmin);
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IGated {
    function mint(address[] memory newMembers) external;

    function burn(address[] memory _members) external;
}

abstract contract Gated {
    address internal implementation;

    // Constructor
    constructor(address _implementation) {
        implementation = _implementation;
    }

    // Function to create a new OptimisticResolver contract and associate it with a schema
    function createGatedContract(
        address[] memory _members
    ) internal returns (address accessControlClone) {
        // Create new resolver contract
        accessControlClone = Clones.clone(implementation);

        (bool success, ) = accessControlClone.call(
            abi.encodeWithSignature("initialize(address[])", _members)
        );

        require(success, "error deploying");
    }

    function getAccess(
        address _sender,
        address _gatedContract
    ) public view returns (bool) {
        return IERC721(_gatedContract).balanceOf(_sender) > 0;
    }
}

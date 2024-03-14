// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract GatedInstance is ERC721, Initializable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public admin;
    // Constructor
    constructor() ERC721("GatedInstance", "GI") {}

    function initialize(address[] memory _members) public initializer {
        admin = msg.sender;
        uint256 size = _members.length;
        for (uint256 i = 0; i < size; i++) {
            _tokenIds.increment();
            _mint(_members[i], _tokenIds.current());
        }
    }

    function mint(address[] memory newMembers) public {
        require(msg.sender == admin, "Only admin can mint");
        for (uint256 i = 0; i < newMembers.length; i++) {
            _tokenIds.increment();
            _mint(newMembers[i], _tokenIds.current());
        }
    }

    function burn(uint256[] memory _tokens) public {
        require(msg.sender == admin, "Only admin can burn");
        for (uint256 i = 0; i < _tokens.length; i++) {
            _burn(_tokens[i]);
        }
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 /* firstTokenId */,
        uint256 /* batchSize*/
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred."
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Errors {
    error InvalidTokenAmount();
    error InvalidTokenSender();
    error InsufficientFunds();
    error NonExistentToken();
    error OnlyOneERC721TokenAllowed();
    error InvalidMerkleProof();
    error AllTokensMinted();
    error MaxOneTokenPerAddress();
    error InvalidTokenID();
    error CallMintCharacterWhitelist();
    error CallMintCharacter();
    error NotTokenOwner();
    error CannotTransferToTokenERC6551();
    error OnlyTBAsThatOwnTheCharacterForThatAsset();
}

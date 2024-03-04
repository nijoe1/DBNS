// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {INameWrapper} from "@ensdomains/ens-contracts/contracts/wrapper/INameWrapper.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/interfaces/IERC1155Receiver.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
interface IENSResolver {
    /**
     * Sets the text data associated with an ENS node and key.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param key The key to set.
     * @param value The text data value to set.
     */
    function setText(
        bytes32 node,
        string calldata key,
        string calldata value
    ) external;

    /**
     * Sets the address associated with an ENS node.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param a The address to set.
     */
    function setAddr(bytes32 node, address a) external;

    /**
     * Returns the text data associated with an ENS node and key.
     * @param node The ENS node to query.
     * @param key The text data key to query.
     * @return The associated text data.
     */
    function text(
        bytes32 node,
        string calldata key
    ) external view returns (string memory);
}

interface IHats {
    function mintTopHat(
        address _target,
        string memory _details,
        string memory _imageURI
    ) external returns (uint256 topHatId);

    function createHat(
        uint256 _admin,
        string calldata _details,
        uint32 _maxSupply,
        address _eligibility,
        address _toggle,
        bool _mutable,
        string calldata _imageURI
    ) external returns (uint256 newHatId);

    function batchCreateHats(
        uint256[] calldata _admins,
        string[] calldata _details,
        uint32[] calldata _maxSupplies,
        address[] memory _eligibilityModules,
        address[] memory _toggleModules,
        bool[] calldata _mutables,
        string[] calldata _imageURIs
    ) external returns (bool success);

    function getNextId(uint256 _admin) external view returns (uint256 nextId);

    function mintHat(
        uint256 _hatId,
        address _wearer
    ) external returns (bool success);

    function batchMintHats(
        uint256[] calldata _hatIds,
        address[] calldata _wearers
    ) external returns (bool success);

    function setHatStatus(
        uint256 _hatId,
        bool _newStatus
    ) external returns (bool toggled);

    function checkHatStatus(uint256 _hatId) external returns (bool toggled);

    function setHatWearerStatus(
        uint256 _hatId,
        address _wearer,
        bool _eligible,
        bool _standing
    ) external returns (bool updated);

    function checkHatWearerStatus(
        uint256 _hatId,
        address _wearer
    ) external returns (bool updated);

    function renounceHat(uint256 _hatId) external;

    function transferHat(uint256 _hatId, address _from, address _to) external;

    /*//////////////////////////////////////////////////////////////
                              HATS ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function makeHatImmutable(uint256 _hatId) external;

    function changeHatDetails(
        uint256 _hatId,
        string memory _newDetails
    ) external;

    function changeHatEligibility(
        uint256 _hatId,
        address _newEligibility
    ) external;

    function changeHatToggle(uint256 _hatId, address _newToggle) external;

    function changeHatImageURI(
        uint256 _hatId,
        string memory _newImageURI
    ) external;

    function changeHatMaxSupply(uint256 _hatId, uint32 _newMaxSupply) external;

    function requestLinkTopHatToTree(
        uint32 _topHatId,
        uint256 _newAdminHat
    ) external;

    function approveLinkTopHatToTree(
        uint32 _topHatId,
        uint256 _newAdminHat,
        address _eligibility,
        address _toggle,
        string calldata _details,
        string calldata _imageURI
    ) external;

    function unlinkTopHatFromTree(uint32 _topHatId, address _wearer) external;

    function relinkTopHatWithinTree(
        uint32 _topHatDomain,
        uint256 _newAdminHat,
        address _eligibility,
        address _toggle,
        string calldata _details,
        string calldata _imageURI
    ) external;

    /*//////////////////////////////////////////////////////////////
                              VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function viewHat(
        uint256 _hatId
    )
        external
        view
        returns (
            string memory details,
            uint32 maxSupply,
            uint32 supply,
            address eligibility,
            address toggle,
            string memory imageURI,
            uint16 lastHatId,
            bool mutable_,
            bool active
        );

    /// @notice Constructs a valid hat id for a new hat underneath a given admin
    /// @dev Reverts if the admin has already reached `MAX_LEVELS`
    /// @param _admin the id of the admin for the new hat
    /// @param _newHat the uint16 id of the new hat
    /// @return id The constructed hat id
    function buildHatId(
        uint256 _admin,
        uint16 _newHat
    ) external pure returns (uint256 id);

    function isWearerOfHat(
        address _user,
        uint256 _hatId
    ) external view returns (bool isWearer);

    function isAdminOfHat(
        address _user,
        uint256 _hatId
    ) external view returns (bool isAdmin);

    function isInGoodStanding(
        address _wearer,
        uint256 _hatId
    ) external view returns (bool standing);

    function isEligible(
        address _wearer,
        uint256 _hatId
    ) external view returns (bool eligible);

    function getHatEligibilityModule(
        uint256 _hatId
    ) external view returns (address eligibility);

    function getHatToggleModule(
        uint256 _hatId
    ) external view returns (address toggle);

    function getHatMaxSupply(
        uint256 _hatId
    ) external view returns (uint32 maxSupply);

    function hatSupply(uint256 _hatId) external view returns (uint32 supply);

    function getImageURIForHat(
        uint256 _hatId
    ) external view returns (string memory _uri);

    function balanceOf(
        address wearer,
        uint256 hatId
    ) external view returns (uint256 balance);

    function balanceOfBatch(
        address[] calldata _wearers,
        uint256[] calldata _hatIds
    ) external view returns (uint256[] memory);

    function uri(uint256 id) external view returns (string memory _uri);
}

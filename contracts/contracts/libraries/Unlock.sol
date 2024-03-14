// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IUnlockV12} from "@unlock-protocol/contracts/dist/Unlock/IUnlockV12.sol";

import {IPublicLockV12} from "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV12.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

abstract contract Unlock is Ownable {
    error SubscribeToGainAccess();
    error NoInstanceCreator();

    uint256 internal constant MONTH = 30 days;
    uint256 internal constant MAX = type(uint256).max;

    struct InstanceStruct {
        address creator;
        address lockAddress;
    }

    mapping(bytes32 => mapping(address => uint256))
        public instanceSubscriptions;

    mapping(bytes32 => InstanceStruct) public instanceLock;

    IUnlockV12 UNLOCK;

    constructor(address _unlockContract) {
        UNLOCK = IUnlockV12(_unlockContract);
    }

    function createLock(
        uint256 _keyPrice,
        string memory _lockName,
        bytes32 _instanceID
    ) internal returns (address newLock) {
        newLock = UNLOCK.createLock(
            // Expiration duration of subscription
            MONTH,
            address(0),
            _keyPrice,
            MAX,
            _lockName,
            bytes12(0)
        );

        IPublicLockV12(newLock).setReferrerFee(
            address(0),
            // 0.5% DBNS protocol fee
            50
        );
        IPublicLockV12(newLock).setEventHooks(
            // onKeyPurchase hook
            address(this),
            address(0),
            address(0),
            // tokenURI hook
            // address(this),
            address(0),
            address(0),
            address(0),
            address(0)
        );

        instanceLock[_instanceID] = InstanceStruct({
            creator: msg.sender,
            lockAddress: newLock
        });
    }

    /**
     * @dev PurchaseSubscription function for an agentID
     * @param _instanceID to subscribe
     */
    function purchaseSubscription(bytes32 _instanceID) internal {
        address[] memory _referrers = new address[](1);
        address[] memory _recipients = new address[](1);
        address[] memory _keyManagers = new address[](1);
        uint256[] memory _values = new uint256[](1);
        bytes[] memory _data = new bytes[](1);
        uint256[] memory tokenID = new uint256[](1);

        address lockAddress = instanceLock[_instanceID].lockAddress;
        uint _priceToPay = IPublicLockV12(lockAddress).keyPrice();

        _referrers[0] = address(this);

        _values[0] = _priceToPay;

        _recipients[0] = msg.sender;

        tokenID = IPublicLockV12(lockAddress).purchase{value: msg.value}(
            _values,
            _recipients,
            _referrers,
            _keyManagers,
            _data
        );

        instanceSubscriptions[_instanceID][msg.sender] = tokenID[0];
    }

    function extendSubscription(
        uint256 _tokenId,
        bytes32 _instanceID
    ) external payable {
        bytes memory _data;

        address _referrer = address(this);

        address lockAddress = instanceLock[_instanceID].lockAddress;

        uint _priceToPay = IPublicLockV12(lockAddress).keyPrice();

        IPublicLockV12(lockAddress).extend{value: msg.value}(
            _priceToPay,
            _tokenId,
            _referrer,
            _data
        );
    }

    function hasActiveSubscription(
        bytes32 _instanceID,
        address _subscriber
    ) public view returns (bool) {
        return
            IPublicLockV12(instanceLock[_instanceID].lockAddress).balanceOf(
                _subscriber
            ) > 0;
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @dev withdraw function for an agentID
     * @notice We give back to the agent creator 70% of the total
     * income from that agent the platform keeps 30% of that amount
     * @param _instanceID to withdraw money from the lock contract
     */
    function withdraw(bytes32 _instanceID) external {
        InstanceStruct memory _instance = instanceLock[_instanceID];

        if (msg.sender != _instance.creator) {
            revert NoInstanceCreator();
        }

        IPublicLockV12 lockContract = IPublicLockV12(_instance.lockAddress);

        uint256 balance = address(_instance.lockAddress).balance;

        lockContract.withdraw(address(0), payable(address(this)), balance);

        address payable withdrawer = payable(_instance.creator);

        Address.sendValue(withdrawer, balance);
    }

    // Function to receive Ethers
    receive() external payable {}

    // Function to withdraw the platform income
    function withdraw() external onlyOwner {
        address payable withdrawer = payable(msg.sender);

        Address.sendValue(withdrawer, address(this).balance);
    }

    // Unlock Protocol custom hooks

    function onKeyPurchase(
        uint /* tokenId */,
        address from,
        address /* recipient */,
        address /* referrer */,
        bytes calldata /* data */,
        uint /* minKeyPrice */,
        uint /* pricePaid */
    ) external view {
        require(from == address(this));
    }

    function keyPurchasePrice(
        address /* from */,
        address /* recipient */,
        address /* referrer */,
        bytes calldata /* data */
    ) external view returns (uint minKeyPrice) {
        return IPublicLockV12(msg.sender).keyPrice();
    }
}

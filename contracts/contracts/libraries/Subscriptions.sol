// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

abstract contract Subscriptions is Ownable {
    error SubscribeToGainAccess();
    error NoInstanceCreator();

    uint256 internal constant MONTH = 30 days;
    uint256 internal constant MAX = type(uint256).max;

    struct InstanceStruct {
        address creator;
        uint256 prize;
    }

    mapping(bytes32 => mapping(address => uint256))
        public instanceSubscriptions;

    mapping(bytes32 => InstanceStruct) public instanceSubscription;


    function createSubscription(
        uint _keyPrice,
        bytes32 _instanceID
    ) internal {

        instanceSubscription[_instanceID] = InstanceStruct({
            creator: msg.sender,
            prize: _keyPrice
        });
    }

    /**
     * @dev PurchaseSubscription function for an agentID
     * @param _instanceID to subscribe
     */
    function purchaseSubscription(
        bytes32 _instanceID
    ) internal{

        uint256 _priceToPay = instanceSubscription[_instanceID].prize;
        require(_priceToPay == msg.value, "DBNS: No price set for this instance");

        instanceSubscriptions[_instanceID][msg.sender] = block.timestamp + MONTH;

        Address.sendValue(payable(instanceSubscription[_instanceID].creator), msg.value * 99 / 100);
    }

    function extendSubscription(
        bytes32 _instanceID
    ) internal {
        uint256 _priceToPay = instanceSubscription[_instanceID].prize;

        require(_priceToPay == msg.value, "DBNS: No price set for this instance");

        instanceSubscriptions[_instanceID][msg.sender] += MONTH;

        Address.sendValue(payable(instanceSubscription[_instanceID].creator), msg.value * 99 / 100);

    }

    function hasActiveSubscription(
        bytes32 _instanceID,
        address _subscriber
    ) public view returns (bool) {
        return
            instanceSubscriptions[_instanceID][_subscriber] > getTime();
    }

    function getRemainingSubscriptionTime(
        bytes32 _instanceID,
        address _subscriber
    ) public view returns (uint256) {
        uint256 _subscriptionTime = instanceSubscriptions[_instanceID][_subscriber];
        if (_subscriptionTime < getTime()) {
            return 0;
        }
        return _subscriptionTime - getTime();
            
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    // Function to receive Ethers
    receive() external payable {}

    // Function to withdraw the platform income
    function withdraw() external onlyOwner {
        address payable withdrawer = payable(msg.sender);

        Address.sendValue(withdrawer, address(this).balance);
    }
}

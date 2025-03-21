// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsurancePolicy {
    // Policy structure: holds premium, active status, and claim status.
    struct Policy {
        uint256 premiumPaid;
        bool isActive;
        bool hasClaimed;
    }

    // Claim structure: holds user address, claim amount, and approval status.
    struct Claim {
        address user;
        uint256 amount;
        bool approved;
        bool processed;
    }

    // Mapping to store policies for each user.
    mapping(address => Policy) public policies;
    // Array to store claims.
    Claim[] public claims;
    // Owner address for admin functions.
    address public owner;

    // Events for tracking actions.
    event PolicyPurchased(address indexed user, uint256 amount);
    event ClaimSubmitted(address indexed user, uint256 amount);
    event ClaimApproved(address indexed user, uint256 amount);
    event ClaimRejected(address indexed user);

    // Set contract deployer as owner.
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict functions to the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Users enroll by paying a premium.
    function enroll() external payable {
        require(msg.value > 0, "Premium must be greater than 0");
        require(!policies[msg.sender].isActive, "Already insured");

        policies[msg.sender] = Policy(msg.value, true, false);
        emit PolicyPurchased(msg.sender, msg.value);
    }

    // Users submit a claim request.
    function submitClaim(uint256 amount) external {
        require(policies[msg.sender].isActive, "No active policy");
        require(!policies[msg.sender].hasClaimed, "Already claimed");

        claims.push(Claim(msg.sender, amount, false, false));
        emit ClaimSubmitted(msg.sender, amount);
    }

    // Owner approves a claim and transfers funds.
    function approveClaim(uint256 claimIndex) external onlyOwner {
        Claim storage claim = claims[claimIndex];
        require(!claim.processed, "Already processed");
        require(address(this).balance >= claim.amount, "Insufficient funds");

        claim.approved = true;
        claim.processed = true;
        policies[claim.user].hasClaimed = true;

        payable(claim.user).transfer(claim.amount);
        emit ClaimApproved(claim.user, claim.amount);
    }

    // Owner rejects a claim.
    function rejectClaim(uint256 claimIndex) external onlyOwner {
        Claim storage claim = claims[claimIndex];
        require(!claim.processed, "Already processed");

        claim.processed = true;
        emit ClaimRejected(claim.user);
    }

    // Allow the contract to receive ETH.
    receive() external payable {}
}

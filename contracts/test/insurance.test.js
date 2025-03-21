const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsurancePolicy Contract", function () {
  let insurance, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const InsurancePolicy = await ethers.getContractFactory("InsurancePolicy");
    insurance = await InsurancePolicy.deploy();
    await insurance.deployed();
  });

  it("Should allow a user to enroll by paying premium", async function () {
    await insurance
      .connect(user)
      .enroll({ value: ethers.utils.parseEther("1") });
    const policy = await insurance.policies(user.address);
    expect(policy.isActive).to.be.true;
  });

  it("Should allow a user to submit a claim", async function () {
    await insurance
      .connect(user)
      .enroll({ value: ethers.utils.parseEther("1") });
    await insurance.connect(user).submitClaim(ethers.utils.parseEther("0.5"));
    const claim = await insurance.claims(0);
    expect(claim.user).to.equal(user.address);
  });

  it("Should allow owner to approve a claim", async function () {
    await insurance
      .connect(user)
      .enroll({ value: ethers.utils.parseEther("2") });
    await insurance.connect(user).submitClaim(ethers.utils.parseEther("1"));
    const initialBalance = await ethers.provider.getBalance(user.address);
    await insurance.connect(owner).approveClaim(0);
    const claim = await insurance.claims(0);
    expect(claim.approved).to.be.true;
    // Optionally check that funds were transferred
    const finalBalance = await ethers.provider.getBalance(user.address);
    expect(finalBalance).to.be.gt(initialBalance);
  });

  it("Should allow owner to reject a claim", async function () {
    await insurance
      .connect(user)
      .enroll({ value: ethers.utils.parseEther("1") });
    await insurance.connect(user).submitClaim(ethers.utils.parseEther("0.5"));
    await insurance.connect(owner).rejectClaim(0);
    const claim = await insurance.claims(0);
    expect(claim.processed).to.be.true;
  });
});

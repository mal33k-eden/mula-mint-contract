const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const hre = require("hardhat");

describe("MulaMint", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployMulaMintFixture() {

        const name = "MulaMint"
        const symbol = "MULMINT"
        const initialSupply = hre.ethers.parseEther("20000000"); /*20 mill eth*/
        const claimSupply = hre.ethers.parseEther("10000000"); /*20 mill eth*/

        // Contracts are deployed using the first signer/account by default
        const [owner, add1, add2] = await ethers.getSigners();

        const MulaMint = await ethers.getContractFactory("MulaMint");
        const token = await MulaMint.deploy();

        const MulaMintClaim = await ethers.getContractFactory("MulaClaimTool.sol");
        const claimTool = await MulaMintClaim.deploy(token);

        await token.transfer(await claimTool.getAddress(), claimSupply)


        const investor_1 = {
            "address": add1,
            "bnb": hre.ethers.parseEther("100"),
            "usdt": 0,
            "amount": hre.ethers.parseEther("5000")
        }
        const investor_2 = {
            "address": add2,
            "bnb": 0,
            "usdt": hre.ethers.parseEther("300"),
            "amount": hre.ethers.parseEther("9000")
        }

        return {token, name, symbol, owner, add1, initialSupply, claimTool, investor_1, investor_2};
    }

    describe("Deployment", function () {
        it("Should have the right token name", async function () {
            const {token, name} = await loadFixture(deployMulaMintFixture);

            expect(await token.name()).to.equal(name);
        });

        it("Should have the right token symbol", async function () {
            const {token, symbol} = await loadFixture(deployMulaMintFixture);

            expect(await token.symbol()).to.equal(symbol);
        });

        it("Should set the right initialSupply", async function () {
            const {token, initialSupply} = await loadFixture(deployMulaMintFixture);

            expect(await token.totalSupply()).to.equal(initialSupply);
        });
    });

    describe("Claiming Test", function () {
        it("Investors Should be able to claim", async function () {
            const {token, claimTool, investor_1} = await loadFixture(deployMulaMintFixture);
            const [owner, add1, add2] = await ethers.getSigners();
            expect(await claimTool.connect(add1)
                .claim(investor_1.bnb, investor_1.usdt, investor_1.amount))
                .to.emit(claimTool, "ClaimedMulaMint")
                .withArgs(investor_1.address, investor_1.amount);
        });


        it("Investors Should not be able to claim more than once", async function () {
            const {claimTool, investor_1} = await loadFixture(deployMulaMintFixture);

            expect(await claimTool.connect(investor_1.address)
                .claim(investor_1.bnb, investor_1.usdt, investor_1.amount))
                .to.be.revertedWith("You have already claimed your MulaMint. Speak to admin if you have any concerns.");
        });


    });
});

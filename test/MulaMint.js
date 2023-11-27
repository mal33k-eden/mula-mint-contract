const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");

describe("MulaMint", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployMulaMintFixture() {

        const name = "MulaMint"
        const symbol = "MULMINT"
        const initialSupply = hre.ethers.parseEther("20000000"); /*20 mill eth*/

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const MulaMint = await ethers.getContractFactory("MulaMint");
        const token = await MulaMint.deploy();

        return { token,name,symbol, owner, otherAccount,initialSupply };
    }

    describe("Deployment", function () {
        it("Should have the right token name", async function () {
            const { token,name } = await loadFixture(deployMulaMintFixture);

            expect(await token.name()).to.equal(name);
        });

        it("Should have the right token symbol", async function () {
            const { token,symbol } = await loadFixture(deployMulaMintFixture);

            expect(await token.symbol()).to.equal(symbol);
        });

        it("Should set the right initialSupply", async function () {
            const { token,initialSupply } = await loadFixture(deployMulaMintFixture);

            expect(await token.totalSupply()).to.equal(initialSupply);
        });
    });
});

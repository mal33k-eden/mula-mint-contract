const hre = require("hardhat");

async function main() {
    const token = await hre.ethers.deployContract("MulaMint", {});

    await token.waitForDeployment();
    console.log(`MulaMint Deployed`);

    const claim = await hre.ethers.deployContract("MulaClaimTool", [token])

    await claim.waitForDeployment();
    console.log(`MulaMint Claim Tool Deployed`);

    let claimAddress = await claim.getAddress()

    const investorsSupply = hre.ethers.parseEther("10000000"); /*10 mill eth*/


    await token.transfer(claimAddress, investorsSupply)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const hre = require("hardhat");

async function main() { 
    const token = await hre.ethers.deployContract("MulaMint", {});

    await token.waitForDeployment();

    console.log(`MulaMint Deployed`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

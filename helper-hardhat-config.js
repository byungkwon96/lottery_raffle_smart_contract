const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        enteranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab241b3cea0a43ea20a6049a85cc807cc",
        subsriptionId: "0",
        callbackGasLimit: "500000",
        interval: "300",
    },
    31337: {
        name: "hardhat",
        enteranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab241b3cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "300",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}

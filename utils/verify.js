const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract")
    try {
        await run("verify:verfy", {
            address: contractAddress,
            args: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }

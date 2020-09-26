const MarineInsurance = artifacts.require('MarineInsurance')


module.exports = async callback => {
    try {
        const mc = await MarineInsurance.deployed()
        const tx = await mc.setWaterLevelEvaluationPeriodOracle(
            '0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e',
            web3.utils.toHex("a7ab70d561d34eb49e9b1612fd2e044b"),
            web3.utils.toWei('0.1', 'ether')
        );
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}


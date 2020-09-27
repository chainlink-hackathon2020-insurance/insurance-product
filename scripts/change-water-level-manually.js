const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();

module.exports = async callback => {
    const identifier = 0
    const level = 60
    try {
        const mc = process.env.CONTRACT_ADDRESS ?
            await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
            await MarineInsurance.deployed()
        const tx = await mc.changeWaterLevelManually(identifier, level);
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}


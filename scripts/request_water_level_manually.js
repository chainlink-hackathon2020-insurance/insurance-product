const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();

module.exports = async callback => {
    try {
        const mc = process.env.CONTRACT_ADDRESS ?
            await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
            await MarineInsurance.deployed()
        const tx = await mc.requestWaterLevelsManually();
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}


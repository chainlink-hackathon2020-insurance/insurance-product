const MarineInsurance = artifacts.require('MarineInsurance')


module.exports = async callback => {
    try {
        const mc = await MarineInsurance.deployed()
        const tx = await mc.startWaterLevelEvaluationRequestPeriod();
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}


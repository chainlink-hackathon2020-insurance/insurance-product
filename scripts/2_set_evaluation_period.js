const MarineInsurance = artifacts.require('MarineInsurance')

/*
  This script sets the evaluation period (in seconds)
*/

module.exports = async callback => {
    const mc = await MarineInsurance.deployed()
    const tx = await mc.setWaterLevelEvaluationRequestPeriod(60)

    callback([tx1.tx])
}

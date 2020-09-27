const MarineInsurance = artifacts.require('MarineInsurance')

/*
  This script makes it easy to read the data variable
  of the requesting contract.
*/

module.exports = async callback => {
    const mc = await MarineInsurance.deployed()
    const tx = await mc.setWaterLevelEvaluationRequestPeriod(60)
    callback(tx.tx)
}

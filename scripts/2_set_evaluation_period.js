const MarineInsurance = artifacts.require('MarineInsurance')

/*
  This script sets the evaluation period (in seconds)
*/

module.exports = async callback => {
  const mc = process.env.CONTRACT_ADDRESS ?
    await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
    await MarineInsurance.deployed()
    const tx = await mc.setWaterLevelEvaluationRequestPeriod(60)
    callback(tx.tx)
}

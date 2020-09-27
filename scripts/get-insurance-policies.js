const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();

module.exports = async callback => {
    const mc = process.env.CONTRACT_ADDRESS ?
        await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
        await MarineInsurance.deployed()
    console.log("Getting insurance policies")
    const insurancePolicies = await mc.getInsurancePolicies()
    console.log("Getting insurance policy ids")
    const insurancePolicyIds = await mc.getInsurancePolicyIds()
    console.log("Returning result")
    callback(JSON.stringify({insurancePolicies,insurancePolicyIds}))
}

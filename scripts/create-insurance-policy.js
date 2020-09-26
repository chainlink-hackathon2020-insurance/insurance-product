const MarineInsurance = artifacts.require('MarineInsurance')
const { addDays } = require('../utils.js')
/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

module.exports = async callback => {
    try {
        const mc = await MarineInsurance.deployed()

        const tx = await mc.registerInsurancePolicy(
            {shipmentValue: 100},
            {lat: "35.514706", lng: "-89.912506"},
            Math.floor(Date.now() / 1000),
            Math.floor(addDays(Date.now(), 10)  / 1000),
            { value: 100 }
        )
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}



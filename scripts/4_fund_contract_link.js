const MarineInsurance = artifacts.require('MarineInsurance')
const LinkTokenInterface = artifacts.require('LinkTokenInterface')
require('dotenv').config();

/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || '1000000000000000000'

module.exports = async callback => {
  try {
    const mc = process.env.CONTRACT_ADDRESS ?
        await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
        await MarineInsurance.deployed()
    const tokenAddress = await mc.getChainlinkToken()
    const token = await LinkTokenInterface.at(tokenAddress)
    console.log(`Token address: ${tokenAddress}`)
    console.log('Funding contract:', mc.address)
    const tx = await token.transfer(mc.address, payment)
    callback(tx.tx)
  } catch (err) {
    callback(err)
  }
}

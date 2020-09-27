const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();

const payment = process.env.TRUFFLE_CL_BOX_ETH_PAYMENT || '2000'

module.exports = async callback => {
    try {
        const mc = process.env.CONTRACT_ADDRESS ?
            await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
            await MarineInsurance.deployed()
        console.log('Funding contract:', mc.address)
        const tx = await mc.sendTransaction({value: payment});
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}

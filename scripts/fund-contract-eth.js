const MarineInsurance = artifacts.require('MarineInsurance')

const payment = process.env.TRUFFLE_CL_BOX_ETH_PAYMENT || '200'

module.exports = async callback => {
    try {
        const mc = await MarineInsurance.deployed()
        console.log('Funding contract:', mc.address)
        const tx = await mc.sendTransaction({value: payment});
        callback(tx.tx)
    } catch (err) {
        callback(err)
    }
}

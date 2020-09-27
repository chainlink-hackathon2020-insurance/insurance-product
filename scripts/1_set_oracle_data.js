const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();
/*
  This script assigns the oracle data to the contract
*/

module.exports = async callback => {
    const mc = process.env.CONTRACT_ADDRESS ?
        await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
        await MarineInsurance.deployed()

    // Kovan (using precoordinator address)
    const tx1 = await mc.setWaterLevelOracleData(
        '0xe41899590E1d8a03EAE91aadaE91C3061329e8EF',
        '0x3bca97023f282087d7e64440d444058ca06445db5aa12d3dd6ada9f101833760',
        web3.utils.toWei('0.2', 'ether')
    );
    const tx2 = await mc.setWaterLevelEvaluationPeriodOracle(
        '0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e',
        web3.utils.toHex("a7ab70d561d34eb49e9b1612fd2e044b"),
        web3.utils.toWei('0.1', 'ether')
    );
    callback([tx1.tx, tx2.tx])
}

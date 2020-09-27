const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();
/*
  This script assigns the oracle data to the contract
*/

module.exports = async callback => {
    const mc = process.env.CONTRACT_ADDRESS ?
        await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
        await MarineInsurance.deployed()

    const tx1 = await mc.setWaterLevelOracleData(
        '0x121927a28b6C5a77064012d8dC0Df3Af81d175de',
        web3.utils.toHex("818de5fad1514b3cb5f356c8200e265d"),
        web3.utils.toWei('0.1', 'ether')
    );
    const tx2 = await mc.setWaterLevelEvaluationPeriodOracle(
        '0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e',
        web3.utils.toHex("a7ab70d561d34eb49e9b1612fd2e044b"),
        web3.utils.toWei('0.1', 'ether')
    );
    callback([tx1.tx, tx2.tx])
}

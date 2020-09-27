const MarineInsurance = artifacts.require('MarineInsurance')
require('dotenv').config();
/*
  This script assigns the oracle data to the contract
*/

module.exports = async callback => {
    const mc = process.env.CONTRACT_ADDRESS ?
        await MarineInsurance.at(process.env.CONTRACT_ADDRESS) :
        await MarineInsurance.deployed()
    
    const newtworkType = await web3.eth.net.getNetworkType();
    let tx1, tx2;

    if(newtworkType === 'kovan'){
        console.log("using kovan")
        //Using precoordinator address
        tx1 = await mc.setWaterLevelOracleData(
            '0xe41899590E1d8a03EAE91aadaE91C3061329e8EF',
            '0x3bca97023f282087d7e64440d444058ca06445db5aa12d3dd6ada9f101833760',
            web3.utils.toWei('0.2', 'ether')
        );
        tx2 = await mc.setWaterLevelEvaluationPeriodOracle(
            '0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e',
            web3.utils.toHex("a7ab70d561d34eb49e9b1612fd2e044b"),
            web3.utils.toWei('0.1', 'ether')
        );
    } else if (newtworkType === 'rinkeby'){
        console.log("using rinkeby")
        tx1 = await mc.setWaterLevelOracleData(
            '0x29CE4C76e6aaA0670751290AC167eeF4B1c6F3E3',
            web3.utils.toHex("c98ab88913aa4690bf72ad52a26c2f27"),
            web3.utils.toWei('1', 'ether')
        );
        tx2 = await mc.setWaterLevelEvaluationPeriodOracle(
            '0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e',
            web3.utils.toHex("4fff47c3982b4babba6a7dd694c9b204"),
            web3.utils.toWei('0.1', 'ether')
        );
    }


    callback([tx1.tx, tx2.tx])
}

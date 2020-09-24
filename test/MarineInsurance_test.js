/* eslint-disable @typescript-eslint/no-var-requires */
const { oracle } = require('@chainlink/test-helpers')
const { expectRevert, time } = require('@openzeppelin/test-helpers')

contract('MarineInsurance', accounts => {
  const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
  const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')
  const MarineInsurance = artifacts.require('MarineInsurance')

  const defaultAccount = accounts[0]
  const oracleNode = accounts[1]
  const stranger = accounts[2]
  const admin = accounts[3]


  // Represents 1 LINK for testnet requests
  const payment = web3.utils.toWei('1')

  let link, oc, insurance

  beforeEach(async () => {
    link = await LinkToken.new({ from: defaultAccount })
    oc = await Oracle.new(link.address, { from: defaultAccount })
    insurance = await MarineInsurance.new(link.address, oc.address, web3.utils.toHex("jobId"), web3.utils.toWei('1', 'ether'),
        { from: admin })
    await oc.setFulfillmentPermission(oracleNode, true, {
      from: defaultAccount,
    })
  })

  describe('calculatePremium', () => {

    it('should calculate premium based on ship data', async () => {
      const premium = await insurance.calculatePremium(
          {shipmentValue: 100}
      );
      assert(premium.toNumber() === 100);
    })
  })

  describe('calculateDailyClaimPayouts', () => {

    it('should calculate daily claim based on ship data', async () => {
      const dailyClaimPayout = await insurance.calculateDailyClaimPayouts(
          {shipmentValue: 100}
      );
      assert(dailyClaimPayout.toNumber() === 100);
    })
  })


  describe('registerInsurancePolicy', () => {

    it('should not create insurance policy if there is no payment', async () => {
      await expectRevert(
          insurance.registerInsurancePolicy(
            {shipmentValue: 100},
            {lat: "35.514706", lng: "-89.912506"},
            Math.floor(Date.now() / 1000),
            Math.floor(addDays(Date.now(), 10)   / 1000),
            stranger
          ), "You need to pay the policy premium"
      )
    })

    it('should not create insurance policy if burn address provided', async () => {
      await expectRevert(
          insurance.registerInsurancePolicy(
              {shipmentValue: 100},
              {lat: "35.514706", lng: "-89.912506"},
              Math.floor(Date.now() / 1000),
              Math.floor(addDays(Date.now(), 10)   / 1000),
              "0x0000000000000000000000000000000000000000",
              {from: stranger, value: 100}
          ), "Beneficiary should not be burning address"
      )
    })

    it('should create insurance policy', async () => {
      await insurance.registerInsurancePolicy(
          {shipmentValue: 100},
          {lat: "35.514706", lng: "-89.912506"},
          Math.floor(Date.now() / 1000),
          Math.floor(addDays(Date.now(), 10)  / 1000),
          stranger,
          {from: stranger, value: 100}
      )

      const insurancePolicies = await insurance.getInsurancePolicies(stranger);
      assert(insurancePolicies.length === 1);
      assert(insurancePolicies[0].coverageData.beneficiary === stranger);
      assert(insurancePolicies[0].coverageData.beneficiary === stranger);
    })

  })

  describe('requestWaterLevels', () => {
    const expected = 300
    const response = web3.utils.padLeft(web3.utils.toHex(expected), 64)
    let request

    beforeEach(async () => {
      await link.transfer(insurance.address, web3.utils.toWei('1', 'ether'), {
        from: defaultAccount,
      })
    })

    it('should request and receive water levels of valid insurances', async () => {
      await insurance.registerInsurancePolicy(
          {shipmentValue: 100},
          {lat: "35.514706", lng: "-89.912506"},
          Math.floor(Date.now() / 1000),
          Math.floor(addDays(Date.now(), 10)  / 1000),
          stranger,
          {from: stranger, value: 100}
      )

      const tx = await insurance.requestWaterLevels(
          { from: admin },
      )
      request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
      await oc.fulfillOracleRequest(
          ...oracle.convertFufillParams(request, response, {
            from: oracleNode,
            gas: 500000,
          }),
      )

      const insurancePolicies = await insurance.getInsurancePolicies(stranger)
      const insurancePolicy = insurancePolicies[0];
      assert(insurancePolicy.trackingData.currentWaterLevel === expected.toString())

    })

  })
})

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

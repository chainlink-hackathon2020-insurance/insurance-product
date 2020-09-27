# Water-level Smart Contract Insurance
[![Build Status](https://travis-ci.org/chainlink-hackathon2020-insurance/insurance-product.svg?branch=master)](https://travis-ci.org/chainlink-hackathon2020-insurance/insurance-product)

## Requirements

- NPM

## Installation


```bash
npm install
cd client
npm install
```

Or

```bash
yarn install
cd client
yarn install
```

## Test smart contract

```bash
npm test
```

## Run frontend

```bash
cd client
npm start
```

## Deploy smart contract

If needed, edit the `truffle-config.js` config file to set the desired network to a different port. It assumes any network is running the RPC port on 8545.

```bash
npm run migrate:dev
```

For deploying to live networks, Truffle will use `truffle-hdwallet-provider` for your mnemonic and an RPC URL. Set your environment variables `$RPC_URL` and `$MNEMONIC` before running:

```bash
npm run migrate:live
```

Note. The project has dotenv as dependency, therefore environment variables can be defined in an .env file at the root of the project.

## Helper Scripts

There are 3 helper scripts provided with this box in the scripts directory:
- `1_set_oracle_data.js`: Sets the Oracle Data to fetch water level. For Kovan a pre-coordinator smart contract is used.
- `2_set_evaluation_period.js`: Sets the frequency of water level evaluation in seconds. By the default it's one day.
- `3_fund_contract_eth.js`: Funds the contract with ETH.
- `4_fund_contract_link.js`: Funds the contract with LINK.
- `5_create_insurance_policy.js`: Creates an insurance policy with pre-defined data.
- `6_start_evaluation_period.js`: Triggers Chainlink Alarm to evaluate water levels depending on the set frequency. 
- `change_water_level_manually.js`: Manually changes the water level of a given policy. This is used for demo purposes.
- `get_insurance_policies.js`: Returns the policies and policy ids of the current user.
- `request_water_level_manually.js`: Performs the request of water levels.

They can be used by calling them from `npx truffle exec`, for example:

```bash
npx truffle exec scripts/4_fund_contract_link.js --network live
```

The CLI will output something similar to the following:

```
Using network 'live'.

Funding contract: 0x972DB80842Fdaf6015d80954949dBE0A1700705E
0xd81fcf7bfaf8660149041c823e843f0b2409137a1809a0319d26db9ceaeef650
Truffle v5.0.25 (core: 5.0.25)
Node v10.16.3
```

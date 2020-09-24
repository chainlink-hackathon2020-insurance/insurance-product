import MarineInsurance from './abi/MarineInsurance.json'
import AssetTracker from './abi/AssetTracker.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    MarineInsurance,
    AssetTracker
  ],
  events: {
  },
  polls: {
    accounts: 1500
  }
};
export default drizzleOptions
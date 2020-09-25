import Dashboard from './dashboard'
import { drizzleConnect } from '@drizzle/react-plugin'

// May still need this even with data function to refresh component on updates for this contract.
function mapStateToProps(state, ownProps) {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
};

const DashboardContainer = drizzleConnect(Dashboard, mapStateToProps);

export default DashboardContainer

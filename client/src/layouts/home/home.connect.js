import Home from './Home'
import { drizzleConnect } from '@drizzle/react-plugin'

// May still need this even with data function to refresh component on updates for this contract.
function mapStateToProps(state, ownProps) {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer

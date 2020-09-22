import SideBar from './sidebar'
import { drizzleConnect } from '@drizzle/react-plugin'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    window: window
  }
};

const SideBarContainer = drizzleConnect(SideBar, mapStateToProps);

export default SideBarContainer

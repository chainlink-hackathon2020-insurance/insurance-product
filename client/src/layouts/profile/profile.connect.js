import Profile from './profile'
import { drizzleConnect } from '@drizzle/react-plugin'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    MarineInsurance: state.contracts.MarineInsurance,
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
  }
};

const ProfileContainer = drizzleConnect(Profile, mapStateToProps);

export default ProfileContainer

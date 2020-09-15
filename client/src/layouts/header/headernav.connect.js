import HeaderNav from './headernav'
import { drizzleConnect } from '@drizzle/react-plugin'

const mapStateToProps = state => {
    return {
      drizzleStatus: state.drizzleStatus,
      address: state.accounts[0],
      accountBalances: state.accountBalances
    };
  };

const HeaderNavCointainer = drizzleConnect(HeaderNav, mapStateToProps);


export default HeaderNavCointainer

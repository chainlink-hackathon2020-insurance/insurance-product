import React, { useState, useEffect } from "react";
import { Text, Box, Button, Flex, Image } from "rimble-ui";
import styled from "styled-components";
import { drizzleConnect } from "@drizzle/react-plugin";
import logo from "./../../images/logo.svg";
import walletIcon from "./../../images/icon-wallet.svg";
import balanceIcon from "./../../images/icon-balance.svg";
import { ethers } from 'ethers';

const StyledHeader = styled(Flex)`
  border-bottom: 1px solid #d6d6d6;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.01);
`;

const connectWallet = () => {
  // initiate wallet connection
  return;
};

function HeaderNav({ drizzle, preflightCheck, address, accountBalances }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const ethersProvider = new ethers.providers.Web3Provider(drizzle.web3.currentProvider);
  
  async function fetchEns() {
    try {
      const name = await ethersProvider.lookupAddress(address);
      setAccount(name)
    } catch(e) {
      setAccount(address)
    }
  }

  useEffect(() => {
    if (address) {
      fetchEns();
    }
  }, [address]);

  useEffect(() => {
    if (Object.keys(accountBalances).length > 0 && address !== null) {
      setBalance(accountBalances[address].toString());
    }
  }, [accountBalances, address]);

  return (
    <StyledHeader justifyContent={"space-between"} p={3} bg={"white"}>
      <Image src={logo} />
      {account && balance ? (
        <Flex>
          <Flex alignItems={"center"} mr={4}>
            <Image src={walletIcon} mr={2} />
            <Box>
              <Text
                fontWeight={600}
                fontSize={"12px"}
                color={"#2B2C36"}
                lineHeight={1}
              >
                Connected as
              </Text>
              <Text fontSize={1} color={"primary"}>
                {account}
              </Text>
            </Box>
          </Flex>

          <Flex alignItems={"center"}>
            <Image src={balanceIcon} mr={2} />
            <Box>
              <Text
                fontWeight={600}
                fontSize={"12px"}
                color={"#2B2C36"}
                lineHeight={1}
              >
                Balance
              </Text>
              <Text fontSize={1} color={"primary"}>
                {drizzle.web3.utils.fromWei(balance, "ether")} ETH
              </Text>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Button
          size={"small"}
          onClick={() => {
            preflightCheck(() => {
              connectWallet();
            });
          }}
        >
          Connect
        </Button>
      )}
    </StyledHeader>
  );
}

/*
 * Export connected component.
 */
export default  HeaderNav
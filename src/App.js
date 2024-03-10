import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  Textarea,
  Button,
  VStack,
  Link,
  List,
  ListItem,
  theme,
} from '@chakra-ui/react';

function App() {
  const [walletAddresses, setWalletAddresses] = useState('');
  const [balances, setBalances] = useState([]);

  const getBalances = useCallback(async () => {
    const addresses = walletAddresses.split('\n').filter(address => address.trim() !== '');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getBalances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({walletAddresses: addresses}),
      });

      if (response.ok) {
        let data = await response.json();
        // Sort the wallets based on balance in descending order
        data = data.sort((a, b) => b.balance - a.balance);
        setBalances(data);
      } else {
        console.error('Failed to fetch balances');
        // Optionally, handle error - for example, you could set an error state and display it
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      // Optionally, handle error - for example, you could set an error state and display it
    }
  }, [walletAddresses]); // Dependencies array

  useEffect(() => {
    // Set the interval to refresh every 30 seconds (30000 milliseconds)
    const interval = setInterval(getBalances, 30000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [getBalances]); // Now you can safely add `getBalances` here

  return (
    <ChakraProvider theme={theme}>
      <Box p={5}>
        <VStack spacing={4}>
          <Textarea
            placeholder="Enter Solana Wallet Addresses (one per line)"
            value={walletAddresses}
            onChange={(e) => setWalletAddresses(e.target.value)}
          />
          <Button colorScheme="green" onClick={getBalances}>Get Balances</Button>
          <List spacing={3} width="full">
            {balances.map((wallet, index) => (
              <ListItem key={index}>
                <Box p={2} shadow="md" borderWidth="1px" borderRadius="md" width="full">
                  {`${index + 1}. ${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`} :  
                  {` ${wallet.balance.toFixed(9)} SOL - `}
                  <Link href={`https://solscan.io/account/${wallet.address}`} isExternal color="blue.500">
                    View on Solscan
                  </Link>
                </Box>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;

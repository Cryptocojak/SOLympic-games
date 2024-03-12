import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Link,
  List,
  ListItem,
  Heading,
  Image,
  HStack,
  Text,
  theme,
} from '@chakra-ui/react';
import hardcodedAddresses from './walletAddresses.json'; // Assuming this file is correctly placed and imported

// Example sponsor to image mapping
const sponsorImages = {
  milady: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/9d58a0b0-b4ab-4c42-3881-68bba3996900/public',
  goblins: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/4b0c2d77-33cb-450c-d087-dab3cfd22800/public',
  surfers: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/cceda807-5155-4afe-337d-992ac314c200/public',
  cigs: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/2d1fe668-445d-43fa-17fe-37e57c9c2800/public'
  // Add more mappings as necessary
};

function App() {
  const [balances, setBalances] = useState([]);

  const getBalances = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getBalances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddresses: hardcodedAddresses.map(ha => ha.address) }),
      });

      if (response.ok) {
        let data = await response.json();
        // Sort the wallets based on balance in descending order
        data = data.sort((a, b) => b.balance - a.balance);
        setBalances(data.map(d => ({
          ...d,
          sponsor: hardcodedAddresses.find(ha => ha.address === d.address)?.sponsor
        })));
      } else {
        console.error('Failed to fetch balances');
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  }, []); 

  useEffect(() => {
    getBalances(); // Call getBalances on component mount
    const interval = setInterval(getBalances, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [getBalances]);

  return (
    <ChakraProvider theme={theme}>
      <Box p={5}>
        <VStack spacing={4}>
          <Heading as="h1" size="lg" textAlign="center">SOLympic Games LEADERBOARD</Heading>
          <List spacing={3} width="full">
            {balances.map((wallet, index) => (
              <ListItem key={index}>
                <HStack spacing={4}>
                  <Image src={sponsorImages[wallet.sponsor]} alt={wallet.sponsor} boxSize="50px" objectFit="cover" />
                  <Box p={2} shadow="md" borderWidth="1px" borderRadius="md" width="full">
                    <Text>
                      {`${index + 1}. ${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`} :  
                      {` ${wallet.balance.toFixed(9)} SOL - `}
                      <Link href={`https://solscan.io/account/${wallet.address}`} isExternal color="blue.500">
                        View on Solscan
                      </Link>
                    </Text>
                  </Box>
                </HStack>
              </ListItem>
            ))}
          </List>
          <Image 
            src="https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f8841de3-7193-4b26-f072-f0e327e97100/public" 
            alt="Milady" 
            width="350px" 
            objectFit="cover" 
            m="auto" />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;

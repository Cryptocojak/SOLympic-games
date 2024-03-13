import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Link,
  List,
  ListItem,
  Image,
  HStack,
  Text,
  theme,
} from '@chakra-ui/react';
import hardcodedAddresses from './walletAddresses.json'; 

const sponsorImages = {
  milady: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/78267ee6-fa89-4e43-6b7a-4891ce84a500/public',
  goblins: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/4b0c2d77-33cb-450c-d087-dab3cfd22800/public',
  cryptogame: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a2d68b73-2a9a-4187-51cb-e36c94867f00/public',
  cigs: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/2d1fe668-445d-43fa-17fe-37e57c9c2800/public',
  unsponsored: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a03abb01-1256-433c-3617-89f4ae02e000/public'
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
          sponsor: hardcodedAddresses.find(ha => ha.address === d.address)?.sponsor,
          // Include the twitter handle in the mapping
          twitter: hardcodedAddresses.find(ha => ha.address === d.address)?.twitter
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
      <Box p={5} bgColor="#BDE0FE" minHeight="100vh">
        <VStack spacing={4}>
        <Image 
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/5f475fe4-b697-402b-a5e8-34ed579bae00/public' 
            alt="SOLympic Games" 
            width="75%"
            height="auto" 
            m="auto"
          />
          <Image 
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a4c57b09-d60a-4c40-838a-a208ba340f00/public' 
            alt="Leaderboard" 
            width="50%"
            height="auto"
            m="auto"
          />
          <List spacing={3} width="full">
            {balances.map((wallet, index) => (
              <ListItem key={index}>
                <HStack spacing={4} justify="center" width="full">
                  <Image src={sponsorImages[wallet.sponsor]} alt={wallet.sponsor} boxSize="50px" objectFit="cover" />
                  <Box p={2} shadow="md" borderWidth="1px" borderRadius="md" width="full" bg="gray.300" margin="auto">
                  <Text as="span" fontWeight="bold">{`${index + 1}. `}</Text>
                  <Text as="span">
                    {`${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`} :  
                    {` ${wallet.balance.toFixed(3)} SOL`}
                      <br />
                      <Link href={`https://twitter.com/${wallet.twitter}`} isExternal color="blue.500">
                        @{wallet.twitter}
                      </Link>
                      <br />
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
          <Box as="footer" width="full" py={5} textAlign="center">
          <Text>
            Created by 
            <Link href="https://twitter.com/cryptocojak" isExternal color="blue.500" ml={1}>
              @cryptocojak
            </Link>
          </Text>
        </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;

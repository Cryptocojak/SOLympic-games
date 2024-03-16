import React, { useState, useEffect, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Link,
  List,
  ListItem,
  Image,
  Flex,
  Text,
  theme,
  Button
} from '@chakra-ui/react';
import hardcodedAddresses from './walletAddresses.json'; 

const sponsorImages = {
  milady: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ae819d8a-e371-4a41-4367-0ee66d50a700/public',
  goblintown: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/bce89079-34c2-4652-3798-8ea5f929e800/public',
  cryptogame: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/cdecae2a-52e7-413d-1928-37f138431c00/public',
  cigs: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/542788f0-ee85-4d66-6a6c-9acc7df2c000/public',
  unsponsored: 'https://pbs.twimg.com/profile_images/1768701961409286144/JRAclGwb_400x400.jpg',
  lmeow: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ca8c7918-1f0e-4adb-a59c-389665072c00/public',
  lawbs: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a1275f94-0cd1-463a-b0b2-c5d256d4d100/public',
  unicorn: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ccc99ff2-ef71-4d49-9ae9-5be2190c1d00/public',
  onlybots: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/acfc39a3-a769-42bb-db92-5aaca4782500/public'
};

function App() {
  const [balances, setBalances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(balances.length / itemsPerPage);

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
    getBalances(); 
    const interval = setInterval(getBalances, 45000); // Refresh every 45 seconds
    return () => clearInterval(interval);
  }, [getBalances]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = balances.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ChakraProvider theme={theme}>
      <Box  bgColor="#BDE0FE" minHeight="100vh">
        <VStack spacing={4}>
          <Image p={5}
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/b977fcaf-28e0-444a-ca3b-5058e42ed200/public' 
            alt="SOLympic Games" 
            width="75%"
            height="auto" 
            m="auto"
          />
          {/* <Image 
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/a4c57b09-d60a-4c40-838a-a208ba340f00/public' 
            alt="Leaderboard" 
            width="50%"
            height="auto"
            m="auto"
          /> */}
         
          <Text fontSize={["2xl", "80"]} // Adjust font size based on the viewport width
                fontStyle="italic"
                fontWeight="bold"
                textAlign="center"
                whiteSpace="nowrap"
                width={["100%", "75%", "50%"]}>LEADERBOARD</Text>
          
            <Flex align='baseline' justify='space-evenly' wrap="wrap" width="full" fontFamily='monospace' height='-webkit-fit-content' justifyContent='space-evenly'>
                    
                    <Link href="https://twitter.com/SOLympicgames" isExternal color="blue.500" fontSize='small'><Flex >(SOLympic Games)<Image
                      src={sponsorImages.unsponsored}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                    <Link href="https://twitter.com/goblintown" isExternal color="blue.500" fontSize='small'><Flex>(Goblintown)<Image
                      src={sponsorImages.goblintown}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                   <Link href="https://twitter.com/cryptothegame_" isExternal color="blue.500" fontSize='small'><Flex >(CryptoTheGame)<Image
                      src={sponsorImages.cryptogame}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                   <Link href="https://twitter.com/MiladyMaker333" isExternal color="blue.500" fontSize='small'><Flex>(anon)<Image
                      src={sponsorImages.milady}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                    <Link href="https://twitter.com/LawbStation" isExternal color="blue.500" fontSize='small'><Flex>(LawbStation)<Image
                      src={sponsorImages.lawbs}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                   <Link href="https://twitter.com/LMEOWSolToken" isExternal color="blue.500" fontSize='small'><Flex>(LMEOW)<Image
                      src={sponsorImages.lmeow}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                    <Link href="https://twitter.com/unicornandmemes" isExternal color="blue.500" fontSize='small'><Flex>(unicornandmemes)<Image
                      src={sponsorImages.unicorn}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
                    <Link href="https://twitter.com/onlydotbot" isExternal color="blue.500" fontSize='small'><Flex>(onlybots)<Image
                      src={sponsorImages.onlybots}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}/></Flex></Link>
              </Flex>


          {/* Column Headers */}
          <Flex justify="center" width="98%" p={1} borderWidth="5px" borderRadius="none" bg="gray.200">
            <Text fontWeight="black" flex="1" textAlign="left">~ Rank, Twitter   &   Sponsor ~</Text>
            <Text fontWeight="black" flex="1" textAlign="center">~ SOL ~</Text>
            <Text fontWeight="black" flex="1" textAlign="center">~ Solscan ~</Text>
          </Flex>

          <List spacing={0} width="98%">
            {currentItems.map((wallet, index) => (
              <ListItem key={index}>
                <Flex direction="row" alignItems="center" justifyContent="center" width="full" p={2} bg="white">
                  {/* Rank, Twitter, and Icon Container */}
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems={{ base: "flex-start", md: "center" }}
                    justifyContent="start"
                    textAlign={{ base: "left", md: "center" }}
                    flex="1"
                    minW="0"
                  >
                    {/* Rank */}
                    <Text
                      fontWeight="bold"
                      fontSize="xxl"
                      mr={{ base: "0", md: "4" }}
                      mb={{ base: "1", md: "0" }}
                      width="45px"
                    >
                      {`#${index + 1 + (currentPage - 1) * itemsPerPage}.`}
                    </Text>
                    
                    {/* Twitter Handle - Use Flex to prevent wrapping */}
                    <Flex
                      direction="row"
                      alignItems="center"
                      wrap="nowrap"
                      maxW="full"
                      my={{ base: "1", md: "0" }}
                      width="145px"
                    >
                      <Link
                        href={`https://twitter.com/${wallet.twitter}`}
                        isExternal
                        color="blue.500"
                        whiteSpace="nowrap"
                        fontSize='small'
                      >
                        @{wallet.twitter}
                      </Link>
                      {/* Sponsor Image */}
                    
                    </Flex>
                    <Image
                      src={sponsorImages[wallet.sponsor] || sponsorImages.unsponsored}
                      alt={wallet.sponsor}
                      boxSize="25px"
                      objectFit="cover"
                      ml={{ base: "0", md: "2" }}
                      mt={{ base: "1", md: "0" }}
                    />
                    
                  </Flex>
  
                  {/* Balance */}
                  <Text flex="1" textAlign="center">{`${wallet.balance.toFixed(3)}`}</Text>
  
                  {/* Solscan Link */}
                  <Flex flex="1" justify={["flex-start", "flex-start", "center"]} align="center">
                    <Link href={`https://solscan.io/account/${wallet.address}`} isExternal color="blue.500">
                      View on Solscan
                    </Link>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </List>
  
          {/* Pagination Controls */}
          <Flex mt="0" >
            <Button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage <= 1} // Prevent going to previous page if on the first page
              mr="1"
              borderRadius='none' >
              ↩️ Prev Page
            </Button>

            <Button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage >= totalPages} // Disable if on the last page or no more items to show
              mr="1"
              borderRadius='none'>
              Next Page ↪️
            </Button>
          </Flex>

            {/* Displaying the current page and total pages */}
            <Text fontWeight='bold' fontStyle='italic' >{`${currentPage} / ${totalPages}`}</Text>


          <Box
          width="100%" // Ensures the Box takes the full width of its container
          height="240px" // Adjust this value based on your needs, ensuring enough space for the tiling effect
          bgImage="url('https://pbs.twimg.com/profile_banners/1768023768574656513/1710526506/1500x500')"
          bgRepeat="repeat-x" // This will repeat the image horizontally
          bgSize="contain" // Adjust this as needed to fit the image nicely
          m="auto"
          borderRadius="none"
        />
  
          <Image 
            src="https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/f8841de3-7193-4b26-f072-f0e327e97100/public" 
            alt="Milady" 
            width="175px" 
            objectFit="cover" 
            m="auto"
            borderRadius="lg"
          />
          <Box as="footer" width="full" py={5} textAlign="center">
            <Text>
              Created by 
              <Link href="https://twitter.com/wirelyss" isExternal color="blue.500" ml={1}>
                @wirelyss
              </Link>
            </Text>
            <Text>
              Site by
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
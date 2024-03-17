import React, { useState, useEffect, useCallback } from 'react';
import { ChakraProvider, Box, VStack, Link, List, ListItem, Image, Flex, Text, theme, Button} from '@chakra-ui/react';

import hardcodedAddresses from './walletAddresses.json'; 

const sponsorImages = {
  milady: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ae819d8a-e371-4a41-4367-0ee66d50a700/public',
  goblintown: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/bce89079-34c2-4652-3798-8ea5f929e800/public',
  cryptogame: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/cdecae2a-52e7-413d-1928-37f138431c00/public',
  unsponsored: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ffff0a9a-2a66-4dde-ec80-89892b603b00/public',
  lmeow: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/ca8c7918-1f0e-4adb-a59c-389665072c00/public',
  lawbs: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/5f14d527-4e76-4470-f43d-af1237dda100/public',
  unicorn: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/b2ff3798-162a-4c3d-6291-a68a5c80ee00/public',
  onlybots: 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/acfc39a3-a769-42bb-db92-5aaca4782500/public'
};

const sponsors = [
  { sponsorName: "SOLympic Games", sponsorImage: sponsorImages.unsponsored, href: "https://twitter.com/SOLympicgames" },
  { sponsorName: "Goblintown", sponsorImage: sponsorImages.goblintown, href: "https://twitter.com/goblintown" },
  { sponsorName: "CryptoTheGame", sponsorImage: sponsorImages.cryptogame, href: "https://twitter.com/cryptothegame_" },
  { sponsorName: "Milady", sponsorImage: sponsorImages.milady, href: "https://twitter.com/MiladyMaker333" },
  { sponsorName: "LawbStation", sponsorImage: sponsorImages.lawbs, href: "https://twitter.com/LawbStation" },
  { sponsorName: "LMEOW", sponsorImage: sponsorImages.lmeow, href: "https://twitter.com/LMEOWSolToken" },
  { sponsorName: "unicornandmemes", sponsorImage: sponsorImages.unicorn, href: "https://twitter.com/unicornandmemes" },
  { sponsorName: "onlybots", sponsorImage: sponsorImages.onlybots, href: "https://twitter.com/onlydotbot" }
];

const DynamicTickerContent = ({ sponsors }) => {
  const [duplicatedContent, setDuplicatedContent] = useState([]);

  useEffect(() => {
    const duplicateContent = () => {
      const timesToDuplicate = 40; // Increase duplication for a smoother loop
      setDuplicatedContent(new Array(timesToDuplicate).fill(sponsors.flat()));
    };
  
    duplicateContent();
  }, [sponsors]);

  return (
    <>
      {duplicatedContent.map((group, index) =>
        group.map((sponsor, sponsorIndex) => (
          <TickerItem key={`sponsor-${index}-${sponsorIndex}`} {...sponsor} />
        ))
      )}
    </>
  );
};


const TickerItem = ({ sponsorName, sponsorImage, href }) => (
  <Link href={href} isExternal color="blue.500" fontSize='small'>
    <Flex align='stretch' mx={10}> {/* mx here ensures spacing between items */}
      <Text as='span'>{sponsorName}</Text>
      <Image
        src={sponsorImage}
        boxSize="25px"
        objectFit="cover"
        ml={2}
        mt={{ base: "1", md: "0" }}
        display="inline-flex"
      />
    </Flex>
  </Link>
);

function App() {
  const [balances, setBalances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 5 : 10);

 useEffect(() => {
   const handleResize = () => {
     setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
   };

   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);
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
    const interval = setInterval(getBalances, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [getBalances]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = balances.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ChakraProvider theme={theme}>
      <Box  bgColor="#BDE0FE" minHeight="100vh" overflowX="hidden">
        <VStack spacing={2}>
          <Image p={5}
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/3f3b5f23-3326-4f9f-c0ca-591a08a6f800/public' 
            alt="SOLympic Games" 
            width="75%"
            height="auto" 
            m="auto"
          />
          <Image 
            src='https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/0ab6d121-8696-422a-6c22-8bfafd767100/public' 
            alt="Leaderboard" 
            width="40%"
            height="auto"
            m="auto"
          /><br></br>
        
          
          <style>
            {`
              @keyframes scrollAnimation {
                from { transform: translateX(0%); }
                to { transform: translateX(-50%); } // Ensure this matches the duplication
              }
              .scrollContainer {
                animation: scrollAnimation 300s linear infinite; // Adjust time as needed
              }
              .scrollContainer:hover {
                animation-play-state: paused;
              }
            `}
          </style>
                <Flex
            className="scrollContainer"
            sx={{
              width: 'auto',
              height: 'auto', 
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            <DynamicTickerContent sponsors={sponsors} />
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
                    
                    {/* Twitter Handle */}
                    <Flex
                      direction="row"
                      alignItems="center"
                      wrap="nowrap"
                      maxW="full"
                      my={{ base: "1", md: "0" }}
                      width="135px"
                    >
                      <Link
                        href={`https://twitter.com/${wallet.twitter}`}
                        isExternal
                        color="blue.500"
                        fontSize='small'
                      >
                        @{wallet.twitter}
                      </Link>

                      {/* Sponsor Image */}
                    </Flex >
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
              ⬅️ Prev Page
            </Button>

            <Button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage >= totalPages} // Disable if on the last page or no more items to show
              mr="1"
              borderRadius='none'>
              Next Page ➡️
            </Button>
          </Flex>

            {/* Displaying the current page and total pages */}
            <Text fontWeight='bold' fontStyle='italic' >{`${currentPage} / ${totalPages}`}</Text>

          <Box
          width="100%" // Ensures the Box takes the full width of its container
          height="240px" // Adjust this value based on your needs, ensuring enough space for the tiling effect
          bgImage="url('https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/e6998dbd-c7d8-4772-465c-d3443bdcd800/public')"
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
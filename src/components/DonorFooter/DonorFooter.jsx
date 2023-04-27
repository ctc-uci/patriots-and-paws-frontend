import React from 'react';
import { Flex, Link, Text, LinkBox, LinkOverlay, Image, Box } from '@chakra-ui/react';
import pnpLogo from './PNPlogo.png';

const DonorFooter = () => {
  return (
    <Flex
      p="20px 40px 20px 40px"
      fontSize="15px"
      fontWeight="500"
      textAlign="center"
      bg="white"
      borderTop="4px"
      borderColor="#3182CE #fff #fff #fff"
      position="sticky"
      top="100vh"
      justifyContent="space-between"
      direction={{ md: 'row', base: 'column' }}
    >
      <Flex direction={{ md: 'row', base: 'column' }} align="center">
        <LinkBox mr={{ md: 10 }}>
          <LinkOverlay href="https://www.patriotsandpaws.org/" isExternal>
            <Image
              boxSize="3rem"
              src={pnpLogo}
              alt="Patriots and Paws logo, redirects to main page"
            />
          </LinkOverlay>
        </LinkBox>
        <Link
          href="https://www.patriotsandpaws.org/"
          fontSize="18px"
          visibility={{ md: 'visible', base: 'hidden' }}
        >
          Patriots & Paws
        </Link>
      </Flex>
      {/* <Flex justifyContent="space-between" gap="10px"> */}
      <Box display={{ md: 'flex' }} gap={{ md: '10px' }} mt={{ md: '10px' }}>
        <Box>
          <Link href="https://www.patriotsandpaws.org/our-story/" isExternal>
            <Text as="u">About Us</Text>
          </Link>
        </Box>
        <Box mt={{ md: 0, base: 3 }}>
          <Link href="https://www.patriotsandpaws.org/wanted/" isExternal>
            <Text as="u">Volunteer</Text>
          </Link>
        </Box>
        <Box mt={{ md: 0, base: 3 }}>
          <Link href="https://www.patriotsandpaws.org/donors" isExternal>
            <Text as="u">Donors & Supporters</Text>
          </Link>
        </Box>
        <Box mt={{ md: 0, base: 3 }}>
          <Link href="https://www.patriotsandpaws.org/asked-questions/" isExternal>
            <Text as="u">FAQ</Text>
          </Link>
        </Box>
      </Box>
      {/* </Flex> */}
    </Flex>
  );
};

export default DonorFooter;

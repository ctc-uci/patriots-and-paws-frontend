import React from 'react';
import { Flex, Link, Text, Image, HStack } from '@chakra-ui/react';
import PNPlogo from '../Navbar/PNPlogo.png';

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
      justifyContent={{ base: 'center', md: 'space-between' }}
      alignItems="center"
    >
      <HStack columnGap={2}>
        <Image boxSize={55} src={PNPlogo} display={{ base: 'none', md: 'block' }} />
        <Link
          href="https://www.patriotsandpaws.org/"
          fontSize="20px"
          display={{ base: 'none', md: 'block' }}
        >
          Patriots & Paws
        </Link>
      </HStack>
      <Flex
        justifyContent={{ base: 'center', md: 'space-between' }}
        alignItems={{ base: 'center', md: 'flex-start' }}
        gap="10px"
        direction={{ base: 'column', md: 'row' }}
      >
        <Image boxSize={55} src={PNPlogo} display={{ base: 'block', md: 'none' }} />
        <Link href="https://www.patriotsandpaws.org/our-story/" isExternal>
          <Text as="u" textDecor="none" fontSize={{ base: '14px', md: '18px' }}>
            About Us
          </Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/wanted/" isExternal>
          <Text as="u" textDecor="none" fontSize={{ base: '14px', md: '18px' }}>
            Volunteer
          </Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/donors" isExternal>
          <Text as="u" textDecor="none" fontSize={{ base: '14px', md: '18px' }}>
            Donors & Supporters
          </Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/asked-questions/" isExternal>
          <Text as="u" textDecor="none" fontSize={{ base: '14px', md: '18px' }}>
            FAQ
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
};

export default DonorFooter;

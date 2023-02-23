import React from 'react';
import { Flex, Link, Text } from '@chakra-ui/react';

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
    >
      <Flex justifyContent="space-between" gap="10px">
        <Link href="https://www.patriotsandpaws.org/our-story/" isExternal>
          <Text as="u">About Us</Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/wanted/" isExternal>
          <Text as="u">Volunteer</Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/asked-questions/" isExternal>
          <Text as="u">FAQ</Text>
        </Link>
        <Link href="https://www.patriotsandpaws.org/donors" isExternal>
          <Text as="u">Donors & Supporters</Text>
        </Link>
      </Flex>
      <Link href="https://www.patriotsandpaws.org/" color="red.500" fontSize="20px">
        Patriots & Paws
      </Link>
    </Flex>
  );
};

export default DonorFooter;

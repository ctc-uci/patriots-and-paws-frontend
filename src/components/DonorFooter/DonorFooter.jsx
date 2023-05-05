import React from 'react';
import { Flex, Link, Text, Image, HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PNPlogo from '../Navbar/PNPlogo.png';

const DonorFooter = () => {
  const navigate = useNavigate();

  return (
    <Flex
      p="20px 40px 20px 40px"
      fontSize="15px"
      fontWeight="500"
      textAlign="center"
      bg="white"
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
        gap={8}
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
        <Button
          variant="unstyled"
          onClick={() => {
            navigate('/donate', {
              state: {},
            });
            navigate(0);
          }}
          size="1rem"
        >
          <Text color="#3182CE" fontSize={{ base: '14px', md: '18px' }}>
            Logout
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default DonorFooter;

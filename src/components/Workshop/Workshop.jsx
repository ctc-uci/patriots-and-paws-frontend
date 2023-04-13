import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Grid,
  GridItem,
  Button,
  extendTheme,
  ChakraProvider,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { PNPBackend } from '../../utils/utils';

const Workshop = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await PNPBackend.get('/donations');
      setData(res.data.donations ?? []);
    })();
  }, []);

  const layoutTutorial = () => {
    return (
      <Box>
        {/* <Flex flexDirection="column">
          {data.map(({ id }) => (
            <>
              <Heading key={id}>{id}</Heading>
              <br />
            </>
          ))}
        </Flex> */}
        {/*
          templateColumns="repeat(5, 1fr)"
        */}
        <Grid templateColumns="repeat(2, 1fr)">
          {data.map(({ id }) => (
            <GridItem key={id}>
              <Heading key={id}>{id}</Heading>
              <br />
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  };
  const boxmodelTutorial = () => {
    return <Text>Box Model</Text>;
  };
  const sizingTutorial = () => {
    return <Text>Sizing</Text>;
  };
  const alignmentTutorial = () => {
    return <Text>Alignment</Text>;
  };
  const borderTutorial = () => {
    return <Text>Border</Text>;
  };
  const chakraTokensTutorial = () => {
    const theme = extendTheme({});
    // const theme = extendTheme({
    //   semanticTokens: {
    //     colors: {
    //       red: {
    //         50: '#000000',
    //       },
    //     },
    //   },
    // });
    return (
      <>
        <Text>Semantic Tokens</Text>
        <Flex direction="column" gap={5} p="auto">
          {/* pre-styled: changing variant also changes the styling; can easily change styling */}
          <Button colorScheme="red">Using Semantic Tokens</Button>
          {/* passed in using bg and color */}
          <ChakraProvider theme={theme}>
            <Button bg="red.500" color="white">
              Using Color Tokens
            </Button>
          </ChakraProvider>

          {/* hard coded hex is hard to restyle if the entire project has a theme */}
          <Button bg="#E53E" color="#FFFFFF">
            Using Hex
          </Button>
        </Flex>
      </>
    );
  };
  const responsiveTutorial = () => {
    return <Text>Responsive</Text>;
  };
  const tabs = [
    { name: 'layout', element: layoutTutorial },
    { name: 'box model', element: boxmodelTutorial },
    { name: 'sizing', element: sizingTutorial },
    { name: 'alignment', element: alignmentTutorial },
    { name: 'border', element: borderTutorial },
    { name: 'chakra styling', element: chakraTokensTutorial },
    { name: 'responsive', element: responsiveTutorial },
  ];
  return (
    <Tabs>
      <TabList>
        {tabs.map(({ name }) => (
          <Tab key={name}>{name}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map(({ element }) => (
          <TabPanel key={element}>{element()}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Workshop;

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
        <Flex flexDirection="column">
          {data.map(({ id }) => (
            <>
              <Heading key={id}>{id}</Heading>
              <br />
            </>
          ))}
        </Flex>
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
  const responsiveTutorial = () => {
    return <Text>Responsive</Text>;
  };
  const tabs = [
    { name: 'layout', element: layoutTutorial },
    { name: 'box model', element: boxmodelTutorial },
    { name: 'sizing', element: sizingTutorial },
    { name: 'alignment', element: alignmentTutorial },
    { name: 'border', element: borderTutorial },
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

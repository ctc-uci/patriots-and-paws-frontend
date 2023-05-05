import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Button,
  Box,
  Center,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Heading,
} from '@chakra-ui/react';
import { PDFViewer } from '@react-pdf/renderer';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { routeFormatDate, isSameDay } from '../../utils/InventoryUtils';
import { routePDFStyles } from '../../utils/RouteUtils';
import { getCurrentUserId } from '../../utils/AuthUtils';
import DonationModal from '../InventoryPage/DonationModal';
import DonationCard from './DonationCard';
import RoutePDF from '../RoutePDF/RoutePDF';

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [route, setRoute] = useState();
  const [driverInfo, setDriverInfo] = useState();
  const { isOpen: exportIsOpen, onOpen: exportOnOpen, onClose: exportOnClose } = useDisclosure();
  const userId = getCurrentUserId();

  const handleRowClick = data => {
    setDonationData(data);
    onOpen();
  };

  const getFurnitureCount = furniture => {
    return furniture.reduce((acc, { count }) => {
      return acc + count;
    }, 0);
  };

  const getDonationsForToday = async () => {
    const { data: driverRoutes } = await PNPBackend.get(`/routes/driver/${userId}`);

    const today = new Date().toISOString();
    const todayRoute = driverRoutes.find(currRoute => isSameDay(currRoute.date, today));
    if (todayRoute) {
      const { data } = await PNPBackend.get(`/routes/${todayRoute.id}`);
      const donationInfo = data.donations;
      setDonations(donationInfo);
      setRoute({ date: today, name: todayRoute.name, isRoute: true });
    }
  };

  const getDriveInfo = async () => {
    const { data } = await PNPBackend.get(`/users/${userId}`);
    setDriverInfo(data[0]);
  };

  useEffect(() => {
    getDriveInfo();
    getDonationsForToday();
  }, []);

  const breakpointsH = {
    base: '100%', // 0-48em
    md: '100%', // 48em-80em,
    lg: 'calc(100vh)',
    xl: 'calc(100vh)', // 80em+
  };
  const breakpointsW = {
    base: '100%', // 0-48em
    md: '100%', // 48em-80em,
    lg: '30%',
    xl: '40%', // 80em+
  };

  return (
    <Box
      bg="#EDF1F8"
      h={breakpointsH}
      w={breakpointsW}
      borderRadius={{ base: 5, md: 0 }}
      m={{
        base: 5.5,
        md: 0,
      }}
    >
      {route ? (
        <>
          <Flex direction="column" gap={5} padding="25px" w="100%" h="100%">
            <Flex flexDirection="column">
              <Text fontSize="3xl" as="b">
                {route.name}
              </Text>
              <Text>{routeFormatDate(route.date)}</Text>
            </Flex>
            <Flex direction={{ base: 'column-reverse', md: 'column' }} gap={5} h="100%">
              <Flex flexDirection="column" gap={5} w="100%" overflowY="scroll" h="50%">
                {donations &&
                  donations.map(d => {
                    return (
                      <DonationCard
                        key={d.id}
                        itemsCount={getFurnitureCount(d.furniture)}
                        data={d}
                        handleRowClick={handleRowClick}
                        setDonations={setDonations}
                      />
                    );
                  })}
              </Flex>
              <Flex justify="flex-end" gap={3}>
                <Button size="sm" colorScheme="blackAlpha" onClick={exportOnOpen}>
                  Export PDF
                </Button>
                <Button
                  size="sm"
                  colorScheme="teal"
                  mr="2%"
                  onClick={() => handleNavigateToAddress(donations)}
                >
                  Navigate to Route
                </Button>
                <Modal isOpen={exportIsOpen} onClose={exportOnClose} size="full">
                  <ModalContent>
                    <ModalCloseButton />
                    <ModalBody p="5em 5em 0 5em">
                      <PDFViewer style={routePDFStyles.viewer}>
                        <RoutePDF
                          driverData={driverInfo}
                          donationData={donations}
                          date={new Date()}
                        />
                      </PDFViewer>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Flex>
            </Flex>
            <DonationModal
              data={donationData}
              onClose={onClose}
              onOpen={onOpen}
              isOpen={isOpen}
              isReadOnly
            />
          </Flex>
        </>
      ) : (
        <Center w="100%" h={breakpointsH} py={{ base: '3em', md: '0' }}>
          <Flex direction="column" alignItems="center">
            <Heading>
              <Text color="grey">No Route Today</Text>
            </Heading>
            <Text color="grey">{routeFormatDate(new Date().toISOString())}</Text>
          </Flex>
        </Center>
      )}
    </Box>
  );
};

export default TodayRoute;

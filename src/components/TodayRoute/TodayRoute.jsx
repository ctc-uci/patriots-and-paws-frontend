import React, { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Button,
  Box,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { PDFViewer } from '@react-pdf/renderer';
import { PNPBackend, handleNavigateToAddress } from '../../utils/utils';
import { makeDate } from '../../utils/InventoryUtils';
import { routePDFStyles } from '../../utils/RouteUtils';
import { getCurrentUserId } from '../../utils/AuthUtils';
import DonationModal from '../InventoryPage/DonationModal';
import DonationCard from './DonationCard';
import RoutePDF from '../RoutePDF/RoutePDF';

const TodayRoute = () => {
  const [donations, setDonations] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donationData, setDonationData] = useState({});
  const [route, setRoute] = useState({});
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

    const today = new Date('04/19/2023').toISOString();

    const todayRoute = driverRoutes.find(route3 => makeDate(route3.date) === makeDate(today));
    if (todayRoute) {
      const { data } = await PNPBackend.get(`/routes/${todayRoute.id}`);
      const donationInfo = data[0].donations;
      setDonations(donationInfo);
      setRoute({ date: today, name: todayRoute.name, isRoute: true });
    } else {
      setRoute({ date: today, name: 'No Route Today', isRoute: false });
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

  return (
    <Flex h="90vh">
      {route.isRoute ? (
        <Flex flexDirection="column" gap={5} padding="25px" w="100%">
          <Flex flexDirection="column">
            <Text fontSize="3xl" as="b">
              {route.name}
            </Text>
            <Text>{makeDate(route.date)}</Text>
          </Flex>

          <Flex flexDirection="column" gap={5} height="70vh" overflow="scroll">
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

          <DonationModal data={donationData} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />

          <Box textAlign="right">
            <Button
              size="sm"
              colorScheme="teal"
              mr="2%"
              onClick={() => handleNavigateToAddress(donations)}
            >
              Navigate to Route
            </Button>
            <Button size="sm" colorScheme="blackAlpha" onClick={exportOnOpen}>
              Export PDF
            </Button>
            <Modal isOpen={exportIsOpen} onClose={exportOnClose} size="full">
              <ModalContent>
                <ModalCloseButton />
                <ModalBody p="5em 5em 0 5em">
                  <PDFViewer style={routePDFStyles.viewer}>
                    <RoutePDF driverData={driverInfo} donationData={donations} date={new Date()} />
                  </PDFViewer>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Flex>
      ) : (
        <Flex w="40vw" h="90vh" justifyContent="center" alignItems="center">
          <Box textAlign="center" color="rgba(0, 0, 0, 0.48)">
            <Text fontSize="4xl" as="b">
              No Route Today
            </Text>
            <Text>{makeDate(route.date)}</Text>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default TodayRoute;

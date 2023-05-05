import React, { useEffect, useState } from 'react';
import { Button, Heading, Flex, useToast, Box } from '@chakra-ui/react';
import EditItemsList from '../../components/EditItemsList/EditItemsList';
import ItemInfo from '../../components/ItemInfo/ItemInfo';
import { PNPBackend } from '../../utils/utils';

const ManageDonationForm = () => {
  const [items, setItems] = useState([]);
  const [newEntries, setNewEntries] = useState([]);
  const [deletedEntries, setDeletedEntries] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const renderCards = async () => {
      const { data } = await PNPBackend.get('/furnitureOptions');
      setItems(data);
    };
    renderCards();
  }, []);

  const updateItems = async () => {
    // const res = newEntries.map(async entry => {
    //   await PNPBackend.post('/furnitureOptions/', entry);
    // });
    await PNPBackend.post('/furnitureOptions', { options: newEntries, deleted: deletedEntries });
    // await PNPBackend.delete('/furnitureOptions', { names: deletedEntries });
    setNewEntries([]);
    setDeletedEntries([]);
    toast({
      title: 'Option Saved.',
      description: 'The furniture options has been saved.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Flex flexDirection="column">
        <Heading mx="3vh" my="2vh">
          Manage Donation Form
        </Heading>
        <Flex justifyContent="center" minHeight="50%">
          <EditItemsList
            items={items}
            setItems={setItems}
            setNewEntries={setNewEntries}
            setDeletedEntries={setDeletedEntries}
            isAccepted
          />
          <EditItemsList
            items={items}
            setItems={setItems}
            setNewEntries={setNewEntries}
            setDeletedEntries={setDeletedEntries}
          />
        </Flex>
      </Flex>
      <Box paddingRight="70px" marginTop="1%" textAlign="right">
        <Button colorScheme="white" color="black" mr="0%">
          <ItemInfo items={items} isAccepted />
        </Button>
        <Button marginLeft="10px" colorScheme="blue" color="white" onClick={updateItems}>
          Publish
        </Button>
      </Box>
    </>
  );
};

export default ManageDonationForm;

import React, { useEffect, useState } from 'react';
import { Button, Heading, Flex, useToast } from '@chakra-ui/react';
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

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    // if the form is NOT unchanged, then set the onbeforeunload
    if (newEntries.length || deletedEntries.length) {
      window.addEventListener('beforeunload', handler);
      // clean it up, if the dirty state changes
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
  }, [newEntries, deletedEntries]);

  const updateItems = async () => {
    // const res = newEntries.map(async entry => {
    //   await PNPBackend.post('/furnitureOptions/', entry);
    // });
    await PNPBackend.post('/furnitureOptions', { options: newEntries, deleted: deletedEntries });
    // await PNPBackend.delete('/furnitureOptions', { names: deletedEntries });
    setNewEntries([]);
    setDeletedEntries([]);
    toast.closeAll();
    toast({
      title: 'Option Saved.',
      description: 'The furniture options has been saved.',
      status: 'success',
      variant: 'subtle',
      position: 'top',
      containerStyle: {
        mt: '6rem',
      },
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Flex p="2em 3em" direction="column" gap="1em">
      <Flex gap="1em" direction="column">
        <Heading as="h4">Manage Donation Form</Heading>
        <Flex justifyContent="space-between" minHeight="50%">
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
      <Flex justify="right" gap="1em">
        <ItemInfo items={items} isAccepted />
        <Button colorScheme="blue" onClick={updateItems}>
          Publish
        </Button>
      </Flex>
    </Flex>
  );
};

export default ManageDonationForm;

import React, { useEffect, useState } from 'react';
import { Button, Heading, Flex, Center } from '@chakra-ui/react';
import EditItemsList from '../../components/EditItemsList/EditItemsList';
import { PNPBackend } from '../../utils/utils';

const ManageDonationForm = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const renderCards = async () => {
      const { data } = await PNPBackend.get('/furnitureOptions/');
      setItems([
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
        ...data,
      ]);
    };
    renderCards();
  }, []);

  return (
    <>
      <Heading> Manage Donation Form </Heading>
      <Flex minWidth="max-content" alignItems="center" minHeight="50%" s>
        <EditItemsList items={items} setItems={setItems} isAccepted />
        <EditItemsList items={items} setItems={setItems} />
      </Flex>
      {/* On click, pop up ItemListModal that displays all the items accepted/not accepted */}
      <Button>Preview</Button>
      {/* On click, save the items list to the backend (add toast confirmation - see chakra toast) */}
      <Button>Publish</Button>
    </>
  );
};

export default ManageDonationForm;

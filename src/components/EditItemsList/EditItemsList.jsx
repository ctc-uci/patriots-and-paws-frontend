import React from 'react';
import { Wrap, Input, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import ItemCard from '../ItemCard/ItemCard';

const EditItemsList = () => {
  const title = 'neither accepted nor non accepted cards. nothing!';
  return (
    <>
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <Wrap>
            <ItemCard />
            <ItemCard />
          </Wrap>
        </CardBody>
        <CardFooter>
          <Input />
        </CardFooter>
      </Card>
    </>
  );
};

export default EditItemsList;

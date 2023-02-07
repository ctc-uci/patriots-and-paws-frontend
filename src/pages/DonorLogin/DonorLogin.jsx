import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import verifyDonorLogin from '../../utils/donorUtils';
import DonorDashboard from '../../components/DonorDashboard/DonorDashboard';

const DonorLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [donationId, setDonationId] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    if (await verifyDonorLogin(donationId, email)) {
      setIsLoggedIn(true);
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <>
          <h1>Donor Login</h1>
          <p>First time donating?</p>

          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Donation ID</FormLabel>
              <Input
                type="text"
                placeholder="########"
                value={donationId}
                onChange={e => setDonationId(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="blue" type="submit">
              Login
            </Button>
          </form>
        </>
      ) : (
        <DonorDashboard />
      )}
    </>
  );
};

export default DonorLogin;

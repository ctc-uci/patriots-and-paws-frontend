import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Flex, FormLabel, Input, Image } from '@chakra-ui/react';
import profilePicture from '../../assets/profilePicture.png';
import styles from './DisplayedProfile.module.css';

const DisplayedProfile = () => {
  const testPerson = {
    role: 'Driver',
    firstName: 'Manny',
    lastName: 'Jacinto',
    email: 'mjacinto@email.com',
    phoneNumber: '346444743',
  };
  const { role, firstName, lastName, email, phoneNumber } = testPerson;

  return (
    <Flex minH="100vh" align="center" justify="center">
      <div className={styles.column}>
        <Image
          boxSize="150px"
          src={profilePicture}
          style={{ alignSelf: 'center', margin: '30px' }}
        />
        <Input value={role} style={{ width: '200px', alignSelf: 'center' }} isRequired />
        <div className={styles.row}>
          <div className={styles['label-info']}>
            <FormLabel className={styles['create-account-form-label']}>First Name</FormLabel>
            <Input value={firstName} isRequired />
          </div>
          <div className={styles['label-info']}>
            <FormLabel className={styles['create-account-form-label']}>Last Name</FormLabel>
            <Input value={lastName} isRequired />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles['label-info']}>
            <FormLabel className={styles['create-account-form-label']}>Email</FormLabel>
            <Input value={email} isRequired />
          </div>
          <div className={styles['label-info']}>
            <FormLabel className={styles['create-account-form-label']}>Phone Number</FormLabel>
            <Input value={phoneNumber} isRequired />
          </div>
        </div>
      </div>
    </Flex>
  );
};

export default DisplayedProfile;

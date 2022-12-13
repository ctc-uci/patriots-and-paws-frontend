import React, { useState } from 'react';
import emailTemplate from './emailtemplate';
import styles from './EmailSending.module.css';
import { sendEmail } from '../../utils/utils';

const SendEmail = () => {
  const [newEmail, setNewEmail] = useState();

  function updateEmail(event) {
    setNewEmail(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    sendEmail(newEmail, emailTemplate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="emailInput">
        enter your email:
        <input
          className={styles['email-input']}
          id="emailInput"
          onChange={updateEmail}
          type="email"
          required
        />
      </label>
      <button type="submit">send!</button>
    </form>
  );
};

export default SendEmail;

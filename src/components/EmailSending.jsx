import React, { useState } from 'react';
import emailtemplate from './EmailTemplates/emailtemplate';
import './EmailSending.module.css';
import { sendEmail } from '../util/utils';

const SendEmail = () => {
  const [newEmail, setNewEmail] = useState();

  function updateEmail(event) {
    setNewEmail(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    sendEmail(newEmail, emailtemplate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="emailInput">
        enter your email:
        <input
          className="email-input"
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

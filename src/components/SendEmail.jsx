import React, { useState } from 'react';
import axios from 'axios';
import emailtemplate from './emailtemplate';
import './SendEmail.css';

export default function SendEmail() {
  const [newEmail, setNewEmail] = useState();

  function updateEmail(event) {
    event.preventDefault();
    setNewEmail(event.target.value);
  }

  async function sending() {
    const response = await axios.post('http://localhost:3001/nodemailer/send', {
      email: newEmail,
      messageHtml: emailtemplate,
      subject: 'testing!',
    });
    if (response.status !== 200) {
      throw new Error('Oops, something went wrong. Try again');
    }
    // console.log(response);
  }

  return (
    <form onSubmit={sending}>
      <label htmlFor="emailinput">
        enter your email:
        <input
          className="email-input"
          id="emailinput"
          onChange={updateEmail}
          type="email"
          required
        />
      </label>
      <button className="submit-button" type="submit">
        send!
      </button>
    </form>
  );
}

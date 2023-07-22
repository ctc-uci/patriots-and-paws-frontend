import React from 'react';
import { A, Email, Item, Span } from 'react-html-email';

function dnotifemailtemplate(id, email) {
  return (
    <Email title="Donation Email Notification">
      <Item align="center">
        <Span fontSize={20}>
          This is an automatic email notification that someone has submitted the donation form. In
          order to track the donation, use the donation ID: {id} and your email: {email}. Go &nbsp;
          <A href="furniture.patriotsandpaws.org/donate">here</A> to log in and view the donation.
        </Span>
      </Item>
    </Email>
  );
}

export default dnotifemailtemplate;

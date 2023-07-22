import React from 'react';
import { A, Email, Item, Span } from 'react-html-email';

function dconfirmemailtemplate(id, email) {
  return (
    <Email title="CONGRATS YOU DONATED!!!">
      <Item align="center">
        <Span fontSize={20}>
          This is a confirmation that {email} has submitted the donation form. In order to track
          their donation, use the donation ID: {id} and your email: {email}. Go&nbsp;
          <A href="https://furniture.patriotsandpaws.org/donate">here</A> to log in and view the
          donation.
        </Span>
      </Item>
    </Email>
  );
}

export default dconfirmemailtemplate;

import React from 'react';
import { Email, Item, Span } from 'react-html-email';

function dconfirmemailtemplate(donation) {
  return (
    <Email title="CONGRATS YOU DONATED!!!">
      <Item align="center">
        <Span fontSize={20}>
          This is a confirmation that you submitted the donation form. In order to track your
          donation, use the donation ID: {donation.id} and your email: {donation.email}.
        </Span>
      </Item>
    </Email>
  );
}

export default dconfirmemailtemplate;

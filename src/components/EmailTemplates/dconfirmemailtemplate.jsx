import React from 'react';
import { Email, Item, Span } from 'react-html-email';

function dconfirmemailtemplate(id, email) {
  return (
    <Email title="CONGRATS YOU DONATED!!!">
      <Item align="center">
        <Span fontSize={20}>
          This is a confirmation that you submitted the donation form. In order to track your
          donation, use the donation ID: {id} and your email: {email}.
        </Span>
      </Item>
    </Email>
  );
}

export default dconfirmemailtemplate;

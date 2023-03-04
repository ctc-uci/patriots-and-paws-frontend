import React from 'react';
import { Email, Item, Span } from 'react-html-email';

const dconfirmemailtemplate = (
  <Email title="CONGRATS YOU DONATED!!!">
    <Item align="center">
      <Span fontSize={20}>This is a confirmation that you submitted the donation form.</Span>
    </Item>
  </Email>
);

export default dconfirmemailtemplate;

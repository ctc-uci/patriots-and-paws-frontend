import React from 'react';
import { Email, Item, Span, A } from 'react-html-email';

const emailTemplate = (
  <Email title="Hello World!">
    <Item align="center">
      <Span fontSize={20}>
        This is an example email made with:
        <A href="https://github.com/chromakode/react-html-email">react-html-email</A>.
      </Span>
    </Item>
  </Email>
);

export default emailTemplate;

import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

const white = definePartsStyle({
  field: {
    border: '1px solid',
    borderColor: 'gray.200',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  addon: {
    background: 'white',
    borderColor: 'gray.200 !important',
    border: '1px solid',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    overflowY: 'hidden',
  },
});

const inputTheme = defineMultiStyleConfig({
  variants: { white },
});

export default inputTheme;

import { extendTheme } from '@chakra-ui/react';
import inputTheme from './Input';

const theme = extendTheme({
  components: {
    Input: inputTheme,
  },
  styles: {
    // global: {
    //   '&::-webkit-scrollbar': {
    //     WebkitAppearance: 'none',
    //     width: '5px',
    //   },
    //   '&::-webkit-scrollbar-thumb': {
    //     borderRadius: '5px',
    //     backgroundColor: 'blackAlpha.500',
    //     WebkitBoxShadow: '0 0 1px whiteAlpha.500',
    //   },
    //   '&::-webkit-scrollbar-thumb:hover': {
    //     borderRadius: '5px',
    //     opacity: 0.5,
    //   },
    // },
  },
});

export default theme;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const customTheme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
);

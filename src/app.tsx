import React from 'react';
import { ChakraProvider, Spinner, extendTheme } from '@chakra-ui/react';
import useEncryptedStorage from './hooks/useEncryptedStorage';
import Unlock from './pages/Unlock';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const Router = React.lazy(() => import('./router'));

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const customTheme = extendTheme({ config });

export default function App() {
  const { storage } = useEncryptedStorage();

  return (
    <ChakraProvider theme={customTheme}>
      {storage ? (
        <React.Suspense fallback={<Spinner />}>
          <Router />
        </React.Suspense>
      ) : (
        <Unlock />
      )}
    </ChakraProvider>
  );
}

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { api } from './api';
import { HomePage, SearchPage } from './pages';

const App = () => {
  const test = async () => {
    const summoner = await api.summoner.byName('Doublelift', 'na1');
    console.log('summoner', summoner);
  };
  test();

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;

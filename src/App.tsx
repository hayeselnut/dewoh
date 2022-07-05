import React from 'react';
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
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

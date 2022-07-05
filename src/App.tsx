import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Anchor, Footer, Grommet, Header, Text } from 'grommet';

import { api } from './api';
import { HomePage, SearchPage } from './pages';

const theme = {
  global: {
    colors: {
      brand: '#000000',
    },
  },
};

const App = () => {
  const test = async () => {
    const summoner = await api.summoner.byName('Doublelift', 'na1');
    console.log('summoner', summoner);
  };
  test();

  return (
    <Grommet theme={theme}>
      <header>
        <Header pad='medium'>
          <Text>Duo Diff</Text>
        </Header>
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </main>
      <footer>
        <Footer pad='medium'>
          <Text>GitHub</Text>
          <Anchor label="GitHub" href='https://github.com/hayeselnut' />
        </Footer>
      </footer>
    </Grommet>
  );
};

export default App;

import { Container } from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../components/nav-bar';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const summoners = searchParams.get('summoners')?.split(',')?.map((summonerName) => summonerName.trim()) ?? [];
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Container>
          <div>
            {summoners.map((summoner) => <p key={summoner}>{summoner}</p>)}
          </div>
        </Container>
      </main>
    </>
  );
};

export default SearchPage;

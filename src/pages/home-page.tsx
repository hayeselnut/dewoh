import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../assets/logo-outline-nobg.svg';
import SummonerCard from '../components/summoner-card';
import AddSummonerCard from '../components/add-summoner-card';

const HomePage = () => {
  const [summoners, setSummoners] = useState<string[]>(['', '']);
  const navigate = useNavigate();

  const onChange = (idx: number): (val: string) => void => {
    return (val: string): void => {
      const newSummoners = [...summoners];
      newSummoners[idx] = val;
      setSummoners(newSummoners);
    };
  };

  const addSummoner = () => {
    setSummoners([...summoners, '']);
  };

  const removeSummoner = (idx: number): () => void => {
    return (): void => {
      const newSummoners = [...summoners];
      newSummoners.splice(idx, 1);
      setSummoners(newSummoners);
    };
  };

  const canSearch = !summoners.some((summonerName) => summonerName === '');

  const canRemoveSummoner = summoners.length > 2;

  const searchSummoners = () => {
    if (!canSearch) return;

    navigate({
      pathname: '/search',
      search: `?summoners=${summoners.join(',')}`,
    });
  };

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        <Heading as='h1' size='4xl'>DUO DIFF</Heading>
        <Image
          boxSize='16rem'
          objectFit='cover'
          src={Logo}
          alt='Logo'
        />
      </Box>
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        {summoners.map((summoner, idx) =>
          <SummonerCard
            key={idx}
            value={summoner}
            onChange={onChange(idx)}
            onClick={removeSummoner(idx)}
            onEnter={searchSummoners}
            canRemoveSummoner={canRemoveSummoner}
          />,
        )}
        {summoners.length < 5 && <AddSummonerCard onClick={addSummoner} />}
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        <Button
          onClick={searchSummoners}
          bg='green.500'
          disabled={!canSearch}
        >
              Search
        </Button>
      </Box>

    </>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Box, Button, Heading, Image } from '@chakra-ui/react';

import Logo from '../assets/logo-outline-nobg.svg';
import SummonerCard from '../components/summoner-card';
import AddSummonerCard from '../components/add-summoner-card';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [summoners, setSummoners] = useState<string[]>(['', '']);

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

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        <Heading as='h1' size='4xl'>Duo Diff</Heading>
        <Image
          boxSize='16rem'
          objectFit='cover'
          src={Logo}
          alt='Logo'
        />
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        {summoners.map((summoner, idx) =>
          <SummonerCard key={idx} value={summoner} onChange={onChange(idx)} onClick={removeSummoner(idx)} />)
        }
        {summoners.length < 5 && <AddSummonerCard onClick={addSummoner} />}
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' padding='4' bg='gray.800' color='white'>
        <Link to={{
          pathname: '/search',
          search: `?summoners=${summoners.join(',')}`,
        }}>
          <Button bg='green.500' disabled={summoners.some((summonerName) => summonerName === '')}>Search</Button>
        </Link>
      </Box>
    </>
  );
};

export default HomePage;

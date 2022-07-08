import React from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';

import Logo from '../assets/logo-outline-nobg.svg';
import SummonerCard from '../components/summoner-card';
import AddSummonerCard from '../components/add-summoner-card';
// import HelmetBro from '../assets/bg.jpg';

const HomePage = () => {
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
        <SummonerCard />
        <SummonerCard />
        <SummonerCard />
        <SummonerCard />
        {/* <SummonerCard /> */}
        <AddSummonerCard />
      </Box>
    </>
  );
};

export default HomePage;

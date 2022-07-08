import React from 'react';
import { Box, Image, Input } from '@chakra-ui/react';
import HelmetBro from '../assets/helmet-bro.svg';

const SummonerCard = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      borderWidth='2px'
      borderRadius='lg'
      bg='white'
      p='4'
      m='4'
    >
      <Box borderRadius='full' bg='gray.200' p='16' m='4'>
        <Image
          boxSize='20'
          opacity='0.25'
          fit='cover'
          src={HelmetBro}
          alt='Summoner icon placeholder'
        />
      </Box>
      <Input placeholder='Summoner name' color='black' />
    </Box>
  );
};

export default SummonerCard;

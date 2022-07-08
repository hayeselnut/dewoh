import React, { FC } from 'react';
import { Box, Image, Input } from '@chakra-ui/react';
import HelmetBro from '../assets/helmet-bro.svg';

const SummonerCard: FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      borderWidth='2px'
      borderRadius='lg'
      maxW='12%'
      bg='white'
      p='2'
      m='2'
    >
      <Box borderRadius='full' bg='gray.200' p='12' m='2'>
        <Image
          boxSize='12'
          opacity='0.25'
          fit='cover'
          src={HelmetBro}
          alt='Summoner icon placeholder'
        />
      </Box>
      <Input placeholder='Summoner name' color='black' m='2' value={value} onChange={(e) => onChange(e.target.value)} />
    </Box>
  );
};

export default SummonerCard;

import React, { FC, useState } from 'react';
import { Box, Image, Input, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import HelmetBro from '../assets/helmet-bro.svg';

const SummonerCard: FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      borderWidth='2px'
      borderRadius='lg'
      position='relative'
      maxW='12%'
      bg='white'
      p='2'
      m='2'
      onMouseEnter={() => setShowCloseButton(true)}
      onMouseLeave={() => setShowCloseButton(false)}
    >
      <IconButton
        icon={<CloseIcon />}
        aria-label='Delete summoner'
        bg='black'
        borderRadius='full'
        position='absolute'
        size='xs'
        top='-3'
        right='-3'
        visibility={showCloseButton ? 'visible' : 'hidden'}
      />
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

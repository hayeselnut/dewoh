import React from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';
import Logo from '../assets/logo-outline-nobg.svg';

const NavBar = () => {
  return (
    <Box display='flex' alignItems='center' padding='4' bg='gray.800' color='white'>
      <Image
        boxSize='8rem'
        objectFit='cover'
        src={Logo}
        alt='Logo'
      />
      <Heading as='h1'>Duo Diff</Heading>
    </Box>
  );
};

export default NavBar;

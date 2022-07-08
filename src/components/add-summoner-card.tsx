import React from 'react';
import { Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddSummonerCard = () => {
  return (
    <Box
      borderRadius='full'
      borderStyle='dashed'
      borderWidth='2px'
      p='10'
      m='4'
      opacity='0.2'
      _hover={{
        opacity: 1,
      }}
    >
      <AddIcon w={6} h={6} color='white'/>
    </Box>
  );
};

export default AddSummonerCard;
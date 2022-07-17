import React, { FC } from 'react';

const AddSummonerCard: FC<{onClick: () => void}>= ({ onClick }) => {
  return (
    <button onClick={() => onClick()}>
      <Box
        borderRadius='lg'
        borderStyle='dashed'
        borderWidth='2px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        m='2'
        w='12vw'
        h='12vw'
        opacity='0.2'
        _hover={{
          opacity: 1,
          cursor: 'pointer',
        }}
      >
        <AddIcon w={10} h={10} color='white'/>
      </Box>
    </button>

  );
};

export default AddSummonerCard;

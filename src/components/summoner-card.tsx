import React, { FC, KeyboardEvent, useState } from 'react';
import HelmetBro from '../assets/helmet-bro.svg';

const SummonerCard: FC<{
  value: string,
  onChange: (val: string) => void,
  onClick: () => void,
  onEnter: () => void,
  canRemoveSummoner: boolean,
}> = ({ value, onChange, onClick, onEnter, canRemoveSummoner }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') onEnter();
  };

  return (
      <Image
        boxSize='4vw'
        opacity='0.25'
        m='6'
        fit='cover'
        src={HelmetBro}
        alt='Summoner icon placeholder'
      />
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        borderWidth='2px'
        borderRadius='lg'
        position='relative'
        w='12vw'
        h='12vw'
        bg='white'
        p='2'
        m='2'
        onMouseEnter={() => setShowCloseButton(true)}
        onMouseLeave={() => setShowCloseButton(false)}
      >
        {canRemoveSummoner
        && <IconButton
          icon={<CloseIcon />}
          aria-label='Delete summoner'
          bg='black'
          borderRadius='full'
          position='absolute'
          size='xs'
          top='-3'
          right='-3'
          visibility= {showCloseButton ? 'visible' : 'hidden'}
          onClick={() => onClick()}
        />
        }
        <Input
          placeholder='Summoner name'
          color='black'
          m='2'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Box>
  );
};

export default SummonerCard;

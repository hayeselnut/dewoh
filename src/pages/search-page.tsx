import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const summoners = searchParams.get('summoners')?.split(',')?.map((summonerName) => summonerName.trim()) ?? [];
  return (
    <div>
      {summoners.map((summoner) => <p key={summoner}>{summoner}</p>)}
    </div>
  );
};

export default SearchPage;

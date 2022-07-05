import { Region, SummonerDto, MatchDto } from '../types';

class RiotGamesApi {
  private url: string;
  readonly summoner: {
        byName: (name: string, region: Region) => Promise<SummonerDto>,
    };
  readonly match: {
        byPuuid: (puuid: string, region: Region) => Promise<string[]>,
        byMatchId: (matchId: string, region: Region) => Promise<MatchDto>,
    };

  constructor(url: string) {
    this.url = url;
    this.summoner = {
      byName: async (name: string, region: Region): Promise<SummonerDto> => {
        const url = new URL(this.url);
        url.searchParams.set('region', region);
        url.searchParams.set('endpoint', `/lol/summoner/v4/summoners/by-name/${name}`);
        return await this.fetch<SummonerDto>(url);
      },
    };
    this.match = {
      byPuuid: async (puuid: string, region: Region): Promise<string[]> => {
        const url = new URL(this.url);
        url.searchParams.set('region', region);
        url.searchParams.set('endpoint', `/lol/match/v5/matches/by-puuid/${puuid}/ids`);
        return await this.fetch<string[]>(url);
      },
      byMatchId: async (matchId: string, region: Region): Promise<MatchDto> => {
        const url = new URL(this.url);
        url.searchParams.set('region', region);
        url.searchParams.set('endpoint', `/lol/match/v5/matches/${matchId}`);
        return await this.fetch<MatchDto>(url);
      },
    };
  }

  private async fetch<T>(url: URL) {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json() as Promise<T>;
    } else {
      console.error(response.status, response.statusText);
      return await response.json() as Promise<T>;
    }
  }
}

export default new RiotGamesApi('https://rgapi-proxy.hayeselnut.workers.dev/api/');

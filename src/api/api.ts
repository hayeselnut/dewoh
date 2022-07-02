

class RiotGamesApi {
    private url: string;
    readonly summoner: {
        byName: any,
    };
    readonly match: object;

    constructor(url: string) {
        console.log(url);
        this.url = url;
        this.summoner = {
            byName: async (name: string) => await fetch(`${this.url}?region=na1&endpoint=/lol/summoner/v4/summoners/by-name/${name}`),
        };
        this.match = {
            byPuuid: async (puuid: string) => await fetch(`${this.url}?region=na1&endpoint=/lol/match/v5/matches/by-puuid/${puuid}/ids`),
            byMatchId: async (matchId: string) => await fetch(`${this.url}?region=na1&endpoint=/lol/match/v5/matches/${matchId}`),
        };
    }
}

export default new RiotGamesApi('https://rgapi-proxy.hayeselnut.workers.dev/api/');
// export default new RiotGamesApi(process.env.WORKER_URL);

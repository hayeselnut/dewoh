class RiotGamesApi {
    private key: string;
    // private summoner: object;

    constructor(key: string) {
        this.key = key;
        // this.summoner = {

        // }
    }

    async getSummoner(name: string) {
        const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, {
            method: 'GET',
            headers: new Headers({
                "X-Riot-Token": this.key
            })
        });
        console.log('response', response);
        const data = await response.json();
        console.log('data', data);
    }
}

export default new RiotGamesApi(process.env.RGAPI_KEY);

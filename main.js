var RIOT_API_KEY = atob("UkdBUEktMzkwYWE5N2YtN2ZjNi00Y2M1LTkwOTMtOGE1MmMzNzQ2OTli");


function getSummonerDTO(summonerName) {
    // return $.get(`https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${RIOT_API_KEY}`, function (response) {
    //     console.log(response);
    // }).fail(function(response) {
    //     console.log("could not retrieve data", response)
    // });

    return $.ajax({
        type: "GET",
        url: `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${RIOT_API_KEY}`,
        // url: `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
        headers: {"X-Riot-Token": RIOT_API_KEY},
        success: function(response) {
            console.log(response);
        }
    });
}

$("#dewoh-btn").on("click", async function() {

    var name1 = $("#sum1-txtbox").val();
    var name2 = $("#sum2-txtbox").val();

    // var sum1 = await getSummonerDTO(name1);
    // var sum2 = await getSummonerDTO(name2);

    getSummonerDTO(name1);
    getSummonerDTO(name2);

    // var id1 = getSummonerId(sum1);
    // var id2 = getSummonerId(sum2);

    // console.log(sum1, sum2);
});
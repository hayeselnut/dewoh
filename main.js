"use strict";

let latestVersion;

const WIN = 1;
const LOSE = 0;
const VS = -1;

const BLUE = 100;
const RED = 200;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function getIntersection(arr1, arr2) {
    return arr1.filter(value => arr2.includes(value));
}

function showStatus(statusMessage) {
    const duration = 500;
    const style = "h3"

    $("#status").fadeOut(duration, () => {
        $("#status").html(`<${style}>${statusMessage}</${style}>`).fadeIn(duration);
    });
}



function getLatestVersion() {
    $.ajax({
        type: "GET",
        url: "https://ddragon.leagueoflegends.com/api/versions.json",
        success: response => {
            latestVersion = response[0];
            console.log("LATEST V", latestVersion);
        }, error: () => {
            latestVersion = "10.16.1";
        }
    });
}

$(document).ready(() => {
    getLatestVersion();
});

function getSummonerDTO(region, name) {
    return $.ajax({
        type: "GET",
        url: `https://dkwuj1k34l.execute-api.us-east-2.amazonaws.com/rgapi/summoner/${region}/${name}`,
        success: response => {
            return response;
        }, error: err => {
            console.log("err get summoner", err.status);
            // TODO: SHOW INVALID SUMMONER NAME -- "name" not found
        }
    });
}

function getMatchlistDTO(region, accountId, index) {
    return $.ajax({
        type: "GET",
        url: `https://dkwuj1k34l.execute-api.us-east-2.amazonaws.com/rgapi/matchlist/${region}/${accountId}/${index}`,
        success: response => {
            return response;
        }, error: err => {
            console.log("err get matchlist", err);
            // TODO: when matchlist hit error (maybe over index?)
        }
    });
}

function getMatchDTO(region, gameId) {
    return $.ajax({
        type: "GET",
        url: `https://dkwuj1k34l.execute-api.us-east-2.amazonaws.com/rgapi/match/${region}/${gameId}`,
        success: response => {
            console.log("game info found, ", response);
            return response;
        }, error: err => {
            console.log("err get match", err);
            // TODO: HANDLE THIS (e.g. invalid gameiD? is that even possible)
        }
    });
}

function showSummonerMetadata(summonerDTO) {
    const name = summonerDTO.name;
    const summonerIcon = summonerDTO.profileIconId;
    const level = summonerDTO.summonerLevel;

    $("#dewoh-results").css("display", "block").css("visibility", "hidden");
    $("#dewoh-desc").slideUp(500, () => {
        $("#dewoh-results").css("visibility", "visible").fadeIn(500);
    });

    let append = `
        <div class="flexbox">
            <img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${summonerIcon}.png"</img>
            <div>
                <h2>${name}</h2>
                <p>Level ${level}</p>
            </div>
        </div>
    `;
    $("#summoner-metadata").append(append);
}

async function getSummonerId(region, name) {

    // Call API to find ID
    const summonerDTO = await getSummonerDTO(region, name);

    if (!summonerDTO) {
        console.log("summonerDTO dtected as null");
        return null;
    }

    // Show summoner information
    showSummonerMetadata(summonerDTO);

    // Return id
    return summonerDTO.accountId;

}

async function getGameIds(region, accountId, timestamp) {
    let idx = 0;
    let matchlistDTO = await getMatchlistDTO(region, accountId, idx);
    let gameIds = matchlistDTO.matches.filter(m => m.timestamp > timestamp).map(m => m.gameId);

    let keepLooking = gameIds.length == 100;
    while (keepLooking) {
        idx += 100;

        matchlistDTO = await getMatchlistDTO(region, accountId, idx);
        let moreGameIds = matchlistDTO.matches.filter(m => m.timestamp > timestamp).map(m => m.gameId);
        keepLooking = moreGameIds.length == 100;

        gameIds = gameIds.concat(moreGameIds);

        //TODO: handle case where you hit the end of someones match history
    }

    return gameIds;
}

// Checks if the two players are on the same team (they could be vsing each other!)
function getTeamId(matchDTO, id1, id2) {
    const participantId1 = matchDTO.participantIdentities.filter(p => p.player.currentAccountId === id1)[0].participantId;
    const participantId2 = matchDTO.participantIdentities.filter(p => p.player.currentAccountId === id2)[0].participantId;

    const team1 = matchDTO.participants[participantId1 - 1].teamId;
    const team2 = matchDTO.participants[participantId2 - 1].teamId;

    if (team1 === team2) {
        return team1;
    }

    return VS;
}

// Gets queueId of game
function getQueueId(matchDTO) {
    return matchDTO.queueId;
}

// Checks if the given team is won the game
function checkWin(matchDTO, teamId) {
    return matchDTO.teams.filter(t => t.teamId === teamId)[0].win == "Win";
}

async function getGameOutcomes(commonGames, region, id1, id2) {
    // WHEN I GET BETTER API LIMITS: const commonMatchDTOs = await Promise.all(commonGames.map(m => getMatchDTO(region, m)));

    const results = { "win": 0, "loss": 0 };

    for (let i = 0; i < commonGames.length; i++) {
        showStatus(`Checking ${i + 1} out of ${commonGames.length} games`);
        const gameId = commonGames[i];
        const matchDTO = await getMatchDTO(region, gameId);
        const teamId = getTeamId(matchDTO, id1, id2);

        if (teamId == VS) {
            console.log("vsed each other");
            continue;
        }

        const queueId = getQueueId(matchDTO);

        if (!(queueId in results)) {
            results[queueId] = { "win": 0, "loss": 0 };
        }

        const win = checkWin(matchDTO, teamId);

        if (win) {
            results.win++;
            results[queueId].win++;
            console.log("win");
        } else {
            results.loss++;
            results[queueId].loss++;
            console.log("loss");
        }

        await sleep(1000);
    }

    return results;
}

$("input").on("focus", function() {
    $(this).removeClass("invalid-input").attr("placeholder", "Summoner Name");
});

function transformSummonerName(name) {
    return name.toLowerCase().split(" ").join("");
}


$("#dewoh-btn").on("click", async () => {
    const region = $("#region").val();
    const name1 = transformSummonerName($("#sum1-txtbox").val());
    const name2 = transformSummonerName($("#sum2-txtbox").val());

    if (name1 === "") {
        console.log("name1 is blank");
        $("#sum1-txtbox").addClass("invalid-input").attr("placeholder", "Please enter a summoner name");
    }

    if (name2 === "") {
        console.log("name2 is blank");
        $("#sum2-txtbox").addClass("invalid-input").attr("placeholder", "Please enter a summoner name");
    }

    $("#summoner-metadata").empty();

    const id1 = await getSummonerId(region, name1);
    const id2 = await getSummonerId(region, name2);

    // Promise.all([id1, id2]); // Async for both ids

    let timestamp = 1577836800 * 1000;

    showStatus("Loading match histories...");

    const games1 = await getGameIds(region, id1, timestamp);
    const games2 = await getGameIds(region, id2, timestamp);

    const commonGames = getIntersection(games1, games2);

    if (commonGames.length) {
        showStatus(`Checking ${commonGames.length} common games...`);

        console.log("COMMON GAMES", commonGames);

        const results = await getGameOutcomes(commonGames, region, id1, id2);

        showStatus("Results are as follows:");

        showStatus(JSON.stringify(results));

    } else {
        showStatus("No common games found this year");
    }

});
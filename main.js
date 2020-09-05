"use strict";

let LATEST_VERSION;
let QUEUES;
let CHAMPIONS = {};

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

function convertUnixTimestamp(timestamp) {
    const date = new Date(timestamp);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    const apm = hour < 12 || hour === 24 ? "AM" : "PM";
    if (min < 10) min = "0" + min;
    hour = hour % 12 || 12;

    return `${day} ${month} ${year} ${hour}:${min} ${apm}`;

}

function showStatus(statusMessage) {
    const duration = 5;
    const style = "h3"

    $("#status").fadeOut(duration, () => {
        $("#status").html(`<${style}>${statusMessage}</${style}>`).fadeIn(duration);
    });
}

function getSpanClass(winRate) {
    if (winRate >= 80) return "best";
    if (winRate >= 65) return "better";
    if (winRate >= 50) return "good";
    if (winRate >= 35) return "bad";
    if (winRate >= 20) return "worse";
    return "worst"
}

function getChampions() {
    return $.ajax({
        type: "GET",
        url: `https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/data/en_US/champion.json`,
        success: response => {
            Object.keys(response.data).forEach(key => {
                const championId = response.data[key].key;
                CHAMPIONS[championId] = response.data[key].id;
            })

            console.log("received champs", CHAMPIONS);
        }, error: err => {
            console.log("err get champs", err);
        }
    });
}

function getChampionURL(championId) {
    const championName = CHAMPIONS[championId];

    return `https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/img/champion/${championName}.png`;
}

function getLatestVersion() {
    return $.ajax({
        type: "GET",
        url: "https://ddragon.leagueoflegends.com/api/versions.json",
        success: response => {
            LATEST_VERSION = response[0];
            console.log("LATEST V", LATEST_VERSION);
        }, error: () => {
            LATEST_VERSION = "10.16.1";
        }
    });
}

function getQueues() {
    return $.ajax({
        type: "GET",
        url: "https://hayeselnut.github.io/dewoh/queues.json",
        success: response => {
            QUEUES = response;
            console.log("queues received", QUEUES);
        }, error: () => {
            console.log("couldn't find queues");
        }
    })
}

function getQueueName(queueId) {
    // Using == instead of === beause queueId will be passed as a string
    if (QUEUES.filter(q => q.queueId == queueId)[0] === undefined) return "undefined";
    return QUEUES.filter(q => q.queueId == queueId)[0].description;
    // return QUEUES[queueId].name;
}

$(document).ready(async () => {
    getQueues();
    await getLatestVersion();
    getChampions();
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
        }
    });
}

function getMatchDTO(region, gameId) {
    return $.ajax({
        type: "GET",
        url: `https://dkwuj1k34l.execute-api.us-east-2.amazonaws.com/rgapi/match/${region}/${gameId}`,
        success: response => {
            // console.log("game info found, ", response);
            return response;
        }, error: err => {
            console.log("err get match", err);
            if (err.status === 504) {
                console.log("retrying...");
                return getMatchDTO(region, gameId);
            }
            // TODO: HANDLE THIS (e.g. invalid gameiD? is that even possible)
        }
    });
}

function showSummonerMetadata(summonerDTO1, summonerDTO2) {
    const name1 = summonerDTO1.name;
    const name2 = summonerDTO2.name;
    const summonerIcon1 = summonerDTO1.profileIconId;
    const summonerIcon2 = summonerDTO2.profileIconId;
    const summonerIconURL1 = `https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/img/profileicon/${summonerIcon1}.png`;
    const summonerIconURL2 = `https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/img/profileicon/${summonerIcon2}.png`;
    const level1 = summonerDTO1.summonerLevel;
    const level2 = summonerDTO2.summonerLevel;

    $("#dewoh-results").css("display", "block").css("visibility", "hidden");
    $("#dewoh-desc").slideUp(500, () => {
        $("#dewoh-results").css("visibility", "visible").fadeIn(500);
    });

    let metadata = `
        <div class="flexbox">
            <img src="${summonerIconURL1}"</img>
            <div>
                <h2>${name1}</h2>
                <p>Level ${level1}</p>
            </div>
        </div>
        <div class="flexbox">
            <img src="${summonerIconURL2}"</img>
            <div>
                <h2>${name2}</h2>
                <p>Level ${level2}</p>
            </div>
        </div>
    `;
    $("#summoner-metadata").html(metadata);
}

async function getSummonerIds(region, name1, name2) {

    // Call API to find ID
    const [summonerDTO1, summonerDTO2] = await Promise.all([getSummonerDTO(region, name1), getSummonerDTO(region, name2)]);

    if (!summonerDTO1 || !summonerDTO2) {
        console.log("summonerDTO dtected as null");
        return null;
    }

    // Show summoner information
    showSummonerMetadata(summonerDTO1, summonerDTO2);

    // Return id
    return [summonerDTO1.accountId, summonerDTO2.accountId];

}

async function getGameIds(region, accountId, timestamp) {
    let idx = 0;
    let matchlistDTO = await getMatchlistDTO(region, accountId, idx);
    let gameIds = matchlistDTO.matches.filter(m => m.timestamp > timestamp).map(m => m.gameId);

    let keepLooking = gameIds.length === 100;
    while (keepLooking) {
        idx += 100;

        matchlistDTO = await getMatchlistDTO(region, accountId, idx);
        let moreGameIds = matchlistDTO.matches.filter(m => m.timestamp > timestamp).map(m => m.gameId);
        keepLooking = moreGameIds.length === 100;

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

function getTime(matchDTO) {
    return matchDTO.gameCreation;
}

function showVsMatch(matchDTO, id1, id2) {
    const championId1 = getChampionId(matchDTO, id1);
    const championId2 = getChampionId(matchDTO, id2);
    const championURL1 = getChampionURL(championId1);
    const championURL2 = getChampionURL(championId2);

    const queueId = getQueueId(matchDTO);
    const queueDesc = getQueueName(queueId);

    const timePlayed = convertUnixTimestamp(getTime(matchDTO));

    const card = `
        <div class="match flexbox vs">
            <img class="champion" src="${championURL1}"/> vs <img class="champion" src="${championURL2}"/>
            <strong>${queueDesc}</strong>
            <text class="date">${timePlayed}</text>
        </div>
    `;

    $("#match-history").append(card);
}

function showMatch(matchDTO, id1, id2) {
    const participantName1 = getParticipantName(matchDTO, id1);
    const participantName2 = getParticipantName(matchDTO, id2);

    const championId1 = getChampionId(matchDTO, id1);
    const championId2 = getChampionId(matchDTO, id2);
    const championURL1 = getChampionURL(championId1);
    const championURL2 = getChampionURL(championId2);

    const queueId = getQueueId(matchDTO);
    const queueDesc = getQueueName(queueId);

    const teamId = getTeamId(matchDTO, id1, id2);
    const teamMessage = teamId == BLUE ? "Blue team" : "Red team";

    const win = checkWin(matchDTO, teamId);
    const winClass = win ? "win" : "loss";
    const winMessage = winClass.toUpperCase();

    const timePlayed = convertUnixTimestamp(getTime(matchDTO));

    const card = `
        <div class="match flexbox ${winClass}">
            <img class="champion" src="${championURL1}"/><img class="champion" src="${championURL2}"/>
            <strong>${queueDesc}</strong>
            <text class="date">${timePlayed}</text>
        </div>
    `;

    $("#match-history").append(card);
}

// Gets the champion a summoner played during the match
function getChampionId(matchDTO, id) {
    const participantId = matchDTO.participantIdentities.filter(p => p.player.currentAccountId === id)[0].participantId;
    return matchDTO.participants[participantId - 1].championId;
}

// Gets participants summoner name at the time of the match (they could have changed their summoner name)
function getParticipantName(matchDTO, id) {
    return matchDTO.participantIdentities.filter(p => p.player.currentAccountId === id).map(p => p.player.summonerName)[0];
}

function getRole(matchDTO, id) {
    // will have to implement https://github.com/meraki-analytics/role-identification later in the future
    const participantId = matchDTO.participantIdentities.filter(p => p.player.currentAccountId === id)[0].participantId;
    const role = matchDTO.participants[participantId - 1].timeline.role;
    const lane = matchDTO.participants[participantId - 1].timeline.lane;

    if (lane === "TOP" && role === "SOLO") return "TOP";
    if (lane === "JUNGLE") return "JUNGLE";
    if (lane === "MIDDLE" && role === "SOLO") return "MID";

    if (lane === "BOTTOM" && role === "DUO_CARRY") return "ADC";
    if (lane === "BOTTOM" && role === "DUO_SUPPORT") return "SUPPORT";

    // Weird cases?
    if (role === "DUO") return "ADC"
    if (role === "DUO_SUPPORT") return "SUPPORT";
    if (lane === "BOTTOM" && role === "SOLO") return "ADC";

    return role + "/" + lane;
}

async function getGameOutcomes(commonGames, region, id1, id2) {
    // WHEN I GET BETTER API LIMITS:
    const commonMatchDTOs = await Promise.all(commonGames.map(m => getMatchDTO(region, m)));

    const results = {
        "win": 0,
        "loss": 0,
        "byQueue": {},
        "byRole": {},
        "byChampion": {}
    };

    for (let i = 0; i < commonGames.length; i++) {
        showStatus(`Checking ${i + 1} out of ${commonGames.length} games`);

        const gameId = commonGames[i];
        // const matchDTO = await getMatchDTO(region, gameId);
        const matchDTO = commonMatchDTOs[i];
        const teamId = getTeamId(matchDTO, id1, id2);

        if (teamId === VS) {
            showVsMatch(matchDTO, id1, id2);
            console.log("vsed each other", matchDTO);
            continue;
        }

        showMatch(matchDTO, id1, id2);
        const win = checkWin(matchDTO, teamId) ? "win" : "loss";
        const queueId = getQueueId(matchDTO);
        const queueDesc = getQueueName(queueId);
        const role1 = getRole(matchDTO, id1);
        const role2 = getRole(matchDTO, id2);
        const champion1 = getChampionId(matchDTO, id1);
        const champion2 = getChampionId(matchDTO, id2);

        if (champion1 !== champion2) {
            const duoChampions = champion1 + " " + champion2;

            if (!(duoChampions in results.byChampion)) {
                results.byChampion[duoChampions] = { "win": 0, "loss": 0 };
            }

            results.byChampion[duoChampions][win]++;
        }

        if (queueDesc.includes("5v5") && !queueDesc.includes("ARAM") || queueDesc.includes("Clash")) {
            // Add role statistic
            const duoRole = role1 + " " + role2;

            if (!(duoRole in results.byRole)) {
                results.byRole[duoRole] = { "win": 0, "loss": 0 };
            }

            results.byRole[duoRole][win]++;
        }

        if (!(queueId in results.byQueue)) {
            results.byQueue[queueId] = { "win": 0, "loss": 0 };
        }
        results[win]++;
        results.byQueue[queueId][win]++;
        console.log(win, gameId, role1, role2);

        await sleep(0.05);
    }

    return results;
}

$("input").on("focus", function() {
    $(this).removeClass("invalid-input").attr("placeholder", "Summoner Name");
});

function transformSummonerName(name) {
    return name.toLowerCase().split(" ").join("");
}

function sortResults(resultsDict, minGames) {
    const resultsArray = [];

    for (const [key, result] of Object.entries(resultsDict)) {
        const games = result.win + result.loss;
        if (games < minGames) continue;

        const wins = result.win;
        const winRate = (100.0 * wins / games).toFixed(2);

        resultsArray.push({
            "key": key,
            "games": games,
            "wins": wins,
            "winRate": winRate,
        })
    }

    resultsArray.sort((a, b) => {
        if (a.games == b.games) {
            return a.wins < b.wins ? 1 : -1;
        }

        return a.games < b.games ? 1 : -1;
    });

    return resultsArray;
}

function showResults(results) {
    console.log(results);

    // Show overall
    const totalGames = results.win + results.loss;
    const totalWins = results.win;
    const totalWinRate = (100.0 * totalWins / totalGames).toFixed(2);
    const spanClass = getSpanClass(totalWinRate);

    $("#overall").html(`
        <h2>Overall win rate: <span class="${spanClass}">${totalWinRate}%</span></h2>
        <p>${totalWins} games won out of ${totalGames} games played together</p>
    `);

    // Show by queue
    let qAnalaysis = "<h3>Queue breakdown:</h3>";
    for (const qArray of sortResults(results.byQueue, 1)) {
        const qId = qArray.key;
        const qDesc = getQueueName(qId);
        const qGames = qArray.games;
        const qWins = qArray.wins;
        const qWinRate = qArray.winRate;
        const spanClass = getSpanClass(qWinRate);

        qAnalaysis += `
            <p>
                <strong>${qDesc} - <span class="${spanClass}">${qWinRate}%</span></strong>
                <br/>
                ${qWins} / ${qGames} games won
            </p>
        `;
    }
    $("#by-queue").html(qAnalaysis);

    // Show by roles
    // TODO: sort based on win rate, then #games played
    let rAnalysis = "<h3>Role breakdown:</h3>";
    const sortedRoles = sortResults(results.byRole, 5);
    for (let i = 0; i < sortedRoles.length && i < 10 || 5 <= i && i < 10 && sortedRoles[i].games >= 10; i++) {
        const rArray = sortedRoles[i];
        const duoRoles = rArray.key;
        const [role1, role2] = duoRoles.split(" ");
        const rGames = rArray.games;
        const rWins = rArray.wins;
        const rWinRate = rArray.winRate;
        const spanClass = getSpanClass(rWinRate);

        rAnalysis += `
            <p>
                <strong>${role1} / ${role2} - <span class="${spanClass}">${rWinRate}%</span></strong>
                <br/>
                ${rWins} / ${rGames} games won
            </p>
        `;
    }
    $("#by-role").html(rAnalysis);

    // Show by champion
    let cAnalysis = "<h3>Champion breakdown:</h3>";
    const sortedChampions = sortResults(results.byChampion, 3);
    for (let i = 0; i < sortedChampions.length && i < 10 || 5 <= i && i < 10 && sortedChampions[i].games >= 5; i++) {
        const cArray = sortedChampions[i];
        const duoChampions = cArray.key;
        const [champion1, champion2] = duoChampions.split(" ");
        const cGames = cArray.games;
        const cWins = cArray.wins;
        const cWinRate = cArray.winRate;
        const spanClass = getSpanClass(cWinRate);

        const championURL1 = getChampionURL(champion1);
        const championURL2 = getChampionURL(champion2);

        cAnalysis += `
            <p>
                <img class="champion" src="${championURL1}"/><img class="champion" src="${championURL2}"/><strong> - <span class="${spanClass}">${cWinRate}%</span></strong>
                <br/>
                ${cWins} / ${cGames} games won
            </p>
        `;
    }
    $("#by-champion").html(cAnalysis);
}


function clickButton(event) {
    if (event.which == 13) { // Enter key
        $("#dewoh-btn").click();
    }
}

$("#sum1-txtbox").on("keydown", clickButton);
$("#sum2-txtbox").on("keydown", clickButton);


function emptyResults() {
    // TODO: could probably write a recursive function that goes through all children
    $("#summoner-metadata").empty();

    $("#analysis").slideUp(500, () => {
        $("#overall").empty();
        $("#by-queue").empty();
        $("#by-role").empty();
        $("#by-champion").empty();
    }).slideDown(500);

    $("#match-history").slideUp(500).empty().slideDown(500);

}

// NEED TO MAKE SURE NO DOUBLE CLICK BUTTON (disable button?)
$("#dewoh-btn").on("click", async function() {
    $(this).prop("disabled", true);
    emptyResults();
    const region = $("#dewoh-region").val();
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

    if (name1 === "" || name2 === "") {
        $(this).prop("disabled", false);
        return;
    }

    if (name1 === name2) {
        showStatus("Please enter two different summoner names");
        $(this).prop("disabled", false);
        return;
    }

    $("#summoner-metadata").empty();

    // const id1 = await getSummonerId(region, name1);
    // const id2 = await getSummonerId(region, name2);

    // Promise.all([id1, id2]); // TODO: Async for both ids
    const [id1, id2] = await getSummonerIds(region, name1, name2);

    const timestamp = new Date().getTime() - $("#dewoh-timeframe").val();
    console.log(timestamp);

    showStatus("Loading match histories...");

    const games1 = await getGameIds(region, id1, timestamp);
    const games2 = await getGameIds(region, id2, timestamp);

    const commonGames = getIntersection(games1, games2);

    if (commonGames.length) {
        showStatus(`Checking ${commonGames.length} common games...`);

        console.log("COMMON GAMES", commonGames);

        const results = await getGameOutcomes(commonGames, region, id1, id2);

        showStatus("");
        showResults(results);

        // showStatus(JSON.stringify(results));

    } else {
        showStatus("No common games found this year");
    }

    $(this).prop("disabled", false);

});
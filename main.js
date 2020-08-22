// var RIOT_API_KEY;
// var ref = firebase.database().ref("dewoh");
// var summonerIdsRef = ref.child("summonerIds");

var latestVersion;

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
    // ref.on("value", snapshot => {
    //     RIOT_API_KEY = snapshot.val().RIOT_API_KEY;
    // }, error => {
    //     alert("ERROR: " + error.code);
    // });

    getLatestVersion();

});

function checkSummonerIdInFirebase(region, name) {

    var regRef = summonerIdsRef.child(region);

    return regRef.once("value").then(snapshot => {
        if (snapshot.hasChild(name)) {
            return snapshot.child(name).val();
        }

        return null;
    });
}

function getSummonerDTO(region, name) {
    return $.ajax({
        type: "GET",
        url: `https://dkwuj1k34l.execute-api.us-east-2.amazonaws.com/rgapi/summoner/${region}/${name}`,
        success: response => {
            console.log(response);
            return response;
        }, error: err => {
            console.log("err", err.status);
            // TODO: SHOW INVALID SUMMONER NAME -- "name" not found
        }
    });
}

async function addSummonerIdToFirebase(region, name, id) {

    summonerIdsRef.child(region).child(name).set(id);
}

function showSummonerMetadata(summonerDTO) {
    name = summonerDTO.name;
    summonerIcon = summonerDTO.profileIconId;
    level = summonerDTO.summonerLevel;

    $("#dewoh-results").css("display", "block");
    $("#summoner-metadata").append(`<p>${name}, Level ${level} - icon: ${summonerIcon}</p>`);
    $("#summoner-metadata").append(`<img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${summonerIcon}.png"</img>`);
}

async function getSummonerId(region, name) {

    // var id = await checkSummonerIdInFirebase(region, name);

    // if (id) {
    //     return id;
    // }

    // // Not in firebase

    // Call API to find ID
    summonerDTO = await getSummonerDTO(region, name);

    showSummonerMetadata(summonerDTO);

    if (!summonerDTO) {
        console.log("summonerDTO dtected as null");
        return null;
    }

    id = summonerDTO.accountId;
    console.log("summonerDTO detected", id);

    // Add to database
    // addSummonerIdToFirebase(region, name, id);

    // Return id
    return id;

}

$("input").on("focus", function() {
    $(this).removeClass("invalid-input").attr("placeholder", "Summoner Name");
});

function transformSummonerName(name) {
    name = name.toLowerCase();
    name = name.split(" ").join("");

    return name;
}

$("#dewoh-btn").on("click", async () => {
    var region = $("#region").val();
    var name1 = transformSummonerName($("#sum1-txtbox").val());
    var name2 = transformSummonerName($("#sum2-txtbox").val());

    if (name1 === "") {
        console.log("name1 is blank");
        $("#sum1-txtbox").addClass("invalid-input").attr("placeholder", "Please enter a summoner name");
    }

    if (name2 === "") {
        console.log("name2 is blank");
        $("#sum2-txtbox").addClass("invalid-input").attr("placeholder", "Please enter a summoner name");
    }

    $("#summoner-metadata").empty();

    var id1 = await getSummonerId(region, name1);
    var id2 = await getSummonerId(region, name2);


    // console.log(sum1, sum2);
});
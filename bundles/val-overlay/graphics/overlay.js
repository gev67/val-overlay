const map1El = document.getElementById("map1");
const map2El = document.getElementById("map2");
const map3El = document.getElementById("map3");

const team1 = document.getElementById("team1");
const logo1 = document.getElementById("logo1");
const bestOf = document.getElementById("bestOf");
const logo2 = document.getElementById("logo2");
const team2 = document.getElementById("team2");

const defenderScore1 = document.getElementById("defender-score-1");
const attackerScore1 = document.getElementById("attacker-score-1");

const current = "CURRENT: ";
const next = "NEXT: ";
const decider = "DECIDER: ";
const mapsRepIndex = nodecg.Replicant("Maps");

mapsRepIndex.on("change", (newValue) => {
    let data = newValue;
    let mapCount = Number(data.map1Status) + Number(data.map2Status);

    switch(mapCount){
        case 0:
            map1El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map1.toUpperCase() + "&nbsp;" + `<img src="${data.map1Select.logo}" class="image">`;
            map2El.innerHTML = "<span class='map-name'>" + next + "</span>" + "&nbsp;" + data.map2.toUpperCase() + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
            map3El.innerHTML = "<span class='map-name'>" + decider + "</span>" + "&nbsp;" + data.map3.toUpperCase();
            break;
        case 1:
            map1El.innerHTML = "<span class='map-name'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + data.map1Score1 + "-" + data.map1Score2 + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
            map2El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map2.toUpperCase() + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
            map3El.innerHTML = "<span class='map-name'>" + decider + "</span>" + "&nbsp;" + data.map3.toUpperCase();
            break;
        case 2:
            map1El.innerHTML = "<span class='map-name'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + data.map1Score1 + "-" + data.map1Score2 + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
            map2El.innerHTML = "<span class='map-name'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Team1.logo}" class="image">` + "&nbsp;" + data.map2Score1 + "-" + data.map2Score2 + "&nbsp;" + `<img src="${data.map2Team2.logo}" class="image">`;
            map3El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map3.toUpperCase();
            break;
    }
});

const scoreRepIndex = nodecg.Replicant("score");
scoreRepIndex.on("change", (newValue) => {
    nodecg.log.info('overlay', newValue);
    let data = newValue;
    let defender = data.defender;
    let attacker = data.attacker;
    team1.innerHTML = defender.teamName.toUpperCase();
    logo1.innerHTML = `<img src="${data.defender.logo}" class="bigImage">`;
    bestOf.innerHTML = "BO" + data.bestOf;
    logo2.innerHTML = `<img src="${data.attacker.logo}" class="bigImage">`;
    team2.innerHTML = attacker.teamName.toUpperCase();

    let defenderScore = data.defenderScore;
    let attackerScore = data.attackerScore;

    if (defenderScore > 0) defenderScore1.hidden = false;
    else defenderScore1.hidden = true;

    if (attackerScore > 0) attackerScore1.hidden = false;
    else attackerScore1.hidden = true;
});
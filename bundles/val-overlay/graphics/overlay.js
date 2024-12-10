const map1El = document.getElementById("map1");
const map2El = document.getElementById("map2");
const map3El = document.getElementById("map3");

const team1 = document.getElementById("team1");
const logo1 = document.getElementById("logo1");
const bestOf = document.getElementById("bestOf");
const logo2 = document.getElementById("logo2");
const team2 = document.getElementById("team2");

const defenderOuter = document.getElementById("defender-outer");
const defenderInner = document.getElementById("defender-inner");
const attackerOuter = document.getElementById("attacker-outer");
const attackerInner = document.getElementById("attacker-inner");

const defenderScore1 = document.getElementById("defender-score-1");
const defenderScore2 = document.getElementById("defender-score-2");
const defenderScore3 = document.getElementById("defender-score-3");
const attackerScore1 = document.getElementById("attacker-score-1");
const attackerScore2 = document.getElementById("attacker-score-2");
const attackerScore3 = document.getElementById("attacker-score-3");

const current = "CURRENT: ";
const next = "NEXT: ";
const decider = "DECIDER: ";
const mapsRepIndex = nodecg.Replicant("Maps");

let actualBestOf = 3;

mapsRepIndex.on("change", (newValue) => {
    let data = newValue;
    let mapCount = Number(data.map1Status) + Number(data.map2Status) + Number(data.map3Status) + Number(data.map4Status);

    if (actualBestOf == 3) {
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
    } else if (actualBestOf == 5) {
        switch(mapCount){
            case 0:
                map1El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map1.toUpperCase() + "&nbsp;" + `<img src="${data.map1Select.logo}" class="image">`;
                map2El.innerHTML = "<span class='map-name'>" + next + "</span>" + "&nbsp;" + data.map2.toUpperCase() + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                map3El.innerHTML = "<span class='map-name'>" + next + "</span>" + "&nbsp;" + data.map3.toUpperCase() + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                break;
            case 1:
                map1El.innerHTML = "<span class='map-name'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + data.map1Score1 + "-" + data.map1Score2 + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
                map2El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map2.toUpperCase() + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                map3El.innerHTML = "<span class='map-name'>" + next + "</span>" + "&nbsp;" + data.map3.toUpperCase() + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                break;
            case 2:
                map1El.innerHTML = "<span class='map-name'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Team1.logo}" class="image">` + "&nbsp;" + data.map2Score1 + "-" + data.map2Score2 + "&nbsp;" + `<img src="${data.map2Team2.logo}" class="image">`;
                map2El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map3.toUpperCase() + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                map3El.innerHTML = "<span class='map-name'>" + next + "</span>" + "&nbsp;" + data.map4.toUpperCase() + "&nbsp;" + `<img src="${data.map4Select.logo}" class="image">`;
                break;
            case 3:
                map1El.innerHTML = "<span class='map-name'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Team1.logo}" class="image">` + "&nbsp;" + data.map3Score1 + "-" + data.map3Score2 + "&nbsp;" + `<img src="${data.map3Team2.logo}" class="image">`;
                map2El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map4.toUpperCase() + "&nbsp;" + `<img src="${data.map4Select.logo}" class="image">`;
                map3El.innerHTML = "<span class='map-name'>" + decider + "</span>" + "&nbsp;" + data.map5.toUpperCase();
                break;
            case 4:
                map1El.innerHTML = "<span class='map-name'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Team1.logo}" class="image">` + "&nbsp;" + data.map3Score1 + "-" + data.map3Score2 + "&nbsp;" + `<img src="${data.map3Team2.logo}" class="image">`;
                map2El.innerHTML = "<span class='map-name'>" + data.map4.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map4Team1.logo}" class="image">` + "&nbsp;" + data.map4Score1 + "-" + data.map4Score2 + "&nbsp;" + `<img src="${data.map4Team2.logo}" class="image">`;
                map3El.innerHTML = "<span class='map-name'>" + current + "</span>" + "&nbsp;" + data.map5.toUpperCase();
                break;
        }
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
    actualBestOf = data.bestOf;
    logo2.innerHTML = `<img src="${data.attacker.logo}" class="bigImage">`;
    team2.innerHTML = attacker.teamName.toUpperCase();

    if (actualBestOf == 3) {
        defenderOuter.hidden = true;
        defenderInner.hidden = true;
        attackerOuter.hidden = true;
        attackerInner.hidden = true;
    } else if (actualBestOf == 5) {
        defenderOuter.hidden = false;
        defenderInner.hidden = false;
        attackerOuter.hidden = false;
        attackerInner.hidden = false;
    }

    let defenderScore = data.defenderScore;
    let attackerScore = data.attackerScore;

    switch (defenderScore) {
        case "0":
            defenderScore1.hidden = true;
            defenderScore2.hidden = true;
            defenderScore3.hidden = true;
            break;
        case "1":
            defenderScore1.hidden = false;
            defenderScore2.hidden = true;
            defenderScore3.hidden = true;
            break;
        case "2":
            defenderScore1.hidden = false;
            defenderScore2.hidden = false;
            defenderScore3.hidden = true;
            break;
        case "3":
            defenderScore1.hidden = false;
            defenderScore2.hidden = false;
            defenderScore3.hidden = false;
            break;
    }

    switch (attackerScore) {
        case "0":
            attackerScore1.hidden = true;
            attackerScore2.hidden = true;
            attackerScore3.hidden = true;
            break;
        case "1":
            attackerScore1.hidden = false;
            attackerScore2.hidden = true;
            attackerScore3.hidden = true;
            break;
        case "2":
            attackerScore1.hidden = false;
            attackerScore2.hidden = false;
            attackerScore3.hidden = true;
            break;
        case "3":
            attackerScore1.hidden = false;
            attackerScore2.hidden = false;
            attackerScore3.hidden = false;
            break;
    }
});
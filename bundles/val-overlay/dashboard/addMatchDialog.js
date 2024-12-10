const matchOrder = document.getElementById("match-order");
const attackerTeam = document.getElementById("attacker-team");
const attackerScore = document.getElementById("attacker-score");
const defenderScore = document.getElementById("defender-score");
const defenderTeam = document.getElementById("defender-team");

const teamsRepDialog = nodecg.Replicant("teamsRep");

document.addEventListener("dialog-opened", function() {
    let teams = teamsRepDialog.value;

    if (!teams) teams = [];
    let teamsTemp = []

    attackerTeam.replaceChildren(new Option("", ""));
    defenderTeam.replaceChildren(new Option("", ""));

    for (var i = 0; i < teams.length; i++) {
        inserted = false;
        for (var j = 0; j < teamsTemp.length; j++) {
            if (teams[i]["teamName"].toUpperCase() < teamsTemp[j]["teamName"].toUpperCase()) {
                inserted = true;
                teamsTemp.splice(j, 0, teams[i]);
                break;
            }
        }
        if (!inserted) teamsTemp.push(teams[i]);
    }

    for (var i = 0; i < teamsTemp.length; i++) {
        let attackerOption = document.createElement("option");
        let defenderOption = document.createElement("option");

        attackerOption.text = teamsTemp[i].teamName;
        defenderOption.text = teamsTemp[i].teamName;
        attackerOption.value = teamsTemp[i].logo;
        defenderOption.value = teamsTemp[i].logo;

        attackerTeam.add(attackerOption);
        defenderTeam.add(defenderOption);
    }
});

document.addEventListener("dialog-confirmed", function() {
    if (matchOrder.value == "" || attackerTeam.value == "" || defenderTeam.value == "") {
        alert("Please complete all fields.");
        return;
    }

    const settingsMatchesRepDialog = nodecg.Replicant("settingsMatches");

    nodecg.log.info("settingsMatchesRepDialog.value", settingsMatchesRepDialog.value);

    let matchesArray = [];
    
    if (settingsMatchesRepDialog.value == undefined) {
        matchesArray = [];
    }  else {
        matchesArray = settingsMatchesRepDialog.value;
    }

    let newMatch = {
        matchOrder: matchOrder.value,
        attackerLogo: attackerTeam.value,
        attackerScore: attackerScore.value,
        defenderScore: defenderScore.value,
        defenderLogo: defenderTeam.value
    };

    matchesArray.push(newMatch);
    settingsMatchesRepDialog.value = matchesArray;
    matchOrder.value = "";
    attackerTeam.value = "";
    attackerScore.value = 0;
    defenderScore.value = 0;
    defenderTeam.value = "";
});

document.addEventListener("dialog-dismissed", function() {
    matchOrder.value = "";
    attackerTeam.value = "";
    attackerScore.value = 0;
    defenderScore.value = 0;
    defenderTeam.value = "";
});
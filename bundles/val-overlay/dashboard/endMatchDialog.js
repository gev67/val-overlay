const nextMatch = document.getElementById("next-match");

const endMatchMatchesRepDialog = nodecg.Replicant("settingsMatches");
const scoreRepEndMatch = nodecg.Replicant("score");
const selectedTeamsRepEndMatch = nodecg.Replicant("selectedTeams");

document.addEventListener("dialog-opened", function() {
    let matches = endMatchMatchesRepDialog.value;

    if (!matches) matches = [];

    nextMatch.replaceChildren(new Option("", ""));

    for (var i = 0; i < matches.length; i++) {
        if (matches[i].matchOrder == "upcoming") {
            let matchOption = document.createElement("option");
    
            let matchName = matches[i].attackerLogo.substring(30, matches[i].attackerLogo.length-4).replaceAll("%20"," ") + " vs. " + 
                matches[i].defenderLogo.substring(30, matches[i].defenderLogo.length-4).replaceAll("%20"," ");
    
            matchOption.text = matchName;
            matchOption.value = i;
    
            nextMatch.add(matchOption);
        }
    }
});

document.addEventListener("dialog-confirmed", function() {
    let matches = endMatchMatchesRepDialog.value;
    let nextMatchIndex = nextMatch.value;
    let currentMatchData = scoreRepEndMatch.value;
    let insertIndex = 0

    nodecg.log.info(currentMatchData);

    let newMatch = {
        matchOrder: "match results",
        attackerLogo: currentMatchData.attacker.logo,
        attackerScore: currentMatchData.attackerScore,
        defenderScore: currentMatchData.defenderScore,
        defenderLogo: currentMatchData.defender.logo
    };

    let newCurrentMatch = [
        {
            teamName: "",
            tricode: "",
            logo: ""
        },
        {
            teamName: "",
            tricode: "",
            logo: ""
        }
    ];

    let newCurrentScore = {
        attacker: {
            logo: "",
            teamName: "",
            tricode: ""
        },
        attackerScore: 0,
        bestOf: 3,
        defender: {
            logo: "",
            teamName: "",
            tricode: ""
        },
        defenderScore: 0
    }

    if (nextMatchIndex != "") {
        matches.splice(nextMatchIndex, 1);
        
        newCurrentMatch = [
            {
                teamName: matches[nextMatch.value].attackerLogo.substring(30, matches[nextMatch.value].attackerLogo.length-4).replaceAll("%20"," "),
                tricode: matches[nextMatch.value].attackerLogo.substring(30, matches[nextMatch.value].attackerLogo.length-4).replaceAll("%20"," "),
                logo: matches[nextMatch.value].attackerLogo
            },
            {
                teamName: matches[nextMatch.value].defenderLogo.substring(30, matches[nextMatch.value].defenderLogo.length-4).replaceAll("%20"," "),
                tricode: matches[nextMatch.value].defenderLogo.substring(30, matches[nextMatch.value].defenderLogo.length-4).replaceAll("%20"," "),
                logo: matches[nextMatch.value].defenderLogo
            }
        ];

        newCurrentScore = {
            attacker: {
                logo: matches[nextMatch.value].attackerLogo,
                teamName: matches[nextMatch.value].attackerLogo.substring(30, matches[nextMatch.value].attackerLogo.length-4).replaceAll("%20"," "),
                tricode: matches[nextMatch.value].attackerLogo.substring(30, matches[nextMatch.value].attackerLogo.length-4).replaceAll("%20"," ")
            },
            attackerScore: 0,
            bestOf: 3,
            defender: {
                logo: matches[nextMatch.value].defenderLogo,
                teamName: matches[nextMatch.value].defenderLogo.substring(30, matches[nextMatch.value].defenderLogo.length-4).replaceAll("%20"," "),
                tricode: matches[nextMatch.value].defenderLogo.substring(30, matches[nextMatch.value].defenderLogo.length-4).replaceAll("%20"," ")
            },
            defenderScore: 0
        }
    }
    selectedTeamsRepEndMatch.value = newCurrentMatch;
    scoreRepEndMatch.value = newCurrentScore;

    for (let i = 0; i < matches.length; i++) {
        if (matches[i].matchOrder == "match results") insertIndex++;
    }
    matches.splice(insertIndex,0,newMatch);

    endMatchMatchesRepDialog.value = matches;
});

document.addEventListener("dialog-dismissed", function() {
    nextMatch.value = "";
});
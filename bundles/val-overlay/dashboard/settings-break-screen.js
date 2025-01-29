const addedMatchesList = document.getElementById("added-matches");
const currentMatch = document.getElementById("current-match");
const otherMatches = document.getElementById("other-matches");
const addMatchButton = document.getElementById("add-match-button");

const attackerLogo = document.getElementById("team-one-logo");
const attackerScore = document.getElementById("team-one-score");
const defenderScore = document.getElementById("team-two-score");
const defenderLogo = document.getElementById("team-two-logo");

let settingsScoreRep = nodecg.Replicant("score");
let settingsMatchesRep = nodecg.Replicant("settingsMatches");

settingsScoreRep.on("change", () => {
    if (settingsScoreRep != undefined) {
        let currentScore = settingsScoreRep.value;

        attackerLogo.src = currentScore.attacker.logo;
        defenderLogo.src = currentScore.defender.logo;

        if (currentScore.attacker.logo == "" || currentScore.defender.logo == "") {
            currentMatch.style.display = "none";
        } else {
            currentMatch.style.display = "flex";
        }

        attackerScore.innerHTML = currentScore.attackerScore;
        defenderScore.innerHTML = currentScore.defenderScore;
    }
});

settingsMatchesRep.on("change", () => {
    if (settingsMatchesRep.value != undefined) {
        let matches = settingsMatchesRep.value;

        addedMatchesList.replaceChildren()

        if (matches.length == 0) {
            otherMatches.hidden = true;
            addMatchButton.hidden = false;
        } else if (matches.length < 3) {
            otherMatches.hidden = false;
            addMatchButton.hidden = false;
        } else {
            otherMatches.hidden = false;
            addMatchButton.hidden = true;
        }

        for (let i = 0; i < matches.length; i++) {
            if (matches[i].matchOrder == "match results") addMatch(matches[i], i);
        }
        for (let i = 0; i < matches.length; i++) {
            if (matches[i].matchOrder == "upcoming") addMatch(matches[i], i+5);
        }
    } else {
        otherMatches.hidden = true;
    }
});

function addMatch(match, i) {
    let li = document.createElement("li");
    let lidiv = document.createElement("div");
    let scorediv = document.createElement("div");
    let typediv = document.createElement("div");
    let buttondiv = document.createElement("div");

    li.className = "li-match";
    lidiv.className = "frow";
    scorediv.className = "score-row ";
    typediv.className = "score-row ";
    buttondiv.className = "score-row ";

    typediv.style.width = "50px";
    buttondiv.style.width = "50px";

    if (match.matchOrder == "match results") {
        typediv.innerHTML = "Prev";
    } else if (match.matchOrder == "upcoming") {
        typediv.innerHTML = "Next";
    }

    let attackerLogodiv = document.createElement("div");
    let attackerLog = document.createElement("img");
    attackerLog.className = "logo ";
    attackerLog.src = match.attackerLogo;
    attackerLogodiv.appendChild(attackerLog);
    scorediv.appendChild(attackerLogodiv);

    let scoreText = "\xa0" + match.attackerScore + "\xa0-\xa0" + match.defenderScore + "\xa0";

    scorediv.innerHTML += scoreText;

    let defenderLogodiv = document.createElement("div");
    let defenderLog = document.createElement("img");
    defenderLog.className = "logo ";
    defenderLog.src = match.defenderLogo;
    defenderLogodiv.appendChild(defenderLog);
    scorediv.appendChild(defenderLogodiv);

    let deletediv = document.createElement("div");
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn");
    
    let deleteButtonI = document.createElement("i");

    deleteButton.id = match.attackerLogo + match.defenderLogo;
    deleteButton.className = "button-remove";
    deleteButtonI.className = "fa fa-trash";
    deleteButton.appendChild(deleteButtonI);
    deletediv.appendChild(deleteButton).addEventListener("click", removeItem);
    buttondiv.appendChild(deletediv);
    lidiv.appendChild(typediv);
    lidiv.appendChild(scorediv);
    lidiv.appendChild(buttondiv);
    li.appendChild(lidiv);
    addedMatchesList.appendChild(li);
}

function removeItem() {
    let matchId = this.id;
    let matches = settingsMatchesRep.value;
    let index = -1;

    for (let i = 0; i < matches.length; i++) {
        let id = matches[i].attackerLogo + matches[i].defenderLogo;
        if (id == matchId) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        matches.splice(index, 1);
        settingsMatchesRep.value = matches;
    }
}
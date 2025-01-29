const matchesDiv = document.getElementById("matches-div");

let breakScoreRep = nodecg.Replicant("score");
let breakMatchesRep = nodecg.Replicant("settingsMatches");

let scoreReady = false;
let matchesReady = false;

breakScoreRep.on("change", () => {
    scoreReady = true;
    if (scoreReady && matchesReady) {
        updateMatches()
    }
});

breakMatchesRep.on("change", () => {
    matchesReady = true;
    if (scoreReady && matchesReady) {
        updateMatches()
    }
});

function updateMatches() {
    matchesDiv.replaceChildren();

    if (breakMatchesRep.value != undefined) {
        let otherMatches = breakMatchesRep.value;
        for (let i = 0; i < otherMatches.length; i++) {
            if (otherMatches[i].matchOrder == "match results") {
                let score = otherMatches[i].attackerScore + " - " + otherMatches[i].defenderScore;
                addMatch(otherMatches[i].matchOrder.toUpperCase(), otherMatches[i].attackerLogo, otherMatches[i].defenderLogo, score);
            }
        }
    }

    if (breakScoreRep.value != undefined) {
        let currentMatch = breakScoreRep.value;
        if (currentMatch.attacker.teamName != "" && currentMatch.defender.teamName != "") {
            let score = currentMatch.attackerScore + " - " + currentMatch.defenderScore;
            addMatch("CURRENT", currentMatch.attacker.logo, currentMatch.defender.logo, score);
        }
    }

    if (breakMatchesRep.value != undefined) {
        let otherMatches = breakMatchesRep.value;
        for (let i = 0; i < otherMatches.length; i++) {
            if (otherMatches[i].matchOrder == "upcoming") {
                addMatch(otherMatches[i].matchOrder.toUpperCase(), otherMatches[i].attackerLogo, otherMatches[i].defenderLogo);
            }
        }
    }
}

function addMatch(matchType, attackerLogo, defenderLogo, score = "") {
    let matchDiv = document.createElement("div");
    let typeEl = document.createElement("div");
    let logosDiv = document.createElement("div");
    let attackerLogoEl = document.createElement("img");
    let vs = document.createElement("div");
    let defenderLogoEl = document.createElement("img");
    let scoreEl = document.createElement("div");

    matchDiv.className = "match-div";
    typeEl.className = "status";
    logosDiv.className = "logos-div";
    attackerLogoEl.className = "logo";
    vs.className = "vs";
    defenderLogoEl.className = "logo";
    scoreEl.className = "score";

    typeEl.innerHTML = matchType.toUpperCase();
    attackerLogoEl.src = attackerLogo;
    vs.innerHTML = "VS";
    defenderLogoEl.src = defenderLogo;
    scoreEl.innerHTML = score;

    logosDiv.appendChild(attackerLogoEl);
    logosDiv.appendChild(vs);
    logosDiv.appendChild(defenderLogoEl);

    matchDiv.appendChild(typeEl);
    matchDiv.appendChild(logosDiv);
    matchDiv.appendChild(scoreEl);

    matchesDiv.appendChild(matchDiv);

    nodecg.log.info("Added match: ", matchType, attackerLogo, defenderLogo, score);
}
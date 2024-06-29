const teamName = document.getElementById("teamName");
const teamAbbreviation = document.getElementById("teamAbbreviation");

const teamsRepDialog = nodecg.Replicant("teamsRep");
const teamLogosRepDialog = nodecg.Replicant("assets:teamLogos");

document.addEventListener("dialog-opened", function() {
    let teamLogos = teamLogosRepDialog.value;
    let teams = teamsRepDialog.value;

    if (!teams) teams = [];
    let dropdownPopTemp = [];
    let dropdownPop = [];

    for(let i = 0; i < teamLogos.length; i++){
        let teamExists = false;
        for(let j = 0; j < teams.length; j++)
            if (teamLogos[i]["name"] === teams[j].tricode) {
            nodecg.log.info("dialog", "team found");
            teamExists = true;
            break;
        }
        if (!teamExists) dropdownPopTemp.push(teamLogos[i]["name"]);
    }

    nodecg.log.info("addTeamDialog", dropdownPopTemp);

    teamAbbreviation.replaceChildren();
    teamAbbreviation.appendChild(new Option("", ""));

    for (var i = 0; i < dropdownPopTemp.length; i++) {
        inserted = false;
        for (var j = 0; j < dropdownPop.length; j++) {
            if (dropdownPopTemp[i].toUpperCase() < dropdownPop[j].toUpperCase()) {
                inserted = true;
                dropdownPop.splice(j, 0, dropdownPopTemp[i]);
                break;
            }
        }
        if (!inserted) dropdownPop.push(dropdownPopTemp[i]);
    }

    nodecg.log.info("addTeamDialog", dropdownPop);

    for (let team in dropdownPop) {
        let option = document.createElement("option");
        option.text = dropdownPop[team];
        option.value = dropdownPop[team];
        teamAbbreviation.add(option);
    }
});

document.addEventListener("dialog-confirmed", function() {
    if (teamName.value == "" || teamAbbreviation.value == "") {
        alert("Please fill all fields.");
        return;
    }

    const teamLogosRep = nodecg.Replicant("assets:teamLogos");
    let teamLogos = teamLogosRep.value;
    let teamLogo = "";
    let teamLogoExist = false;

    for (let i = 0; i < teamLogos.length; i++) {
        if (teamAbbreviation.value == teamLogos[i]["name"]) {
            teamLogo = teamLogos[i]["url"];
            teamLogoExist = true;
            break;
        }
    }

    if (!teamLogoExist) {
        alert("Please upload a logo with a matching tricode first.");
        return;
    }

    const teamsRep = nodecg.Replicant("teamsRep");
    let teamsArray = teamsRep.value;
    let newTeam = {
        tricode: teamAbbreviation.value,
        teamName: teamName.value,
        logo: teamLogo
    };

    teamsArray.push(newTeam);
    teamsRep.value = teamsArray;
    teamName.value = "";
    teamAbbreviation.value = "";
});

document.addEventListener("dialog-dismissed", function() {
    teamName.value = "";
    teamAbbreviation.value = "";
});
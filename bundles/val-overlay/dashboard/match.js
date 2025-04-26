const dropdown1 = document.getElementById("team1");
const dropdown2 = document.getElementById("team2");

const teamLogo1 = document.getElementById("teamLogo1");
const teamLogo2 = document.getElementById("teamLogo2");

const bestOfThree = document.getElementById("bestOfThree");
const bestOfFive = document.getElementById("bestOfFive");

const defender = document.getElementById("defender");
const defenderScore = document.getElementById("defenderScore");
const attacker = document.getElementById("attacker");
const attackerScore = document.getElementById("attackerScore");

const map1 = document.getElementById("map1");
const map1Select = document.getElementById("map1Select");
const map1Status = document.getElementById("map1Status");
const map1Team1 = document.getElementById("map1Team1");
const map1Score1 = document.getElementById("map1Score1");
const map1Score1Up = document.getElementById("map1Score1Up");
const map1Score1Down = document.getElementById("map1Score1Down");
const map1Score2 = document.getElementById("map1Score2");
const map1Score2Up = document.getElementById("map1Score2Up");
const map1Score2Down = document.getElementById("map1Score2Down");
const map1Team2 = document.getElementById("map1Team2");

const map2 = document.getElementById("map2");
const map2Select = document.getElementById("map2Select");
const map2Status = document.getElementById("map2Status");
const map2Team1 = document.getElementById("map2Team1");
const map2Score1 = document.getElementById("map2Score1");
const map2Score1Up = document.getElementById("map2Score1Up");
const map2Score1Down = document.getElementById("map2Score1Down");
const map2Score2 = document.getElementById("map2Score2");
const map2Score2Up = document.getElementById("map2Score2Up");
const map2Score2Down = document.getElementById("map2Score2Down");
const map2Team2 = document.getElementById("map2Team2");

const map3el1 = document.getElementById("map3el1");
const map3el2 = document.getElementById("map3el2");
const map3el3 = document.getElementById("map3el3");
const map3el4 = document.getElementById("map3el4");
const map3el5 = document.getElementById("map3el5");
const map3el6 = document.getElementById("map3el6");
const map3 = document.getElementById("map3");
const map3Select = document.getElementById("map3Select");
const map3Status = document.getElementById("map3Status");
const map3Team1 = document.getElementById("map3Team1");
const map3Score1 = document.getElementById("map3Score1");
const map3Score1Up = document.getElementById("map3Score1Up");
const map3Score1Down = document.getElementById("map3Score1Down");
const map3Score2 = document.getElementById("map3Score2");
const map3Score2Up = document.getElementById("map3Score2Up");
const map3Score2Down = document.getElementById("map3Score2Down");
const map3Team2 = document.getElementById("map3Team2");

const map4row = document.getElementById("map4row");
const map4 = document.getElementById("map4");
const map4Select = document.getElementById("map4Select");
const map4Status = document.getElementById("map4Status");
const map4Team1 = document.getElementById("map4Team1");
const map4Score1 = document.getElementById("map4Score1");
const map4Score1Up = document.getElementById("map4Score1Up");
const map4Score1Down = document.getElementById("map4Score1Down");
const map4Score2 = document.getElementById("map4Score2");
const map4Score2Up = document.getElementById("map4Score2Up");
const map4Score2Down = document.getElementById("map4Score2Down");
const map4Team2 = document.getElementById("map4Team2");

const map5row = document.getElementById("map5row");
const map5 = document.getElementById("map5");

const timeoutStatus = document.getElementById("timeoutStatus");
const techStatus = document.getElementById("techStatus");

let teamsRepMatch = nodecg.Replicant("teamsRep");
let selectedTeamsRepMatch = nodecg.Replicant("selectedTeams");
let settingsMapsRepMatch = nodecg.Replicant("settingsMapsRep");
let selectedTeamsRepMatchValue;
let scoreRepMatch = nodecg.Replicant("score");
let mapsRepMatch = nodecg.Replicant("Maps");
let pausesRepMatch = nodecg.Replicant("pauseRep");

let scoreRepInit = false;
let mapsRepInit = false;

scoreRepMatch.on("change", () => {
    let savedData = scoreRepMatch.value;
    if (!scoreRepInit) {

        if (scoreRepMatch.value.bestOf == 3) {
            bestOfFive.checked = false;
            bestOfThree.checked = true;
            defenderScore.setAttribute("max", 2);
            attackerScore.setAttribute("max", 2);

            map3el1.hidden = true;
            map3el2.hidden = true;
            map3el3.hidden = true;
            map3el4.hidden = true;
            map3el5.hidden = true;
            map3el6.hidden = true;

            map4row.hidden = true;
            map5row.hidden = true;
        } else if (scoreRepMatch.value.bestOf == 5) {
            bestOfThree.checked = false;
            bestOfFive.checked = true;
            defenderScore.setAttribute("max", 3);
            attackerScore.setAttribute("max", 3);

            map3el1.hidden = false;
            map3el2.hidden = false;
            map3el3.hidden = false;
            map3el4.hidden = false;
            map3el5.hidden = false;
            map3el6.hidden = false;

            map4row.hidden = false;
            map5row.hidden = false;
        }

        NodeCG.waitForReplicants(selectedTeamsRepMatch).then(() => {
            for (var i = 0; i < defender.length; i++) {
                if (defender[i].innerHTML === savedData.defender.teamName) {
                    defender.selectedIndex = i;
                    break;
                }
            }
    
            if (savedData.defenderScore != "") defenderScore.value = savedData.defenderScore;
            
            for (var i = 0; i < attacker.length; i++) {
                if (attacker[i].innerHTML === savedData.attacker.teamName) {
                    attacker.selectedIndex = i;
                    break;
                }
            }
    
            if (savedData.attackerScore != "") attackerScore.value = savedData.attackerScore;
        });
        
        scoreRepInit = true;
    } else {
        defenderScore.value = scoreRepMatch.value.defenderScore ? scoreRepMatch.value.defenderScore : 0;
        attackerScore.value = scoreRepMatch.value.attackerScore ? scoreRepMatch.value.attackerScore : 0;
    }

    NodeCG.waitForReplicants(selectedTeamsRepMatch).then(() => {
        for (var i = 0; i < defender.length; i++) {
            if (defender[i].innerHTML === savedData.defender.teamName) {
                defender.selectedIndex = i;
                break;
            }
        }

        if (savedData.defenderScore != "") defenderScore.value = savedData.defenderScore;
        
        for (var i = 0; i < attacker.length; i++) {
            if (attacker[i].innerHTML === savedData.attacker.teamName) {
                attacker.selectedIndex = i;
                break;
            }
        }

        if (savedData.attackerScore != "") attackerScore.value = savedData.attackerScore;
    });
});

mapsRepMatch.on("change", () => {
    if (!mapsRepInit) {
        let savedData = mapsRepMatch.value;
        let tempData = {
            map1: "",
            map1Select: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map1Status: false,
            map1Team1: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map1Score1: "0",
            map1Team2: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map1Score2: "0",
            map2: "",
            map2Select: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map2Status: false,
            map2Team1: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map2Score1: "0",
            map2Team2: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map2Score2: "0",
            map3: "",
            map3Select: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map3Status: false,
            map3Team1: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map3Score1: "0",
            map3Team2: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map3Score2: "0",
            map4: "",
            map4Select: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map4Status: false,
            map4Team1: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map4Score1: "0",
            map4Team2: {
                tricode: "",
                teamName: "",
                logo: ""
            },
            map4Score2: "0",
            map5: ""
        };

        if (savedData === undefined) savedData = tempData;

        else {
            if (savedData.map1) tempData.map1 = savedData.map1;
            if (savedData.map1Select) tempData.map1Select = savedData.map1Select;
            if (savedData.map1Status) tempData.map1Status = savedData.map1Status;
            if (savedData.map1Team1) tempData.map1Team1 = savedData.map1Team1;
            if (savedData.map1Score1) tempData.map1Score1 = savedData.map1Score1;
            if (savedData.map1Score2) tempData.map1Score2 = savedData.map1Score2;
            if (savedData.map1Team2) tempData.map1Team2 = savedData.map1Team2;
            if (savedData.map2) tempData.map2 = savedData.map2;
            if (savedData.map2Select) tempData.map2Select = savedData.map2Select;
            if (savedData.map2Status) tempData.map2Status = savedData.map2Status;
            if (savedData.map2Team1) tempData.map2Team1 = savedData.map2Team1;
            if (savedData.map2Score1) tempData.map2Score1 = savedData.map2Score1;
            if (savedData.map2Score2) tempData.map2Score2 = savedData.map2Score2;
            if (savedData.map2Team2) tempData.map2Team2 = savedData.map2Team2;
            if (savedData.map3) tempData.map3 = savedData.map3;
            if (savedData.map3Select) tempData.map3Select = savedData.map3Select;
            if (savedData.map3Status) tempData.map3Status = savedData.map3Status;
            if (savedData.map3Team1) tempData.map3Team1 = savedData.map3Team1;
            if (savedData.map3Score1) tempData.map3Score1 = savedData.map3Score1;
            if (savedData.map3Score2) tempData.map3Score2 = savedData.map3Score2;
            if (savedData.map3Team2) tempData.map3Team2 = savedData.map3Team2;
            if (savedData.map4) tempData.map4 = savedData.map4;
            if (savedData.map4Select) tempData.map4Select = savedData.map4Select;
            if (savedData.map4Status) tempData.map4Status = savedData.map4Status;
            if (savedData.map4Team1) tempData.map4Team1 = savedData.map4Team1;
            if (savedData.map4Score1) tempData.map4Score1 = savedData.map4Score1;
            if (savedData.map4Score2) tempData.map4Score2 = savedData.map4Score2;
            if (savedData.map4Team2) tempData.map4Team2 = savedData.map4Team2;
            if (savedData.map5) tempData.map5 = savedData.map5;
            savedData = tempData;
        }

        for (let i = 0; i < 8; i++){
            if (savedData.map1 == map1.options[i].text) map1.selectedIndex = i;
            if (savedData.map2 == map2.options[i].text) map2.selectedIndex = i;
            if (savedData.map3 == map3.options[i].text) map3.selectedIndex = i;
            if (savedData.map4 == map4.options[i].text) map4.selectedIndex = i;
            if (savedData.map5 == map5.options[i].text) map5.selectedIndex = i;
        }

        for (let i = 0; i < map1Select.options.length; i++){
            if (savedData.map1Select.teamName == map1Select.options[i].text) map1Select.selectedIndex = i;
            if (savedData.map1Team1.teamName == map1Team1.options[i].text) map1Team1.selectedIndex = i;
            if (savedData.map1Team2.teamName == map1Team2.options[i].text) map1Team2.selectedIndex = i;
            if (savedData.map2Select.teamName == map2Select.options[i].text) map2Select.selectedIndex = i;
            if (savedData.map2Team1.teamName == map2Team1.options[i].text) map2Team1.selectedIndex = i;
            if (savedData.map2Team2.teamName == map2Team2.options[i].text) map2Team2.selectedIndex = i;
            if (savedData.map3Select.teamName == map3Select.options[i].text) map3Select.selectedIndex = i;
            if (savedData.map3Team1.teamName == map3Team1.options[i].text) map3Team1.selectedIndex = i;
            if (savedData.map3Team2.teamName == map3Team2.options[i].text) map3Team2.selectedIndex = i;
            if (savedData.map4Select.teamName == map4Select.options[i].text) map4Select.selectedIndex = i;
            if (savedData.map4Team1.teamName == map4Team1.options[i].text) map4Team1.selectedIndex = i;
            if (savedData.map4Team2.teamName == map4Team2.options[i].text) map4Team2.selectedIndex = i;
        }

        if (savedData.map1Status) {
            map1Status.checked = true;
            map1Score1.disabled = false;
            map1Score1Up.disabled = false;
            map1Score1Down.disabled = false;
            map1Score2.disabled = false;
            map1Score2Up.disabled = false;
            map1Score2Down.disabled = false;
        } else map1Status.checked = false;

        if (savedData.map1Score1 != undefined) map1Score1.value = savedData.map1Score1;
        else map1Score1.value = "0";

        if (savedData.map1Score2 != undefined) map1Score2.value = savedData.map1Score2;
        else map1Score2.value = "0";

        if (savedData.map2Status) {
            map2Status.checked = true;
            map2Score1.disabled = false;
            map2Score1Up.disabled = false;
            map2Score1Down.disabled = false;
            map2Score2.disabled = false;
            map2Score2Up.disabled = false;
            map2Score2Down.disabled = false;
        } else map2Status.checked = false;

        if (savedData.map2Score1 != undefined) map2Score1.value = savedData.map2Score1;
        else map2Score1.value = "0";

        if (savedData.map2Score2 != undefined) map2Score2.value = savedData.map2Score2;
        else map2Score2.value = "0";

        if (savedData.map3Status) {
            map3Status.checked = true;
            map3Score1.disabled = false;
            map3Score1Up.disabled = false;
            map3Score1Down.disabled = false;
            map3Score2.disabled = false;
            map3Score2Up.disabled = false;
            map3Score2Down.disabled = false;
        } else map3Status.checked = false;

        if (savedData.map3Score1 != undefined) map3Score1.value = savedData.map3Score1;
        else map3Score1.value = "0";

        if (savedData.map3Score2 != undefined) map3Score2.value = savedData.map3Score2;
        else map3Score2.value = "0";

        if (savedData.map4Status) {
            map4Status.checked = true;
            map4Score1.disabled = false;
            map4Score1Up.disabled = false;
            map4Score1Down.disabled = false;
            map4Score2.disabled = false;
            map4Score2Up.disabled = false;
            map4Score2Down.disabled = false;
        } else map4Status.checked = false;

        if (savedData.map4Score1 != undefined) map4Score1.value = savedData.map4Score1;
        else map4Score1.value = "0";

        if (savedData.map4Score2 != undefined) map4Score2.value = savedData.map4Score2;
        else map4Score2.value = "0";

        mapsRepInit = true;
        mapsRepMatch.value = savedData;
    }
});

teamsRepMatch.on("change", (newValue) => {
    let input = newValue;
    var teams = [];
    var inserted;

    if (dropdown1.selectedIndex != 0 || dropdown2.selectedIndex != 0) {
        let teamsFound = 0;

        if (dropdown1.selectedIndex === 0) teamsFound++;
        if (dropdown2.selectedIndex === 0) teamsFound++;

        for (let i = 0; i < input.length; i++){
            if (dropdown1.options[dropdown1.selectedIndex].value === input[i].tricode) teamsFound++;
            if (dropdown2.options[dropdown2.selectedIndex].value === input[i].tricode) teamsFound++;
        }
        
        if (teamsFound < 2) {
            resetTeams();
            return;
        }
    }

    for (var i = 0, ii = input.length; i < ii; i++){
        inserted = false;

        for (var j = 0; j < teams.length; j++) {
            if (input[i].teamName.toUpperCase() < teams[j].teamName.toUpperCase()) {
                inserted = true;
                teams.splice(j, 0, input[i]);
                break;
            }
        }

        if (!inserted) teams.push(input[i]);
    }

    dropdown1.replaceChildren();
    dropdown2.replaceChildren();
    dropdown1.appendChild(new Option(""));
    dropdown2.appendChild(new Option(""));

    for (let i = 0; i < teams.length; i++){
        let option1 = document.createElement("option");
        option1.text = teams[i].teamName;
        option1.value = teams[i].tricode;
        option1.id = "team" + i;
        dropdown1.add(option1);

        let option2 = document.createElement("option");
        option2.text = teams[i].teamName;
        option2.value = teams[i].tricode;
        dropdown2.add(option2);
    }
});

selectedTeamsRepMatch.on("change", (newValue) => {
    resetMaps();

    let data = newValue;
    let team1 = data[0];
    let team2 = data[1];

    if (team1.teamName == "") dropdown1.selectedIndex = 0;
    if (team2.teamName == "") dropdown2.selectedIndex = 0;

    for (var i = 0; i < dropdown1.length; i++) {
        if (dropdown1[i].innerHTML === team1.teamName) {
            dropdown1.selectedIndex = i;
            teamLogo1.replaceChildren();

            let logodiv = document.createElement("div");
            logodiv.style.width = "170px";
            logodiv.style.height = "170px";
            logodiv.style.padding = "10px 0px 0px 0px";
            logodiv.style.alignSelf = "center";

            let logo = document.createElement("img");
            logo.style.maxWidth = "170px";
            logo.style.maxHeight = "170px";

            logodiv.appendChild(logo);
            logo.src = team1.logo;
            teamLogo1.appendChild(logodiv);
        }

        if (dropdown2[i].innerHTML === team2.teamName) {
            dropdown2.selectedIndex = i;
            teamLogo2.replaceChildren();

            let logodiv = document.createElement("div");
            logodiv.style.width = "170px";
            logodiv.style.height = "170px";
            logodiv.style.padding = "10px 0px 0px 0px";
            logodiv.style.alignSelf = "center";

            let logo = document.createElement("img");
            logo.style.maxWidth = "170px";
            logo.style.maxHeight = "170px";

            logodiv.appendChild(logo);
            logo.src = team2.logo;
            teamLogo2.appendChild(logodiv);
        }
    }

    defender.replaceChildren(new Option(""));
    attacker.replaceChildren(new Option(""));
    map1Select.replaceChildren(new Option(""));
    map1Team1.replaceChildren(new Option(""));
    map1Team2.replaceChildren(new Option(""));
    map2Select.replaceChildren(new Option(""));
    map2Team1.replaceChildren(new Option(""));
    map2Team2.replaceChildren(new Option(""));
    map3Select.replaceChildren(new Option(""));
    map3Team1.replaceChildren(new Option(""));
    map3Team2.replaceChildren(new Option(""));
    map4Select.replaceChildren(new Option(""));
    map4Team1.replaceChildren(new Option(""));
    map4Team2.replaceChildren(new Option(""));

    if (team1.teamName) {
        let attackerTeam1 = new Option(team1.teamName, team1.tricode);
        let defenderTeam1 = new Option(team1.teamName, team1.tricode);
        let map1SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map1Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map1Team2Team1 = new Option(team1.teamName, team1.tricode);
        let map2SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map2Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map2Team2Team1 = new Option(team1.teamName, team1.tricode);
        let map3SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map3Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map3Team2Team1 = new Option(team1.teamName, team1.tricode);
        let map4SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map4Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map4Team2Team1 = new Option(team1.teamName, team1.tricode);

        attacker.appendChild(attackerTeam1);
        defender.appendChild(defenderTeam1);
        map1Select.appendChild(map1SelectTeam1);
        map1Team1.appendChild(map1Team1Team1);
        map1Team2.appendChild(map1Team2Team1);
        map2Select.appendChild(map2SelectTeam1);
        map2Team1.appendChild(map2Team1Team1);
        map2Team2.appendChild(map2Team2Team1);
        map3Select.appendChild(map3SelectTeam1);
        map3Team1.appendChild(map3Team1Team1);
        map3Team2.appendChild(map3Team2Team1);
        map4Select.appendChild(map4SelectTeam1);
        map4Team1.appendChild(map4Team1Team1);
        map4Team2.appendChild(map4Team2Team1);
    }

    if (team2.teamName) {
        let defenderTeam2 = new Option(team2.teamName, team2.tricode);
        let attackerTeam2 = new Option(team2.teamName, team2.tricode);
        let map1SelectTeam2 = new Option(team2.teamName, team2.tricode);
        let map1Team1Team2 = new Option(team2.teamName, team2.tricode);
        let map1Team2Team2 = new Option(team2.teamName, team2.tricode);
        let map2SelectTeam2 = new Option(team2.teamName, team2.tricode);
        let map2Team1Team2 = new Option(team2.teamName, team2.tricode);
        let map2Team2Team2 = new Option(team2.teamName, team2.tricode);
        let map3SelectTeam2 = new Option(team2.teamName, team2.tricode);
        let map3Team1Team2 = new Option(team2.teamName, team2.tricode);
        let map3Team2Team2 = new Option(team2.teamName, team2.tricode);
        let map4SelectTeam2 = new Option(team2.teamName, team2.tricode);
        let map4Team1Team2 = new Option(team2.teamName, team2.tricode);
        let map4Team2Team2 = new Option(team2.teamName, team2.tricode);

        attacker.appendChild(attackerTeam2);
        defender.appendChild(defenderTeam2);
        map1Select.appendChild(map1SelectTeam2);
        map1Team1.appendChild(map1Team1Team2);
        map1Team2.appendChild(map1Team2Team2);
        map2Select.appendChild(map2SelectTeam2);
        map2Team1.appendChild(map2Team1Team2);
        map2Team2.appendChild(map2Team2Team2);
        map3Select.appendChild(map3SelectTeam2);
        map3Team1.appendChild(map3Team1Team2);
        map3Team2.appendChild(map3Team2Team2);
        map4Select.appendChild(map4SelectTeam2);
        map4Team1.appendChild(map4Team1Team2);
        map4Team2.appendChild(map4Team2Team2);
    }

    selectedTeamsRepMatchValue = selectedTeamsRepMatch.value;
});

settingsMapsRepMatch.on("change", () => {
    let maps = settingsMapsRepMatch.value;
    if (maps == undefined) maps = [];

    let sortedMaps = maps.map((x) => x);
    sortedMaps.sort();

    let mapDropdowns = [map1, map2, map3, map4, map5];

    for (let i = 0; i < mapDropdowns.length; i++) {
        mapDropdowns[i].replaceChildren();
        let emptyMapOption = document.createElement("option");
        emptyMapOption.value = "";
        emptyMapOption.innerHTML = "";
        
        mapDropdowns[i].appendChild(emptyMapOption);

        for (let j = 0; j < sortedMaps.length; j++) {
            let mapOption = document.createElement("option");
            mapOption.value = sortedMaps[j];
            mapOption.innerHTML = sortedMaps[j];
            
            mapDropdowns[i].appendChild(mapOption);
        }

        mapDropdowns[i].selectedIndex = 0;
    }
});

pausesRepMatch.on("change", () => {
    let data = pausesRepMatch.value;
    nodecg.log.info(data);
    if (data == undefined) {
        data = {};
        data.timeoutStatus = false;
        data.techStatus = false;
    }
    timeoutStatus.checked = data.timeoutStatus;
    techStatus.checked = data.techStatus;
});

function teamChange(num) {
    let data = [
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

    if (selectedTeamsRepMatch.value) data = selectedTeamsRepMatch.value;

    let teamArray = teamsRepMatch.value;
    let team;
    let logodiv = document.createElement("div");

    logodiv.style.width = "170px";
    logodiv.style.height = "170px";
    logodiv.style.padding = "10px 0px 0px 0px";
    logodiv.style.alignSelf = "center";

    let logo = document.createElement("img");
    logo.style.maxWidth = "170px";
    logo.style.maxHeight = "170px";
    logodiv.appendChild(logo);

    switch(num){
        case 1:
            teamLogo1.replaceChildren();
            var value = dropdown1.value;
            if (value === "") data[0] = {
                teamName: "",
                tricode: "",
                logo: ""
            };
            else {
                team = teamArray.filter((obj)=>{
                    return obj.tricode === value;
                });
                data[0] = team[0];
                logo.src = team[0].logo;
                teamLogo1.appendChild(logodiv);
            }
            break;
        case 2:
            teamLogo2.replaceChildren();
            var value = dropdown2.value;
            if (value === "") data[1] = {
                teamName: "",
                tricode: "",
                logo: ""
            };
            else {
                team = teamArray.filter((obj)=>{
                    return obj.tricode === value;
                });
                data[1] = team[0];
                logo.src = team[0].logo;
                teamLogo2.appendChild(logodiv);
            }
            break;
    }

    resetScore();
    resetMaps();
    resetPauseStatus();

    if (dropdown1.selectedIndex === dropdown2.selectedIndex) toast("You have selected the same map twice!");
    selectedTeamsRepMatch.value = data;
}

function resetTeams() {
    resetScore();
    resetMaps();
    resetPauseStatus();
    let data = [
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

    dropdown1.selectedIndex = 0;
    dropdown2.selectedIndex = 0;
    teamLogo1.replaceChildren();
    teamLogo2.replaceChildren();
    selectedTeamsRepMatch.value = data;
}

function changeBestOf(bestOf) {
    let data = scoreRepMatch.value;
    data.bestOf = String(bestOf);
    data.defenderScore = 0;
    data.attackerScore = 0;

    if (bestOf == 3) {
        defenderScore.setAttribute("max", 2);
        attackerScore.setAttribute("max", 2);

        map3el1.hidden = true;
        map3el2.hidden = true;
        map3el3.hidden = true;
        map3el4.hidden = true;
        map3el5.hidden = true;
        map3el6.hidden = true;
        
        map4row.hidden = true;
        map5row.hidden = true;
    } else if (bestOf == 5) {
        defenderScore.setAttribute("max", 3);
        attackerScore.setAttribute("max", 3);

        map3el1.hidden = false;
        map3el2.hidden = false;
        map3el3.hidden = false;
        map3el4.hidden = false;
        map3el5.hidden = false;
        map3el6.hidden = false;

        map4row.hidden = false;
        map5row.hidden = false;
    }

    scoreRepMatch.value = data;

    resetScore(bestOf);
    resetMaps();
    resetPauseStatus();
}

function changeDefender() {
    let data = scoreRepMatch.value;

    if (defender.value === "") data.defender = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === defender.value;
        });
        data.defender = team[0];
    }

    if (defender.value === attacker.value) toast("You have selected the same team twice!");
    scoreRepMatch.value = data;
}

function changeDefenderScore() {
    let data = scoreRepMatch.value;
    data.defenderScore = defenderScore.value;
    scoreRepMatch.value = data;
}

function changeAttacker() {
    let data = scoreRepMatch.value;

    if (attacker.value === "") data.attacker = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === attacker.value;
        });
        data.attacker = team[0];
    }

    if (defender.value === attacker.value) toast("You have selected the same team twice!");
    scoreRepMatch.value = data;
}

function changeAttackerScore() {
    let data = scoreRepMatch.value;
    data.attackerScore = attackerScore.value;
    scoreRepMatch.value = data;
}

function swapTeams() {
    let data = scoreRepMatch.value;

    data.defender = [
        data.attacker,
        data.attacker = data.defender
    ][0];

    data.defenderScore = [
        data.attackerScore,
        data.attackerScore = data.defenderScore
    ][0];

    scoreRepInit = false;
    scoreRepMatch.value = data;
}

function resetScore(bestOf = 3) {
    let data = {
        attacker: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        attackerScore: "0",
        defender: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        defenderScore: "0",
        bestOf: parseInt(bestOf)
    };

    scoreRepInit = false;
    scoreRepMatch.value = data;

    resetPauseStatus();
}

function changeMap1() {
    let data = mapsRepMatch.value;
    data.map1 = map1.value;

    if (map1.value === map2.value || map1.value === map3.value) toast("You have selected the same map twice!");
    mapsRepMatch.value = data;
}

function changeMap1Select() {
    let data = mapsRepMatch.value;

    if (map1Select.value === "") data.map1Select = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map1Select.value;
        });
        data.map1Select = team[0];
    }

    if (map1Select.value === map2Select.value) toast("You have selected the same team twice!");
    mapsRepMatch.value = data;
}

function changeMap1Status() {
    let data = mapsRepMatch.value;
    data.map1Status = map1Status.checked;

    if (map1Status.checked) {
        map1Team1.selectedIndex = map1Select.selectedIndex;
        let team1 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map1Team1.options[map1Team1.selectedIndex].value;
        });

        data.map1Team1 = team1[0];
        map1Team2.selectedIndex = map1Select.selectedIndex % 2 + 1;
        let team2 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map1Team2.options[map1Team2.selectedIndex].value;
        });

        data.map1Team2 = team2[0];
        map1Score1.disabled = false;
        map1Score1Up.disabled = false;
        map1Score1Down.disabled = false;
        map1Score2.disabled = false;
        map1Score2Up.disabled = false;
        map1Score2Down.disabled = false;
    } else {
        map1Team1.selectedIndex = 0;
        data.map1Team1 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        map1Team2.selectedIndex = 0;
        data.map1Team2 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        data.map1Score1 = "0";
        data.map1Score2 = "0";
        map1Score1.value = "0";
        map1Score2.value = "0";
        map1Score1.disabled = true;
        map1Score1Up.disabled = true;
        map1Score1Down.disabled = true;
        map1Score2.disabled = true;
        map1Score2Up.disabled = true;
        map1Score2Down.disabled = true;
    }
    
    mapsRepMatch.value = data;
}

function changeMap1Score1() {
    let data = mapsRepMatch.value;
    data.map1Score1 = map1Score1.value;
    mapsRepMatch.value = data;
}

function changeMap1Score2() {
    let data = mapsRepMatch.value;
    data.map1Score2 = map1Score2.value;
    mapsRepMatch.value = data;
}

function changeMap2() {
    let data = mapsRepMatch.value;
    data.map2 = map2.value;
    if (map2.value === map1.value || map2.value === map3.value) toast("You have selected the same map twice!");
    mapsRepMatch.value = data;
}

function changeMap2Select() {
    let data = mapsRepMatch.value;

    if (map2Select.value === "") data.map2Select = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map2Select.value;
        });
        data.map2Select = team[0];
    }

    if (map1Select.value === map2Select.value) toast("You have selected the same team twice!");
    mapsRepMatch.value = data;
}

function changeMap2Status() {
    let data = mapsRepMatch.value;
    data.map2Status = map2Status.checked;

    if (map2Status.checked) {
        map2Team1.selectedIndex = map2Select.selectedIndex;
        let team1 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map2Team1.options[map2Team1.selectedIndex].value;
        });

        data.map2Team1 = team1[0];
        map2Team2.selectedIndex = map2Select.selectedIndex % 2 + 1;
        let team2 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map2Team2.options[map2Team2.selectedIndex].value;
        });

        data.map2Team2 = team2[0];
        map2Score1.disabled = false;
        map2Score1Up.disabled = false;
        map2Score1Down.disabled = false;
        map2Score2.disabled = false;
        map2Score2Up.disabled = false;
        map2Score2Down.disabled = false;
    } else {
        map2Team1.selectedIndex = 0;
        data.map2Team1 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        map2Team2.selectedIndex = 0;
        data.map2Team2 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        data.map2Score1 = "0";
        data.map2Score2 = "0";
        map2Score1.value = "0";
        map2Score2.value = "0";
        map2Score1.disabled = true;
        map2Score1Up.disabled = true;
        map2Score1Down.disabled = true;
        map2Score2.disabled = true;
        map2Score2Up.disabled = true;
        map2Score2Down.disabled = true;
    }

    mapsRepMatch.value = data;
}

function changeMap2Score1() {
    let data = mapsRepMatch.value;
    data.map2Score1 = map2Score1.value;
    mapsRepMatch.value = data;
}

function changeMap2Score2() {
    let data = mapsRepMatch.value;
    data.map2Score2 = map2Score2.value;
    mapsRepMatch.value = data;
}

function changeMap3() {
    let data = mapsRepMatch.value;
    data.map3 = map3.value;
    if (map3.value === map1.value || map3.value === map2.value || map3.value === map4.value || map3.value === map5.value) toast("You have selected the same map twice!");
    mapsRepMatch.value = data;
}

function changeMap3Select() {
    let data = mapsRepMatch.value;

    if (map3Select.value === "") data.map3Select = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map3Select.value;
        });
        data.map3Select = team[0];
    }

    if (map2Select.value === map3Select.value) toast("You have selected the same team twice!");
    mapsRepMatch.value = data;
}

function changeMap3Status() {
    let data = mapsRepMatch.value;
    data.map3Status = map3Status.checked;

    if (map3Status.checked) {
        map3Team1.selectedIndex = map3Select.selectedIndex;
        let team1 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map3Team1.options[map3Team1.selectedIndex].value;
        });

        data.map3Team1 = team1[0];
        map3Team2.selectedIndex = map3Select.selectedIndex % 2 + 1;
        let team2 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map3Team2.options[map3Team2.selectedIndex].value;
        });

        data.map3Team2 = team2[0];
        map3Score1.disabled = false;
        map3Score1Up.disabled = false;
        map3Score1Down.disabled = false;
        map3Score2.disabled = false;
        map3Score2Up.disabled = false;
        map3Score2Down.disabled = false;
    } else {
        map3Team1.selectedIndex = 0;
        data.map3Team1 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        map3Team2.selectedIndex = 0;
        data.map3Team2 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        data.map3Score1 = "0";
        data.map3Score2 = "0";
        map3Score1.value = "0";
        map3Score2.value = "0";
        map3Score1.disabled = true;
        map3Score1Up.disabled = true;
        map3Score1Down.disabled = true;
        map3Score2.disabled = true;
        map3Score2Up.disabled = true;
        map3Score2Down.disabled = true;
    }

    mapsRepMatch.value = data;
}

function changeMap3Score1() {
    let data = mapsRepMatch.value;
    data.map3Score1 = map3Score1.value;
    mapsRepMatch.value = data;
}

function changeMap3Score2() {
    let data = mapsRepMatch.value;
    data.map3Score2 = map3Score2.value;
    mapsRepMatch.value = data;
}

function changeMap4() {
    let data = mapsRepMatch.value;
    data.map4 = map4.value;
    if (map4.value === map1.value || map4.value === map2.value || map4.value === map3.value || map4.value === map5.value) toast("You have selected the same map twice!");
    mapsRepMatch.value = data;
}

function changeMap4Select() {
    let data = mapsRepMatch.value;

    if (map4Select.value === "") data.map4Select = {
        teamName: "",
        tricode: "",
        logo: ""
    };
    else {
        let team = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map4Select.value;
        });
        data.map4Select = team[0];
    }

    if (map3Select.value === map4Select.value) toast("You have selected the same team twice!");
    mapsRepMatch.value = data;
}

function changeMap4Status() {
    let data = mapsRepMatch.value;
    data.map4Status = map4Status.checked;

    if (map4Status.checked) {
        map4Team1.selectedIndex = map4Select.selectedIndex;
        let team1 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map4Team1.options[map4Team1.selectedIndex].value;
        });

        data.map4Team1 = team1[0];
        map4Team2.selectedIndex = map4Select.selectedIndex % 2 + 1;
        let team2 = selectedTeamsRepMatchValue.filter((obj)=>{
            return obj.tricode === map4Team2.options[map4Team2.selectedIndex].value;
        });

        data.map4Team2 = team2[0];
        map4Score1.disabled = false;
        map4Score1Up.disabled = false;
        map4Score1Down.disabled = false;
        map4Score2.disabled = false;
        map4Score2Up.disabled = false;
        map4Score2Down.disabled = false;
    } else {
        map4Team1.selectedIndex = 0;
        data.map4Team1 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        map4Team2.selectedIndex = 0;
        data.map4Team2 = {
            tricode: "",
            teamName: "",
            logo: ""
        };
        data.map4Score1 = "0";
        data.map4Score2 = "0";
        map4Score1.value = "0";
        map4Score2.value = "0";
        map4Score1.disabled = true;
        map4Score1Up.disabled = true;
        map4Score1Down.disabled = true;
        map4Score2.disabled = true;
        map4Score2Up.disabled = true;
        map4Score2Down.disabled = true;
    }

    mapsRepMatch.value = data;
}

function changeMap4Score1() {
    let data = mapsRepMatch.value;
    data.map4Score1 = map4Score1.value;
    mapsRepMatch.value = data;
}

function changeMap4Score2() {
    let data = mapsRepMatch.value;
    data.map4Score2 = map4Score2.value;
    mapsRepMatch.value = data;
}

function changeMap5() {
    let data = mapsRepMatch.value;
    data.map5 = map5.value;

    if (map5.value === map1.value || map5.value === map2.value || map5.value === map3.value || map5.value === map4.value) toast("You have selected the same map twice!");
    mapsRepMatch.value = data;
}

function resetMaps() {
    let data = {
        map1: "",
        map1Select: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map1Status: false,
        map1Team1: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map1Score1: "0",
        map1Team2: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map1Score2: "0",
        map2: "",
        map2Select: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map2Status: false,
        map2Team1: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map2Score1: "0",
        map2Team2: {
            tricode: "",
            teamName: "",
            logo: ""
        },
        map2Score2: "0",
        map3: ""
    };

    map1Score1.disabled = true;
    map1Score1Up.disabled = true;
    map1Score1Down.disabled = true;
    map1Score2.disabled = true;
    map1Score2Up.disabled = true;
    map1Score2Down.disabled = true;
    map2Score1.disabled = true;
    map2Score1Up.disabled = true;
    map2Score1Down.disabled = true;
    map2Score2.disabled = true;
    map2Score2Up.disabled = true;
    map2Score2Down.disabled = true;
    mapsRepInit = false;
    mapsRepMatch.value = data;

    resetPauseStatus();
}

function changePauseStatus() {
    let data = pausesRepMatch.value;
    nodecg.log.info(data);
    if (data == undefined) {
        data = {};
        data.timeoutStatus = false;
        data.techStatus = false;
    }
    data.timeoutStatus = timeoutStatus.checked;
    data.techStatus = techStatus.checked;
    pausesRepMatch.value = data;
}

function resetPauseStatus() {
    let data = pausesRepMatch.value;
    if (data !== undefined) {
        data.timeoutStatus = false;
        data.techStatus = false;
        pausesRepMatch.value = data;
    }
}

function toast(text) {
    nodecg.log.info("Showing toast");
    var toast = document.getElementById("snackbar");
    toast.innerHTML = text;
    toast.className = "show";
    setTimeout(function() {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}
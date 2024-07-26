const dropdown1 = document.getElementById("team1");
const dropdown2 = document.getElementById("team2");

const teamLogo1 = document.getElementById("teamLogo1");
const teamLogo2 = document.getElementById("teamLogo2");

const bestOfThree = document.getElementById("bestOfThree");

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

const map3 = document.getElementById("map3");

let teamsRepMatch = nodecg.Replicant("teamsRep");
let selectedTeamsRepMatch = nodecg.Replicant("selectedTeams");
let settingsMapsRepMatch = nodecg.Replicant("settingsMapsRep");
let selectedTeamsRepMatchValue;
let scoreRepMatch = nodecg.Replicant("score");
let mapsRepMatch = nodecg.Replicant("Maps");

let scoreRepInit = false;
let mapsRepInit = false;

scoreRepMatch.on("change", () => {
    if (!scoreRepInit) {
        let savedData = scoreRepMatch.value;

        bestOfThree.checked = true;

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
        scoreRepInit = true;
    }
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
            map3: ""
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
            savedData = tempData;
        }

        for (let i = 0; i < 8; i++){
            if (savedData.map1 == map1.options[i].text) map1.selectedIndex = i;
            if (savedData.map2 == map2.options[i].text) map2.selectedIndex = i;
            if (savedData.map3 == map3.options[i].text) map3.selectedIndex = i;
        }

        for (let i = 0; i < map1Select.options.length; i++){
            if (savedData.map1Select.teamName == map1Select.options[i].text) map1Select.selectedIndex = i;
            if (savedData.map1Team1.teamName == map1Team1.options[i].text) map1Team1.selectedIndex = i;
            if (savedData.map1Team2.teamName == map1Team2.options[i].text) map1Team2.selectedIndex = i;
            if (savedData.map2Select.teamName == map2Select.options[i].text) map2Select.selectedIndex = i;
            if (savedData.map2Team1.teamName == map2Team1.options[i].text) map2Team1.selectedIndex = i;
            if (savedData.map2Team2.teamName == map2Team2.options[i].text) map2Team2.selectedIndex = i;
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
    let data = newValue;
    let team1 = data[0];
    let team2 = data[1];

    for (var i = 0; i < dropdown1.length; i++) {
        if (dropdown1[i].innerHTML === team1.teamName && dropdown1.value === "") {
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

        if (dropdown2[i].innerHTML === team2.teamName && dropdown2.value === "") {
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

    if (team1.teamName) {
        let attackerTeam1 = new Option(team1.teamName, team1.tricode);
        let defenderTeam1 = new Option(team1.teamName, team1.tricode);
        let map1SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map1Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map1Team2Team1 = new Option(team1.teamName, team1.tricode);
        let map2SelectTeam1 = new Option(team1.teamName, team1.tricode);
        let map2Team1Team1 = new Option(team1.teamName, team1.tricode);
        let map2Team2Team1 = new Option(team1.teamName, team1.tricode);

        attacker.appendChild(attackerTeam1);
        defender.appendChild(defenderTeam1);
        map1Select.appendChild(map1SelectTeam1);
        map1Team1.appendChild(map1Team1Team1);
        map1Team2.appendChild(map1Team2Team1);
        map2Select.appendChild(map2SelectTeam1);
        map2Team1.appendChild(map2Team1Team1);
        map2Team2.appendChild(map2Team2Team1);
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

        attacker.appendChild(attackerTeam2);
        defender.appendChild(defenderTeam2);
        map1Select.appendChild(map1SelectTeam2);
        map1Team1.appendChild(map1Team1Team2);
        map1Team2.appendChild(map1Team2Team2);
        map2Select.appendChild(map2SelectTeam2);
        map2Team1.appendChild(map2Team1Team2);
        map2Team2.appendChild(map2Team2Team2);
    }

    selectedTeamsRepMatchValue = selectedTeamsRepMatch.value;
});

settingsMapsRepMatch.on("change", () => {
    let maps = settingsMapsRepMatch.value;
    if (maps == undefined) maps = [];

    let sortedMaps = maps.map((x) => x);
    sortedMaps.sort();

    let mapDropdowns = [map1, map2, map3];

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

    if (dropdown1.selectedIndex === dropdown2.selectedIndex) toast("You have selected the same map twice!");
    selectedTeamsRepMatch.value = data;
}

function resetTeams() {
    resetScore();
    resetMaps();
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
    scoreRepMatch.value = data;
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
function resetScore() {
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
        bestOf: "3"
    };

    scoreRepInit = false;
    scoreRepMatch.value = data;
}
function changeMap1() {
    let data = mapsRepMatch.value;
    nodecg.log.info(mapsRepMatch.value);
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

    if (map3.value === map1.value || map3.value === map2.value) toast("You have selected the same map twice!");
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
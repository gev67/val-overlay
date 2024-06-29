const addedTeams = document.getElementById("addedTeams");

let teamsRepTeams = nodecg.Replicant("teamsRep");
let teamLogosRepTeams = nodecg.Replicant("assets:teamLogos");

let teamsRepTeamsInit = false;

teamsRepTeams.on("change", (newValue) => {
    if (newValue == undefined) {
        teamsRepTeams.value = [];
        newValue = [];
    } 
    let input = newValue;
    var teams = [];
    var inserted;

    for (var i = 0; i < input.length; i++) {
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

    addedTeams.replaceChildren();
    for(let i = 0; i < teams.length; i++){
        let li = document.createElement("li");
        let lidiv = document.createElement("div");
        lidiv.style.display = "flex";
        lidiv.style.flexDirection = "column";
        lidiv.style.alignContent = "space-between";

        let logodiv = document.createElement("div");
        logodiv.style.width = "170px";
        logodiv.style.height = "170px";
        logodiv.style.padding = "10px 0px 0px 0px";
        logodiv.style.alignSelf = "center";

        let logo = document.createElement("img");
        logo.src = teams[i].logo;
        logo.style.maxWidth = "170px";
        logo.style.maxHeight = "170px";
        logodiv.appendChild(logo);
        lidiv.appendChild(logodiv);

        let teamNameDiv = document.createElement("div");
        teamNameDiv.innerHTML = `<b>${teams[i].teamName}</b>`;
        teamNameDiv.style.padding = "5px";
        teamNameDiv.style.overflowWrap = "anywhere";
        lidiv.appendChild(teamNameDiv);

        let deletediv = document.createElement("div");
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn");
        deleteButton.appendChild(document.createTextNode("Remove"));

        deleteButton.id = teams[i].teamName;
        deleteButton.className = "button-remove";
        deletediv.appendChild(deleteButton).addEventListener("click", removeItem);
        lidiv.appendChild(deletediv);
        li.appendChild(lidiv);
        addedTeams.appendChild(li);
    }

    teamsRepTeamsInit = true;
});

teamLogosRepTeams.on("change", (newValue) => {
    if (teamsRepTeamsInit) {
        let teams = teamsRepTeams.value;
        let logos = newValue;
        for(let i = 0; i < teams.length; i++){
            let logoExists = false;
            for(let j = 0; j < logos.length; j++) {
                if (teams[i].tricode === logos[j]["name"]) {
                    logoExists = true;
                    break;
                }
            }
            if (!logoExists) {
                teams.splice(i, 1);
                teamsRepTeams.value = teams;
                toastTeams("The team with that logo has been removed!");
            }
        }
    }
});

function removeItem() {
    let teamName = this.id;
    let teams = teamsRepTeams.value;
    let index = -1;

    for (let i = 0; i < teams.length; i++) {
        nodecg.log.info(teams[i].teamName);
        if (teams[i].teamName == teamName) {
            index = i;
            nodecg.log.info(index, teamName);
            break;
        }
    }

    if (index >= 0) {
        teams.splice(index, 1);
        nodecg.log.info(teams);
        teamsRepTeams.value = teams;
    }
}

function toastTeams(text) {
    nodecg.log.info("Showing toast");
    var toast = document.getElementById("snackbar");
    toast.innerHTML = text;
    toast.className = "show";
    setTimeout(function() {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}
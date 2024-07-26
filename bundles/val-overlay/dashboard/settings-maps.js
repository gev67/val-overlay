const addedMapsList = document.getElementById("added-maps");

let settingsMapsRep = nodecg.Replicant("settingsMapsRep");

settingsMapsRep.on("change", () => {
    let settingsMapData = settingsMapsRep.value;

    if (settingsMapData == undefined) {
        settingsMapData = [];
    }

    var maps = [];
    var inserted;

    for (var i = 0; i < settingsMapData.length; i++) {
        inserted = false;
        for (var j = 0; j < maps.length; j++) {
            if (settingsMapData[i].toUpperCase() < maps[j].toUpperCase()) {
                inserted = true;
                maps.splice(j, 0, settingsMapData[i]);
                break;
            }
        }
        if (!inserted) maps.push(settingsMapData[i]);
    }

    addedMapsList.replaceChildren();
    for (let i = 0; i < maps.length; i++) {
        let newMap = document.createElement("li");
        let newMapDiv = document.createElement("div");
        let newMapName = document.createElement("div");
        let newMapDeleteButton = document.createElement("button");
        let newMapDeleteButtonI = document.createElement("i");

        newMap.className = "li-map";
        newMapDiv.className = "map-list-div";

        newMapName.innerHTML = maps[i];

        newMapDeleteButton.className = "button-remove";
        newMapDeleteButton.id = maps[i];
        newMapDeleteButton.addEventListener("click", removeMap);

        newMapDeleteButtonI.className = "fa fa-trash";

        newMapDeleteButton.appendChild(newMapDeleteButtonI);
        newMapDiv.appendChild(newMapName);
        newMapDiv.appendChild(newMapDeleteButton);
        newMap.appendChild(newMapDiv);

        addedMapsList.appendChild(newMap);
    }
});

function addMap() {
    let settingsMapData = settingsMapsRep.value;
    settingsMapData.push()
}

function removeMap() {
    let settingsMapData = settingsMapsRep.value;

    if (settingsMapData == undefined) return;

    let mapName = this.id;
    let index = -1;

    for (let i = 0; i < settingsMapData.length; i++) {
        if (settingsMapData[i] == mapName) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        settingsMapData.splice(index, 1);
        settingsMapsRep.value = settingsMapData;
    }
}
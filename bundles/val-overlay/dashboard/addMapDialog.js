const mapName = document.getElementById("mapName");

document.addEventListener("dialog-confirmed", function() {
    if (mapName.value == "") {
        alert("Please enter a map name.");
        return;
    }

    const dialogMapsRep = nodecg.Replicant("settingsMapsRep");
    let mapsArray = dialogMapsRep.value;
    let newMapName = mapName.value;

    for (let i = 0; i < mapsArray.length; i++) {
        if (mapsArray[i].toUpperCase() == newMapName.toUpperCase()) {
            alert("This map already exists.");
            return;
        }
    }

    mapsArray.push(newMapName);
    dialogMapsRep.value = mapsArray;
    mapName.value = "";
});

document.addEventListener("dialog-dismissed", function() {
    mapName.value = "";
});
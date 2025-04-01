const map1El = document.getElementById("map1");
const map2El = document.getElementById("map2");
const map3El = document.getElementById("map3");

const background = document.getElementById("background");

const current = "CURRENT: ";
const next = "NEXT: ";
const decider = "DECIDER: ";
const mapsRepIndex = nodecg.Replicant("Maps");
const scoreRepIndex = nodecg.Replicant("score");

let actualBestOf = 3;

mapsRepIndex.on("change", (newValue) => {
    let data = newValue;
    let mapCount = Number(data.map1Status) + Number(data.map2Status) + Number(data.map3Status) + Number(data.map4Status);

    NodeCG.waitForReplicants(scoreRepIndex).then(() => {

        nodecg.log.info("Best of: ", actualBestOf);

        if (actualBestOf == 3) {
            switch(mapCount){
                case 0:
                    background.style.backgroundImage="url(hud-m1.png)";
                    map1El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Select.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name not-current-map'>" + next + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + decider + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map3.toUpperCase() + "</span>";
                    break;
                case 1:
                    background.style.backgroundImage="url(hud-m2.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map1Score1 + "-" + data.map1Score2 + "</span>" + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map2.toUpperCase() + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + decider + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map3.toUpperCase() + "</span>";
                    break;
                case 2:
                    background.style.backgroundImage="url(hud-m3.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map1Score1 + "-" + data.map1Score2 + "</span>" + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name not-current-map'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map2Score1 + "-" + data.map2Score2 + "</span>" + "&nbsp;" + `<img src="${data.map2Team2.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map3.toUpperCase();
                    break;
            }
        } else if (actualBestOf == 5) {
            switch(mapCount){
                case 0:
                    background.style.backgroundImage="url(hud-m1.png)";
                    map1El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Select.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name not-current-map'>" + next + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + next + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                    break;
                case 1:
                    background.style.backgroundImage="url(hud-m2.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map1.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map1Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map1Score1 + "-" + data.map1Score2 + "</span>" + "&nbsp;" + `<img src="${data.map1Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + next + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                    break;
                case 2:
                    background.style.backgroundImage="url(hud-m2.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map2.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map2Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map2Score1 + "-" + data.map2Score2 + "</span>" + "&nbsp;" + `<img src="${data.map2Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + next + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map4.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map4Select.logo}" class="image">`;
                    break;
                case 3:
                    background.style.backgroundImage="url(hud-m2.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map3Score1 + "-" + data.map3Score2 + "</span>" + "&nbsp;" + `<img src="${data.map3Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map4.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map4Select.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name not-current-map'>" + decider + "</span>" + "&nbsp;" + "<span class='not-current-map'>" + data.map5.toUpperCase() + "</span>";
                    break;
                case 4:
                    background.style.backgroundImage="url(hud-m3.png)";
                    map1El.innerHTML = "<span class='map-name not-current-map'>" + data.map3.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map3Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map3Score1 + "-" + data.map3Score2 + "</span>" + "&nbsp;" + `<img src="${data.map3Team2.logo}" class="image">`;
                    map2El.innerHTML = "<span class='map-name not-current-map'>" + data.map4.toUpperCase() + "</span>" + "&nbsp;" + `<img src="${data.map4Team1.logo}" class="image">` + "&nbsp;" + "<span class='not-current-map'>" + data.map4Score1 + "-" + data.map4Score2 + "</span>" + "&nbsp;" + `<img src="${data.map4Team2.logo}" class="image">`;
                    map3El.innerHTML = "<span class='map-name current-map'>" + current + "</span>" + "&nbsp;" + "<span class='current-map'>" + data.map5.toUpperCase() + "</span>";
                    break;
            }
        }
    });
});

scoreRepIndex.on("change", (newValue) => {
    let data = newValue;
    actualBestOf = data.bestOf;
});
function setTile(i, j) {
    let cell = document.getElementById(`cell_${i}_${j}`);
    let tileType = document.getElementById('tileType').value;
    cell.dataset.type = tileType;

    if (tileType === 'enemy') {
        let enemyId = document.getElementById('enemyId').value;
        let isBlocked = document.getElementById('blocked').checked;
        cell.dataset.enemyId = enemyId;
        cell.dataset.blocked = isBlocked;
    }
    if (tileType === 'transition') {
        let destination = document.getElementById('destination').value;
        let destinationX = document.getElementById('destinationX').value;
        let destinationY = document.getElementById('destinationY').value;
        cell.dataset.destination = destination;
        cell.dataset.destinationX = destinationX;
        cell.dataset.destinationY = destinationY;
    }
    if (tileType === 'chest') {
        let chestId = document.getElementById('chestId').value;
        let isBlocked = document.getElementById('blocked').checked;
        cell.dataset.chestId = chestId;
        cell.dataset.blocked = isBlocked;
    }
    if (tileType === 'npc') {
        let npcId = document.getElementById('npcId').value;
        let isBlocked = document.getElementById('blocked').checked;
        cell.dataset.npcId = npcId;
        cell.dataset.blocked = isBlocked;
    }

    // Remove previous classes
    ["wall", "enemy", "npc", "chest","transition"].forEach(type => {
        cell.classList.remove(type);
    });

    cell.classList.add(tileType);
    cell.dataset.type = tileType; // store the type as a data attribute
}

function showEnemyOptions() {
    let tileType = document.getElementById('tileType').value;
    let enemyOptionsDiv = document.getElementById('enemyOptions');
    let transitionOptionsDiv = document.getElementById('transitionOptions');
    let chestOptionsDiv = document.getElementById('chestOptions');
    let npcOptionsDiv = document.getElementById('npcOptions');
    if (tileType === 'enemy') {
        enemyOptionsDiv.style.display = 'block';
    } else {
        enemyOptionsDiv.style.display = 'none';
    }
    if (tileType === 'transition') {
        transitionOptionsDiv.style.display = 'block';
    } else {
        transitionOptionsDiv.style.display = 'none';
    }
    if (tileType === 'chest') {
        chestOptionsDiv.style.display = 'block';
    } else {
        chestOptionsDiv.style.display = 'none';
    }
    if (tileType === 'npc') {
        npcOptionsDiv.style.display = 'block';
    } else {
        npcOptionsDiv.style.display = 'none';
    }
}

function getTileShortcode(tileType) {
    switch (tileType) {
        case 'wall': return 'w';
        case 'enemy': return 'e';
        case 'npc': return 'n';
        case 'chest': return 'c';
        case 'empty': return 'e';
        case 'transition': return 't';
        default: return 'e'; // default to 'empty' for unforeseen tile types
    }
}

function exportToJson() {
    let roomId = document.getElementById('roomId').value;

    let roomInfo = "";
    let specialTiles = [];
    let transitionTiles = [];
    let previousTileType = null;
    let count = 1;
    
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 20; j++) {
            let cell = document.getElementById(`cell_${i}_${j}`);
            let tileType = cell.dataset.type || "empty";
            
            if (tileType === 'enemy') {
                let enemyId = cell.dataset.enemyId;
                let isBlocked = cell.dataset.blocked === 'true';
                // Adjust how you incorporate this info into your data as needed
                specialTiles.push(["battle-" + enemyId, isBlocked, j , i]);
                tileType = "empty";
            }
            if (tileType === 'transition') {
                let destination = cell.dataset.destination;
                let destinationX = cell.dataset.destinationX;
                let destinationY = cell.dataset.destinationY;
                transitionTiles.push([destination, j , i, parseInt(destinationX), parseInt(destinationY)]);
                tileType = "empty";
            
            }
            if (tileType === 'chest') {
                let chestId = cell.dataset.chestId;
                let isBlocked = cell.dataset.blocked === 'true';
                specialTiles.push(["chest-" + chestId, isBlocked, j , i]);
                tileType = "empty";
            }
            if (tileType === 'npc') {
                let npcId = cell.dataset.npcId;
                let isBlocked = cell.dataset.blocked === 'true';
                specialTiles.push(["npc-" + npcId, isBlocked, j , i]);
                tileType = "empty";
            }
                

            if (i === 11 && j === 19) {
                // Special case for the last tile in the grid
                if(tileType == previousTileType){
                    count++; // Include the last tile in the count
                    roomInfo += getTileShortcode(tileType) + count;
                } else {
                    roomInfo += getTileShortcode(previousTileType) + count;
                    roomInfo += getTileShortcode(tileType) + 1;
                }
            } else if (previousTileType !== null && tileType !== previousTileType) {
                // Commit the previous tile sequence to roomInfo
                roomInfo += getTileShortcode(previousTileType) + count;
                count = 1; // Reset the count for the new tile sequence
            }else {
                if(i !== 0 || j !== 0){
                count++;
                }
            }
            
            previousTileType = tileType;
        }
    }

    let data = {
        roomData: {
            room: roomId,
            roomInfo: roomInfo,
            specialTiles: specialTiles,
            transitionTiles: transitionTiles
        }
    };

    let jsonString = JSON.stringify(data, null, 3);
    download(jsonString, roomId + '.json', 'application/json');
}

function download(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


function generateTable() {
    let tableBody = document.getElementById("gridTable");

    for (let i = 0; i < 12; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 20; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("onclick", `setTile(${i}, ${j})`);
            cell.setAttribute("id", `cell_${i}_${j}`);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

// Call the function to generate the table when the script loads:
generateTable();
// ... keep the download function as before ...

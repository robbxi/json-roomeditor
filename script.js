function setTile(i, j, newType) {
    let cell = document.getElementById(`cell_${i}_${j}`);
    let tileType = document.getElementById('tileType').value || newType;
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
        let isBlocked = document.getElementById('blockedChest').checked;
        cell.dataset.chestId = chestId;
        cell.dataset.blocked = isBlocked;
    }
    if (tileType === 'npc') {
        let npcId = document.getElementById('npcId').value;
        let isBlocked = document.getElementById('blockedNPC').checked;
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
function importString(string) {
    const str = string.toString();
    const chars = str.match(/\D+/g) || [];
    const numbers = str.match(/\d+/g).map(Number) || [];
    let position = 0;
    let x = -1;
    let y = -1;
    chars.forEach((char, i) => {
        const count = numbers[i] || 1;
        const type = ( char == 'w' ? 'wall' : 'empty');
        if(type == 'empty'){
            position += count;
            x = (position % 20) - 1;
            y = Math.floor(position / 20);
            return;
        }
        for (let j = 0; j < count; j++) {
            if (position % 20 === 0) {
                x = 0;
                y = (y < 11 ? y + 1 : y);
            } else {
                x++;
            }
            setTile(y, x, type);
            position++;
        }
    });
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
            let tileType = cell.dataset.type || 'empty';
            
            if (tileType === 'enemy') {
                let enemyId = cell.dataset.enemyId;
                let isBlocked = cell.dataset.blocked === 'true';
                // Adjust how you incorporate this info into your data as needed
                specialTiles.push(["battle-" + enemyId, isBlocked, j , i]);
                tileType = 'empty';
            }
            if (tileType === 'transition') {
                let destination = cell.dataset.destination;
                let destinationX = cell.dataset.destinationX;
                let destinationY = cell.dataset.destinationY;
                transitionTiles.push([destination, j , i, parseInt(destinationX), parseInt(destinationY)]);
                tileType = 'empty';
            
            }
            if (tileType === 'chest') {
                let chestId = cell.dataset.chestId;
                let isBlockedChest = cell.dataset.blocked === 'true';
                specialTiles.push(["chest-" + chestId, isBlockedChest, j , i]);
                tileType = 'empty';
            }
            if (tileType === 'npc') {
                let npcId = cell.dataset.npcId;
                let isBlocked = cell.dataset.blocked === 'true';
                specialTiles.push(["npc-" + npcId, isBlocked, j , i]);
                tileType = 'empty';
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




function clearGrid(){
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 20; j++) {
            let cell = document.getElementById(`cell_${i}_${j}`);
            let tileType = 'empty';
            cell.dataset.type = tileType;

            // Remove previous classes
            ["wall", "enemy", "npc", "chest","transition"].forEach(type => {
                cell.classList.remove(type);
            });
        
            cell.classList.add(tileType);
            cell.dataset.type = tileType; // store the type as a data attribute
        }
    }
}
function importJson() {
    const fileInput = document.getElementById('jsonInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                let roomInfo = jsonData.roomData.roomInfo;
                importString(roomInfo.toString());
                let specialTiles = jsonData.roomData.specialTiles;
                specialTiles.forEach((tile) => {
                    let tileX = tile[2];
                    let tileY = tile[3];
                    let cell = document.getElementById(`cell_${tileY}_${tileX}`);
                    let tileType = tile[0].split('-')[0];
                    

                    if (tileType === 'battle') {
                        tileType = 'enemy';
                        let enemyId = tile[0].split('-')[1];
                        let isBlockedE = tile[2];
                        cell.dataset.enemyId = enemyId;
                        cell.dataset.blocked = isBlockedE;
                    }

                    cell.dataset.type = tileType;
                    if (tileType === 'chest') {
                        let chestId = tile[0].split('-')[1];
                        let isBlockedChest = tile[2];
                        cell.dataset.chestId = chestId;
                        cell.dataset.blocked = isBlockedChest;
                    }
                    if (tileType === 'npc') {
                        let npcId = tile[0].split('-')[1];
                        let isBlockedN = tile[2];;
                        cell.dataset.npcId = npcId;
                        cell.dataset.blocked = isBlockedN;
                    }

                    // Remove previous classes
                    ["wall", "enemy", "npc", "chest","transition"].forEach(type => {
                        cell.classList.remove(type);
                    });

                    cell.classList.add(tileType);
                    cell.dataset.type = tileType;
                });
                let transitionTiles = jsonData.roomData.transitionTiles;
                transitionTiles.forEach((tile) => {
                    let cell = document.getElementById(`cell_${tile[2]}_${tile[1]}`);
                    let tileType = 'transition';
                    cell.dataset.type = tileType;
            
                    let destination = tile[0];
                    let destinationX = tile[3];
                    let destinationY = tile[4];
                    cell.dataset.destination = destination;
                    cell.dataset.destinationX = destinationX;
                    cell.dataset.destinationY = destinationY;
          
                
                    // Remove previous classes
                    ["wall", "enemy", "npc", "chest","transition"].forEach(type => {
                        cell.classList.remove(type);
                    });
                
                    cell.classList.add(tileType);
                    cell.dataset.type = tileType; // store the type as a data attribute
                });
                console.log(jsonData);
            } catch (error) {
                alert('Error parsing JSON: ' + error.message);
                console.log(error);
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please select a JSON file.');
    }
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

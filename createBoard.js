var bombs = new Array();
for(var i = 0; i < 8; i++){
    bombs[i] = new Array()
    for(var j = 0; j < 8; j++){
        bombs[i][j] = false;
    }
}

function createBoard(rows, cols) {
    bombs = new Array();
    for(var i = 0; i < rows; i++){
        bombs[i] = new Array()
        for(var j = 0; j < cols; j++){
            bombs[i][j] = false;
        }
    }

    const board = document.getElementById('board');
    var text = "<tr>";
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            text += "<td><button onclick='setBombs(" + i + "," + j + ")' class='cell'>" + bombs[i][j] + "</button></td>";
        }
        text += "</tr>"
    }
    board.innerHTML = text;
}

function resetBoard(){
    const rows = bombs.length;
    const cols = bombs[0].length;
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            bombs[i][j] = false;
        }
    }

    const board = document.getElementById('board');
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.innerHTML = bombs[i][j];
            $cell.setAttribute("onclick", "setBombs("+i+", " + j + ");");
        }
    }
}

function setBombs(x, y){
    console.log(x);
    console.log(y);
    const rows = bombs.length;
    const cols = bombs[0].length;
    const board = document.getElementById('board');

    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.onclick = null;
        }
    }

    const num = Math.floor((rows*cols)*(document.getElementById("perBomb").value/100.0));
    for(var i = 0; i < num; i++){
        do {
            row = Math.floor((Math.random() * rows));
            col = Math.floor((Math.random() * cols));
        }while(bombs[row][col] || (row == x && col == y));
        bombs[row][col] = true;
        const $cell = board.rows[row].cells[col].firstElementChild;
        $cell.innerHTML = bombs[row][col];
    }
}
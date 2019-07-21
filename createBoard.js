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
    document.getElementById("perBomb").max = Math.floor(0.85*rows*cols);
    document.getElementById("perBomb").value = Math.floor(0.2*rows*cols);
    document.getElementById("bombNum").innerText = String(Math.floor(0.2*rows*cols));

    const board = document.getElementById('board');
    var text = "<tr>";
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            text += "<td><img onclick='setBombs(" + i + "," + j + ")' class='cell' src='resources/block.png'/></td>";
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
            $cell.src = 'resources/block.png';
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
            $cell.setAttribute("onclick", "reveal("+i+", " + j + ");");
        }
    }

    const num = document.getElementById("perBomb").value;
    for(var i = 0; i < num; i++){
        var row, col;
        do {
            row = Math.floor((Math.random() * rows)) - 1;
            col = Math.floor((Math.random() * cols)) - 1;
        }while(bombs[row][col] || (row == x && col == y) || (row == x+1 && col == y) || (row == x+1 && col == y+1) || (row == x+1 && col == y-1)
        || (row == x-1 && col == y) || (row == x-1 && col == y+1) || (row == x && col == y+1) || (row == x && col == y-1) || (row == x-1 && col == y-1));
        bombs[row][col] = true;
    }

    reveal(x, y);
}

function chgRange(){
    const $bombNum = document.getElementById("bombNum");
    $bombNum.innerText = document.getElementById("perBomb").value;
}

function reveal(x, y){
    if(bombs[x][y]){
        lose();
        return;
    }
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    let bombsNear = 0;
    if(x+1 < bombs.length && bombs[x+1][y]){
        bombsNear++;
    }
    if(x+1 < bombs.length && y+1 < bombs[0].length && bombs[x+1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && bombs[x-1][y]){
        bombsNear++;
    }
    if(x-1 >= 0 && y+1 < bombs[0].length && bombs[x-1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && y-1 >= 0 && bombs[x-1][y-1]){
        bombsNear++;
    }
    if(y+1 < bombs[0].length && bombs[x][y+1]){
        bombsNear++;
    }
    if(y-1 >= 0 && bombs[x][y-1]){
        bombsNear++;
    }
    if(x+1 < bombs.length && y-1 >= 0 && bombs[x+1][y-1]){
        bombsNear++;
    }

    if(bombsNear == 0){
        $cell.src = 'resources/empty.png';
    }else{
        $cell.src = 'resources/' + bombsNear + '.png';
    }
    $cell.onclick = null;
}

function lose(){

}
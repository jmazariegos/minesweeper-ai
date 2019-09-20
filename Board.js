var timer;
var r_length = 8;
var c_length = 8;
var left = 0;
var started = false;
var bombs = new Array();
var revealed = new Array();
for(var i = 0; i < 8; i++){
    bombs[i] = new Array();
    revealed[i] = new Array();
    for(var j = 0; j < 8; j++){
        bombs[i][j] = false;
        revealed[i][j] = false;
    }
}

//Miscellaneous Functions (Img Change etc.)

function chgRange(){
    const $bombNum = document.getElementById("bombNum");
    $bombNum.innerText = document.getElementById("perBomb").value;
}

function push(x, y){
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    $cell.src = 'resources/block pushed.png'
}

function pull(x, y){
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    $cell.src = 'resources/block.png'
}

//Timer Functions

function timerIncrement(){
    const $time = document.getElementById("time");
    let val = parseInt($time.innerText) + 1;
    $time.innerText = val;
    if(val == 999){
        clearInterval(timer);
    }
}

//Board Functions

function createBoard(rows, cols) {
    r_length = rows;
    c_length = cols;
    bombs = new Array();
    revealed = new Array();
    for(var i = 0; i < rows; i++){
        bombs[i] = new Array();
        revealed[i] = new Array();
        for(var j = 0; j < cols; j++){
            bombs[i][j] = false;
            revealed[i][j] = false;
        }
    }
    document.getElementById("perBomb").max = Math.floor(0.85*rows*cols);
    document.getElementById("perBomb").value = Math.floor(0.2*rows*cols);
    document.getElementById("bombNum").innerText = String(Math.floor(0.2*rows*cols));

    const board = document.getElementById('board');
    var text = "<tr>";
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            text += "<td><img onclick='setBombs(" + i + "," + j + ")' class='cell' src='resources/block.png' onmousedown='push(" + i + "," + j + ")'/></td>";
        }
        text += "</tr>"
    }
    board.innerHTML = text;

    const $bombs = document.getElementById("bombs");
    $bombs.innerText = document.getElementById("perBomb").value;
}

function resetBoard(){
    for(var i = 0; i < r_length; i++){
        for(var j = 0; j < c_length; j++){
            bombs[i][j] = false;
            revealed[i][j] = false;
        }
    }

    const board = document.getElementById('board');
    for(var i = 0; i < r_length; i++){
        for(var j = 0; j < c_length; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.src = 'resources/block.png';
            $cell.setAttribute("onclick", "setBombs(" + i + ", " + j + ", true);");
            $cell.setAttribute("onmousedown", "push(" + i + ", " + j + ");");
        }
    }

    started = false;
    const $bombs = document.getElementById("bombs");
    $bombs.innerText = document.getElementById("perBomb").value;
    clearInterval(timer);
    const $time = document.getElementById("time");
    $time.innerText = "0";

}

function setBombs(x, y){
    const board = document.getElementById('board');

    for(var i = 0; i < r_length; i++){
        for(var j = 0; j < c_length; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.setAttribute("onclick", "reveal("+i+", " + j + ", true);");
        }
    }

    const num = document.getElementById("perBomb").value;
    for(var i = 0; i < num; i++){
        var row, col;
        do {
            row = Math.floor((Math.random() * r_length));
            col = Math.floor((Math.random() * c_length));
        }while(bombs[row][col] || (row == x && col == y) || (row == x+1 && col == y) || (row == x+1 && col == y+1) || (row == x+1 && col == y-1)
        || (row == x-1 && col == y) || (row == x-1 && col == y+1) || (row == x && col == y+1) || (row == x && col == y-1) || (row == x-1 && col == y-1));
        bombs[row][col] = true;
    }

    left = r_length*c_length - document.getElementById("perBomb").value;
    reveal(x, y, true);
    timer = setInterval(timerIncrement, 1000);
    started = true;
}

function reveal(x, y, clicked){
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    if(bombs[x][y] && clicked){
        lose(x, y);
        alert("you lose");
        return;
    }
    if(revealed[x][y] || (bombs[x][y] && !clicked)){
        return;
    }
    revealed[x][y] = true;
    let bombsNear = 0;
    if(x+1 < r_length && bombs[x+1][y]){
        bombsNear++;
    }
    if(x+1 < r_length && y+1 < c_length && bombs[x+1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && bombs[x-1][y]){
        bombsNear++;
    }
    if(x-1 >= 0 && y+1 < c_length && bombs[x-1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && y-1 >= 0 && bombs[x-1][y-1]){
        bombsNear++;
    }
    if(y+1 < c_length && bombs[x][y+1]){
        bombsNear++;
    }
    if(y-1 >= 0 && bombs[x][y-1]){
        bombsNear++;
    }
    if(x+1 < r_length && y-1 >= 0 && bombs[x+1][y-1]){
        bombsNear++;
    }

    if(bombsNear == 0){
        $cell.src = 'resources/empty.png';
        if(x+1 < r_length){
            reveal(x+1, y, false);
        }
        if(x+1 < r_length && y+1 < c_length){
            reveal(x+1, y+1, false);
        }
        if(x-1 >= 0){
            reveal(x-1, y, false);
        }
        if(x-1 >= 0 && y+1 < c_length){
            reveal(x-1, y+1, false);
        }
        if(x-1 >= 0 && y-1 >= 0){
            reveal(x-1, y-1, false);
        }
        if(y+1 < c_length){
            reveal(x, y+1, false);
        }
        if(y-1 >= 0){
            reveal(x, y-1, false);
        }
        if(x+1 < r_length && y-1 >= 0){
            reveal(x+1, y-1, false);
        }
    }else{
        $cell.src = 'resources/' + bombsNear + '.png';
    }
    $cell.onclick = null;
    $cell.onmousedown = null;
    left -= 1;
    if(left == 0){
        win();
        return;
    }
}

function lose(x, y){
    clearInterval(timer);
    started = false;
    const board = document.getElementById('board');
    for(var i = 0; i < r_length; i++){
        for(var j = 0; j < c_length; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.onclick = null;
            $cell.onmousedown = null;
            if(bombs[i][j]){
                if(x == i && y == j){
                    $cell.src = 'resources/explosion.png';
                }else{
                    $cell.src = 'resources/bomb.png';
                }
            }
        }
    }
}

function win(){
    clearInterval(timer);
    started = false;
    const board = document.getElementById('board');
    for(var i = 0; i < r_length; i++){
        for(var j = 0; j < c_length; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.onclick = null;
            $cell.onmousedown = null;
        }
    }
    alert("you win");
}
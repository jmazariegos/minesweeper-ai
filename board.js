var timer;
var flag;
var rLength = 8;
var cLength = 8;
var left = 0;
var bombsLeft = 0;
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

document.documentElement.addEventListener('mouseout', function(e){
    if(flag) {
        const board = document.getElementById('board');
        for (var i = 0; i < rLength; i++) {
            for (var j = 0; j < cLength; j++) {
                const $cell = board.rows[i].cells[j].firstElementChild;
                if ($cell == e.target) {
                    releaseTile(i, j);
                }
            }
        }
    }
});

//Miscellaneous Functions (Img Change etc.)
function chgBombs(bombs, val){
    if(val < 0){
        return;
    }
    if(val < 10){
        bombs[0].src = 'resources/t0.png';
        bombs[1].src = 'resources/t0.png';
        bombs[2].src = 'resources/t' + val + '.png';
    }else if(val < 100){
        bombs[0].src = 'resources/t0.png';
        bombs[1].src = 'resources/t' + Math.floor(val/10)%10 + '.png';
        bombs[2].src = 'resources/t' + val%10 + '.png';
    }else{
        bombs[0].src = 'resources/t' + Math.floor(val/100)%10 + '.png';
        bombs[1].src = 'resources/t' + Math.floor(val/10)%10 + '.png';
        bombs[2].src = 'resources/t' + val%10 + '.png';
    }
}

function chgRange(){
    const $bombNum = document.getElementById("bombNum");
    $bombNum.innerText = document.getElementById("perBomb").value;
    if(!started){
        chgBombs(document.getElementsByClassName('bombs'), document.getElementById("perBomb").value);
    }
}

function pushTile(x, y){
    var e = window.event;
    if(e.which == 1){
        e.preventDefault();
        e.cancelBubble = false;
    }
    const guy = document.getElementById('guy');
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    if(e.which == 3){
        if(started){
            if($cell.src.includes('block')){
                $cell.src = 'resources/flag.png';
                bombsLeft--;
                chgBombs(document.getElementsByClassName('bombs'), bombsLeft);
            }else{
                $cell.src = 'resources/block.png';
                bombsLeft++;
                chgBombs(document.getElementsByClassName('bombs'), bombsLeft);
            }
        }
        return;
    }else {
        $cell.src = $cell.src.slice(0, $cell.src.length - 4) + ' pushed.png';
    }
    guy.src = 'resources/o.png';

    if(started){
        flag = setTimeout(function () {
            if ($cell.src.includes('block')) {
                $cell.src = 'resources/flag.png';
                bombsLeft--;
                chgBombs(document.getElementsByClassName('bombs'), bombsLeft);
            } else {
                $cell.src = 'resources/block.png';
                bombsLeft++;
                chgBombs(document.getElementsByClassName('bombs'), bombsLeft);
            }
            guy.src = 'resources/happy.png';
            flag = null;
        }, 1000);
    }
}

function releaseTile(x, y){
    var e = window.event;
    if(e.which == 3){
        return;
    }
    const guy = document.getElementById('guy');
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    guy.src = 'resources/happy.png';
    if(!started || flag){
        clearTimeout(flag);
        flag = null;
        if(!$cell.src.includes('flag')) {
            if (started) {
                reveal(x, y, true);
            } else {
                setBombs(x, y);
            }
        }else{
            $cell.src = 'resources/flag.png';
        }
    }
}

//Timer Functions

function timerIncrement(){
    const $time = document.getElementsByClassName("time");
    let val = (parseInt($time[0].src.charAt($time[0].src.lastIndexOf('t')+1))*100) +
        (parseInt($time[1].src.charAt($time[1].src.lastIndexOf('t')+1))*10) +
        parseInt($time[2].src.charAt($time[2].src.lastIndexOf('t')+1)) + 1;
    if(val < 10){
        $time[0].src = 'resources/t0.png';
        $time[1].src = 'resources/t0.png';
        $time[2].src = 'resources/t' + val + '.png';
    }else if(val < 100){
        $time[0].src = 'resources/t0.png';
        $time[1].src = 'resources/t' + Math.floor(val/10)%10 + '.png';
        $time[2].src = 'resources/t' + val%10 + '.png';
    }else{
        $time[0].src = 'resources/t' + Math.floor(val/100)%10 + '.png';
        $time[1].src = 'resources/t' + Math.floor(val/10)%10 + '.png';
        $time[2].src = 'resources/t' + val%10 + '.png';
    }
    if(val == 999){
        clearInterval(timer);
    }
}

//Board Functions

function createBoard(rows, cols) {
    started = false;
    clearInterval(timer);
    const $time = document.getElementsByClassName("time");
    for(var i = 0; i < 3; i++){
        $time[i].src = 'resources/t0.png';
    }
    const guy = document.getElementById('guy');
    guy.src = 'resources/happy.png';

    rLength = rows;
    cLength = cols;
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
            text += "<td><img src='resources/block.png' onmousedown='pushTile(" + i + "," + j + ")' onmouseup='releaseTile(" + i + "," + j + ")' oncontextmenu='return false;'/></td>";
        }
        text += "</tr>"
    }
    board.innerHTML = text;

    const boardContainer = document.getElementById('board-container');
    boardContainer.style.width = (cols*19 + 10).toString() + "px";
    boardContainer.style.height = (rows*19 + 27).toString() + "px";

    chgBombs(document.getElementsByClassName('bombs'), document.getElementById("perBomb").value);
}

function resetBoard(){
    const guy = document.getElementById('guy');
    guy.src = 'resources/happy.png';

    for(var i = 0; i < rLength; i++){
        for(var j = 0; j < cLength; j++){
            bombs[i][j] = false;
            revealed[i][j] = false;
        }
    }

    const board = document.getElementById('board');
    for(var i = 0; i < rLength; i++){
        for(var j = 0; j < cLength; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.src = 'resources/block.png';
            $cell.setAttribute("onmousedown", "pushTile(" + i + ", " + j + ");");
            $cell.setAttribute("onmouseup", "releaseTile(" + i + ", " + j + ");");
        }
    }

    started = false;
    chgBombs(document.getElementsByClassName('bombs'), document.getElementById("perBomb").value);
    clearInterval(timer);
    const $time = document.getElementsByClassName("time");
    for(var i = 0; i < 3; i++){
        $time[i].src = 'resources/t0.png';
    }
}

function setBombs(x, y){
    const num = document.getElementById("perBomb").value;
    for(var i = 0; i < num; i++){
        var row, col;
        do {
            row = Math.floor((Math.random() * rLength));
            col = Math.floor((Math.random() * cLength));
        }while(bombs[row][col] || (row == x && col == y) || (row == x+1 && col == y) || (row == x+1 && col == y+1) || (row == x+1 && col == y-1)
        || (row == x-1 && col == y) || (row == x-1 && col == y+1) || (row == x && col == y+1) || (row == x && col == y-1) || (row == x-1 && col == y-1));
        bombs[row][col] = true;
    }

    left = rLength*cLength - document.getElementById("perBomb").value;
    bombsLeft = document.getElementById("perBomb").value;
    timer = setInterval(timerIncrement, 1000);
    reveal(x, y, true);
    started = true;
}

function reveal(x, y, clicked){
    const board = document.getElementById('board');
    const $cell = board.rows[x].cells[y].firstElementChild;
    if($cell.src.includes('flag')){
        return;
    }
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
    if(x+1 < rLength && bombs[x+1][y]){
        bombsNear++;
    }
    if(x+1 < rLength && y+1 < cLength && bombs[x+1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && bombs[x-1][y]){
        bombsNear++;
    }
    if(x-1 >= 0 && y+1 < cLength && bombs[x-1][y+1]){
        bombsNear++;
    }
    if(x-1 >= 0 && y-1 >= 0 && bombs[x-1][y-1]){
        bombsNear++;
    }
    if(y+1 < cLength && bombs[x][y+1]){
        bombsNear++;
    }
    if(y-1 >= 0 && bombs[x][y-1]){
        bombsNear++;
    }
    if(x+1 < rLength && y-1 >= 0 && bombs[x+1][y-1]){
        bombsNear++;
    }

    if(bombsNear == 0){
        if(x+1 < rLength){
            reveal(x+1, y, false);
        }
        if(x+1 < rLength && y+1 < cLength){
            reveal(x+1, y+1, false);
        }
        if(x-1 >= 0){
            reveal(x-1, y, false);
        }
        if(x-1 >= 0 && y+1 < cLength){
            reveal(x-1, y+1, false);
        }
        if(x-1 >= 0 && y-1 >= 0){
            reveal(x-1, y-1, false);
        }
        if(y+1 < cLength){
            reveal(x, y+1, false);
        }
        if(y-1 >= 0){
            reveal(x, y-1, false);
        }
        if(x+1 < rLength && y-1 >= 0){
            reveal(x+1, y-1, false);
        }
    }
    $cell.src = 'resources/' + bombsNear + '.png';
    $cell.onmousedown = null;
    $cell.onmouseup = null;
    left -= 1;
    if(left == 0){
        win();
        return;
    }
}

function lose(x, y){
    const guy = document.getElementById('guy');
    guy.src = 'resources/wah.png';
    clearInterval(timer);
    started = false;
    const board = document.getElementById('board');
    for(var i = 0; i < rLength; i++){
        for(var j = 0; j < cLength; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.onmousedown = null;
            $cell.onmouseup = null;
            if(bombs[i][j]){
                if(x == i && y == j){
                    $cell.src = 'resources/explosion.png';
                }else if(!$cell.src.includes('flag')){
                    $cell.src = 'resources/bomb.png';
                }
            }else if($cell.src.includes('flag')){
                $cell.src = 'resources/wrong.png';
            }
        }
    }
}

function win(){
    const guy = document.getElementById('guy');
    var uwu = Math.random();
    if(uwu < 0.05){
        guy.src = 'resources/uwu.png';
    }else{
        guy.src = 'resources/cool.png';
    }
    clearInterval(timer);
    started = false;
    const board = document.getElementById('board');
    for(var i = 0; i < rLength; i++){
        for(var j = 0; j < cLength; j++){
            const $cell = board.rows[i].cells[j].firstElementChild;
            $cell.onmousedown = null;
            $cell.onmouseup = null;
        }
    }
    alert("you win");
}
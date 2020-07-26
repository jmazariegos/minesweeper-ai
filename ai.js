const rewardPercentage = 0.05;
var disabled = false;

class Node{
    constructor(state, leftConnections=[], rightConnections=[]){
        this.state = state;
        this.leftConnections = leftConnections;
        this.rightConnections = rightConnections;
    }

    getState(){
        return this.state;
    }

    addLeftConnection(connection){
        this.leftConnections.push(connection);
    }

    addRightConnection(connection){
        this.rightConnections.push(connection)
    }

    getLeftConnections(){
        return this.leftConnections;
    }

    getRightConnections(){
        return this.rightConnections;
    }

    forwardPass(){
        let maxConnection = this.rightConnections[0];
        for(let connection = 0; connection < this.rightConnections.length; connection++){
            let curConnection = this.rightConnections[connection];
            if(curConnection.getWeight() > maxConnection.getWeight()){
                maxConnection = curConnection;
            }
        }
        return maxConnection;
    }

}

class inputNode extends Node{
    forwardPass(){
        let maxConnection = super.forwardPass();
        let maxNode = maxConnection.getRight();
        let choice = maxNode.forwardPass();
        return [maxConnection.getPositions()[choice[0]], choice[1]];
    }
}

class hiddenNode extends Node{
    constructor(state, tiles, leftConnections=[], rightConnections=[]){
        super(state, leftConnections, rightConnections);
        this.tiles = tiles;
    }

    getTiles(){
        return this.tiles;
    }

    getMaxWeight(){
        let max_weight = 0;
        for(let connection = 0; connection < this.rightConnections.length; connection++){
            max_weight = Math.max(max_weight, this.rightConnections[connection].getWeight())
        }
        return max_weight
    }

    forwardPass(){
        let maxConnection = super.forwardPass();
        let maxNode = maxConnection.getRight();
        return [maxConnection.getPositions()[0], maxNode];
    }

    backwardPass(reward){
        for(let connection = 0; connection < this.leftConnections.length; connection++){
            this.leftConnections[connection].adjustWeight(reward);
        }
    }
}

class outputNode extends Node{
    backwardPass(reward){
        let connection = this.leftConnections[0];
        let leftNode = connection.getLeft();
        if(leftNode.getTiles() == 9){
            return;
        }
        connection.adjustWeight(connection.getWeight()*reward);
        let difference = Math.abs(1 - reward);
        let neighbours = leftNode.getRightConnections();
        let maxWeight = 0;
        for(let neighbour = 0; neighbour < neighbours.length; neighbour++){
            if(neighbours[neighbour] != connection){
                if(reward > 1) {
                    neighbours[neighbour].adjustWeight(neighbours[neighbour].getWeight() * (1 - difference / leftNode.getTiles()));
                }else{
                    neighbours[neighbour].adjustWeight(neighbours[neighbour].getWeight() * (1 + difference / leftNode.getTiles()));
                }
            }
            if(neighbours[neighbour].getWeight() > maxWeight){
                maxWeight = neighbours[neighbour].getWeight();
            }
        }
        leftNode.backwardPass(maxWeight);
    }
}

class Connection{
    constructor(weight, leftConnection, rightConnection){
        this.weight = weight;
        this.positions = [];
        this.leftConnection = leftConnection;
        this.rightConnection = rightConnection;
    }

    getLeft(){
        return this.leftConnection;
    }

    getRight(){
        return this.rightConnection;
    }

    adjustWeight(newWeight){
        this.weight = newWeight;
    }

    getWeight(){
        return this.weight;
    }

    addPosition(position){
        this.positions.push(position);
    }

    getPositions(){
        return this.positions;
    }
}

class AI{
    constructor(boardState){
        this.nodeDict = {};
        this.hiddenNodeDict = {};
        this.updateBoard(boardState);
    }

    updateBoard(boardState){
        //board node
        let node = new inputNode(boardState);
        //console.log(boardState);

        //going through each 3x3 square on the board
        for(var i = 0; i < boardState.length-2; i++){
            for(var j = 0; j < boardState[0].length-2; j++){
                let squareState = [[boardState[i][j], boardState[i][j+1], boardState[i][j+2]],
                    [boardState[i+1][j], boardState[i+1][j+1], boardState[i+1][j+2]],
                    [boardState[i+2][j], boardState[i+2][j+1], boardState[i+2][j+2]]];
                //console.log(squareState);
                let unrevealed = 9 - squareState.filter(Boolean).length;

                //have we seen this state before?
                let squareNode;
                if(!(squareState in Object.keys(this.hiddenNodeDict))){
                    squareNode = new hiddenNode(squareState, unrevealed);

                    //go through each tile in the square
                    for(var i_m = 0; i_m < 3; i_m++) {
                        for (var j_m = 0; j_m < 3; j_m++) {
                            let tileNode = new outputNode(squareState[i_m][j_m])
                            let weight = 1.0/unrevealed
                            if(squareState[i_m][j_m]){
                                weight = 0;
                            }
                            let sqTiConnection = new Connection(weight, squareNode, tileNode);

                            //add relative position in the square i.e. tile 0 - 8 (left to right then down 1)
                            sqTiConnection.addPosition((i_m*3) + j_m);
                            squareNode.addRightConnection(sqTiConnection);
                            tileNode.addLeftConnection(sqTiConnection);
                        }
                    }
                    this.hiddenNodeDict[squareState] = squareNode;

                //we have seen this state before!
                }else{
                    squareNode = this.hiddenNodeDict[squareState];
                }
                let boSqconnection = new Connection(squareNode.getMaxWeight(), node, squareNode);
                for(var i_m = 0; i_m < 3; i_m++) {
                    for (var j_m = 0; j_m < 3; j_m++) {
                        boSqconnection.addPosition([i + i_m, j + j_m]);
                    }
                }
                node.addRightConnection(boSqconnection);
                squareNode.addLeftConnection(boSqconnection);
            }
        }
        this.nodeDict[boardState] = node;
        return node;
    }

    input(boardState){
        let node;
        if(boardState in this.nodeDict){
            node = this.nodeDict[boardState];
        }else{
            node = this.updateBoard(boardState);
        }
        let choice = node.forwardPass();
        let index = choice[0];

        const board = document.getElementById('board');
        const $cell = board.rows[index[0]].cells[index[1]].firstElementChild;
        let mousedown = new Event("mousedown");
        let mouseup = new Event("mouseup");
        $cell.dispatchEvent(mousedown);
        $cell.dispatchEvent(mouseup);

        if(started == false && left > 0) {
            choice[1].backwardPass(1.0 - rewardPercentage);
        }else{
            choice[1].backwardPass(1.0 + rewardPercentage);
        }
    }
}

var ai;
function createAI(){
    resetBoard();
    ai = new AI(revealed);

    const guy = document.getElementById('guy');
    guy.src = "resources/hal.png";

    const aiOptions = document.getElementById('ai-options');
    let text = "<tr><td><input type='number' min='1' step='1' value='1' class='option' id='rounds'>Rounds</input></td>";
    text += "<td><button onclick='startUp()' class='option' id='start'>Start A Round</button></td>";
    text += "<td><input type='number' min='0' step='1' value='0' class='option' id='delay'>Delay</input></td></tr>";
    aiOptions.innerHTML = text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startUp() {
    const delay = document.getElementById('delay').value;
    const rounds = document.getElementById('rounds').value;
    for(let round = 0; round < rounds; round++) {
        resetBoard();
        do {
            ai.input(revealed);
            sleep(delay);
        } while (started);
    }
}

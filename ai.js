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
        return (maxConnection.getPositions()[choice[0]], choice[1]);
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
        return (maxConnection.getPositions()[0], maxNode);
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
        let neighbours = leftNode.getRightConnections();
        let maxWeight = 0;
        for(let neighbour = 0; neighbour < neighbours.length; neighbour++){
            if(neighbours[neighbour] != connection){
                neighbours[neighbour].adjustWeight(neighbours[neighbour].getWeight()*(1-reward/leftNode.getTiles()))
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
        this.positions.concat(position);
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
        let node = new inputNode(boardState);
        for(var i = 0; i < boardState.length-2; i++){
            for(var j = 0; j < boardState[0].length-2; j++){
                let miniState = [[boardState[i][j], boardState[i][j+1], boardState[i][j+2]],
                    boardState[i+1][j], boardState[i+1][j+1], boardState[i+1][j+2],
                    boardState[i+2][j], boardState[i+2][j+1], boardState[i+2][j+2]];
                let miniNode;
                let unrevealed = 9 - miniState.filter(Boolean).length
                if(!(miniState in this.hiddenNodeDict)){
                    miniNode = new hiddenNode(miniState, unrevealed);
                    for(var i_m = 0; i_m < 3; i_m++) {
                        for (var j_m = 0; j_m < 3; j_m++) {
                            let microNode = new outputNode(miniState[i_m][j_m])
                            let miniConnection = new Connection(1/unrevealed, miniNode, microNode);
                            miniConnection.addPosition([(i_m + 1) + (j_m + 1)]);
                            miniNode.addRightConnection(miniConnection);
                            microNode.addLeftConnection(miniConnection);
                        }
                    }
                    this.hiddenNodeDict[miniState] = miniNode;
                }else{
                    miniNode = this.hiddenNodeDict[miniState];
                }
                let connection = new Connection(miniNode.getMaxWeight(), node, miniNode);
                connection.addPosition([(i, j), (i, j+1), (i, j+2), (i+1, j), (i+1, j+1), (i+1, j+2), (i+2, j), (i+2, j+1), (i+2, j+2)])
                node.addRightConnection(connection);
                miniNode.addLeftConnection(connection);
            }
        }
        this.nodeDict[boardState] = node;
        return node;
    }

    input(boardState){
        let node;
        if(boardState in this.nodeDict){
            node = this.updateBoard(boardState);
        }
        let choice = node.forwardPass();
        console.log(choice);
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

function checkLength(which){
    var box;
    if(which){
        box = document.getElementById('delay');
    }else{
        box = document.getElementById('rounds');
    }
    box.value = box.value.slice(0, 2);
}

var ai;
function createAI(){
    resetBoard();
    ai = new AI(revealed);

    const guy = document.getElementById('guy');
    guy.src = "resources/hal.png";

    const aiOptions = document.getElementById('ai-options');
    let text = "<tr><td><input type='number' oninput='checkLength(0)' class='option' id='rounds'>Rounds</input></td>";
    text += "<td><button onclick='startUp()' class='option' id='start'>Start A Round</button></td>";
    text += "<td><input type='number' oninput='checkLength(1)' class='option' id='delay'>Delay</input></td></tr>";
    aiOptions.innerHTML = text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startUp() {
    resetBoard();
    ai.input(revealed);
}

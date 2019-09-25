class Node{
    constructor(state, right_connection=null, left_connection=null){
        this.state = state;
        this.right_connection = right_connection;
        this.left_connection = left_connection;
    }
}

class Connection{
    constructor(left_node, right_node, weight){
        this.left_node = left_node;
        this.right_node = right_node;
        this.weight = weight;
    }

    getWeight(){
        return this.weight;
    }

    setWeight(weight){
        this.weight = weight;
    }

    setLeftNode(left_node){
        this.left_node = left_node;
    }

    setRightNode(right_node){
        this.right_node = right_node;
    }
}

class AI{
    constructor(){
        this.node_dict = {};
        this.board_dict = {};
    }

    addState(state){
        let node = new Node(state);
        this.node_dict[state] = node;
    }

    translate(board, start){
        let state = new Array();
        for(var row = start; row < start+3; row++){
            state[row] = new Array();
            for(var col = start; col < start+3; col++){
                const $cell = board.rows[x].cells[y].firstElementChild;
                if($cell.src.includes('block')){
                    //state[row][col] = (true, 0);
                    state[row][col] = true;
                }else{
                    //let bombs = $cell.src.charAt($cell.src.lastIndexOf('.')-1);
                    //state[row][col] = (false, bombs);
                    state[row][col] = false;
                }
            }
        }
        return state;
    }

    input(state){

    }
}

var ai = new AI();

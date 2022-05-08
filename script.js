

/*TO DO:

    -create smarter way for cpu to attack
    -do the hovor placement of user ships, keep buttons
    -fix the obvious crap like usability



*/






var X;
var Y;
var settingUser = false; 
var clickableUser = false;
var clickableAttack = false ;




hardmode = false;

var userShipsDestroyed = 0;
var cpuSquaresHit = 0;


var userBoard = [ // 1 = ship, 2 = hit, 3 = miss
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
    ]

var userShips = {
    //[placed, size, destroyed, color, coordinates, squares hit]
    Carrier: [0, 5, false, 'grey', [], 0],   // CHANGE THEESE COLORS for each:
    Battleship: [0, 4, false, 'grey', [], 0],
    Destroyer: [0, 3, false, 'grey', [], 0],
    Submarine: [0, 3, false, 'grey', [], 0],
    PatrolBoat: [0, 2, false, 'grey', [], 0],
}

var cpuShips = {
    // [coordinates, squares hit, total Squares, is destroyed]
    Carrier: [[], 0, 5, false], 
    Battleship: [[], 0, 4, false],
    Destroyer: [[], 0, 3, false],
    Submarine: [[], 0, 3, false],
    PatrolBoat:[[], 0, 2, false],

}


var cpuBoard = [ //IMPORTANT NOTE - the memory coordianates and the board visuals are transposed(X=Y), (Y = X) this does not affect the functionality of the program at all and is not worth fixing at the moment.
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
    ]

var cpuFired= [ // 0 is a spot that hasnt been fired at yet, 1 is a miss, 2 is a hit
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
    ]

//i got the majority of the grid drawing code from https://codepen.io/tealynsea/pen/Eavzpb 
function displayGrid(canvas) {
    var canvas = document.getElementById(canvas);
    if (canvas.getContext) {
        var context = canvas.getContext('2d');


        context.fillStyle='rgb(176, 213, 255)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        for(var x=0.5;x<276;x+=25) {
            context.moveTo(x,0);
            context.lineTo(x,275);
        }

        for(var y=0.5; y<276; y+=25) {
            context.moveTo(0,y);
            context.lineTo(275,y);

        }

        context.strokeStyle='grey';
        context.stroke();

        context.strokeStyle='Black';

        //Draw Letters on the top
        context.font = "15px Arial";
        context.fillStyle='black';
        var letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        let xPosLetter = 32;
        for (let i = 0; i < 11; i++){
            context.fillText(letter[i], xPosLetter, 18);
            xPosLetter += 25;
        }

        //Draw Numbers On the side
        let yPosNum = 42;
        for (let i = 1; i < 11; i++){
            context.fillText(i, 5, yPosNum);
            yPosNum += 25;
        }



    }
}


//checks the board for 1s and display 
function displayUserShips(){
    for (var r = 0; r < 10; r++ ){
        for (var c = 0; c < 10; c++){
            if (userBoard[r][c] == 1){
                fillSquareUser(r, c, 'grey');
            }
        }
    }
}

function startGame(){
    randomCpuShipPlacement();
    clickableUser = false;
    window.alert("All User Ships Placed. Click a square above to fire torpedo");
    clickableAttack = true;
}

function gameOver(){
    if(userShipsDestroyed == 5){
        window.alert("You Win!");
    }else{
        window.alert("You Loose!")
    }
}

function randomCpuShipPlacement(){ // places ships for cpu in random spots that dont overlap
    var ships = [5, 4, 3, 3, 2];
    var placeHorizontal;
    var canBePlaced;
    var cpuShipBeingSet = "";

    for (var currentShip = 0; currentShip < 5; currentShip++){ // for each ship size:
        if(currentShip == 0) cpuShipBeingSet = "Carrier";
        if(currentShip == 1) cpuShipBeingSet = "Battleship";
        if(currentShip == 2) cpuShipBeingSet = "Destroyer";
        if(currentShip == 3) cpuShipBeingSet = "Submarine";
        if(currentShip == 4) cpuShipBeingSet = "PatrolBoat";
        
        placeHorizontal = Boolean(Math.round(Math.random()));
        canBePlaced = false;

        while (canBePlaced == false){
            if (placeHorizontal == true){//Gets the first square of ship
                var firstSquare = [Math.floor(Math.random() * (10)), Math.floor(Math.random() * (10 - ships[currentShip]))];
            }else{
                var firstSquare = [Math.floor(Math.random() * (10 - ships[currentShip])), Math.floor(Math.random() * (10))];
            }
            var allShipSquaresEmpty = true;


            for(var i = 0; i < ships[currentShip]; i++){ //each ship takes the first square and then checks the necisary number of squares down or to the right to see if they are empty and the ship can be placed
                if(placeHorizontal == true){
                    if(cpuBoard[firstSquare[0]][firstSquare[1] + i] == 1){
                        allShipSquaresEmpty = false;
                        //console.log("Space occupied at " + firstSquare[0] + "," + (firstSquare[1] + i) + "   for square " + i );
                    }
                }else{
                    if(cpuBoard[firstSquare[0] + i][firstSquare[1]] == 1){
                        allShipSquaresEmpty = false;
                        //console.log("Space occupied at " + (firstSquare[0] + i) + "," + firstSquare[1] + "   for square " + i );
                    }
                }
            }

            if (allShipSquaresEmpty == true){
                canBePlaced = true;
            }
        }


        //console.log(placeHorizontal, firstSquare);


        for(var i = 0; i < ships[currentShip]; i++){//set ship in board - places ship either down or to the right from firstSquare coordinates
            if(placeHorizontal == true){
                cpuBoard[firstSquare[0]][firstSquare[1] + i] = 1;
                cpuShips[cpuShipBeingSet][0].push([firstSquare[0], firstSquare[1] + i]);
            }else{
                cpuBoard[firstSquare[0] + i][firstSquare[1]] = 1;
                cpuShips[cpuShipBeingSet][0].push([firstSquare[0] + i, firstSquare[1]]);

            }
        }



    }

}

//https://codepen.io/tealynsea/pen/Eavzpb 
function clickSquareUser(event) {
    if (clickableUser == true){
        //gets the coordinates and transfers them into Letter - number form for battleship
        var x = event.clientX - 15;
        var y = event.clientY - 300;
        var coords = "X coordinates: " + x + ", Y coordinates: " + y;
        //document.getElementById('showCoords').innerHTML = coords;
    
    
        var number = Math.floor(y / 25);
        if(number == 0) number = "";
        var letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        var letter = Math.floor(x / 25);
    
        var letterNum = letters[letter] + number;
    
        document.getElementById('showLetterNum').innerHTML = shipBeingSet + " placed at " + letterNum; 

    
        X = letter - 1;
        Y = number - 1;

        if (settingUser == true){
            setShipsUser();
        }
    }
  
}

function clickSquareAttack(event) { 
    if (clickableAttack == true){

        //same as above
        var x = event.clientX - 15;
        var y = event.clientY - 15;
        var coords = "X coordinates: " + x + ", Y coordinates: " + y;
        //document.getElementById('showCoords').innerHTML = coords;
    
    
        var number = Math.floor(y / 25);
        if(number == 0) number = "";
        var letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        var letter = Math.floor(x / 25);
    
        var letterNum = letters[letter] + number;
    
        document.getElementById('showLetterNum').innerHTML = "You Fired " + letterNum;

    
        X = letter - 1;
        Y = number - 1;

        if (cpuBoard[X][Y] == 2 || cpuBoard[X][Y] == 3){
            document.getElementById("attackInfo").innerHTML = "You Already Clicked Here!";
        }


        if (cpuBoard[X][Y] == 1){ // checks if clicked spot is a ship
            document.getElementById("attackInfo").innerHTML = "You HIT!";
            fillSquareAttack(Y, X, "red");
            cpuBoard[X][Y] = 2;

            var ship = "";
            for (var i = 0; i < 5; i ++){
                if(i == 0) ship = "Carrier";
                if(i == 1) ship = "Battleship";
                if(i == 2) ship = "Destroyer";
                if(i == 3) ship = "Submarine";
                if(i == 4) ship = "PatrolBoat";

                for(var j = 0; j < cpuShips[ship][0].length; j ++){// checks coordinates of placed ship and matches the hit to that ship
                    if((cpuShips[ship][0][j][0] == X) && (cpuShips[ship][0][j][1] == Y)){
                        cpuShips[ship][1] ++;
                    }
                }

                if((cpuShips[ship][1] == cpuShips[ship][2]) && cpuShips[ship][3] == false){ //uses info gained above to determine what ship is sunk
                    document.getElementById("attackInfo").innerHTML = "You sunk their " + ship;
                    window.alert("You sunk their " + ship);
                    cpuShips[ship][3] = true;
                    userShipsDestroyed ++;
                }
            }


            clickableAttack = false;

            if (userShipsDestroyed == 5){
                gameOver();
            }else{
                if (hardmode == false) easyCpuAttack();
                if(hardmode == true) hardCpuAttack();
            }
        }

        if (cpuBoard[X][Y] == 0){
            fillSquareAttack(Y, X, "rgb(182, 182, 182)");
            cpuBoard[X][Y] = 3;
            clickableAttack = false;
            document.getElementById("attackInfo").innerHTML = "You MISSED!";
            if (hardmode == false) easyCpuAttack();
            if(hardmode == true) hardCpuAttack();
        }


        
    }
  
}



//create a smarter cpu attack
//make into one function and allow user to choose

function easyCpuAttack(){
    var shot = [Math.floor(Math.random() * (10)), Math.floor(Math.random() * (10))]; // random coordinate

    if (userBoard[shot[1]][shot[0]] != 2 && userBoard[shot[1]][shot[0]] != 3){ //see info about userBoard to see what numbers mean, checks if its been hit

        if (userBoard[shot[1]][shot[0]] == 1){
            userBoard[shot[1]][shot[0]] = 2;
            console.log((shot[1]));
            console.log(shot[0]);
            fillSquareUser(shot[1],shot[0], "orange");
            cpuSquaresHit ++;
            clickableAttack = true;
            document.getElementById("userInfo").innerHTML= "CPU HIT a ship!";
            if (cpuSquaresHit == 17){
                gameOver();
            }
        }
        if (userBoard[shot[1]][shot[0]] == 0){
            fillSquareUser(shot[1],shot[0], "blue");
            userBoard[shot[1]][shot[0]] = 3;
            clickableAttack = true;
            document.getElementById("userInfo").innerHTML= "CPU MISSED";

        }
    }else{
        easyCpuAttack(); // if the random coordinate is a point already shot at, get another one 
    }



}


/*

MY ATTEMPT TO MAKE A SMARTER CPU


//coordinates of past hit sqares, ship being targeted is horizontal
var damagedShip = [[], false];

function hardCpuAttack(){
    if (damagedShip[0].length == 1){

        damagedShip[1] = Boolean(Math.round(Math.random()));
        var leftRight = 0;
        if (Math.random() > 0.5){leftRight = Number(1);}else{leftRight = Number(-1);}
        var Updown = 0;
        if (Math.random() > 0.5){Updown = Number(1);}else{Updown = Number(-1);}
        console.log(leftRight);
        console.log(Updown);

        if(damagedShip[1] == true){
            var shot = [damagedShip[0][0] + leftRight, NumberdamagedShip[0][1]];
            console.log(shot);
        }else{
            var shot = [damagedShip[0][0], damagedShip[0][1] + Updown];
            console.log(shot);
        }


    }else if(damagedShip[0].length > 1){
        
    }else{
        var shot = [Math.floor(Math.random() * (10)), Math.floor(Math.random() * (10))]; // random shot
    }

    if (userBoard[shot[0]][shot[1]] != 2 && userBoard[shot[0]][shot[1]] != 3){
        if (userBoard[shot[0]][shot[1]] == 1){
            userBoard[shot[0]][shot[1]] = 2;

            damagedShip[0].push([shot[0],shot[1]]);


            fillSquareUser(shot[0],shot[1], "orange");
            for (var i = 0; i < 5; i ++){
                if(i == 0) ship = "Carrier";
                if(i == 1) ship = "Battleship";
                if(i == 2) ship = "Destroyer";
                if(i == 3) ship = "Submarine";
                if(i == 4) ship = "PatrolBoat";

                for(var j = 0; j < userShips[ship][4].length; j ++){
                    if((userShips[ship][4][j][0] == shot[0]) && (userShips[ship][4][j][1] == shot[1])){
                        userShips[ship][5] ++;
                    }
                }

                if((userShips[ship][5] == userShips[ship][1]) && userShips[ship][2] == false){
                    window.alert("The CPU sank your " + ship);
                    userShips[ship][2] = true;
                    cpuShipsDestroyed ++;
                }
            
            }
            clickableAttack = true;

            if (cpuShipsDestroyed == 5){
                gameOver();
            }
        }



        if (userBoard[shot[0]][shot[1]] == 0){
            fillSquareUser(shot[0],shot[1], "blue");
            userBoard[shot[0]][shot[1]] = 3;
            clickableAttack = true;
        }
    }else{
        hardCpuAttack();
    }



}
*/




function fillSquareUser(number, letter, color){
    var x = (letter * 25) + 25;
    var y = (number * 25) + 25;

    var canvas = document.getElementById('canvas1');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = color;

        context.fillRect(x, y, 25, 25);

    }

}

function fillSquareAttack(number, letter, color){
    var x = (letter * 25) + 25;
    var y = (number * 25) + 25;

    var canvas = document.getElementById('canvas2');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = color;

        context.fillRect(x, y, 25, 25);

    }

}

function clearGridUser(){
    var canvas = document.getElementById('canvas1');
    var context = canvas.getContext('2d');

    for (var r = 0; r < 10; r++ ){
        for (var c = 0; c < 10; c++){
            if (userBoard[r][c] != 1){
                fillSquareUser(r, c, 'rgb(176, 213, 255)');
            }
        }
    }

    for(var x=0.5;x<551;x+=50) {
        context.moveTo(x,0);
        context.lineTo(x,550);
    }

    for(var y=0.5; y<551; y+=50) {
        context.moveTo(0,y);
        context.lineTo(550,y);

    }

    context.strokeStyle='grey';
    context.stroke();

}


var shipBeingSet;
var previousSquare;
var vertical = false;

var canvasss = document.getElementById("canvas1");

function showHighlights(event){ // Gets mouse position and then draws squares based on ship length being placed
    if (clickableUser == true){
        var pos = getMousePos(canvasss, event)
        clearGridUser();
        if (setHorizontal){
            if (!(pos.x < 0 || pos.y < 0)){
                if(shipBeingSet == "Carrier"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y , pos.x + 1, "grey");
                    fillSquareUser(pos.y, pos.x + 2, "grey");
                    fillSquareUser(pos.y, pos.x + 3, "grey");
                    fillSquareUser(pos.y, pos.x + 4, "grey");
                }
                if(shipBeingSet == "Battleship"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y , pos.x + 1, "grey");
                    fillSquareUser(pos.y, pos.x + 2, "grey");
                    fillSquareUser(pos.y, pos.x + 3, "grey");
                }
                if(shipBeingSet == "Destroyer"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y , pos.x + 1, "grey");
                    fillSquareUser(pos.y, pos.x + 2, "grey");
                }
                if(shipBeingSet == "Submarine"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y , pos.x + 1, "grey");
                    fillSquareUser(pos.y, pos.x + 2, "grey");
                }
                if(shipBeingSet == "PatrolBoat"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y , pos.x + 1, "grey");
                }
            }

        }else{
            if (!(pos.x < 0 || pos.y < 0)){
                if(shipBeingSet == "Carrier"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y + 1, pos.x, "grey");
                    fillSquareUser(pos.y + 2, pos.x, "grey");
                    fillSquareUser(pos.y + 3, pos.x, "grey");
                    fillSquareUser(pos.y + 4, pos.x, "grey");
                }
                if(shipBeingSet == "Battleship"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y + 1, pos.x, "grey");
                    fillSquareUser(pos.y + 2, pos.x, "grey");
                    fillSquareUser(pos.y + 3, pos.x, "grey");
                }
                if(shipBeingSet == "Destroyer"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y + 1, pos.x, "grey");
                    fillSquareUser(pos.y + 2, pos.x, "grey");
                }
                if(shipBeingSet == "Submarine"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y + 1, pos.x, "grey");
                    fillSquareUser(pos.y + 2, pos.x, "grey");
                }
                if(shipBeingSet == "PatrolBoat"){
                    fillSquareUser(pos.y, pos.x, "grey");
                    fillSquareUser(pos.y + 1, pos.x, "grey");

                }


            }
        }







    }
}

//help from https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas

function getMousePos(canvas, event) {
    var x = event.clientX - 15;
    var y = event.clientY - 300;

    var number = Math.floor(y / 25);
    if(number == 0) number = "";
    var letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    var letter = Math.floor(x / 25);

    var letterNum = letters[letter] + number;



    return {
      x: letter - 1,
      y: number - 1,
    };
}



function placeShipSection(y, x){
    userBoard[Y][X] = 1;
    userShips[shipBeingSet][0] ++;
    userShips[shipBeingSet][4].push([Y, X]);
    fillSquareUser(Y, X, userShips[shipBeingSet][3]);
    if(userShips[shipBeingSet][0] == userShips[shipBeingSet][1]){
        enableShipSettingButtons();
    }



}


var setHorizontal = true;

function toggleHoriz(){
    if (setHorizontal == true) {
        setHorizontal = false;
        document.getElementById("toggleH").innerHTML = "Place Horizontal";
    }else{
        setHorizontal = true; 
        document.getElementById("toggleH").innerHTML = "Place Vertical";

    }
}


function setShipsUser(){
    var ships = [5, 4, 3, 3, 2];
    var canBePlaced;
    var userShipBeingSet = "";

    
        if(shipBeingSet == "Carrier") currentShip = 0;
        if(shipBeingSet == "Battleship") currentShip = 1;
        if(shipBeingSet == "Destroyer") currentShip = 2;
        if(shipBeingSet == "Submarine") currentShip = 3;
        if(shipBeingSet == "PatrolBoat") currentShip = 4;
        
        canBePlaced = false;

        var inbounds = false;
        if (setHorizontal == true){//Gets the first square of ship
            if (X < (11 - ships[currentShip])){
                inbounds = true;
            }
        }else{
            if (Y < (11 - ships[currentShip])){
            inbounds = true;
            }
        }


        var allShipSquaresEmpty = true;
        for(var i = 0; i < ships[currentShip]; i++){ //each ship takes the first square and then checks the necisary number of squares down or to the right to see if they are empty and the ship can be placed
            if(setHorizontal == true){
                if(userBoard[Y][X + i] == 1){
                    allShipSquaresEmpty = false;
                        //console.log("Space occupied at " + firstSquare[0] + "," + (firstSquare[1] + i) + "   for square " + i );
                }
            }else{
                if(userBoard[Y+ i][X] == 1){
                    allShipSquaresEmpty = false;
                    //console.log("Space occupied at " + (firstSquare[0] + i) + "," + firstSquare[1] + "   for square " + i );
                }
            }
        }

        if (allShipSquaresEmpty == true && inbounds == true){
            for(var i = 0; i < ships[currentShip]; i++){//set ship in board - places ship either down or to the right from firstSquare coordinates
                if(setHorizontal == true){
                    userBoard[Y][X + i] = 1;
                    placeShipSection(Y, X, "grey");
                }else if(setHorizontal == false){
                    userBoard[Y + i] [X] = 1;
                    placeShipSection(Y, X, "grey");
    
                }
            }

        }
    
        
}


function hideShipSettingButtons(){
    clickableUser = true;
    for(data in userShips){
        button = document.getElementById(data.toString());
        button.hidden = true;
        
    }

}

function enableShipSettingButtons(){ 
    clickableUser = false;
    var allset = true;
    button = document.getElementById("toggleH");
    button.hidden = false;

    if (userShips.Battleship[0] < userShips.Battleship[1]){
        button = document.getElementById("Battleship");
        button.hidden = false;
        allset = false;
    }

    if (userShips.Carrier[0] < userShips.Carrier[1]){
        button = document.getElementById("Carrier");
        button.hidden = false;
        allset = false;

    }

    if (userShips.Destroyer[0] < userShips.Destroyer[1]){
        button = document.getElementById("Destroyer");
        button.hidden = false;
        allset = false;

    }

    if (userShips.Submarine[0] < userShips.Submarine[1]){
        button = document.getElementById("Submarine");
        button.hidden = false;
        allset = false;

    }

    if (userShips.PatrolBoat[0] < userShips.PatrolBoat[1]){
        button = document.getElementById("PatrolBoat");
        button.hidden = false;
        allset = false;

    }

    if (allset == true){
        startGame();
        button = document.getElementById("toggleH");
        button.hidden = true;


    }
}


// Global Variable

var allEnemies = []; // stores all enemy objects
var player;
var gem;
var allGems = []; // stores all gem objects 
var possibleGems = ['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png'];
var highestScore = 0;
var newHighScore; // true when a new high score is reached.
var score = 0;
var audio = new Audio;


// Use jQuery to call the welcome modal, modal works through css & HTML

$(document).ready(function(){
    location.href = "#welcomeModal";
});


// Different functions that help the game run

 const Helper ={

//-- shuffle function

 returnRandomValue(array) {


   var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array[randomIndex]; //-- shuffles and returns an array


 },
 //-- checks for collision between two objects on the canvas, useful for checking if player collides with enemy


 collisionDetection(obj1, player){
    return !( player.x + obj1.xoffset > (obj1.x + obj1.width)  ||  // player is to the right of figure 1
    (player.x + player.width - obj1.xoffset) < obj1.x    ||  // player is to the left of fig 1
    player.y + (player.height - obj1.yoffset) < (obj1.y) ||  //player is above fig1
    player.y  > (obj1.y + (obj1.height - obj1.yoffset)))   //player is below fig1
},
//-- checks for collisions between two objects on the canvas, useful for checking if gems ane player are on the same block)
sameBlock(fig1, player){
    var fig1Row = Helper.getRow(fig1);
    var fig1Col = Helper.getCol(fig1);
    var playerRow = Helper.getRow(player);
    var playerCol = Helper.getCol(player);
    if(fig1Row == playerRow && fig1Col == playerCol){
        return true;
    }},

 //-- calculates the row number of elements , used in the sameBlock function

getRow(element){
    var row;
    if((element.y + element.height/2) <= 85){
        row = 0;
    }
    if((element.y + element.height/2) > 85 && (element.y + element.height/2) <= 170){
        row = 1;
    }
    if((element.y + element.height/2) > 170 && (element.y + element.height/2) <= 255){
        row = 2;
    }
    if((element.y + element.height/2) > 255 && (element.y + element.height/2) <= 340){
        row = 3;
    }
    if((element.y + element.height/2) > 340 && (element.y + element.height/2) <= 425){
        row = 4;
    }
    if((element.y + element.height/2) > 425){
        row = 5;
    }
    return row;
},

 //-- calculates the column number of elements , used in the sameBlock function

getCol(element){
    var col;
    if(element.x < 100){
        col = 0;
    }
    if(element.x >= 100 && element.x < 200){
        col = 1;
    } 
    if(element.x >= 200 && element.x < 300){
        col = 2;
    }
    if(element.x >= 300 && element.x < 400){
        col = 3;
    }
    if(element.x >= 400){
        col = 4;
    }
    return col;

},

 //-- calculates the high score, uses jQuery to dynamically display the high score board div

highScore(){

   

 $('#highScoreBoard').css('display','block') ;

  var URL = encodeURIComponent("https://ifeanyiibekwe.github.io/frontend-nanodegree-arcade-game-master-/");
   var text = encodeURIComponent("I scored " + highestScore + " on Frogger!")
  $('#highScoreBoard').html ("High Score: " + score +"<br>"+'<a class="twitter-share-button" id="tweet-score" target="_blank" href="https://twitter.com/share?url='+ URL +'&text='+ text +'">Tweet Your Score</a>');
},

//-- Accepts a string and executes "if" statements based on the value
updateScore (event){
    if(possibleGems.indexOf(event) > -1){ // if the gem url string received is found in the possible gems array
        score += Helper.getGemScore(event); //proceed to update score with corresponding gem value received from gemscore function
        $('#scoreBoard').html ("Score: " + score);
        audio.src = 'sounds/levelup.mp3';
        audio.play();
    }
   if(event == "died") {
        if(newHighScore){
            Helper.highScore();
       }
      newHighScore = false;
        score = 0;
       $('#scoreBoard').html("You Died! Score: " + score);
    
        $('#scoreBoard').css("backgroundColor" ,"#C72317");
        $('#scoreBoard').css("color" , "#ffffff");
        audio.src = 'sounds/fail.mp3';
        audio.play();
    }
    if(event == "water"){
        score += 10;
        $('#scoreBoard').html( "Yay! Score: " + score);
        audio.src = 'sounds/score.mp3';
        audio.play();
    }
    if(score >= 100){
        $('#scoreBoard').html("Wow! Score: " + score);
        $('#scoreBoard').css("backgroundColor ", "#FDB93A");
        $('#scoreBoard').css("color",  "#E1077F");

    }
    if(score == 100 || score == 200){
        $('#scoreBoard').html("*New Level!!!* " + score)
        ;
        audio.src = 'sounds/gem.mp3';
        audio.play();
    }
    
    if(score > highestScore){
        highestScore = score;
        newHighScore = true;
    }      



 },
 //-- maps gem image strings to corresponding scores
 getGemScore(gemImageString){
    var gemScores = {
        "images/Gem-Green.png": 20,
        "images/Gem-Blue.png": 30,
        "images/Gem-Orange.png": 50
        }
    return gemScores[gemImageString];
}
 }
 

 // Takes gem urls, shuffles them and creates a gem from one of them
var Gem = function() {
    this.gemImage = Helper.returnRandomValue(possibleGems); // shuffles gem images
    this.x = Helper.returnRandomValue([126, 227, 328]); // shuffles gem position on the x axis
    this.y = Helper.returnRandomValue([115, 200, 275]); // shuffles gem position om the y axis
    this.width = 50;
    this.height = 85;   
}

//-- Draws gem on the canvas using game engine and resources
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gemImage), this.x, this.y);

}

//-- Uses sameBlock function to check if player has collided with gem and updates score accordingly
Gem.prototype.update = function() {
    allGems.forEach(function(gem, index) {
        if(Helper.sameBlock(gem, player)){
            Helper.updateScore(gem.gemImage); // passes gem into updatescore function to check for corresponding score
            Gem.expireGem(gem);
        }
    });
}
// - Generates gem, calls itself after random time intervals using the setTimeout function
Gem.generateGem = function() {
    newGem = new Gem();
    allGems.push(newGem);
    audio.src = 'sounds/coin.mp3';
    audio.play();
    var delay = Helper.returnRandomValue([9000, 19000, 14000, 25000]); //shuffles time to create gem
    setTimeout(function() { Gem.expireGem(newGem); }, 2800); // sets time to splice gem (expired effect)
    setTimeout(Gem.generateGem, delay);
}
// removes gem from the array, thereby creating an expired effect
Gem.expireGem = function(expriringGem){
    allGems.forEach(function(gem, index) { //compa
        if(expriringGem == gem ){
            allGems.splice(index, 1);
        }
    });
}

 
// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    if(score >= 20){

        this.y= Helper.returnRandomValue([60, 125, 200, 315, 250]); // the y-axis coordinates of the paved tracks enemies can run on 
   }else{
this.y = Helper.returnRandomValue([ 80, 125, 200])
   }
    
    this.width = 171;
    this.height = 101;

if(score>=20){
            this.speed = Helper.returnRandomValue([650, 350, 450, 550, 500]); //

} else{
        this.speed = Helper.returnRandomValue([100, 200, 300, 90, 150]); //
}
    this.yoffset = 50;
    this.xoffset = 100;
    
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    // Multiplies the speed by the dt parameter on the x axis
    this.x += this.speed * dt;

    

    // Checks for collisions between the player and the enemies
    allEnemies.forEach(function(enemy, index) {
        if(Helper.collisionDetection(enemy, player)){
            Helper.updateScore("died");
            player.y = 380;
        }
    });
};

// Renders the enemy into the game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// creates new instances of the enemy and adds them to the game at random times
Enemy.generateEnemies = function() {
    allEnemies.push(new Enemy());
    Enemy.removeOffScreenEnemies();
    var delay;
    if(score >= 30){
        delay = Helper.returnRandomValue([400, 500, 700, 800]); 
    } else{
        delay = Helper.returnRandomValue([900, 1000, 2000, 3000])
    }
    
    
    setTimeout(Enemy.generateEnemies, delay);
}


/*
 * Method loops through allEnemies array and deletes any enemy in the array 
 * that has moved off the canavs. The canvas width is set at 505.
 */ 
Enemy.removeOffScreenEnemies = function() {
    allEnemies.forEach(function(enemy, index) {
        if(enemy.x > 505){
            allEnemies.splice(index, 1);
        }
    });
}

// constructor for the player
var Player = function(){
    this.playerIcon = 'images/char-horn-girl.png';
    this.x = Helper.returnRandomValue([0, 100, 200, 300, 400]);
    this.y = 380;
    this.width = 171;
    this.height = 101;
}



// draws the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.playerIcon), this.x, this.y);
 }
 
// moves player around 
Player.prototype.handleInput = function(keyCode) {
    if(keyCode === 'left'){
        if(this.x - 101 < 0){ 
            this.x = 0;  
        } else {
            this.x -= 100; // If it's on the grid, move left by 100
        }  
    } else if(keyCode == 'up'){ // water ranges from y=0 to y=85
        if(this.y - 85 < 0){ //prevents pressing up key at top of game from incrementing score   
            Helper.updateScore("water");  
            this.y =  380;   
        }
         else {
            this.y -= 85; 
        } 


        
    } else if(keyCode == 'right'){ 
         if(this.x + 101 > 400){  //Player's maximum rightward position
                this.x = 400; 
            } else {
                this.x += 100; 
            }
        } else if(keyCode == 'down') { 
            if(this.y + 85 > 380) {  //Players maximum distance from the top of the canvas
                this.y = 380; 
            } else {
                this.y += 85; 
            } 
        
    }
}




// Instantiate Objects
Enemy.generateEnemies();
player = new Player();
// Randomly generate gems
Gem.generateGem();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. 
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

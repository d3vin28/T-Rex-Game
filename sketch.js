  //initiate Game STATES
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, trex, invisibleGround, CloudsGroup, ObstaclesGroup, gameOver, restart ;
//score
var count = 0;

function preload (){
  
trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  //jumpSound = loadSound("jump.mp3");
  //dieSound = loadSound("die.mp3");
  //checkPointSound = loadSound("checkPoint.mp3") 
}

function setup() {
  
  createCanvas(400, 400);
  
//create a trex sprite
trex = createSprite(200,380,20,50);
trex.addAnimation("trex",trex_running);
  trex.addAnimation("collided", trex_collided)

//set collision radius for the trex
trex.setCollider("circle",0,0,30);

//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
ground = createSprite(200,380,400,20);
ground.addImage("ground2",groundImage);
ground.x = ground.width /2;

//invisible Ground to support Trex
invisibleGround = createSprite(200,385,400,5);
invisibleGround.visible = false;

//create Obstacle and Cloud Groups
ObstaclesGroup = new Group();
CloudsGroup = new Group();

//place gameOver and restart icon on the screen
gameOver = createSprite(200,300);
restart = createSprite(200,340);
gameOver.addImage("gameOver",gameOverImg);
gameOver.scale = 0.5;
restart.addImage("restart",restartImg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);

}

function draw() {
  background(255);
  
//display score
  text("Score: "+ count, 250, 100);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count + Math.round(World.frameRate/60);
    
    if (count>0 && count%100 === 0){
      //playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 359){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
    reset();
  
  }
    
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(400,320,40,10);
    cloud.y = random(280,320);
    cloud.addImage("cloud",cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(400,365,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round (random(1,6));
    obstacle.addImage("ob",obstacle3);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY ;
  gameOver.visible = false ;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
   CloudsGroup.destroyEach();
   count = 0 ; 
   trex.changeAnimation("trex",trex_running);
  
}
  

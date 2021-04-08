var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


    

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {

  var canvas = createCanvas(1300,200);

  //var box = createSprite(200,200,1100,1100 )

 
 // var box = createSprite(500,20,1000,200)
 ground = createSprite(-500,190,1366/2,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  trex = createSprite(displayWidth-700,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.16;
  trex.velocityX = 1;
  
  
  
  gameOver = createSprite(trex.x + 100,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(trex.x + 100,100);
  restart.addImage(restartImg);


  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width/2,trex.height/2);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("black");
  //displaying score
  fill("white");
  textSize(20);
  text("Score: "+ score,camera.position.x + 500,50);
  
 
  console.log(restart.x)
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < trex.x){
      ground.x = trex.x + 500;
    }
    if (invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    if(keyDown("RIGHT_ARROW")){
      trex.x = trex.x + 5;
    }
    camera.position.x=trex.x;
    invisibleGround.x = trex.x
    gameOver.x = trex.x;
    restart.x = trex.x;
  
    //camera.position.x = invisibleGround.x
    //camera.position.y = trex.y;
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
      trex.velocityX = 0;
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
       if(mousePressedOver(restart)) {
    
    
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  



  drawSprites();
}

function reset(){
 score = 0;
  restart.visible = false;
  gameOver.visible = false;
  
  //ground.velocityX = -(3 + 3*score/100);
  //obstaclesGroup.setVelocityXEach(-3);
  //cloudsGroup.setVelocityXEach(-3);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameState = PLAY;
  
  trex.changeAnimation("running",trex_running);

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(trex.x +500,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(displayWidth,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 900;
    
    
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


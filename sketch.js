// criando as variaveis 
var trex, trexRunning,trexCollided ;
var edges;
var solo, imageSolo;
var soloInvisivel;
var clouds, imageClouds,cloudsGp;
var cactos, imageCacto1,imageCacto2,imageCacto3,imageCacto4,imageCacto5,imageCacto6, cactosGp;
var score=0;
var play = 1;
var end = 0;
var gameState = play;
var record =0;
var gameOver, imageGameOver;
var restart, imageRestart;
var somJump, somDie, somCheckPoint;

//preload carrega as midías do jogo 
function preload(){
 //animação do Trex
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  //imagem do solo
  imageSolo = loadImage("ground2.png");
  // imagem nuvens
  imageClouds = loadImage("cloud.png");
  imageCacto1 = loadImage("obstacle1.png");
  imageCacto2 = loadImage("obstacle2.png");
  imageCacto3 = loadImage("obstacle3.png");
  imageCacto4 = loadImage("obstacle4.png");
  imageCacto5 = loadImage("obstacle5.png");
  imageCacto6 = loadImage("obstacle6.png");
  imageGameOver = loadImage("gameOver.png");
  imageRestart = loadImage("restart.png");
  // carregando os sons
  somJump = loadSound("jump.mp3");
  somDie = loadSound("die.mp3");
  somCheckPoint = loadSound("checkpoint.mp3");
  
}
//setup faz a aconfiguração
function setup(){
  createCanvas(windowWidth,windowHeight);
  // criando as bordas
  edges = createEdgeSprites();
  //crie um sprite de trex
  trex = createSprite(50,height-40,20,50);
  // adicione dimensão e posição ao trex
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided", trexCollided);
  trex.scale=0.5;
  // mostra a caixo colisora do trex qualdo é = true
  //trex.debug=true;
  trex.debug=false;
  // permite ver a caixa com o raio colisor do trex, aonde os 0 são os centro do raio os 50w,h e o 60 é o giro da caixa.
     // trex.setCollider("rectangle",0,0,50,50,60); 
   trex.setCollider("circle",0,0,30 ); 
  
  //sprite do solo
  solo =createSprite(width/2,height-30,width,2);
  solo.addImage("solo", imageSolo);
  soloInvisivel = createSprite(width/2,height-10,width,2);
  soloInvisivel.visible = false;

  //criando grupos de nuvem e cactos
  cloudsGp = new Group();
  cactosGp =  new Group();
// criando o sprite do game over
  gameOver=createSprite(width/2,height-120,100,10);
  gameOver.addImage(imageGameOver)
  gameOver.scale=0.5;
  // deixando invisivel
  gameOver.visible =false;
//criando o sprite do restart e deixando ele invisivel.
  restart=createSprite(width/2,height-90,100,10);
  restart.addImage(imageRestart);
  restart.scale=0.5;
  restart.visible=false;
}
//draw faz o movimento, a ação do jogo
function draw(){
  background("#f0f9f7");
  // vendo se trex ta colidindo com cacto
  if(trex.isTouching(cactosGp)){
    gameState= end;
  // somDie.play();
  }
  //game state: estados do jogo
  if (gameState == play){
    //com o comentado zera o frameCount
    //score = Math.round(frameCount/5);
    score += Math.round(getFrameRate()/60);
    if(score % 100 === 0 && score>0){
      somCheckPoint.play();
    }
  
     // fazero trex pular
    if(touches.length>0||keyDown("space")&& trex.y>height-46) {
      trex.velocityY =  - 12 ;
      somJump.play();
      touches=[]
    }
    
    // dando velocidade ao solo
   solo.velocityX =-(12+score/100);
  //conferindo a rolagem do solo
    if( solo.x < 0){
      solo.x=solo.width/2;
       }
// chamando a função dos cactos e das nuvens para dentro do codigo.
    createCactos(); 
    createClouds();
  }
// se o estado do jogo for fim
      if (gameState == end){
        // a imagem do trex vai mudar para a imagem de colisão
        trex.changeAnimation("collided", trexCollided);
        // o solo vai perder a velocidade a parar
        solo.velocityX=0;
        // o grupo de nuvem e de cactos vão parar
        cloudsGp.setVelocityXEach(0);
         cactosGp.setVelocityXEach(0);
        // o grupo de nuvem e de cacto vai mudar o lifetime pra negativo para n desaparecer
         cloudsGp.setLifetimeEach(-1);
         cactosGp.setLifetimeEach(-1);
         gameOver.visible=true;
         restart.visible=true;
       
         if(record<score){
          record=score;
        }
        
         if (mousePressedOver(restart)) {
           //console.log("clicou");
           gameState=play;
           gameOver.visible=false;
           restart.visible=false;
           cactosGp.destroyEach();
           cloudsGp.destroyEach();
           trex.changeAnimation("running",trexRunning);
           //frameCount=0;
           score=0;
         }
  }
 

 
//texto para vida
  fill("black");
  stroke("blue");
  textAlign(CENTER, TOP);
  textSize(18);
  
  text("Score "+score, width-74,height-150 );
  // não tem que fazer
  text("Record "+record, width-74,height-130 );
 // chamando a  função de gravidade
  gravity();
  //colisão do trex com as bordas
    trex.collide(soloInvisivel);
    //console.log(trex.Y);
   
 
   //coordenadas do mouse na tela
  //text("X: "+mouseX+"/ Y: "+mouseY,mouseX,mouseY);
  drawSprites();

}
// função de gravidade
function gravity(){
  trex.velocityY+=0.5;
}
function createClouds(){
  if(frameCount%60==0){
    clouds = createSprite(width,random(height-186,height-100),40,10);
    clouds.velocityX = -(12+score/100);
    clouds.addImage(imageClouds);
    clouds.scale=random(0.3,1.4);
    clouds.depth =trex.depth -1;
    clouds.lifetime = 210;
    cloudsGp.add(clouds);
}
}

function createCactos(){
  if(frameCount%50==0){
    cactos = createSprite(width,height-30,10,50);
    cactos.velocityX = -(12+score/100);
    var sorteioCactos = Math.round(random(1,6)); 
        switch(sorteioCactos) {
          case 1: cactos.addImage(imageCacto1);     
          break;
          case 2: cactos.addImage(imageCacto2);
          break;
          case 3: cactos.addImage(imageCacto3);
          break;
          case 4: cactos.addImage(imageCacto4);
          break;
          case 5: cactos.addImage(imageCacto5);
          break;
          case 6: cactos.addImage(imageCacto6);
              break;
    }
    cactos.scale= 0.5;
    cactos.lifetime=210;
    cactosGp.add(cactos);
   // cactos.depth =trex.depth;
  }
  }   

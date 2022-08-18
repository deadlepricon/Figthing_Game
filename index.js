const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 500;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const backGround = new Sprite({
    position: {
        x:0,
        y: 0
    },
    imageSrc: './Images/background.png'

});

const shop = new Sprite({
    position: {
        x:600,
        y: 225
    },
    imageSrc: './Images/shop.png',
    scale: 2,
    framesMax: 6

});


const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset:{
    x: 0,
    y: 0 
  },
  imageSrc: './Images/samurai/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset:{
    x:215,
    y:157
  },
  sprites:{
    idle:{
        imageSrc: './Images/samurai/Idle.png',
        framesMax: 8
    },
    run:{
        imageSrc: './Images/samurai/Run.png',
        framesMax: 8
    },
    jump:{
      imageSrc: './Images/samurai/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: './Images/samurai/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: './Images/samurai/Attack1.png',
      framesMax: 6
    },
    takeHit:{
    imageSrc: './Images/samurai/Take hit.png',
    framesMax: 4
  },
  death:{
    imageSrc: './Images/samurai/Death.png',
    framesMax: 6
  }

  },
  attackBox:{
    offset:{
      x:100,
      y:50
    },
    width: 160,
    height:50
  }

});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset:{
    x: -50,
    y: 0

  },
  imageSrc: './Images/ninja/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset:{
    x:215,
    y:167
  },
  sprites:{
    idle:{
        imageSrc: './Images/ninja/Idle.png',
        framesMax: 4
    },
    run:{
        imageSrc: './Images/ninja/Run.png',
        framesMax: 8
    },
    jump:{
      imageSrc: './Images/ninja/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: './Images/ninja/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: './Images/ninja/Attack1.png',
      framesMax: 4
    },
    takeHit:{
      imageSrc: './Images/ninja/Take hit.png',
      framesMax: 3
    },
    death:{
    imageSrc: './Images/ninja/Death.png',
    framesMax: 7
  }
  },
  attackBox:{
    offset:{
      x:-165,
      y:50
    },
    width: 165,
    height:50
  }
  
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};



decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backGround.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.15)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  
  
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run');
    
  }else{
    player.switchSprite('idle')
  }

  if(player.velocity.y < 0){
    player.switchSprite('jump')
  }else if(player.velocity.y >0){
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  }else{
    enemy.switchSprite('idle')
  }

  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  }else if(enemy.velocity.y >0){
    enemy.switchSprite('fall')
  }

  //detect Collision for player 1
  //and enemy gets hit
  if (
    rectCollision({rectangle1: player, rectangle2: enemy}) &&
    player.isAttacking && player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    
    
    gsap.to('#enemyHealth', {
      width:enemy.health + "%"
    });
  }
  if(player.isAttacking && player.framesCurrent ===4){
    player.isAttacking = false;
  }

  //detect collision for enemy
  //player gets hit
  if (
    rectCollision({rectangle1: enemy, rectangle2: player}) &&
    enemy.isAttacking && enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    
   
    gsap.to('#playerHealth', {
      width:player.health + "%"
    });
  }
  if(enemy.isAttacking && enemy.framesCurrent ===2){
    enemy.isAttacking = false;
  }


  //endgame on health
  if(enemy.health <=0 || player.health <=0) {
    chooseWinner({player,enemy, timerId})
    
  }


}

animate();

window.addEventListener("keydown", (event) => {
  if(!player.dead){
    switch (event.key) {
        case "d":
          keys.d.pressed = true;
          player.lastKey = "d";
          break;
        case "a":
          keys.a.pressed = true;
          player.lastKey = "a";
          break;
        case "w":
          player.velocity.y = -20;
          break;
        case ' ':
            player.attacking()
            break;
      }
  }
  
  if(!enemy.dead){
    switch(event.key){
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
        enemy.attacking();
        break; 
  }
  }
  
 // console.log(event);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  //console.log(event);
});

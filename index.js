const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.6;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 650,
    y: 173,
  },
  imageSrc: "./img/shop.png",
  scale: 2.4,
  framesMax: 6,
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
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/wizard/Idle.png",
  framesMax: 6,
  scale: 1.6,
  offset: { x: 0, y: 74 },
  sprites: {
    idle: {
      imageSrc: "./img/wizard/Idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./img/wizard/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/wizard/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/wizard/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/wizard/Attack1.png",
      framesMax: 8,
    },
  },
  attackBox: {
    offset: { x: 180, y: 30 },
    width: 135,
    height: 100,
  },
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
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/ewizard/Idle.png",
  framesMax: 8,
  scale: 2.1,
  offset: { x: 0, y: 200 },
  sprites: {
    idle: {
      imageSrc: "./img/ewizard/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/ewizard/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/ewizard/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/ewizard/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/ewizard/Attack1.png",
      framesMax: 8,
    },
  },
  attackBox: {
    offset: { x: 60, y: 30 },
    width: 160,
    height: 100,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
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
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
    player.framesMax = player.sprites.run.framesMax;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y > 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 4
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
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
    case " ":
      player.attack();
      break;

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

    case "Enter":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

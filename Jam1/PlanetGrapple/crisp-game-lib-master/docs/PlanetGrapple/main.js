title = "MissileDefense";

description = `

`;
const G = {
	WIDTH: 100,
	HEIGHT: 150,
  BOXHEIGHT : 40,
  BOXWIDTH : 25,
  ENEMY_MIN_BASE_SPEED: 0.1,
  ENEMY_MAX_BASE_SPEED: 0.2,
  SPAWNARC : 50
};

let speedMultiplier = 1
let gunHeight = (G.HEIGHT - G.BOXHEIGHT/2) - 23
// http://localhost:4000/?PlanetGrapple

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
};

characters = [
`
  ll
  ll
llllll
llllll
llllll
llllll
`
,
`
ll
ll
`
,
`
llllll
l    l
l    l
llllll 
`
,
`
cccccc
cccccc
cccccc
cccccc
  cc
  cc
`



];


/**
* @typedef {{
  * pos: Vector,
  * speed: number,
  * angle : number,
  * }} Bullet
  */
/**
* @type  { Bullet }
*/
let bullet = {
 pos : vec(50,50),
 speed : 1,
 angle : 270
};

/**
 * @typedef {{
 * pos: Vector
 * attackAngle : Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies = [];


/**
 * @type { number }
 */
 let currentEnemySpeed;


/**
* @typedef {{
  * pos: Vector,
  * }} Star
  */
/**
* @type  { Star [] }
*/
let stars = [];


let gameOver = false;

function update() {
  // The init function running at startup
  if (!ticks) {
    bulletReset();
    starsInit();
    enemies = [];
  }
  cosmeticUpdate();

  buildingUpdate();
  fireUpdate();
  enemiesUpdate();
  

}


function cosmeticUpdate()
{
  color("light_black");
  box(G.WIDTH/2,G.HEIGHT/2,500,500);
  for(let i=0;i<20;i++)
  {

//    stars[i]
    color('yellow')
    box(stars[i].pos.x,stars[i].pos.y,1,1)

  }

}

function starsInit()
{
  for(let i=0;i<20;i++)
  {
    
    const randX = rnd(0,G.WIDTH);
    const randY = rnd(0,G.HEIGHT);
    let newStar = {pos : vec(randX,randY)}
    stars.push({pos : vec(randX,randY)})
    
  }
}
function buildingUpdate()
{
  //building base
  color('black')
  box(G.WIDTH/2,(G.HEIGHT - G.BOXHEIGHT/2),G.BOXWIDTH,G.BOXHEIGHT)

  color('light_blue')
  box(G.WIDTH/2-7,(G.HEIGHT - G.BOXHEIGHT/2)-10,10,6)
  box(G.WIDTH/2-7,(G.HEIGHT - G.BOXHEIGHT/2),10,6)
  box(G.WIDTH/2+6,(G.HEIGHT - G.BOXHEIGHT/2),10,6)
  box(G.WIDTH/2-7,(G.HEIGHT - G.BOXHEIGHT/2)+10,10,6)
  box(G.WIDTH/2+6,(G.HEIGHT - G.BOXHEIGHT/2)+10,10,6)
  box(G.WIDTH/2-7,(G.HEIGHT - G.BOXHEIGHT/2)+20,10,6)
  box(G.WIDTH/2+6,(G.HEIGHT - G.BOXHEIGHT/2)+20,10,6)
  //building gun
  color('black');
  char('a',G.WIDTH/2,(G.HEIGHT - G.BOXHEIGHT/2) - 23)
}
function fireUpdate()
{
  char('b',bullet.pos.x,bullet.pos.y);
  if (bullet.angle == 0)
  {
    bullet.pos.x += bullet.speed;
  }
  if (bullet.angle == 90)
  {
    bullet.pos.y += bullet.speed;
  }
  if (bullet.angle == 180)
  {
    bullet.pos.x -= bullet.speed;
  }
  if (bullet.angle == 270)
  {
    bullet.pos.y -= bullet.speed;
  }

  if (input.isJustPressed)
  {
    if (bulletActive())
    {
      bullet.angle = (bullet.angle + 90)%360;
      play('select',{pitch : 30 + bullet.angle/6, volume : .5})
      //change angle
    }
    if (!bulletActive())
    {
      bulletReset()
    }
  }
}

function enemiesUpdate()
{
  arc(G.WIDTH/2,G.HEIGHT/2,G.SPAWNARC)
  color('red')
  if (enemies.length === 0) {
    currentEnemySpeed =
        rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 3; i++) {
      
      const rand = -rnd(0,1)  * Math.PI// rand angle
      
      const posX = G.SPAWNARC * Math.cos(rand) + G.WIDTH/2;
      const posY = G.SPAWNARC * Math.sin(rand) + G.HEIGHT/2;
      
      const angVec = vec((G.WIDTH/2-posX)/G.SPAWNARC,(G.HEIGHT-posY)/G.SPAWNARC)
      
      


      enemies.push({ pos: vec(posX, posY) , attackAngle : angVec })
    }
  }

  remove(enemies, (e) => {
    e.pos.y += e.attackAngle.y / 20 * speedMultiplier;
    e.pos.x += e.attackAngle.x/ 20 * speedMultiplier;

    const isCollidingWithBullets = char("d", e.pos).isColliding.char.b;
    const isCollidingWithTower = char("d", e.pos).isColliding.rect.red;
    color("red");
    char("d", e.pos);

    if (isCollidingWithBullets) {
      color("yellow");
      particle(e.pos);
      bulletReset();
      play('explosion')
      play('hit')
    }

    if (isCollidingWithTower) {
      play('powerUp')
      play('explosion')
      end();
    }

  
    return (isCollidingWithBullets || e.pos.y > G.HEIGHT);
  });

}

function bulletReset()
{
  bullet.pos.x = G.WIDTH/2;
  bullet.pos.y = (G.HEIGHT - G.BOXHEIGHT/2) - 23;
  bullet.angle = 270
  play('laser')
  play('select')
}

function bulletActive()
{
  if (bullet.pos.x < G.WIDTH && bullet.pos.x > 0)
  {
    if (bullet.pos.y < G.HEIGHT && bullet.pos.y > 0)
    {
      return true;
    }
  }
  return false;
}

addEventListener("load", onLoad);
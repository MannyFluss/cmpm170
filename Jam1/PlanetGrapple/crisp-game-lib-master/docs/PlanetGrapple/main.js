title = "MissileDefense";

description = `

`;
const G = {
	WIDTH: 100,
	HEIGHT: 150,
  BOXHEIGHT : 40,
  BOXWIDTH : 25
  

};
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


function update() {
  // The init function running at startup
if (!ticks) {
  
  }
    buildingUpdate();
    fireUpdate();
}

function buildingUpdate()
{
  //building base
  color('red')
  box(G.WIDTH/2,(G.HEIGHT - G.BOXHEIGHT/2),G.BOXWIDTH,G.BOXHEIGHT)
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
      //change angle
    }
    if (!bulletActive())
    {
      bulletReset()
    }
  }
}

function bulletReset()
{
  bullet.pos.x = G.WIDTH/2;
  bullet.pos.y = (G.HEIGHT - G.BOXHEIGHT/2) - 23;
  bullet.angle = 270
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




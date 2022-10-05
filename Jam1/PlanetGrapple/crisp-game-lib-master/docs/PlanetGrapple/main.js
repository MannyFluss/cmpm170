title = "PlanetGrapple";

description = `

`;
const G = {
	WIDTH: 100,
	HEIGHT: 150,
  STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0
};

// http://localhost:4000/?PlanetGrapple

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme : 'crt',
  
  isCapturing: true,
  isCapturingGameCanvasOnly : true,
  captureCanvasScale : 1,
};

characters = [
`
  ll
  ll
ccllcc
ccllcc
ccllcc
cc  cc
  `
  ];


/**
* @typedef {{
  * pos: Vector,
  * speed: number,
  * size : number
  * transformFlag : boolean
  * }} Planet
  */

/**
* @type  { Planet [] }
*/
let Planets = []
Planets[0] = {pos : vec(G.WIDTH/2,G.HEIGHT/2 - 60),speed : .3,size : 10 , transformFlag : true}
Planets[1] = {pos : vec(G.WIDTH/2 + 10,G.HEIGHT/2 + 25),speed : .3,size : 10, transformFlag : true}

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */

/**
* @type  { Star [] }
*/
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * speed : number,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @type { Planet }
 */
let playerGrapplePlanet;
let playerGrapplePlanetDistance;
let deltaX
let deltaY
let clockwise


function update() {
  // The init function running at startup
if (!ticks) {
  playBgm()
  starsInit()
  playerInit()
}
//update every 1/60th

starsUpdate();
playerUpdate();
planetsUpdate();
uiUpdate();
}

function uiUpdate()
{
  let temp = score.toString()
  if (ticks%30 == 0)
  {
    addScore(1)
  }
  color('purple')
  text(temp, G.WIDTH - 25, 6)
  
}

function planetsUpdate()
{
  
  
  Planets.forEach((s) => {

    s.pos.y += s.speed;
    // Move the star downwards
    // Bring the star back to top once it's past the bottom of the screen
    //let temp = s.pos.wrap(0, G.WIDTH, -30, G.HEIGHT + 30);
    
    if (s.pos.y > G.HEIGHT+30)
    {
      s.size = rnd(5,18)
      s.speed = rnd(.3,.5)
      s.pos.y = -30
      s.pos.x = rnd(30,G.WIDTH-30 )
    }


    

    
    // Choose a color to draw
    color('green')
    arc(s.pos.x,s.pos.y,s.size,3,0,360)
    



});

}

function playerInit()
{
  player = {
    pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
    speed : 2
  };
}
function playerUpdate()
{

  Planets.forEach((planet) =>
  {
    let x2 = planet.pos.x
    let y2 = planet.pos.y
    let x1 = player.pos.x
    let y1 = player.pos.y 
    let d = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
    if (d < planet.size)
    {
      stopBgm();
      play('explosion')
      end(' you crashed into a planet ')
      
    }
  })

  color("black");
  char('a',player.pos);
  if (input.isJustPressed)
  {
    let closestPlanet = null
    let closestDistance = null
    Planets.forEach((planet) =>
    {
      
      let x2 = planet.pos.x
      let y2 = planet.pos.y
      let x1 = player.pos.x
      let y1 = player.pos.y 
      let d = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
      if (d < closestDistance || closestDistance == null)
      {
        play('hit')
        closestPlanet = planet; 
        closestDistance = d;
      }
    })
    playerGrapplePlanet = closestPlanet;
    playerGrapplePlanetDistance = closestDistance;
    
    determineDirection();

    
    //find nearest planet and engage hook
  }
  if (input.isPressed)
  {
    if (playerGrapplePlanet)
    { // https://danceswithcode.net/engineeringnotes/rotations_in_2d/rotations_in_2d.html

      let preX = player.pos.x
      let preY = player.pos.y

      let theta = 1/playerGrapplePlanetDistance * player.speed// temp value
      if (clockwise == false){theta = -theta;}
      let x0 = player.pos.x
      let y0 = player.pos.y
      let xc = playerGrapplePlanet.pos.x
      let yc = playerGrapplePlanet.pos.y
      

      color('white')
      
      player.pos.x = (((x0-xc)*Math.cos(theta)) - ((y0-yc)*Math.sin(theta)) + xc) 
      player.pos.y = (((x0-xc)*Math.sin(theta)) + ((y0-yc)*Math.cos(theta)) + yc )
      line(player.pos.x,player.pos.y,playerGrapplePlanet.pos.x,playerGrapplePlanet.pos.y)

      deltaX = player.pos.x - preX
      deltaY = player.pos.y - preY
      if (playerGrapplePlanet.pos.y > G.HEIGHT)
      {
        playerGrapplePlanet = null
        playerGrapplePlanetDistance = null;
      }
      
    }
  }
  if (!playerGrapplePlanet)
  {
    if (deltaX && deltaX)
    {
      player.pos.x += deltaX;
      player.pos.y += deltaY;
    }
  }

  if (input.isJustReleased)
  {
    playerGrapplePlanet = null
    playerGrapplePlanetDistance = null;
  }
  

  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
  if (player.pos.x == 0 || player.pos.x == G.WIDTH)
  {
    deltaX = -deltaX
    play('select', {volume : .1})
  }
  if (player.pos.y == 0 || player.pos.y == G.HEIGHT)
  {
    deltaY = -deltaY
    play('select', {volume : .1})
  }
}

 function starsUpdate(){
    color("black")
    box(G.WIDTH/2,G.HEIGHT/2,G.WIDTH,G.HEIGHT)
      // Update for Star
      stars.forEach((s) => {
        // Move the star downwards
        s.pos.y += s.speed; //edit this to be based on player movement
        // Bring the star back to top once it's past the bottom of the screen
        s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
        
        // Choose a color to draw
        color("light_black");
        // Draw the star as a square of size 1
        box(s.pos, 2);
    });
 }

function starsInit()
{
        // A CrispGameLib function
      // First argument (number): number of times to run the second argument
      // Second argument (function): a function that returns an object. This
      // object is then added to an array. This array will eventually be
      // returned as output of the times() function.
      stars = times(20, () => {
        // Random number generator function
        // rnd( min, max )
        const posX = rnd(0, G.WIDTH);
        const posY = rnd(0, G.HEIGHT);
        // An object of type Star with appropriate properties
        return {
          // Creates a Vector
            pos: vec(posX, posY),
            // More RNG
            speed: rnd(0.5, 1.0)
        };
    }); 
}

function determineDirection()// too simple
{
  let x1= player.pos.x - (deltaX*2)
  let y1 = player.pos.y - (deltaY*2)
  let x2= player.pos.x + (deltaX*2)
  let y2 = player.pos.y + (deltaY*2)
  let x = playerGrapplePlanet.pos.x
  let y = playerGrapplePlanet.pos.y

  let d = ((x-x1)*(y2-y1)) - ((y-y1)*(x2-x1))
  console.log(d)
  if (d>0)
  {
    clockwise = false
  }else
  {
    clockwise = true
  }

}



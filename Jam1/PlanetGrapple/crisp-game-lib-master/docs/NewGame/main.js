title = "Tower Defense";

description = `

`;
var SIZE = 10;
const G = { //constant global variables
    //aspect ratio 9 : 16
	WIDTH: 9 * SIZE,
	HEIGHT: 16 * SIZE,

};
options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
  };
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
  characters = [
`
   GG
 grg  
ggg   
  Lg
  Lg
  Gg
`
,
`
   yyY
  yyY
 yyY
  yyY
   yY
  yY  
`,
`
 yY
  LL
 Llll
 llll
  ll
`,
`
L L L
lllll
 LLL
  l
 LLL
 lll
`
,
`
  Bb
b  Bb
Bb  Bb
Bb  Bb
b  Bb
  Bb
`,




    ,
    ];

var updateList = [];
//class declarations
class LightningBolt
{
  
  constructor(_target = vec(0,0))
  {
    this.target = _target;
    this.targetAngle = Math.atan2(_target.y-G.HEIGHT/2, _target.x-G.WIDTH/2 )
    this.targetAngleVector = vec(Math.cos(this.targetAngle),Math.sin(this.targetAngle))
    updateList.push(this)//global list to update
    this.position = vec(G.WIDTH/2,G.HEIGHT/2);
    console.log(this.targetAngle)
  }
  update()
  {
    color('black');
    char('e',this.position,{scale : vec(3,3)})
    this.position.x += this.targetAngleVector.x;
    this.position.y += this.targetAngleVector.y;
    
  }
};




//global variables
var mousePosition = vec(0,0);


function start()
{
  mousePosition = vec(input.pos.x,input.pos.y)
  var test = new LightningBolt(mousePosition);
  console.log(updateList)
}

function update()
{
    if (!ticks) 
    {
        start();    
    }
    color('black')
    char('a',G.WIDTH/2,G.HEIGHT/2+50,{scale : vec(3,3)})
    char('b',G.WIDTH/2,G.HEIGHT/2+25,{scale : vec(3,3)})
    char('c',G.WIDTH/2,G.HEIGHT/2,{scale : vec(3,3)})
    char('d',G.WIDTH/2,G.HEIGHT/2 - 25,{scale : vec(3,3)})
    //char('e',G.WIDTH/2,G.HEIGHT/2 - 50,{scale : vec(3,3)})
    objectsUpdate()

    handleClicks();

    updateList.forEach(element => {
      element.update();
    });

}

function handleClicks()
{
  if (input.isJustPressed)
  {
    fireProjectiles()
    new LightningBolt(mousePosition)
  }
}

function fireProjectiles()
{   //this will execute all of the attacks in the list
  

}

function objectsUpdate()
{
    mousePosition = vec(input.pos.x,input.pos.y)
    color("red")
    rect(mousePosition.x,mousePosition.y,3)

}
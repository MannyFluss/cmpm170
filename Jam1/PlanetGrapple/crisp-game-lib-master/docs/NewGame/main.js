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


//global variables
var mousePosition = vec(0,0);


function start()
{

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
    char('e',G.WIDTH/2,G.HEIGHT/2 - 50,{scale : vec(3,3)})
    objectsUpdate()
}

function objectsUpdate()
{
    mousePosition = vec(input.pos.x,input.pos.y)
    color("red")
    rect(mousePosition.x,mousePosition.y,3)

}
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
 b  Bb
b  Bb
  Bb
`,
`
 r
rrr L
lyy l
lll l
bbbbl
bbb
`



    ,
    ];


//class declarations

class enemy
{
  constructor(_position = vec(0,0))
  {
    //attributes
    this.speed = .2
    this.sprite = 'a';
    this.hp = 5;
    this.maxHp = this.hp

    enemyUpdateList.add(this);
    this.position = _position;
    this.target = vec(G.WIDTH/2,G.HEIGHT/2);
    this.targetAngle = Math.atan2(this.target.y-this.position.y, this.target.x-this.position.x )
    this.targetAngleVector = vec(Math.cos(this.targetAngle) * this.speed,Math.sin(this.targetAngle) * this.speed)
  }
  update()
  {
    this.position.x += this.targetAngleVector.x;
    this.position.y += this.targetAngleVector.y;
    color('red')
    bar(vec(this.position.x,this.position.y-5),3,2,0)
    color('black');
    const object = char(this.sprite,this.position,{scale : vec(1,1)}).isColliding.char.b;
    //console.log(object)
    //this.collide = char(this.sprite,this.position).isColliding.char.b;
    if (object)
    {
      this.takeDamage();
    }
    

  }
  takeDamage()
  {

    this.hp -= 1;
    if (this.hp <= 0)//death
    {
      color("red");
      particle(this.position,5,2)
      enemyUpdateList.delete(this);
    }
  }

}

class LightningBolt
{
  
  constructor(_target = vec(0,0))
  {
    this.target = _target;
    this.targetAngle = Math.atan2(_target.y-G.HEIGHT/2, _target.x-G.WIDTH/2 )
    this.targetAngleVector = vec(Math.cos(this.targetAngle),Math.sin(this.targetAngle))
    updateList.add(this)//global list to update
    this.position = vec(G.WIDTH/2,G.HEIGHT/2);
    
  }
  update()
  {
    color('black');
    char('b',this.position).isColliding.char.a
    this.position.x += this.targetAngleVector.x;
    this.position.y += this.targetAngleVector.y;
    if(onScreen(this.position)==false)
    {
      this.offScreen();
    }
  }
  offScreen()
  {
    updateList.delete(this);
  }
};




//global variables
var mousePosition = vec(0,0);

var currentXp = 100.0
var levelUpXp = 500.0
var attackInterval = 4;


var attackList = [1];

var enemyUpdateList = new Set();
var updateList = new Set();

function start()
{
  mousePosition = vec(input.pos.x,input.pos.y)
  //var test = new LightningBolt(mousePosition);
  
}

function onScreen(_point)
{
  if(_point.x < 0 || _point.x > G.WIDTH)
  {
    return false;
  }
  if(_point.y < 0 || _point.y > G.HEIGHT)
  {
    return false;
  }
  return true;
}

function update()
{
    if (!ticks) 
    {
        start();    
    }
    color('black')
    //char('a',G.WIDTH/2,G.HEIGHT/2+50,{scale : vec(3,3)})
    //char('b',G.WIDTH/2,G.HEIGHT/2+25,{scale : vec(3,3)})
    //char('c',G.WIDTH/2,G.HEIGHT/2,{scale : vec(3,3)})
    char('d',G.WIDTH/2,G.HEIGHT/2 ,{scale : vec(3,3)})
    //char('e',G.WIDTH/2,G.HEIGHT/2 - 50,{scale : vec(3,3)})
    objectsUpdate()

    handleClicks();

    updateList.forEach(element => {
      element.update();
    });
    enemyUpdateList.forEach(element => {
      element.update();
    });
    //enemy spawns
    if (ticks%600 ==0)
    {
      let angle = Math.random()*Math.PI*2;
      let radius = 50;
      let pos = vec((Math.cos(angle)*radius)+G.WIDTH/2,(Math.sin(angle)*radius)+G.HEIGHT/2);
      console.log(pos)
      new enemy(pos);
    }
    //player attackInterval
    if(ticks%Math.round(attackInterval*60)==0)
    {
      fireProjectiles();
    }
    //experienceBar
    color("green")
    let barAmnt = (currentXp/levelUpXp) * G.WIDTH-10
    bar(G.WIDTH/2  ,20,barAmnt ,10,0)
    color("black")
    text("XP",G.WIDTH/2,20)
    currentXp +=1;
    if (currentXp >= levelUpXp)//levle up
    {
      currentXp = 0;
    }
    updateCards();
    
}

function updateCards()
{
  //attributes
  let cardPos = vec(G.WIDTH/2-10,G.HEIGHT-25)
  let cardPos2 = vec(G.WIDTH/2-10-30,G.HEIGHT-25)
  let cardPos3 = vec(G.WIDTH/2-10+30,G.HEIGHT-25)

  //lightning card
  


  color("black")
  rect(cardPos.x,cardPos.y,20);
  color("light_cyan");
  let collision = rect(cardPos.x+ 1, cardPos.y+1,18).isColliding.rect.red;
  if (collision && input.isJustPressed)//clicking this card
  {
    attackList.push(1);
    console.log("added lightning attack")
  }
  color("black");
  char('b',vec(cardPos.x+10,cardPos.y+10),{scale:vec(2,2)});
  //bomb card
  color("black")
  rect(cardPos2.x,cardPos2.y,20);
  color("light_cyan");
  let collision2 = rect(cardPos2.x+ 1, cardPos2.y+1,18).isColliding.rect.red;
  if (collision2 && input.isJustPressed)//clicking this card
  {
    attackList.push(2);
    console.log("added bomb attack")
  }
  color("black");
  char('c',vec(cardPos2.x+8,cardPos2.y+9),{scale:vec(2,2)});
  //speed card
  color("black");
  char('b',vec(cardPos.x+10,cardPos.y+10),{scale:vec(2,2)});
  //bomb card
  color("black")
  rect(cardPos3.x,cardPos3.y,20);
  color("light_cyan");
  let collision3 = rect(cardPos3.x+ 1, cardPos3.y+1,18).isColliding.rect.red;
  if (collision3 && input.isJustPressed)//clicking this card
  {
    attackInterval -= .1
    if (attackInterval <= 0)
    {
      attackInterval = .1
      
    }
    console.log("attack time down")
  }
  color("black");
  char('e',vec(cardPos3.x+10,cardPos3.y+9),{scale:vec(2,2)});
}


function handleClicks()
{
  // if (input.isJustPressed)
  // {
  //   fireProjectiles()
  // }
}

function fireProjectiles()
{   //this will execute all of the attacks in the list
  //new LightningBolt(mousePosition)
  let elementCount = 0;
  attackList.forEach(element => {
    switch(element)
    {
      case 1:
        setTimeout(()=>{ new LightningBolt(mousePosition);},250 * elementCount)
        break;
    }
    elementCount += 1;
  });

}

function objectsUpdate()
{
    mousePosition = vec(input.pos.x,input.pos.y)
    color("red")
    rect(mousePosition.x,mousePosition.y,3)

}
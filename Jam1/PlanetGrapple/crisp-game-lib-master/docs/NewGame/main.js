title = "Tower Defense";

description = `
aim tower and
deafeat enemies
for xp + score.

on level up,
choose upgrade:
lightning,
bombs, or
+ attack speed

survive for as
long as you can
`;
var SIZE = 10;
const G = { //constant global variables
    //aspect ratio 9 : 16
	WIDTH: 9 * SIZE,
	HEIGHT: 16 * SIZE,
  
};
const S = //statboard
{
  HPUPGRADE1 : 1,
  SPEEDUPGRADE1 : 0.0,

  HPUPGRADE2 : 2,
  SPEEDUPGRADE2 : 0.001,

  HPUPGRADE3 : 6,
  SPEEDUPGRADE3 : 0.003,

  HPUPGRADE4 : 4,
  SPEEDUPGRADE4 : 0.003,

  MINHP : 3,
  MINSPEED : .01,

  BOMBDAMAGE : 2,
  LIGHTNINGDAMAGE : 1,


  ATTACKDOWNAMNT : .35,
  LOWESTATTACKSPEED : 1.5,

  XPMULTIPLIERONDEATH : 4,


  GOBLINSLEVEL3 : 8,
  GOBLINSLEVEL10 : 20,
  GOBLINSLEVEL20 : 40,
  GOBLINSLEVEL50 : 55,

  SPAWNRADIUS : 60,

  CYCLETIME : 25,  
  CYCLESPERDOWN : 4, // how many cycles for the time to go down
  CYCLESPERDOWNSPAWN : 3, //cycles for the spawn rate to go up
  SPAWNINTERVALDOWN : .5,
  MINSPAWNINTERVAL : 1,
  MAXGOBLINSPAWN : 5,

  

  LIGHTNINGBOLTDMGMULTIPLIER : 2,
  LIGHTNINGBOLTMAXPROJECTILES : 8,


  BOMBDAMAGEMULTIPLIER : 1,
  BOMBMAXPROJECTILES : 6,
  BOMBMAXSPREAD : 10,
  BOMBCIRCLERADIUS : 10,
  BOMBEXPLOSIONSCALE : 3,


  SPRITELIST : ['a','f','h','i','j','k'],


};

var LightningBoltStats = 
{
  level : 1,
  damage : 1,
  count : 1,

}
var bombStats = 
{
  level : 0,
  damage : 1,
  count : 0,

}

options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
  };
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
characters = [//a
`
GG    
 grg   
  ggg   
 gL  
 gL 
 gG
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
rrr
LYY L
LLL l
BBBBl
BBB 
`
,//G
`
 yY
  LL
 Llll
 llll
  ll
`
,
`
 BB
BBBB
YlYl
bbb  L
llllL
b b
` 
,
`
gG l l 
Gg GGG
  GGr
 GGG
GG  g
G g
`,
`
Y
 LL  l
LLLLLl
LllLLl
l  l l 
 ll
`,
`
     r
 g lg
G  gg
g g 
G  G 
 gGg
`

    ,
    ];


//class declarations
class enemySpawner
{
  constructor()
  {
    this.cyclesPast = 1;

    this.spawnInterval = 5.0
    this.timeUntilSpawn = this.spawnInterval;
    updateList.add(this);

    this.enemySpeedMin = S.MINSPEED;
    this.enemySpeedMax = S.MINSPEED;
    
    this.enemyHpMin = S.MINHP;
    this.enemyHpMax = S.MINHP;

    this.amountToSpawn = 1;

  }


  spawnEnemy()
  {
    let angle = Math.random()*Math.PI*2;
    let radius = S.SPAWNRADIUS;
    let pos = vec((Math.cos(angle)*radius)+G.WIDTH/2,(Math.sin(angle)*radius)+G.HEIGHT/2);

    let _speed = Math.random()*(this.enemySpeedMax-this.enemySpeedMin) + this.enemySpeedMax;
    let min = Math.ceil(this.enemyHpMin);
    let max = Math.floor(this.enemyHpMax);
    let _hp = round(Math.random()*(max-min) + min);
    

    const sprite = S.SPRITELIST[Math.floor(Math.random()*S.SPRITELIST.length)];
    new enemy(pos,_speed,_hp,sprite);
  }

  update()
  {

    this.timeUntilSpawn -= .016;
    if (this.timeUntilSpawn <= 0)
    {
      this.timeUntilSpawn = this.spawnInterval;
      for(let i=0;i<this.amountToSpawn;i++)
      {
      this.spawnEnemy();
      }
    }

    //difficulty tracker
    if (ticks%(60*S.CYCLETIME) == 0 && ticks != 0)
    {
      this.fifteenSeconds();
      console.log("new time between cycles and time between spawn: "+this.spawnInterval+ " " + this.amountToSpawn );
    }
  }
  fifteenSeconds()//upgrade difficulty
  {
    console.log("current cycle : " +this.cyclesPast);
    this.cyclesPast += 1;
    if (this.cyclesPast%S.CYCLESPERDOWN == 0)
    {

      this.spawnInterval -= S.SPAWNINTERVALDOWN
      if (this.spawnInterval <= S.MINSPAWNINTERVAL)
      {
        console.log("min spawn time hit")
        this.spawnInterval = S.MINSPAWNINTERVAL;
      }
    }
    if(this.cyclesPast%S.CYCLESPERDOWNSPAWN == 0)
    {
      this.amountToSpawn += 1;
      if (this.amountToSpawn >= S.MAXGOBLINSPAWN)
      {
        this.amountToSpawn = S.MAXGOBLINSPAWN;
      }
    }
    if (this.cyclesPast < 4)
    {
      this.enemyHpMax += S.HPUPGRADE1
      this.enemySpeedMax += S.SPEEDUPGRADE1
      return
    }
    if (this.cyclesPast < 8)
    {
      this.enemyHpMax += S.HPUPGRADE2
      this.enemySpeedMax += S.SPEEDUPGRADE2
      return
    }
    if (this.cyclesPast < 12)
    {
      this.enemyHpMax += S.HPUPGRADE3
      this.enemySpeedMax += S.SPEEDUPGRADE3
      return
    }
    this.enemyHpMax += S.HPUPGRADE4
    this.enemySpeedMax += S.SPEEDUPGRADE4
  }

}

class enemy
{
  constructor(_position = vec(0,0), _speed = .01, _hp = 5.0, _sprite = 'a')
  {
    //attributes
    this.speed = _speed
    this.sprite = _sprite;
    this.hp = _hp
    this.maxHp = this.hp
    this.rotation = 1
    if (_position.x <= G.WIDTH/2)
    {
      this.rotation = -1
    }
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
    let barAmnt = round(this.hp/this.maxHp * 4)
    bar(vec(this.position.x,this.position.y-5),barAmnt,2,0)
    color('black');
    let object;
    if (this.rotation == -1)
    {
      object = char(this.sprite,this.position,{scale : vec(1,1), mirror:{x:1,y:1}})
    }else
    {
      object = char(this.sprite,this.position,{scale : vec(1,1), mirror:{x:-1,y:1}})
    }
    let lightningCollider = object.isColliding.char.b;
    let bombCollider = object.isColliding.char.g;
    //console.log(object)
    //this.collide = char(this.sprite,this.position).isColliding.char.b;
    if (lightningCollider)
    {
      this.takeDamage(LightningBoltStats.damage * S.LIGHTNINGBOLTDMGMULTIPLIER);
     // console.log("taking damage")
    }
    if(bombCollider)
    {
      this.takeDamage(bombStats.damage * S.BOMBDAMAGEMULTIPLIER);
    }
    

  }
  takeDamage(_damage = 1)
  {
    this.hp -= _damage;
    console.log(this.hp)
    color("red");
    particle(this.position,2,1)
    play("click",{seed:128965234234235}) //enemy gets hit

    if (this.hp <= 0)//death
    {
      play("hit",{seed:1})//goblin dies


      currentXp += this.maxHp * S.XPMULTIPLIERONDEATH;
      score += this.maxHp;
      color("red");
      particle(this.position,5,2)
      enemyUpdateList.delete(this);
    }
  }

}


class bomb
{
  constructor(_target = vec(0,0))
  {
    this.timeElapsed = 0.0;
    this.timeUntilImapct = 2.5;
    this.target = _target;
    this.bombPosition = vec(this.target.x-1,this.target.y-G.HEIGHT+1);
    updateList.add(this)//global list to update
    play("select",{seed:1,volume:.25})//bomb start
    
  }
  update()
  {
    color('black');
    this.bombPosition.y = lerp(this.bombPosition.y,this.target.y,easeIn(this.timeElapsed/this.timeUntilImapct));

    char('c',this.bombPosition).isColliding.char.a
    arc(this.target.x,this.target.y,S.BOMBCIRCLERADIUS,1)
    this.timeElapsed += .0166

    if (this.timeElapsed >= this.timeUntilImapct)
    {
      this.explode();
      this.offScreen();
      char('g',this.bombPosition,{scale:vec(S.BOMBEXPLOSIONSCALE,S.BOMBEXPLOSIONSCALE)}).isColliding.char.a
    }
  }

  explode()
  {
    ///explode
    color("yellow");
    particle(this.target.x,this.target.y,20,1)
    play("explosion",{seed:23022533, volume:.25}) //end bomb

  }
  offScreen()
  {
    updateList.delete(this);
  }
}

class LightningBolt
{
  
  constructor(_target = vec(0,0))
  {

    this.target = _target;
    // let num = Math.floor(Math.random()*2);
    // num *= Math.round(Math.random()) ? 1 : -1;
    this.targetAngle = Math.atan2(_target.y-G.HEIGHT/2, _target.x-G.WIDTH/2);
    
    this.targetAngleVector = vec(Math.cos(this.targetAngle),Math.sin(this.targetAngle))
    updateList.add(this)//global list to update
    lateUpdateList.add(this)
    this.position = vec(G.WIDTH/2,G.HEIGHT/2);
    play("click",{seed:7856789807,volume:.5}) //lightning start
    
    //this.sprite = char('b',this.position)
    
  }
  update()
  {
    color('black');
    this.position.x += this.targetAngleVector.x;
    this.position.y += this.targetAngleVector.y;
    char('b',this.position)

    
    if(onScreen(this.position)==false)
    {
      this.delete();
    }
  }

  lateUpdate()
  {
    let collider = char('b',this.position)
    let collision = (collider.isColliding.char.a ||
                      collider.isColliding.char.f ||
                      collider.isColliding.char.h ||
                      collider.isColliding.char.i ||
                      collider.isColliding.char.j ||
                      collider.isColliding.char.k)
    if (collision)
    {
      this.delete();
      play("hit",{seed:1242,volume:.5})
    }
  }
  delete()
  {
    //lightning hit

    updateList.delete(this);
    lateUpdateList.delete(this);
  }
};




//global variables
var mousePosition = vec(0,0);

var currentLevel = 0;
var currentXp = 0
var levelUpXp = 10
var attackInterval = 4;
var timeUntilattack = attackInterval;
var attackList = [1];
var levelUpAvailable = false
var myEnemySpawner;



var enemyUpdateList = new Set();
var updateList = new Set();
var lateUpdateList = new Set();

function start()
{
LightningBoltStats = 
{
  level : 1,
  damage : 1,
  count : 1,

}
bombStats = 
{
  level : 0,
  damage : 1,
  count : 0,

}
  //reset values
  //aaaaaaa
  
  //playBgm();
  
  
  enemyUpdateList.clear();
  updateList.clear();
  lateUpdateList.clear();
  attackList = [1];
  currentXp = 0
  levelUpXp = 5
  currentLevel = 1;
  attackInterval = 4;
  timeUntilattack = attackInterval;
  levelUpAvailable = false;

  myEnemySpawner = new enemySpawner();

  mousePosition = vec(input.pos.x,input.pos.y)
  
  
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
    //char('e',G.WIDTH/2,G.HEIGHT/2 - 50,{scale : vec(3,3)})
    objectsUpdate()

    

    updateList.forEach(element => {
      element.update();
    });
    enemyUpdateList.forEach(element => {
      element.update();
    });

    lateUpdateList.forEach(element => {
      element.lateUpdate();
    });
    //enemy spawns
    if (ticks%600 ==0)
    {

    }
    //player attackInterval

    timeUntilattack += .016;

    if(timeUntilattack >= attackInterval)
    {
      fireProjectiles();
      timeUntilattack = 0;
    }

    //experienceBar
    color("green")
    let barAmnt = (currentXp/levelUpXp) * (G.WIDTH-10)
    bar(G.WIDTH/2  ,20,barAmnt ,10,0)
    color("black")
    text("XP " + String(currentXp) +"/"+String(levelUpXp),G.WIDTH/2,20)
    //currentXp +=1;
    if (currentXp >= levelUpXp)//levle up
    {
      levelUp()
    }
    updateTower();
    updateCards();
    
}

function levelUp()
{
  play("powerUp",{seed: 1623226344152765365845}) // level up

  currentXp = 0;
  levelUpAvailable = true;
  const currMaxHp = myEnemySpawner.enemyHpMax;
  if (currentLevel < 3)
  {
    levelUpXp = currMaxHp * S.GOBLINSLEVEL3;
    return;
  }
  if (currentLevel < 10)
  {
    levelUpXp = currMaxHp * S.GOBLINSLEVEL10;
    return;
  }
  if (currentLevel < 20)
  {
    levelUpXp = currMaxHp * S.GOBLINSLEVEL20;
    return;
  }
  levelUpXp = currMaxHp * currentLevel * S.GOBLINSLEVEL50
  
}

function updateTower()
{
 
  color('black');
  let collider = char('d',G.WIDTH/2,G.HEIGHT/2 ,{scale : vec(3,3)})
  let collision = (collider.isColliding.char.a ||
                    collider.isColliding.char.f ||
                    collider.isColliding.char.h ||
                    collider.isColliding.char.i ||
                    collider.isColliding.char.j ||
                    collider.isColliding.char.k)
  
  //attack bar


  color('red')
  let barAmnt = (timeUntilattack/attackInterval) * (G.WIDTH-5)
  bar(G.WIDTH/2,13,barAmnt ,5,0)
  if (collision)//gamew over condition
  {
    color("black")
    rect(G.WIDTH/2-40,G.HEIGHT/2-10,80,40)
    color("light_cyan")
    rect(G.WIDTH/2-38,G.HEIGHT/2-8,76,36)
    play("random",{seed:1242})//game over
    
    end("Game Over!")
  }
}

function updateCards()
{

  if (levelUpAvailable==false)
  {
    return;
  }
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
    levelUpAvailable = false;
    play("powerUp",{seed:28315356323325232}) // power up choice
    powerUpLightning();

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
    levelUpAvailable = false;
    play("powerUp",{seed:28315356323325232}) // power up choice
    powerUpBomb();

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
    levelUpAvailable = false;
    attackInterval -= S.ATTACKDOWNAMNT;
    play("powerUp",{seed:28315356323325232}) // power up choice

    if (attackInterval <= S.LOWESTATTACKSPEED)
    {
      attackInterval = S.LOWESTATTACKSPEED

      
    }
    console.log("attack time down")
  }
  color("black");
  char('e',vec(cardPos3.x+10,cardPos3.y+9),{scale:vec(2,2)});
}

function powerUpLightning()
{
  
  if (LightningBoltStats.level == 1)
  {
    LightningBoltStats.count += 1;
  }
  else if(LightningBoltStats.level % 6==0 && LightningBoltStats.count <= S.LIGHTNINGBOLTMAXPROJECTILES)
  {
    LightningBoltStats.count +=1;
  }
  else
  {
    LightningBoltStats.damage += 1;
  }
  LightningBoltStats.level += 1;
}
function powerUpBomb()
{
  if (bombStats.level == 1 || bombStats.level == 2 )
  {
    bombStats.count += 1;
  }
  else if (bombStats.level % 6 ==0 && bombStats.count <= S.BOMBMAXPROJECTILES)
  {
    bombStats.count += 1;
  }
  else
  {
    bombStats.damage += 1;
  }

  bombStats.level += 1;
}



function fireProjectiles()
{   //this will execute all of the attacks in the list
  //new LightningBolt(mousePosition)
  fireLightning();
  fireBombs();
}
function fireLightning()
{
  let elementCount=0;
  for(let i=0;i<LightningBoltStats.count;i++)
  {

    let target = vec(mousePosition.x,mousePosition.y);
    if(i%4==0)
    {
      console.log("nothing")
      //do nothing
    }
    if((i+1)%4==0)
    {
      console.log("invert right")

      //invert backwards
      target.x -= G.WIDTH/2;
      target.y -= G.HEIGHT/2;
      let temp = target.x
      target.x = target.y
      target.y = -temp
      target.x += G.WIDTH/2;
      target.y += G.HEIGHT/2
    }
    if((i+2)%4==0)
    {
      console.log("invert left")
      target.x -= G.WIDTH/2;
      target.y -= G.HEIGHT/2;
      let temp = target.x
      target.x = -target.y
      target.y = temp
      target.x += G.WIDTH/2;
      target.y += G.HEIGHT/2
      //target.x = G.WIDTH - (mousePosition.x * 2)
    }
    if((i+3)%4==0)
    {
      console.log("invert backwards")
      target.x -= G.WIDTH/2;
      target.y -= G.HEIGHT/2;
      target.x = -target.x
      target.y = -target.y
      target.x += G.WIDTH/2;
      target.y += G.HEIGHT/2
    }
    setTimeout(()=>{ new LightningBolt(target);},125 * elementCount)
    elementCount += 1;

  }
  function helper()
  {

  }
}
function fireBombs()
{
  let elementCount=0;
  for(let i=0;i<bombStats.count;i++)
  {
    let randomX= Math.floor(Math.random() * S.BOMBMAXSPREAD)*2 - S.BOMBMAXSPREAD;
    let randomY = Math.floor(Math.random() * S.BOMBMAXSPREAD)*2 - S.BOMBMAXSPREAD;

    let target = vec(mousePosition.x + randomX, mousePosition.y + randomY);

    setTimeout(()=>{ new bomb(target);},125 * elementCount)
    elementCount += 1;
  }
}


function objectsUpdate()
{
    mousePosition = vec(input.pos.x,input.pos.y)
    color("red")
    rect(mousePosition.x,mousePosition.y,3)

}
function lerp(a = 1.0,b=1.0,alpha=1.0)
{
  return a + alpha * (b-a);
}
function easeIn(a =1.0)
{
  return a*a;
}
var context, controller, square, loop ,red ,green ,black , score = 0;

var playc = new Audio();
playc.src = "beep-07.wav";
var dea= new Audio();
dea.src="beep-03.wav";

var canvas = document.querySelector('canvas');

var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//Square Function
Square = function(x, y, width, height, color) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;

};

Square.prototype = {

  draw:function() {// draws rectangle to canvas

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.color;
    context.fill();

  },

  // get the four side coordinates of the rectangle
  get bottom() { return this.y + this.height; },
  get left() { return this.x; },
  get right() { return this.x + this.width; },
  get top() { return this.y; },

  testCollision:function(square) {

    if (this.top > square.bottom || this.right < square.left || this.bottom < square.top || this.left > square.right) {

          return false;

                           }

          return true;

                                 }

};

rectangle = {

  height:32,
  jumping:true,
  width:32,
  x:144, 
  x_velocity:0,
  y:0,
  y_velocity:0

};

controller = {

  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 37:// left key
        controller.left = key_state;
      break;
      case 38:// up key
        controller.up = key_state;
      break;
      case 39:// right key
        controller.right = key_state;
      break;
	}
  }
};

//enemy
var enemy =
{
	eneX : canvas.width - 180,
	eneY : canvas.height - 126 - 32,
	eneSPX : 10
};
var point =
{
	poiX : canvas.width - 180 ,
	poiY : canvas.height - 126 - 32,
	poiSPX : 5
};

black = new Square(rectangle.x,rectangle.y,rectangle.width,rectangle.height,"black");
green = new Square(point.poiX,point.poiY,32,32,"green");
red = new Square(enemy.eneX,enemy.eneY,32,32,"#ff0000");

let move = true ;

loop = function() { 
  //move = true;
  if (controller.up && rectangle.jumping == false) {

    rectangle.y_velocity -= 20;
    rectangle.jumping = true;

  }

  if (controller.left && move == true) {

    rectangle.x_velocity -= 0.5;

  }

  if (controller.right && move == true) {

    rectangle.x_velocity += 0.5;

  }

  rectangle.y_velocity += 1.5;// gravity
  rectangle.x += rectangle.x_velocity;
  rectangle.y += rectangle.y_velocity;
  rectangle.x_velocity *= 0.9;// friction
  rectangle.y_velocity *= 0.9;// friction

  // if rectangle is falling below floor line
  if (rectangle.y > canvas.height - 126 - 32) {

    rectangle.jumping = false;
    rectangle.y = canvas.height - 126 - 32;
    rectangle.y_velocity = 0;

  }

  // if rectangle is going off the left of the screen
  if (rectangle.x < -32) {

    rectangle.x = canvas.width;
  } else if (rectangle.x > canvas.width) {// if rectangle goes past right boundary

    rectangle.x = -32;

  }
	
  black = new Square(rectangle.x,rectangle.y,rectangle.width,rectangle.height,"black");
  green = new Square(point.poiX,point.poiY,32,32,"green");
  red = new Square(enemy.eneX,enemy.eneY,32,32,"#ff0000");

  context.fillStyle = "#202020";
  context.fillRect(0, 0, canvas.width, canvas.height);// x, y, width, height
 
//player
  black.draw();

//enemy
  red.draw();

//Points
  green.draw();
 
//line
  context.strokeStyle = "#202830";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, 820);
  context.lineTo(1980, 820);
  context.stroke();
//score
  context.font = "40px Arial";
  context.fillStyle = "white";
  context.fillText("score = "+score ,canvas.width/15,canvas.height/9);

//restart 
  document.onkeydown = function(key){
  if(key.keyCode == 13){
   
	enter = true;
                     }
   }
 //enemy
  enemy.eneX += enemy.eneSPX ;
	
  if (enemy.eneX < -32) {

    enemy.eneX = Math.random()*canvas.width;

    } else if (enemy.eneX > canvas.width) {// if rectangle goes past right boundary

       enemy.eneX = Math.random()* -32;

    }
 //points 
  point.poiY += 10;
  
  if(point.poiY > innerHeight || green.testCollision(black))
	
  {	point.poiY = 0; point.poiX = Math.random() * window.innerWidth; }
 
 //collision
  //red
  if(red.testCollision(black))
  {
	  console.log("t");
	  enemy.eneX = rectangle.x;
	  point.poiY = 0;
	  rectangle.jumping = true ;
	  move = false;
	  context.font = "60px Arial";
	  context.fillStyle = "red";
	  context.fillText("GAME OVER", canvas.width/2 - 64, canvas.height/2 - 64);
	  context.font = "40px Arial";
	  context.fillStyle = "red";
	  context.fillText("Press ENTER to play again", canvas.width/2-128 ,canvas.height/2 - 128);
	  context.fillText("HighScore : " +score, canvas.width/2+128 ,canvas.height/2+128);
	  dea.play();
	  //restart
	  if(enter == true)
	   {
		   location.reload();
	   }

  }
  //green
  if(green.testCollision(black))
	  {
		  score++;
		  console.log("c");
		  playc.play();
	  }
// call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};	

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
/*
  TODO:
  Outcomes:
    * Objects collide elastically ( their velocities change wrt to the angle at which they collide at. A collision happens when the distance between the centers of the objects are less then the the the sum of their radii (if they are circles) )
  Add collision behaviour for circles::
    Collision is represented by
  * Objects are wrapped by canvas, the canvas sets their properties.

*/

var elem = document.getElementById('draw-shapes');
var params = { width: 640, height: 480 };

var two = new Two(params).appendTo(elem);

// class ExampleCanvas {
//   constructor( height, width){
//     this.height = height;
//     this.width = width;
//     this.
//   }

//   addCircle()
// }

class Circle {
  constructor(params){
    this.x = params.x;
    this.y = params.y;
    this.size = params.size;
    this.dx  = params.dx;
    this.dy = params.dy;
    this.twoObj = two.makeCircle( this.x , this.y, this.size);

    this.twoObj.fill = params.fill; // 'rgba(0, 200, 255, 0.75)';
    this.twoObj.stroke = params.stroke //'#1C75BC';
    this.twoObj.linewidth = 5;
  }
    _move(){
      //if the object goes out of bounds, shift the direction of the object ( horizontal )
      if ( (this.twoObj.translation.x < this.size) || (this.twoObj.translation.x > (params.width - this.size) ) ){
        this.dx = -1 *  this.dx;
      }
      //if the object goes out of bounds, shift the direction of the object ( vertical )
      if ( (this.twoObj.translation.y < this.size) || (this.twoObj.translation.y > (params.height - this.size) ) ){
        this.dy = -1 *  this.dy;
      }

      this.twoObj.translation.x = this.twoObj.translation.x + this.dx;
      this.twoObj.translation.y = this.twoObj.translation.y + this.dy;

    }
 }


 var default_params = {
  x : 300,
  y : 100,
  size : 50,
  dx : 2,
  dy : 2,
  fill : 'rgba(0, 200, 255, 0.75)',
  stroke : '#1C75BC'
}

var params2 = {
  x : 200,
  y : 100,
  size : 50,
  dx : 5,
  dy : 5,
  fill : '#FF8000',
  stroke : 'orangered'
}
 // main



var circle1 = new Circle( default_params );
var circle2 = new Circle( params2 );


// circle1.fill = "#FF8000";
// circle1.stroke = 'orangered';
// circle1.linewidth = 5;

two.bind('update', function(frameCount){
  circle1._move();
  circle2._move();

  x1 = circle1.twoObj.translation.x;
  y1 = circle1.twoObj.translation.y;

  x2 = circle2.twoObj.translation.x;
  y2 = circle2.twoObj.translation.y;

  // collisionDetector =  Math.abs( (x1^2 + y1^2)^(1/2) - (x2^2 + y2^2)^(1/2)  );
  collisionDetector2 = Math.abs( (x1 + y1) - (x2 + y2)  );
  /*
    I acknoweledge that this an O(n^2) process, and I can ( and perhaps will ) change
    my code to reduce cost / complexity
  */
  // xCollisionDetector = Math.abs( x2 - x1 );
  // yCollisionDetector = Math.abs( y2 - y1 );
  // x_collision_detected = ( xCollisionDetector <= 103 );
  // y_collision_detected = ( yCollisionDetector <= 103 );
  // collision_detected = ( x_collision_detected  || y_collision_detected ); // size of shape + 3 ( for stroke weight)
  // collisionDetectorValues = [ xCollisionDetector, yCollisionDetector ];

  // if (x_collision_detected){
  //   circle1.dx = - 1 * circle1.dx;
  //   circle2.dx =  - 1 * circle2.dx;
  // }
  // if (y_collision_detected){
  //   circle1.dy = - 1 * circle1.dy;
  //   circle2.dy =  - 1 * circle2.dy;
  // }


  document.getElementById("C1analytics").innerHTML = "Position of Circle2: " + x2 + ", " + y2;
  document.getElementById("C2analytics").innerHTML = "Position of Circle1: " + x1 + ", " + y1;
  document.getElementById("collision-analytics").innerHTML = "Collision Detected: " +  String(collisionDetector2);  // "( X: " + x_collision_detected + ", Y: " + y_collision_detected + ", " + collisionDetectorValues;
}).play();

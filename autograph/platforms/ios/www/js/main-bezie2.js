// based on http://www.tricedesigns.com/2012/01/04/sketching-with-html5-canvas-and-brush-images/

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var el = document.getElementById('canvas');
var ctx = el.getContext('2d');
ctx.lineJoin = ctx.lineCap = 'round';

ctx.lineWidth = 3;
ctx.shadowBlur = 1;
ctx.shadowColor = 'rgb(30, 30, 30)';
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, points = [ ];
var lastX, lastY;
var lasCoords = {};

function getRealCoords(e) {
  if (e.touches){
    var _coords={
      pageX: e.touches[0].clientX,
      pageY: e.touches[0].clientY
    }
  } else {
    var _coords={
      pageX: e.clientX,
      pageY: e.clientY
    }
  };
  return {x:_coords.pageX-$(el).position().left, y:_coords.pageY-$(el).position().top}
}

touchstart = function(e) {
  e.preventDefault();

  isDrawing = true;
  points.push(getRealCoords(e));
};

onmousemove = function(e) {
  e.preventDefault();

  if (!isDrawing) return;
  
  points.push(getRealCoords(e));
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  var p1 = points[0];
  var p2 = points[1];
  
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  console.log(points);

  for (var i = 1, len = points.length; i < len; i++) {
    // we pick the point between pi+1 & pi+2 as the
    // end point and p1 as our control point
    var midPoint = midPointBtw(p1, p2);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    p1 = points[i];
    p2 = points[i+1];
  }
  
  
  ctx.lineTo(p1.x, p1.y);
  //ctx.closePath();
  //ctx.strokeStyle = randomColor();
  ctx.stroke();
  
  
  /*var currentPoint = getRealCoords(e);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  points.push(getRealCoords(e));

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (var i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();*/
};

onmouseup = function(e) {
  e.preventDefault();
  //ctx.closePath();
  isDrawing = false;
  points.length = 0;
  ctx.closePath();
};

el.addEventListener('touchstart', touchstart, false);
el.addEventListener('mousedown', touchstart, false);

el.addEventListener('touchmove', onmousemove, false);
el.addEventListener('mousemove', onmousemove, false);

el.addEventListener('touchend', onmouseup, false);
el.addEventListener('mouseup', onmouseup, false);
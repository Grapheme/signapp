// based on http://www.tricedesigns.com/2012/01/04/sketching-with-html5-canvas-and-brush-images/

var img = new Image();
img.src = '/img/brush2.png';

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

var el = document.getElementById('canvas');
var ctx = el.getContext('2d');
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, lastPoint;

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
  lastPoint = getRealCoords(e);
};

onmousemove = function(e) {
  e.preventDefault();

  if (!isDrawing) return;
  
  var currentPoint = getRealCoords(e);
  var dist = distanceBetween(lastPoint, currentPoint);
  var angle = angleBetween(lastPoint, currentPoint);
  
  for (var i = 0; i < dist; i++) {
    x = lastPoint.x + (Math.sin(angle) * i) - 5;
    y = lastPoint.y + (Math.cos(angle) * i) - 5;
    ctx.drawImage(img, x, y);
  }
  
  lastPoint = currentPoint;
};

onmouseup = function() {
      e.preventDefault();

  isDrawing = false;
};

el.addEventListener('touchstart', touchstart, false);
el.addEventListener('mousedown', touchstart, false);

el.addEventListener('touchmove', onmousemove, false);
el.addEventListener('mousemove', onmousemove, false);

el.addEventListener('touchend', onmouseup, false);
el.addEventListener('mouseup', onmouseup, false);
$(document).ready(function() {
  var el = document.getElementById('canvas');
  var ctx = el.getContext('2d');

  ctx.lineWidth = 3;
  ctx.lineJoin = ctx.lineCap = 'round';
  
  var isDrawing, points = [ ];
  
  function midPointBtw(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
    };
  }
  
  function getRealCoords(e, el) {
    console.log($(el).position())
    console.log(e.pageX, e.pageY)
    return [e.pageX-$(el).position().left, e.pageY-$(el).position().top]
  }
  
  el.addEventListener('touchstart', function(e) {
    isDrawing = true;
    
    var c = getRealCoords(e.touches[0], el);
    ctx.moveTo(c[0], c[1]);
    e.preventDefault();
  }, false);
  
  el.addEventListener('touchmove', function(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    var c = getRealCoords(e.touches[0], el);
    ctx.lineTo(c[0], c[1]);
    ctx.stroke();
  }, false);
  
  el.addEventListener('touchend', function(e) {
    e.preventDefault();
    isDrawing = false;
  }, false);

});
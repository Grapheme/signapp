var croquis = new Croquis();
var getContours = function(){};
var domElement;
var counturs

var pressed = false;

$( document ).ready(function() {
  croquis.setCanvasSize(704, 205);
  croquis.addLayer();
  //croquis.fillLayer('#000');
  
  var brush = new Croquis.Brush();
  brush.setSize(3);
  brush.setColor('#fff');
  brush.setSpacing(0.5);
  
  croquis.setTool(brush);
  croquis.setToolStabilizeLevel(10);
  croquis.setToolStabilizeWeight(0.3);
  
  domElement = croquis.getDOMElement();
  var $holder = $('.step-3 .container');
  $holder[0].appendChild(domElement);
  
  var lasCoords = {}
  var lasCoords2 = {}
  
  function getRealCoords(e) {
    if (e.touches){
      /*if (e.touches[1]) {
        var _coords={
          pageX: e.touches[1].clientX,
          pageY: e.touches[1].clientY
        }
      } else {
        var _coords={
          pageX: e.touches[0].clientX,
          pageY: e.touches[0].clientY
        }
      }*/
      var _coords={
        pageX: e.targetTouches[0].clientX,
        pageY: e.targetTouches[0].clientY
      }
    } else {
      var _coords={
        pageX: e.clientX,
        pageY: e.clientY
      }
    };
    return {x:_coords.pageX-$holder.position().left, y:_coords.pageY-$holder.position().top}
  }
  
  function getRealCoords2(e) {
    if (e.touches){
      var _coords={
        pageX: e.touches[1].clientX,
        pageY: e.touches[1].clientY
      }
    } else {
      var _coords={
        pageX: e.clientX,
        pageY: e.clientY
      }
    };
    return {x:_coords.pageX-$('.holder').position().left, y:_coords.pageY-$('.holder').position().top}
  }
  
  touchstart = function(e) {
    e.preventDefault();
    console.log('start');
    croquis.down(getRealCoords(e).x, getRealCoords(e).y);
    lasCoords = getRealCoords(e);
     pressed = true;
  };
  
  onmousemove = function(e) {
    e.preventDefault();
    if (pressed == true) {
      croquis.move(getRealCoords(e).x, getRealCoords(e).y);
      lasCoords = getRealCoords(e);
    }
  }
  onmouseup = function(e) {
    e.preventDefault();
    console.log('up');
    croquis.up(lasCoords.x, lasCoords.y);
    pressed = false;
  }
  
  
  domElement.addEventListener('touchstart', touchstart, false);
  domElement.addEventListener('mousedown', touchstart, false);
  domElement.addEventListener('touchmove', onmousemove, false);
  domElement.addEventListener('mousemove', onmousemove, false);
  domElement.addEventListener('touchend', onmouseup, false);
  domElement.addEventListener('mouseup', onmouseup, false);
  
  //$('body')[0].addEventListener('touchmove', function(e){e.preventDefault()}, false);
  $(document).bind('touchmove', function(e){
    if (!$(e.target).parents('.text-wrapper')[0]) {
      e.preventDefault();
    }
    //e.preventDefault();
  })
  /*$('.text-wrapper').bind('touchmove', function(e){
    e.stopPropagation();
    //e.preventDefault();
  })*/
  
  /*
  for (y = 0; y < dumpImg.data.length; y++) {
    if (dumpImg.data[y]!=0 && dumpImg.data[y]!=255) {
      console.log(dumpImg.data[y]);
    }
  }*/
});
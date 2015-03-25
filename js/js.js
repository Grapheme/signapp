var signImage = new Image();

window.signature = {
  initialize: function() {
    return $('.step-2 svg').each(function() {
      var delay, length, path, paths, previousStrokeLength, speed, _i, _len, _results;
      paths = $('path, circle, rect', this);
      delay = 0;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        length = path.getTotalLength();
        previousStrokeLength = speed || 0;
        speed = length < 100 ? 20 : Math.floor(length);
        delay += previousStrokeLength + 100;
        _results.push($(path).css('transition', 'none').attr('data-length', length).attr('data-speed', speed).attr('data-delay', delay).attr('stroke-dashoffset', length).attr('stroke-dasharray', length + ',' + length));
      }
      return _results;
    });
  },
  animate: function() {
    return $('.step-2 svg g').each(function() {
      var delay, length, path, paths, speed, _i, _len, _results;
      paths = $('path, circle, rect', this);
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        length = $(path).attr('data-length');
        speed = $(path).attr('data-speed');
        delay = $(path).attr('data-delay');
        _results.push($(path).css('transition', 'stroke-dashoffset ' + speed + 'ms ' + delay + 'ms linear').attr('stroke-dashoffset', '0'));
      }
      return _results;
    });
  }
};

$(document).ready(function(){
  function firstSlide(n) {
    $('.step-'+n).fadeIn();
  }
  firstSlide(3);
  
  var chooseNextStep = function(prevX, prevY, curX, curY, direction) {
      var isX = curX - prevX;
      var isY = curY - prevY;
      var stepX;
      var stepY;
      if(direction > 0){
          direction = 1;
      }else{
          direction = -1;
      }

      if(isX === 0 && isY === 1) {
          stepX = -1*direction;
          stepY = 0;
      }
      if(isX === 0 && isY === -1 ) {
          stepX = 1*direction;
          stepY = 0;
      }
      if(isX === 1 && isY === 0){
          stepX = 0;
          stepY = 1*direction;
      }
      if(isX === -1 && isY === 0){
          stepX = 0;
          stepY = -1*direction;
      }

      var nextX = curX + stepX;
      var nextY = curY + stepY;
      return [nextX,nextY];
  }
  
  var findBoundaryPixel = function(image){
    var prev, cur;
    var prevX, prevY;
    for(var i = 0; i < image.length; i++){
        for(var j = 0; j< image[i].length; j++){
            cur = image[i][j];
            if(cur === 1 && prev === 0){
                return {
                    white:[prevX, prevY],
                    black:[i,j]
                }
            }
            prev = cur;
            prevX = i;
            prevY = j;
        }
    }
  }
  
  var findShape = function(data) {
    var shape=[];
    var image = data;


    var boundaryPixel = findBoundaryPixel(image);
    if (!boundaryPixel) {
        return null;
    }
    var startX = boundaryPixel.white[0];
    var startY = boundaryPixel.white[1];

    var prevX = startX;
    var prevY = startY;
    var curX = boundaryPixel.black[0];
    var curY = boundaryPixel.black[1];
    var iterates = 0;

    while (true){
        if(image[curX] && image[curX][curY] === 1) {
            shape.push([curX,curY]);
            image[curX][curY]+=1;
        }

        var nexts = chooseNextStep(prevX,prevY,curX,curY,image[curX] ? image[curX][curY] || 0 : 0);
        prevX = curX;
        prevY = curY;
        curX = nexts[0];
        curY = nexts[1];

        if(curX === startX && curY === startY){
            break;
        }
        iterates++;
        if (iterates > 5000) {
            return null;
        }
    }
    //return createTouchRect(shape);
    return shape;
  }
  
  function createImage(binArray, w, h) { //создаёт изображения из одномерного монохромного массива
    var _canvas=document.createElement("canvas");
    var _ctx=_canvas.getContext("2d");
    _canvas.width=w;
    _canvas.height=h;
    var imgData=_ctx.getImageData(0,0,w,h);
    var data=imgData.data;
    for(var i=0;i<binArray.length;i+=1){
      if (binArray[i]==1) {
        data[i*4]=255
        //data[(i*4)+1]=255
        //data[(i*4)+2]=255
        data[(i*4)+3]=255
      }
    }
    _ctx.putImageData(imgData,0,0);
    return _canvas.toDataURL()
  }
  
  function getRawMonochrome(rawArray) { //превращает одномерный массив изображения в монохромный одномерный масив
    rawMono = []
    for (i = 0; i < rawArray.length; i += 4) {
      //if (rawArray[i]==255 && rawArray[i+1]==255 && rawArray[i+2]==255 && rawArray[i+3]==255) {
      if (rawArray[i]!=0 || rawArray[i+1]!=0 || rawArray[i+2]!=0 || rawArray[i+3]!=0) {
        rawMono.push(1)
      } else {
        rawMono.push(0)
      }
    }
    return rawMono;
  }
  
  function make1dimArray(twoDimArr) {
    var oneDimArr = [];
    for (y = 0; y<twoDimArr.length; y+=1) {
      for (x = 0; x<twoDimArr[y].length; x+=1) {
        oneDimArr.push(twoDimArr[y][x]);
      }
    }
    return oneDimArr;
  }
  
  function make2dimArray(rawArray, w, h) { //делает двумерный массив из монохромного одномерного
    var arrayImage = [];
    for (y = 0; y < h; y += 1) {
      var row = [];
      for (x = 0; x < w; x += 1) {
        row.push(rawArray[(y*w)+x]);
      }
      arrayImage.push(row);
    }
    return arrayImage;
  }
  
  $('.step-3 a.clear').click(function(e){
    e.preventDefault();
    croquis.clearLayer();
  });
  
  $('.step-3 a.scan-btn').click(function(e){
    e.preventDefault();
    var rawImage = croquis.getLayerImageDataCache().data;
    var _w = croquis.getLayerImageDataCache().width;
    var _h = croquis.getLayerImageDataCache().height;
    var twoDimArray = make2dimArray(getRawMonochrome(rawImage), _w, _h);
    
    //console.log(createImage(make1dimArray(make2dimArray(getRawMonochrome(rawImage), _w, _h)), _w, _h));
    
    console.log(findShape(make2dimArray(getRawMonochrome(rawImage), _w, _h)))
    
  });
  
  $('.step-1 a.start').click(function(e){
    e.preventDefault();
    
    window.signature.initialize();
    
    $('.step-1').fadeOut();
    $('.step-2').fadeIn(300, function(e){
      setTimeout(function() {
        window.signature.animate();
      }, 500);
      setTimeout(function(){
        $('.step-2').fadeOut(300, function(e){
          $('.step-3').fadeIn();
          $('.step-3 a.scan-btn').click(function(e){
            e.preventDefault();
            signImage.src = $('.step-3 .container .croquis-layer-canvas')[0].toDataURL();
            $('.step-4 .sign-image')[0].appendChild(signImage.cloneNode(true));
            $('.step-5 .sign-image')[0].appendChild(signImage.cloneNode(true));
            $('.step-3').fadeOut(300, function(){
              $('.step-4').fadeIn(300, function(){
                setTimeout(function(){
                  $('.step-4').fadeOut(300, function(){
                    $('.step-5').fadeIn();
                    $('.step-5 .send-btn').click(function(e){
                      e.preventDefault();
                      $('.step-5').fadeOut(300, function(){
                        $('.step-6').fadeIn();
                        $('.step-6 .email-form').submit(function(e){
                          e.preventDefault();
                          $('.step-6').fadeOut(300, function(){
                            $('.step-7').fadeIn(300, function(){
                              setTimeout(function(){
                                $('.step-7').addClass('active');
                              }, 400)
                            });
                          });
                        });
                      })
                    });
                  });
                }, 5000)
              });
            });
          });
        });
      }, 4000)
    });
  });
});
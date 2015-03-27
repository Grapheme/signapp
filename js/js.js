function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  
  function prepare(twoDimArray) {
    var total = 0;
    for (y = 0; y < twoDimArray.length; y += 1) {
      for (x = 0; x < twoDimArray[y].length; x += 1) {
        var _c = 0;
        if (twoDimArray[y][x]==1) {
          try{
            if (twoDimArray[y-1][x]==1) {
              _c++
            }
          } catch(e) {
            
          }
          
          try{
            if (twoDimArray[y+1][x]==1) {
              _c++
            }
          } catch(e) {
            
          }
          try{
            if (twoDimArray[y][x+1]==1) {
              _c++
            }
          } catch(e) {
            
          }
          try{
            if (twoDimArray[y][x-1]==1) {
              _c++
            }
          } catch(e) {
            
          }
        }
        //console.log(_c);
        if (_c==1) {
          //console.log('fix!');
          total++
          twoDimArray[y][x]=0;
        }
      }
    }
    console.log('total fix: ', total)
    return twoDimArray;
  }
  
  function coordsToTwoDim(element, _w, _h) {
    var y=element.coords[0][0];
    var x=element.coords[0][1];
    var h = element.coords[1][0];
    var w = element.coords[1][1];
    var arrayTwoDim = [];
    for (_y=0; _y<_h; _y++) {
      var row=[];
      for (_x=0; _x<_w; _x++) {
        row.push(0);
      }
      arrayTwoDim.push(row);
    }
    for (i=0; i<element.data.length; i++) {
      var _x_ = element.data[i][1];
      var _y_ = element.data[i][0];
      arrayTwoDim[_y_][_x_] = 1;
    }
    
    return arrayTwoDim;
  }
  
  function twoDimToCoords(matrix, element) {
    var coordsArray = [];
    var starty=element.coords[0][0];
    var startx=element.coords[0][1];
    var endy = element.coords[1][0];
    var endx = element.coords[1][1];
    
    for (y = 0; y < matrix.length; y += 1) {
      for (x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x]==1) {
          coordsArray.push([y+starty, x+startx])
        }
      }
    }
  };
  
  function biggestCountur(array) {
    var _c = 0;
    var big;
    _.each(array, function(element, index, list){
      if (element.data && element.data.length>_c) {
        _c = element.data.length
        big = element;
      }
    })
    var sign = {
      sign: big,
    };
    biggestCounturDetail(sign, array);
    return sign;
  }
  
  function biggestCounturDetail(big, counturs) {
    _.each(counturs, function(element, index, list){
      var intersection = _.intersection(big.sign.data, element.data);
      console.log(intersection, element.data)
      if (intersection == element.data) {
        console.log('YES!')
      } else {
        console.log('NO!')
      }
    });
  }
  
  function floodFill(element, x, y, _w, _h) {
    var matrix = coordsToTwoDim(element.data, _w, _h);
    if (matrix[y][x]!=0) {
      return matrix//нужно конвертировать в координаты
    } else {
      try {
        matrix[y][x]=1;        
      } catch(e) {
        console.log(e);
      }
      floodFill(element, x-1, y, _w, _h)
      floodFill(element, x+1, y, _w, _h)
      floodFill(element, x, y+1, _w, _h)
      floodFill(element, x, y-1, _w, _h)
    };
  };
  
  function floodFillController(element, _w, _h) {
    var starty=element.coords[0][0];
    var startx=element.coords[0][1];
    var endy = element.coords[1][0];
    var endx = element.coords[1][1];
    var randomy = getRandomInt(starty, endy)
    var randomx = getRandomInt(startx, endx)
    
    var flooded = floodFill(element, randomy, randomx, _w, _h);
    
    if (flooded.data == element.data) {
      floodFillController(element, _w, _h)
    } else {
      return flooded;
    }
    
    /*for (_y=0; _y<matrix.length; _y++) {
      for (_x=0; _x<matrix.length; _x++){
        
      }
    }*/
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
    console
    //console.log(createImage(make1dimArray(make2dimArray(getRawMonochrome(rawImage), _w, _h)), _w, _h));
    
    //console.log(findShape(make2dimArray(getRawMonochrome(rawImage), _w, _h)))
    //console.log(twoDimArray)
    //twoDimArray = prepare(twoDimArray);
    console.log('before', createImage(make1dimArray(twoDimArray), _w, _h));
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    console.log('after', createImage(make1dimArray(twoDimArray), _w, _h));
    counturs = [];
    shapes = [];
    counturs = findShapes(twoDimArray, counturs);
    
    
    
    //var bigCountur = biggestCountur(counturs);
    console.log(counturs);
    //console.log(bigCountur);
    
    var sign = {
      coords: [],
      data: [],
    }
    _.each(counturs, function(element, index, list){
      var y=element.coords[0][0]-1;
      var x=element.coords[0][1]-1;
      var h = element.coords[1][0]-y+1;
      var w = element.coords[1][1]-x+1;
      console.log('countur!!!', createImage(make1dimArray(coordsToTwoDim(element, _w, _h)), _w, _h));
      croquis.fillLayerRect('rgba('+(Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256))+', 0.5)', x, y, w, h);
    });
    //console.log(_.max(shapes));
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
var wrate = 0.16;
var hrate = 0.19;

var _RESULT_ = {
  text: []  
};

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
  firstSlide(1);
  
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
          /*twoDimArray[y][x]=1;
          try{
            twoDimArray[y+1][x]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y-1][x]=1;
          } catch(e) {
            
          }  
          try{
            twoDimArray[y][x+1]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y][x-1]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y-1][x-1]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y+1][x-1]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y+1][x+1]=1;
          } catch(e) {
            
          }
          try{
            twoDimArray[y-1][x+1]=1;
          } catch(e) {
            
          }*/
        }
      }
    }
    console.log('total fix: ', total)
    return twoDimArray;
  }
  
  function coordsToTwoDim(element, _w, _h) {
    console.log(element)
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
    console.log(sign);
    try {
      var h = sign.sign.coords[1][0]-sign.sign.coords[0][0];
      var w = sign.sign.coords[1][1]-sign.sign.coords[0][1];
      sign.sign.h = h;
      sign.sign.w = w; 
    } catch(e) {
      sign.error = e
    }
    //biggestCounturDetail(sign, array);
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
  
  function signLength(sign) {
    var _w = sign.sign.w / 2
    if (_w > 138) {
      sign.sign.is_long = true
    } else {
      sign.sign.is_long = false
    }
    return sign;
  }
  /*function signHigh(sign) {
    var _h = sign.sign.h * hrate
    if (_h > 138) {
      sign.sign.is_long = true
    } else {
      sign.sign.is_long = false
    }
    return sign;
  }*/
  
  $('.step-3 a.clear').click(function(e){
    e.preventDefault();
    croquis.clearLayer();
  });
  
  function sliceSign(sign) {
    var starty = sign.coords[0][0];
    var startx = sign.coords[0][1];
    var endy = sign.coords[1][0];
    var endx = sign.coords[1][1];
    var n_slices = 16;
    
    var slicesx = [];
    var step = parseInt(sign.w/n_slices);
    for (i=0; i<n_slices; i++) {
      slicesx.push((i*step)+startx)
    }
    slicesx.push(endx);
    var slices = [];
    
    for (i=0; i<slicesx.length-1; i++) {
      var chunk = []
      
      for (y=starty; y<endy; y++) {
        var row = [];
        for (x=slicesx[i]; x<slicesx[i+1]; x++) {
          row.push(sign.matrix[y][x]);
        }
        chunk.push(row);
      }
      slices.push(chunk);
    }
    var heights = [];
    var density = [];
    
    for (i=0; i<slices.length; i++) {
      var chunk = slices[i];
      var info = {};
      var density_chunk = 0;
      for (y=0; y<chunk.length; y++) {
        var first = false;
        for (x=0; x<chunk[y].length; x++) {
          if (chunk[y][x]==1) {
            first = true;
            info.last = y
            density_chunk++
          }
        }
        if (!info.first&&first==true) {
          info.first = y
        }
      }
      density.push(density_chunk);
      heights.push(info.last - info.first);
    }
    
    
    console.log(slicesx);
    console.log(slices);
    console.log(heights);
    console.log(density);
    return heights
  }
  
  function startAnaliz() {
    var rawImage = croquis.getLayerImageDataCache().data;
    var _w = croquis.getLayerImageDataCache().width;
    var _h = croquis.getLayerImageDataCache().height;
    var twoDimArray = make2dimArray(getRawMonochrome(rawImage), _w, _h);
    //console.log(createImage(make1dimArray(make2dimArray(getRawMonochrome(rawImage), _w, _h)), _w, _h));
    
    //console.log(findShape(make2dimArray(getRawMonochrome(rawImage), _w, _h)))
    //console.log(twoDimArray)
    //twoDimArray = prepare(twoDimArray);
    //console.log('before', createImage(make1dimArray(twoDimArray), _w, _h));
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    twoDimArray = prepare(twoDimArray);
    //console.log('after', createImage(make1dimArray(twoDimArray), _w, _h));
    
    counturs = [];
    shapes = [];
    counturs = findShapes(twoDimArray, counturs);
    
    var bigCountur = biggestCountur(counturs);
    if (bigCountur.sign) {
      bigCountur.sign.matrix = coordsToTwoDim(bigCountur.sign, _w, _h);
      console.log(counturs);
      console.log(bigCountur);
      
      bigCountur = signLength(bigCountur);
      
      console.log(bigCountur);
      
      var heights_px = sliceSign(bigCountur.sign);
  
      var heights_mm = [];
      var small_count = 0;
      _.each(heights_px, function(element, index, list){
        var mm = element*hrate
        heights_mm.push(mm);
        if (mm<=3) {
          small_count++
        }
      });
      
      if (small_count>=4) {
        bigCountur.sign.is_small = true
      } else {
        bigCountur.sign.is_small = false
      }
      
      console.log(heights_mm);
      
      var max_mm = _.max(heights_mm);
      var min_mm = _.min(heights_mm);
      var avg_mm = _.reduce(heights_mm, function(memo, element) {
                    return memo + element
                  }, 0) / heights_mm.length
      
      console.log(max_mm, min_mm, avg_mm);
      
      var max_count = 0;
      var min_count = 0;
      _.each(heights_mm, function(element, index, list){
        if (element > avg_mm) {
          max_count++
        } else {
          min_count++
        }
      })
      
      console.log(max_count, min_count)
      
      if (Math.abs(max_count-min_count)<=4) {
        bigCountur.sign.swing = 'min'
      } else {
        bigCountur.sign.swing = 'max'
      }
    } else {
      console.log('!ПОДПИСЬ НЕ РАСПОЗНАНА!');
      bigCountur.sign={
        is_long: true,
        bigCharHeight: 5,
        is_small: true,
        swing: 'max'
      }
      var heights_mm = [];
      heights_mm.length=2;
    };
    
    var direction = _.random(2);
    if (direction==0) {
      _RESULT_.text.push('Уникальная деталь Вашего характера — <strong>наличие творческого потенциала</strong>. В  подписи также проявляются черты, свойственные  амбициозным и энергичным  людям.');
    } else if (direction==1) {
      _RESULT_.text.push('Уникальная деталь Вашего характера – <strong>реалистичный взгляд на окружающий мир</strong>. В подписи также проявляются черты, свойственные людям, способным быстро ориентироваться в ситуации.');      
    } else {
      _RESULT_.text.push('Уникальная деталь Вашего характера — <strong>рациональный взгляд на жизнь</strong>. В подписи также проявляются черты, свойственные уравновешенным и самокритичным людям. Ваша способность ясно мыслить и четко действовать помогает избегать сложных ситуаций.');
    }
    
    if (bigCountur.sign.is_long) {
      _RESULT_.text.push('Вы обладаете <strong>стратегическими способностями, а  обстоятельность, усидчивость, настойчивость</strong> позволяют реализовывать многогранные бизнес-проекты.')
    } else {
      _RESULT_.text.push('Вы обладаете <strong>тактическими навыками и способностью быстро принимать  решения</strong>, что помогает реализовывать новые  бизнес-идеи.');
    }
    
    var bigCharHeight = 0;
    
    if (heights_mm&&heights_mm[0]>avg_mm && heights_mm[1]>avg_mm && heights_mm[2]>avg_mm&&heights_mm[3]>avg_mm) {
      _RESULT_.text.push('Также в профессиональной деятельности Вам легко генерировать идеи и планировать их реализацию. <strong>Вы отдаете предпочтение умственному труду</strong>.')
      bigCharHeight = _.max([heights_mm[0],heights_mm[1],heights_mm[2],heights_mm[3]])
    } else if (heights_mm&&heights_mm[heights_mm.length-1]>avg_mm || heights_mm[heights_mm.length-2]>avg_mm) {
      _RESULT_.text.push('Также в профессиональной деятельности <strong>Вам свойственно практическое воплощение идей</strong>.')
      bigCharHeight = _.max([heights_mm[heights_mm.length-1],heights_mm[heights_mm.length-2]])
    } else {
      console.log('заглавные в начале (0-1)');
      _RESULT_.text.push('Также в профессиональной деятельности <strong>верное решение Вам помогает принять жизненный опыт</strong>.')
      bigCharHeight = max_mm;
    }
    
    if (bigCharHeight>=4) {
      _RESULT_.text.push('В обществе <strong>Вы проявляете повышенные требования к окружающим и избирательность</strong>. Благодаря такому амбициозному подходу, Вы добиваетесь поставленных целей.');
    } else {
      _RESULT_.text.push('В обществе <strong>Вы утонченный интеллектуал, проявляете сдержанность, действуете осмысленно</strong> и получаете нужную информацию в общении.');
    }
    
    if (bigCountur.sign.is_small) {
      _RESULT_.text.push('В почерке находит отражение <strong>Ваша способность к поиску точных решений</strong>.')
    } else {
      _RESULT_.text.push('В почерке находит отражение <strong>Ваша способность убеждать</strong>.');
    }
    
    if (bigCountur.sign.swing == 'min') {
      _RESULT_.text.push('<strong>В личной жизни Вы цените постоянство.</strong>')
    } else {
      _RESULT_.text.push('<strong>В личной жизни Вы проявляете энтузиазм и инициативность. </strong>');
    }
    
    var angle_char = _.random(2);
    if (angle_char==0) {
      _RESULT_.text.push('<strong>Вы легко находите общий язык с разными людьми.</strong>');
    } else if (angle_char==1) {
      _RESULT_.text.push('<strong>Вы интересный собеседник</strong> и всегда объективно излагаете свою позицию.');
    } else {
      _RESULT_.text.push('<strong>В общении Вы осторожны и проявляете самообладание.</strong>');
    }
    
    var angle_char = _.random(2);
    if (angle_char==0) {
      _RESULT_.text.push('Широкий круг Ваших интересов позволяет быть активным всегда и везде. Вам нравятся светские мероприятия в клубах и вечеринки на открытом воздухе.');
    } else if (angle_char==1) {
      _RESULT_.text.push('Широкий круг Ваших интересов позволяет посещать  как творческие мероприятия, так и  проводить время в уютных ресторанах,  на закрытых вечеринках.');
    } else {
      _RESULT_.text.push('Широкий круг Ваших увлечений позволяет посещать светские мероприятия, на которых Ваша эмоциональная и яркая натура чувствует себя свободно. ');
    }
    
    
    _.each(_RESULT_.text, function(element, index, list){
      $('.step-5 .text-wrapper .text').append('<p>'+element+'</p>')
    })

    $('.step-5 .text-wrapper .text').append('<p>Уникальное сочетание деталей в подписи отражает Вашу индивидуальность.</p>');
    
    
    try {
      bigCountur.sign.data = [];       
      bigCountur.sign.matrix = [];       
    } catch (e) {
      bigCountur.error2 = e;
    }
    
    /*$.ajax({
      method: "POST",
      url: "http://levichev.dev.grapheme.ru/ajax/marat/test",
      data: {image: createImage(make1dimArray(twoDimArray), _w, _h), sign: bigCountur, heights_mm: heights_mm},
      success:function(data) {
      
      }
    })*/
    
    
    
    /*var sign = {
      coords: [],
      data: [],
    }*/
    _.each(counturs, function(element, index, list){
      var y=element.coords[0][0]-1;
      var x=element.coords[0][1]-1;
      var h = element.coords[1][0]-y+1;
      var w = element.coords[1][1]-x+1;
      console.log('countur!!!', createImage(make1dimArray(coordsToTwoDim(element, _w, _h)), _w, _h));
      croquis.fillLayerRect('rgba('+(Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256))+', 0.5)', x, y, w, h);
    });
  }
  
  $('.step-3 a.scan-btn').click(function(e){
    e.preventDefault();
    //startAnaliz();
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
                startAnaliz();
                //return false;
                setTimeout(function(){
                  $('.step-4').fadeOut(300, function(){
                    $('.step-5').fadeIn();
                    $('.step-5 .send-btn').click(function(e){
                      e.preventDefault();
                      $('.step-5').fadeOut(300, function(){
                        $('.step-6').fadeIn();
                        $('.step-6 .email-form').submit(function(e){
                          e.preventDefault();
                          $.ajax({
                            method: "POST",
                            url: "http://common.dev.grapheme.ru/app-signature/work",
                            data: {
                              image: signImage.src,
                              text: $('.step-5 .text-wrapper .text').html(),
                              email: $('.step-6 .email-form input').val()
                            },
                            success:function(data) {
                              
                            }
                          })
                          $('.step-6').fadeOut(300, function(){
                            $('.step-7').fadeIn(300, function(){
                              setTimeout(function(){
                                $('.step-7').addClass('active');
                                setTimeout(function(){
                                  location.href='index.html'
                                }, 5000)
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
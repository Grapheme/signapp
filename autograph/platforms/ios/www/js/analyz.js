var counturs = [];
var shapes = [];
var findShape;

var findShapes = function(data, existingButtons) {
    var createTouchRect = function(shape){
            var minX = Infinity;
            var maxX = -1;
            var minY = Infinity;
            var maxY = -1;

            for(var i = 0; i<shape.length; i++){
                if(shape[i][0] < minX) {
                    minX = shape[i][0];
                }
                if(shape[i][0] > maxX) {
                    maxX = shape[i][0]
                }
                if(shape[i][1] < minY) {
                    minY = shape[i][1];
                }
                if(shape[i][1] > maxY){
                    maxY = shape[i][1];
                }
            }
            return [[minX, minY], [maxX, maxY]];
        },
        findShape = function(data) {
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
                if (iterates > 50000) {
                    return null;
                }
            }
            if (shape.length>=8) {
              shapes.push(shape);
            }
            return createTouchRect(shape);
        },
        chooseNextStep = function(prevX, prevY, curX, curY, direction) {
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
        },
        findBoundaryPixel = function(image){
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
        },
        subtract = function(data, button) {
            /*
            var x0 = Math.max(button[0][1] - 10, 0),
                x1 = Math.min(button[1][1] + 10, data[0] ? data[0].length : 0),
                y0 = Math.max(button[0][0] - 10, 0),
                y1 = Math.min(button[1][0] + 10, data.length);

            for (var row = y0; row <= y1; row++) {
                for (var col = x0; col <= x1; col++) {
                    if (data[row]) {
                        data[row][col] = 0;
                    }
                }
            }
            */
            return data;
        },
        isFilled = function(data) {
            var filled = 0,
                height = data.length,
                width = data[0] ? data[0].length : 0;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    filled += data[i][j] ? 1 : 0;
                }
            }
            return filled/(width*height) > 0.3;
        },
        isEmpty = function(data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    if (data[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        },
        isButton = function(button) {
            var minSize = 8;
            return (button[1][0] - button[0][0] > minSize) && (button[1][1] - button[0][1] > minSize);
        },
        cropArea = function(data, coords) {
            var cropedData = [],
                extendSize = 0,
                minX = Math.max(0, coords[0][1] - extendSize),
                maxX = Math.min(options.width - 1, coords[1][1] + extendSize),
                minY = Math.max(0, coords[0][0] - extendSize),
                maxY = Math.min(options.width - 1, coords[1][0] + extendSize);

            for (var row = minY, i = 0; row <= maxY; row++, i++) {
                cropedData[i] = [];
                for (var col = minX, j = 0; col <= maxX; col++, j++) {
                    if (data[row]) {
                        cropedData[i][j] = data[row][col] || 0;
                    }
                }
            }
            return cropedData;
        },
        getButtonSquare = function(coords) {
            return (coords[1][1] - coords[0][1]) * (coords[1][0] - coords[0][0]);
        },
        uuid = (function() {
            var index = 1;
            return function() {
                return index++;
            }
        })();
    var found = true,
        button = null,
        buttons = [];

    //debugger;
    for (var i = 0; i < existingButtons.length; i++) {
        button = findShape(cropArea(data, existingButtons[i].coords));
        if (button) {
            if (getButtonSquare(button) / getButtonSquare(existingButtons[i].coords) < 0.7) {
                button = existingButtons[i].coords;
            } else {
                button[0][0] += existingButtons[i].coords[0][0];
                button[0][1] += existingButtons[i].coords[0][1];
                button[1][0] += existingButtons[i].coords[0][0];
                button[1][1] += existingButtons[i].coords[0][1];
            }
            if (isButton(button)) {
                existingButtons[i].coords = button;
                buttons.push(existingButtons[i]);
            }
            data = subtract(data, button);
        }
    }
    while (!isEmpty(data) && !isFilled(data) && found && buttons.length < 100) {
        button = findShape(data);
        //console.log('shapes',shapes[0]);
        if (button) {
            if (isButton(button)) {
                var _id = uuid();
                buttons.push({
                    id: _id,
                    //sum: getButtonHash(data, button),
                    coords: button,
                    data: shapes[_id-1]
                });
            }
            //console.log('test', button);
            data = subtract(data, button);
        } else {
            found = false;
        }
    }
    return buttons;
}
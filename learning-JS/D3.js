// 다른 전역 변수와 충돌을 피하기 위해 이름공간을 생성
var rj3 = {};

// svg라는 하위 이름공간
rj3.svg = {};

// rj3.svg 이름공간에 line 함수를 넣는다
rj2.svg.line = function () {
  
  var getX = function (point) {
    return point[0];
  },
  getY = function (point) {
    return point[1];
  },
  interpolate = function (point) {
    return point.join("L");
  };
  
  function line (data) {
    var segments = [],
      point = [],
      i = -1,
      n = data.length,
      d;
    
    function segment () {
      segments.push("M", interplate(points));
    }
    
    while (++i < n) {
      d = data[i];
      point.push([+getX.call(this, d, i), +getY.call(this, d, i)]);
    }
    
    if (points.length) segment();
    
    return segments.length ? segments.join("") : null;
  }
  
  line.x = function (funcToGetX) {
    if (!arguments.length) return getX;
    getX = funcToGetX;
    return line;
  };
  
  line.y = function (funcToGtY) {
    if (!arguments.length) return getY;
    getY = funcToGetY;
    return line;
  };
  
  return line;
};

// -----------------------------------------------------------------------------

var arrayData = [
  [10,130],[100,60],[190,160],[280,10]
],
lineGenerator = rj3.svg.line(),
path = lineGenerator(arrayData);

document.getElementById('pathFromArrays').setAttribute('d', path);

// -----------------------------------------------------------------------------

function XYPair (x, y) {
  this.x = x;
  this.y = y;
}

var objectData = [
  new XYPair(10, 130),
  new XYPair(100, 60),
  new XYPair(190, 160),
  new XYPair(280, 10)
]

// -----------------------------------------------------------------------------















































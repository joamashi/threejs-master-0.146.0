// 상위클래스
function Shape () {
    this.x = 0;
    this.y = 0;
}
Shape.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    console.info(this.x, this.y);
};

// 하위클래스
function Rectangle () {
    Shape.call(this); // super 생성자 호출.
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;



var rect = new Rectangle();

console.log(rect instanceof Shape);     // true
console.log(rect instanceof Rectangle); // true
rect.move(1, 1); // 1 1


// ------------------------------------------------------------------------


function Vehicle(name, speed) {
    this.name = name;
    this.speed = speed;
}
Vehicle.prototype.drive = function () {
    console.log(this.name + ' runs at ' + this.speed)
};

var tico = new Vehicle('tico', 50);
tico.drive(); // 'tico runs at 50'

function Sedan(name, speed, maxSpeed) {
    Vehicle.apply(this, arguments)
    this.maxSpeed = maxSpeed;
}
Sedan.prototype = Object.create(Vehicle.prototype);
Sedan.prototype.constructor = Sedan;
Sedan.prototype.boost = function () {
    console.log(this.name + ' boosts its speed at ' + this.maxSpeed);
};

var sonata = new Sedan('sonata', 100, 200);
sonata.drive(); // 'sonata runs at 100'
sonata.boost(); // 'sonata boosts its speed at 200'


// ------------------------------------------------------------------------


function Truck ( name, speed, capacity ) {
    Vehicle.apply(this, arguments);
    this.capacity = capacity;
}

Truck.prototype = Object.create( Vehicle.prototype );
Truck.prototype.constructor = Truck;
Truck.prototype.load = function (weight) {
    if (weight > this.capacity) {
        return console.error('아이고 무거워!');
    }
    return console.log('짐을 실었습니다!');
};

var boongboong = new Truck('boongboong', 40, 100);
boongboong.drive(); // 'boongboong runs at 40'
boongboong.load(120); // '아이고 무거워!'
   
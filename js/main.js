"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var log = console.log;
var pi = Math.PI, cos = Math.cos, sin = Math.sin, tan = Math.tan, atan = Math.atan, asin = Math.asin, acos = Math.acos, hypot = Math.hypot;
var canvas = document.createElement('canvas');
canvas.height = 1000;
canvas.width = 1000;
var ctx = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;
document.body.appendChild(canvas);
var score = 0;
var subScore = 0;
var GElement = /** @class */ (function () {
    function GElement(width, height, x, y, style) {
        if (typeof width !== 'number')
            throw new TypeError('GElement Constructor: width must be a number');
        if (typeof height !== 'number')
            throw new TypeError('GElement Constructor: height must be a number');
        if (typeof x !== 'number')
            throw new TypeError('GElement Constructor: x must be a number');
        if (typeof y !== 'number')
            throw new TypeError('GElement Constructor: y must be a number');
        if (typeof style !== 'object')
            throw new TypeError('GElement Constructor: style must be an object');
        if (style.type === undefined)
            throw new TypeError('GElement Constructor: style must be an object with a type property');
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.style = style;
    }
    GElement.prototype.draw = function () {
        if (this.style.type === 'sprite') {
            log('yy');
            var img = new Image();
            img.src = (this.style.spriteSrc);
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
        else if (this.style.type === 'square') {
            var c = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : null;
            if (c === null)
                throw new TypeError('GElement draw: style.color must be a string or a rgb');
            ctx.fillStyle = c;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else if (this.style.type === 'path') {
            if (this.style.fill !== undefined && typeof this.style.fill !== 'boolean')
                throw new TypeError('GElement draw: style.fill must be a boolean');
            if (this.style.points === undefined)
                throw new TypeError('GElement draw: style.points must be an Array');
            if (this.style.points.length === 0)
                throw new Error('GElement draw: minimum style.points length is 1');
            for (var _i = 0, _a = this.style.points; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!Array.isArray(i))
                    throw new TypeError('GElement draw: all GElement of style.points must be Arrays');
                if (i.length < 2)
                    throw new Error('GElement draw: min length of all GElements of style.points is 2');
                if (typeof i[0] !== 'number' || typeof i[1] !== 'number')
                    throw new TypeError('GElement draw: all GElements of style.points must be an Array of number');
            }
            var c = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : null;
            if (c === null)
                throw new TypeError('GElement draw: style.color must be a string or a rgb');
            ctx.fillStyle = c;
            ctx.strokeStyle = c;
            ctx.beginPath();
            var fpp = [((this.style.points[0][0] / 100) * this.width) + this.x, ((this.style.points[0][1] / 100) * this.height) + this.y];
            ctx.moveTo.apply(ctx, fpp);
            for (var _b = 0, _c = this.style.points; _b < _c.length; _b++) {
                var i = _c[_b];
                var p = [((i[0] / 100) * this.width) + this.x, ((i[1] / 100) * this.height) + this.y];
                /*p.push(((i[0] / 100) * this.width) + this.x);
                p.push(((i[1] / 100) * this.height) + this.y);*/
                ctx.lineTo.apply(ctx, p);
            }
            var fill = this.style.fill === undefined ? false : this.style.fill;
            ctx.lineTo.apply(ctx, fpp);
            if (fill)
                ctx.fill();
            ctx.stroke();
            ctx.closePath();
            var pp = [];
            for (var i = 0; i < this.style.points.length - 1; i++) {
                var p = [];
                p.push(((this.style.points[i][0] / 100) * this.width) + this.x);
                p.push(((this.style.points[i][1] / 100) * this.height) + this.y);
                for (var _d = 0, pp_1 = pp; _d < pp_1.length; _d++) {
                    var j = pp_1[_d];
                    if (j[0] == p[0] && j[1] == p[1])
                        continue;
                }
                pp.push(p);
                ctx.beginPath();
                ctx.fillStyle = 'hsl(' + (i * (255 / 4)) + ',100%, 50%)';
                //ctx.arc(p[0] - 1, p[1] - 1, 2, 0, pi * 2);
                ctx.fill();
                ctx.closePath();
                ctx.font = '10px Arial';
                //ctx.fillText((i + 1).toString(), p[0] - 5, p[1] - 5)
            }
        }
    };
    GElement.prototype.touch = function (GEl) {
        return GElement.touch(this.x, this.y, this.width, this.height, GEl.x, GEl.y, GEl.width, GEl.height);
    };
    GElement.touch = function (x, y, w, h, x2, y2, w2, h2) {
        var X = false;
        var Y = false;
        var entXW = x2 + w2;
        var entYH = y2 + h2;
        var thisXW = x + w;
        var thisYH = y + h;
        if ((thisXW <= entXW && thisXW >= x2) || (x <= entXW && x >= x2))
            X = true;
        if ((thisYH <= entYH && thisYH >= y2) || (y <= entYH && y >= y2))
            Y = true;
        var res = false;
        if (Y && X)
            res = true;
        return res;
    };
    return GElement;
}());
var GPlayer = /** @class */ (function (_super) {
    __extends(GPlayer, _super);
    function GPlayer(color, x, y, life) {
        var _this = _super.call(this, 50, 60, x, y, {
            type: 'path',
            color: color,
            points: [
                [50, 0],
                [100, 100],
                [50, 70],
                [0, 100],
                [50, 0]
            ]
        }) || this;
        _this.OPoints = [
            [50, 0],
            [100, 100],
            [50, 70],
            [0, 100],
            [50, 0]
        ];
        _this.PPoints = {
            a: _this.OPoints[0],
            b: _this.OPoints[1],
            c: _this.OPoints[2],
            d: _this.OPoints[3],
            e: [50, 100],
            C: [50, 50]
        };
        _this.len = {
            a: {
                a: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.a.concat(_this.PPoints.C))
            },
            b: {
                a: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.b.concat(_this.PPoints.C))
            },
            c: {
                a: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.c.concat(_this.PPoints.C))
            },
            d: {
                a: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.d.concat(_this.PPoints.C))
            },
            e: {
                a: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.e.concat(_this.PPoints.C))
            },
            C: {
                a: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.a)),
                b: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.b)),
                c: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.c)),
                d: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.d)),
                e: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.e)),
                C: len.apply(void 0, _this.PPoints.C.concat(_this.PPoints.C))
            }
        };
        _this.OAngle = pi / 2;
        _this.d = pi / 2;
        _this.life = life;
        _this.maxLife = life;
        return _this;
    }
    Object.defineProperty(GPlayer.prototype, "angle", {
        set: function (Angle) {
            var alpha = Angle /* - (pi*2)*(~~(Angle/(pi*2))-1)*/, Cx = 50, Cy = 50, TOP = (alpha >= 0 && alpha <= pi) || (alpha <= -pi && alpha >= -(pi * 2)), BOTTOM = (alpha <= 0 && alpha >= -pi) || (alpha >= pi && alpha <= pi * 2), LEFT = (alpha >= pi / 2 && alpha <= 3 * (pi / 4)) || (alpha <= -(pi / 2) && alpha >= -(3 * (pi / 4))), RIGHT = (alpha <= pi / 2 && alpha >= -(pi / 2)), delta1 = (alpha) + (acos(this.len.C.e / this.len.C.d)) * (LEFT ? 1 : -1), delta2 = (alpha + pi) + (acos(this.len.C.e / this.len.C.b)) * (RIGHT ? 1 : -1), ax = Cx + (cos(alpha) * this.len.a.C) * (LEFT ? -1 : 1), ay = Cy + (sin(alpha) * this.len.a.C) * (TOP ? 1 : -1), bx = Cx + (sin(delta2) * this.len.b.C) * (LEFT ? -1 : 1), by = Cy + (cos(delta2) * this.len.b.C) * (BOTTOM ? 1 : -1), cx = Cx + (cos(alpha + pi) * this.len.C.c) * (RIGHT ? 1 : -1), cy = Cy + (sin(alpha + pi) * this.len.C.c) * (TOP ? 1 : -1), dx = Cx + (sin(delta1) * this.len.d.C) * (RIGHT ? 1 : -1), dy = Cy + (cos(delta1) * this.len.d.C) * (BOTTOM ? 1 : -1);
            this.d = alpha;
            /*this.style.points = [
                [ax, ay],
                [bx, by],
                [cx, cy],
                [dx, dy],
                [ax, ay]
            ]*/
        },
        enumerable: true,
        configurable: true
    });
    GPlayer.prototype.draw = function () {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.d);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        GElement.prototype.draw.call(this);
        ctx.restore();
    };
    return GPlayer;
}(GElement));
var GAsteroids = /** @class */ (function (_super) {
    __extends(GAsteroids, _super);
    function GAsteroids(x, y, size, fx, fy) {
        if (size === void 0) { size = Math.floor(Math.random() * (151 - 50) + 50); }
        if (fx === void 0) { fx = Math.random() * 12 - 6; }
        if (fy === void 0) { fy = Math.random() * 12 - 6; }
        var _this = _super.call(this, size, size, x, y, {
            type: 'path',
            color: 'white',
            fill: false,
            points: [
                [10, 20],
                [40, 10],
                [70, 20],
                [90, 20],
                [80, 30],
                [90, 40],
                [90, 50],
                [80, 60],
                [70, 90],
                [60, 80],
                [40, 80],
                [30, 70],
                [30, 50],
                [10, 50],
                [20, 40],
                [10, 20]
            ]
        }) || this;
        _this.fX = fx;
        _this.fY = fy;
        GAsteroids.Asteroids.push(_this);
        while (GAsteroids.Asteroids.length > 20) {
            GAsteroids.Asteroids.splice(GAsteroids.Asteroids.length - 1, 1);
        }
        return _this;
    }
    GAsteroids.prototype.move = function () {
        this.x += this.fX;
        this.y += this.fY;
        if (!GElement.touch(this.x, this.y, this.width, this.height, 0, 0, canvas.width, canvas.height)) {
            this.x = this.x > canvas.width ? -this.width : this.x;
            this.x = this.x + this.width < 0 ? canvas.width : this.x;
            this.y = this.y > canvas.height ? -this.height : this.y;
            this.y = this.y + this.height < 0 ? canvas.height : this.y;
        }
    };
    GAsteroids.prototype.kill = function () {
        GAsteroids.Asteroids.splice(GAsteroids.Asteroids.indexOf(this), 1);
    };
    GAsteroids.Asteroids = [];
    return GAsteroids;
}(GElement));
var GBullets = /** @class */ (function (_super) {
    __extends(GBullets, _super);
    function GBullets(x, y, angle, onDeath) {
        if (onDeath === void 0) { onDeath = function () { }; }
        var _this = _super.call(this, 2, 10, x, y, { type: "square", color: "white" }) || this;
        _this.angle = angle;
        _this.onDeath = onDeath;
        return _this;
    }
    GBullets.prototype.draw = function () {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        GElement.prototype.draw.call(this);
        ctx.restore();
        ctx.fillStyle = "white";
    };
    GBullets.prototype.move = function () {
        var speed = 10;
        var fx = cos(this.angle - pi / 2) * speed;
        var fy = sin(this.angle - pi / 2) * speed;
        this.x += fx;
        this.y += fy;
        for (var _i = 0, _a = GAsteroids.Asteroids; _i < _a.length; _i++) {
            var i = _a[_i];
            if (this.touch(i)) {
                this.kill();
                if (i.width / 2 > 50) {
                    var fx_1 = Math.random() * 12 - 6;
                    var fy_1 = Math.random() * 12 - 6;
                    new GAsteroids(i.x, i.y, i.width / 2, fx_1, fy_1);
                    new GAsteroids(i.x, i.y, i.width / 2, -fx_1, -fy_1);
                }
                i.kill();
                score += 100;
            }
        }
    };
    GBullets.prototype.kill = function () {
        this.onDeath(this);
    };
    return GBullets;
}(GElement));
var bg = new GElement(cw, ch, 0, 0, {
    type: 'square',
    color: rgb.black
});
var a = new GAsteroids(200, 200);
console.log(bg.style.color);
(bg.style.color).logColor();
var player = new GPlayer(rgb.white, cw / 2, ch / 2, 3);
var playerBullets = [];
bg.draw();
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    bg.draw();
    player.draw();
    for (var _i = 0, _a = GAsteroids.Asteroids; _i < _a.length; _i++) {
        var i = _a[_i];
        i.draw();
    }
    for (var _b = 0, playerBullets_1 = playerBullets; _b < playerBullets_1.length; _b++) {
        var i = playerBullets_1[_b];
        i.draw();
    }
    ctx.fillStyle = 'white';
    ctx.font = '25px Arial';
    ctx.fillText(score.toString(), 25, 40);
}
function play() {
    if (subScore >= 30) {
        score += 10;
        subScore = 0;
    }
    else {
        subScore++;
    }
    a.move();
    for (var _i = 0, _a = GAsteroids.Asteroids; _i < _a.length; _i++) {
        var i = _a[_i];
        i.move();
    }
    for (var _b = 0, _c = GAsteroids.Asteroids; _b < _c.length; _b++) {
        var i = _c[_b];
        if (player.touch(i)) {
            clearInterval(play.interval);
            clearInterval(draw.interval);
            ctx.fillStyle = new rgb(0, 0, 0, 0.5).value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.save();
            ctx.font = '100px Arial';
            ctx.fillText('you lose', canvas.width / 2 - 170, canvas.height / 2 - 50);
            ctx.restore();
        }
    }
    for (var _d = 0, playerBullets_2 = playerBullets; _d < playerBullets_2.length; _d++) {
        var i = playerBullets_2[_d];
        i.move();
        if (!GElement.touch(i.x, i.y, i.width, i.height, 0, 0, canvas.width, canvas.height)) {
            i.kill();
        }
    }
}
draw.rate = 60;
play.rate = 60;
draw.interval = setInterval(draw, 1000 / draw.rate);
play.interval = setInterval(play, 1000 / play.rate);
var _$$c = canvas;
var _$$cw = _$$c.width;
var _$$ch = _$$c.height;
function _$$adaptSize() {
    var rhl = _$$cw / _$$ch;
    var rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = '100%';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = '100%';
    }
}
_$$adaptSize();
window.addEventListener('resize', _$$adaptSize);
function FToA(Fx, Fy) {
    var fr = atan(Fy / Fx);
    fr = Fx < 0 ? pi + fr : fr;
    return fr;
}
function AToF(A) {
    return [cos(A), sin(A)];
}
function len(ax, ay, bx, by) {
    return hypot(bx - ax, by - ay);
}
function setangle(e) {
    var x = e.clientX * (cw / window.innerWidth);
    var y = e.clientY * (ch / window.innerHeight);
    var ad = x < player.x ? pi : 0;
    var angle = atan((player.y - y) / (player.x - x)) + ad;
    player.angle = angle + Math.PI / 2;
}
document.addEventListener('mousemove', setangle);
document.addEventListener('mousedown', function (e) {
    playerBullets.push(new GBullets((player.x + player.width / 2) + cos(player.d - pi / 2) * player.height / 2, (player.y + player.height / 2) + sin(player.d - pi / 2) * player.height / 2, player.d, function (e) {
        playerBullets.splice(playerBullets.indexOf(e), 1);
    }));
});
var timeAS = 5000;
function newAsteroids() {
    var x = Math.floor(Math.random() * canvas.width + 1);
    var y = Math.floor(Math.random() * canvas.height + 1);
    if (Math.floor(Math.random() * 2) === 0) {
        if (Math.floor(Math.random() * 2) === 0) {
            x = 0;
        }
        else {
            x = canvas.width;
        }
    }
    else {
        if (Math.floor(Math.random() * 2) === 0) {
            y = 0;
        }
        else {
            y = canvas.height;
        }
    }
    new GAsteroids(x, y);
    setTimeout(newAsteroids, Math.random() * timeAS);
    timeAS -= 100;
    timeAS = timeAS < 2000 ? 2000 : timeAS;
}
newAsteroids();

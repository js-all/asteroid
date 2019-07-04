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
                ctx.arc(p[0] - 1, p[1] - 1, 2, 0, pi * 2);
                ctx.fill();
                ctx.closePath();
                ctx.font = '10px Arial';
                ctx.fillText((i + 1).toString(), p[0] - 5, p[1] - 5);
            }
        }
    };
    GElement.prototype.touch = function (GEl) {
        var X = false;
        var Y = false;
        var entXW = GEl.x + GEl.width;
        var entYH = GEl.y + GEl.height;
        var thisXW = this.x + this.width;
        var thisYH = this.y + this.height;
        if ((thisXW <= entXW && thisXW >= GEl.x) || (this.x <= entXW && this.x >= GEl.x))
            X = true;
        if ((thisYH <= entYH && thisYH >= GEl.y) || (this.y <= entYH && this.y >= GEl.y))
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
        ctx.fillStyle = "white";
        ctx.fillText((this.d / Math.PI * 180).toString(), 20, 10);
    };
    return GPlayer;
}(GElement));
var GAsteroids = /** @class */ (function (_super) {
    __extends(GAsteroids, _super);
    function GAsteroids(x, y) {
        var _this = this;
        var size = Math.floor(Math.random() * (151 - 50) + 50);
        _this = _super.call(this, size, size, x, y, {
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
        return _this;
    }
    return GAsteroids;
}(GElement));
var bg = new GElement(cw, ch, 0, 0, {
    type: 'square',
    color: rgb.black
});
var a = new GAsteroids(200, 200);
console.log(bg.style.color);
(bg.style.color).logColor();
var player = new GPlayer(rgb.white, cw / 2, ch / 2, 3);
bg.draw();
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    bg.draw();
    player.draw();
    a.draw();
}
function play() {
}
draw.rate = 30;
play.rate = 10;
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

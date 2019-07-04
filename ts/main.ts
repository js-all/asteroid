const {
    log
} = console;
const {
    PI: pi,
    cos,
    sin,
    tan,
    atan,
    asin,
    acos,
    hypot
} = Math;
const canvas = document.createElement('canvas');
canvas.height = 1000;
canvas.width = 1000;
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw = canvas.width;
const ch = canvas.height;

interface Style {
    type: string;
    color?: string | rgb;
    spriteSrc?: string;
    fill?: boolean;
    points?: Array<Array<number>>;
}

document.body.appendChild(canvas)

class GElement {
    width: number;
    height: number;
    x: number;
    y: number;
    style: Style;
    constructor(width: number, height: number, x: number, y: number, style: Style) {
        if (typeof width !== 'number') throw new TypeError('GElement Constructor: width must be a number');
        if (typeof height !== 'number') throw new TypeError('GElement Constructor: height must be a number');
        if (typeof x !== 'number') throw new TypeError('GElement Constructor: x must be a number');
        if (typeof y !== 'number') throw new TypeError('GElement Constructor: y must be a number');
        if (typeof style !== 'object') throw new TypeError('GElement Constructor: style must be an object');
        if (style.type === undefined) throw new TypeError('GElement Constructor: style must be an object with a type property');
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.style = style;
    }
    draw() {
        if (this.style.type === 'sprite') {
            log('yy')
            let img = new Image();
            img.src = <string>(this.style.spriteSrc);
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else if (this.style.type === 'square') {
            let c = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : null;
            if (c === null) throw new TypeError('GElement draw: style.color must be a string or a rgb');
            ctx.fillStyle = c;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.style.type === 'path') {
            if (this.style.fill !== undefined && typeof this.style.fill !== 'boolean') throw new TypeError('GElement draw: style.fill must be a boolean');
            if (this.style.points === undefined) throw new TypeError('GElement draw: style.points must be an Array');
            if (this.style.points.length === 0) throw new Error('GElement draw: minimum style.points length is 1');
            for (let i of this.style.points) {
                if (!Array.isArray(i)) throw new TypeError('GElement draw: all GElement of style.points must be Arrays');
                if (i.length < 2) throw new Error('GElement draw: min length of all GElements of style.points is 2');
                if (typeof i[0] !== 'number' || typeof i[1] !== 'number') throw new TypeError('GElement draw: all GElements of style.points must be an Array of number');
            }
            let c = typeof this.style.color === 'string' ? this.style.color : this.style.color instanceof rgb ? this.style.color.value : null;
            if (c === null) throw new TypeError('GElement draw: style.color must be a string or a rgb');
            ctx.fillStyle = c;
            ctx.strokeStyle = c;
            ctx.beginPath();
            let fpp: [number, number] = [((this.style.points[0][0] / 100) * this.width) + this.x, ((this.style.points[0][1] / 100) * this.height) + this.y];
            ctx.moveTo(...fpp);
            for (let i of this.style.points) {
                let p: [number, number] = [((i[0] / 100) * this.width) + this.x, ((i[1] / 100) * this.height) + this.y];
                /*p.push(((i[0] / 100) * this.width) + this.x);
                p.push(((i[1] / 100) * this.height) + this.y);*/
                ctx.lineTo(...p);
            }
            let fill = this.style.fill === undefined ? false : this.style.fill;
            ctx.lineTo(...fpp);
            if (fill) ctx.fill();
            ctx.stroke();
            ctx.closePath();
            let pp = [];
            for (let i = 0; i < this.style.points.length - 1; i++) {
                let p = [];
                p.push(((this.style.points[i][0] / 100) * this.width) + this.x);
                p.push(((this.style.points[i][1] / 100) * this.height) + this.y);
                for (let j of pp) {
                    if (j[0] == p[0] && j[1] == p[1]) continue;
                }
                pp.push(p);
                ctx.beginPath();
                ctx.fillStyle = 'hsl(' + (i * (255 / 4)) + ',100%, 50%)';
                ctx.arc(p[0] - 1, p[1] - 1, 2, 0, pi * 2);
                ctx.fill();
                ctx.closePath();
                ctx.font = '10px Arial';
                ctx.fillText((i + 1).toString(), p[0] - 5, p[1] - 5)
            }
        }
    }
    touch(GEl: GElement) {
        let X = false;
        let Y = false;
        let entXW = GEl.x + GEl.width;
        let entYH = GEl.y + GEl.height;
        let thisXW = this.x + this.width;
        let thisYH = this.y + this.height;
        if ((thisXW <= entXW && thisXW >= GEl.x) || (this.x <= entXW && this.x >= GEl.x)) X = true;
        if ((thisYH <= entYH && thisYH >= GEl.y) || (this.y <= entYH && this.y >= GEl.y)) Y = true;
        let res = false;
        if (Y && X) res = true;
        return res;
    }
}

class GPlayer extends GElement {
    OPoints: [number, number][];
    PPoints: { a: [number, number]; b: [number, number]; c: [number, number]; d: [number, number]; e: [number, number]; C: [number, number]; };
    len: { a: { a: number; b: number; c: number; d: number; e: number; C: number; }; b: { a: number; b: number; c: number; d: number; e: number; C: number; }; c: { a: number; b: number; c: number; d: number; e: number; C: number; }; d: { a: number; b: number; c: number; d: number; e: number; C: number; }; e: { a: number; b: number; c: number; d: number; e: number; C: number; }; C: { a: number; b: number; c: number; d: number; e: number; C: number; }; };
    OAngle: number;
    d: number;
    life: any;
    maxLife: any;
    constructor(color: string | rgb, x: number, y: number, life: number) {
        super(50, 60, x, y, {
            type: 'path',
            color: color,
            points: [
                [50, 0],
                [100, 100],
                [50, 70],
                [0, 100],
                [50, 0]
            ]
        });
        this.OPoints = [
            [50, 0],
            [100, 100],
            [50, 70],
            [0, 100],
            [50, 0]
        ];
        this.PPoints = {
            a: this.OPoints[0],
            b: this.OPoints[1],
            c: this.OPoints[2],
            d: this.OPoints[3],
            e: [50, 100],
            C: [50, 50]
        }
        this.len = {
            a: {
                a: len(...this.PPoints.a, ...this.PPoints.a),
                b: len(...this.PPoints.a, ...this.PPoints.b),
                c: len(...this.PPoints.a, ...this.PPoints.c),
                d: len(...this.PPoints.a, ...this.PPoints.d),
                e: len(...this.PPoints.a, ...this.PPoints.e),
                C: len(...this.PPoints.a, ...this.PPoints.C)
            },
            b: {
                a: len(...this.PPoints.b, ...this.PPoints.a),
                b: len(...this.PPoints.b, ...this.PPoints.b),
                c: len(...this.PPoints.b, ...this.PPoints.c),
                d: len(...this.PPoints.b, ...this.PPoints.d),
                e: len(...this.PPoints.b, ...this.PPoints.e),
                C: len(...this.PPoints.b, ...this.PPoints.C)
            },
            c: {
                a: len(...this.PPoints.c, ...this.PPoints.a),
                b: len(...this.PPoints.c, ...this.PPoints.b),
                c: len(...this.PPoints.c, ...this.PPoints.c),
                d: len(...this.PPoints.c, ...this.PPoints.d),
                e: len(...this.PPoints.c, ...this.PPoints.e),
                C: len(...this.PPoints.c, ...this.PPoints.C)
            },
            d: {
                a: len(...this.PPoints.d, ...this.PPoints.a),
                b: len(...this.PPoints.d, ...this.PPoints.b),
                c: len(...this.PPoints.d, ...this.PPoints.c),
                d: len(...this.PPoints.d, ...this.PPoints.d),
                e: len(...this.PPoints.d, ...this.PPoints.e),
                C: len(...this.PPoints.d, ...this.PPoints.C)
            },
            e: {
                a: len(...this.PPoints.e, ...this.PPoints.a),
                b: len(...this.PPoints.e, ...this.PPoints.b),
                c: len(...this.PPoints.e, ...this.PPoints.c),
                d: len(...this.PPoints.e, ...this.PPoints.d),
                e: len(...this.PPoints.e, ...this.PPoints.e),
                C: len(...this.PPoints.e, ...this.PPoints.C)
            },
            C: {
                a: len(...this.PPoints.C, ...this.PPoints.a),
                b: len(...this.PPoints.C, ...this.PPoints.b),
                c: len(...this.PPoints.C, ...this.PPoints.c),
                d: len(...this.PPoints.C, ...this.PPoints.d),
                e: len(...this.PPoints.C, ...this.PPoints.e),
                C: len(...this.PPoints.C, ...this.PPoints.C)
            }
        }
        this.OAngle = pi / 2;
        this.d = pi / 2;
        this.life = life;
        this.maxLife = life;
    }
    set angle(Angle: number) {
        const alpha = Angle/* - (pi*2)*(~~(Angle/(pi*2))-1)*/,
            Cx = 50,
            Cy = 50,
            TOP = (alpha >= 0 && alpha <= pi) || (alpha <= -pi && alpha >= -(pi * 2)),
            BOTTOM = (alpha <= 0 && alpha >= -pi) || (alpha >= pi && alpha <= pi * 2),
            LEFT = (alpha >= pi / 2 && alpha <= 3 * (pi / 4)) || (alpha <= -(pi / 2) && alpha >= -(3 * (pi / 4))),
            RIGHT = (alpha <= pi / 2 && alpha >= -(pi / 2)),
            delta1 = (alpha) + (acos(this.len.C.e / this.len.C.d)) * (LEFT ? 1 : -1),
            delta2 = (alpha + pi) + (acos(this.len.C.e / this.len.C.b)) * (RIGHT ? 1 : -1),
            ax = Cx + (cos(alpha) * this.len.a.C) * (LEFT ? -1 : 1),
            ay = Cy + (sin(alpha) * this.len.a.C) * (TOP ? 1 : -1),
            bx = Cx + (sin(delta2) * this.len.b.C) * (LEFT ? -1 : 1),
            by = Cy + (cos(delta2) * this.len.b.C) * (BOTTOM ? 1 : -1),
            cx = Cx + (cos(alpha + pi) * this.len.C.c) * (RIGHT ? 1 : -1),
            cy = Cy + (sin(alpha + pi) * this.len.C.c) * (TOP ? 1 : -1),
            dx = Cx + (sin(delta1) * this.len.d.C) * (RIGHT ? 1 : -1),
            dy = Cy + (cos(delta1) * this.len.d.C) * (BOTTOM ? 1 : -1);
        this.d = alpha;
        /*this.style.points = [
            [ax, ay],
            [bx, by],
            [cx, cy],
            [dx, dy],
            [ax, ay]
        ]*/
    }
    draw() {
        ctx.save()
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        ctx.rotate(this.d);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
        GElement.prototype.draw.call(this);
        ctx.restore();
        ctx.fillStyle = "white"
        ctx.fillText((this.d / Math.PI * 180).toString(), 20, 10)
    }
}

class GAsteroids extends GElement {
    constructor(x :number, y: number) {
        const size = Math.floor(Math.random() * (151 - 50) + 50)
        super(size, size, x, y, {
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
        })
    }
}

const bg = new GElement(cw, ch, 0, 0, {
    type: 'square',
    color: rgb.black
});
const a = new GAsteroids(200, 200);
console.log(bg.style.color);
(<rgb>(bg.style.color)).logColor();
const player = new GPlayer(rgb.white, cw / 2, ch / 2, 3);
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

const _$$c = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;

function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
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

function FToA(Fx: number, Fy: number) {
    let fr = atan(Fy / Fx);
    fr = Fx < 0 ? pi + fr : fr;
    return fr;
}

function AToF(A: number) {
    return [cos(A), sin(A)];
}

function len(ax: number, ay: number, bx: number, by: number) {
    return hypot(bx - ax, by - ay);
}

function setangle(e: MouseEvent) {
    const x = e.clientX * (cw / window.innerWidth);
    const y = e.clientY * (ch / window.innerHeight);
    const ad = x < player.x ? pi : 0;
    const angle = atan((player.y - y) / (player.x - x)) + ad;
    player.angle = angle + Math.PI / 2;
}
document.addEventListener('mousemove', setangle)
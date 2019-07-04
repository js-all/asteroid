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

let score = 0;
let subScore = 0;

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
                //ctx.arc(p[0] - 1, p[1] - 1, 2, 0, pi * 2);
                ctx.fill();
                ctx.closePath();
                ctx.font = '10px Arial';
                //ctx.fillText((i + 1).toString(), p[0] - 5, p[1] - 5)
            }
        }
    }
    touch(GEl: GElement) {
        return GElement.touch(this.x, this.y, this.width, this.height, GEl.x, GEl.y, GEl.width, GEl.height)
    }
    static touch(x: number, y: number, w: number, h: number, x2: number, y2: number, w2: number, h2: number) {
        let X = false;
        let Y = false;
        let entXW = x2 + w2;
        let entYH = y2 + h2;
        let thisXW = x + w;
        let thisYH = y + h;
        if ((thisXW <= entXW && thisXW >= x2) || (x <= entXW && x >= x2)) X = true;
        if ((thisYH <= entYH && thisYH >= y2) || (y <= entYH && y >= y2)) Y = true;
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
    }
}

class GAsteroids extends GElement {
    fX: number;
    fY: number;
    static Asteroids: GAsteroids[] = [];
    constructor(x: number, y: number, size: number = Math.floor(Math.random() * (151 - 50) + 50), fx: number = Math.random() * 12 - 6, fy: number = Math.random() * 12 - 6) {
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
        });
        this.fX = fx;
        this.fY = fy;
        GAsteroids.Asteroids.push(this);
        while (GAsteroids.Asteroids.length > 20) {
            GAsteroids.Asteroids.splice(GAsteroids.Asteroids.length - 1, 1)
        }

    }
    move() {
        this.x += this.fX;
        this.y += this.fY;
        if (!GElement.touch(this.x, this.y, this.width, this.height, 0, 0, canvas.width, canvas.height)) {
            this.x = this.x > canvas.width ? -this.width : this.x;
            this.x = this.x + this.width < 0 ? canvas.width : this.x;
            this.y = this.y > canvas.height ? -this.height : this.y;
            this.y = this.y + this.height < 0 ? canvas.height : this.y;
        }
    }
    kill() {
        GAsteroids.Asteroids.splice(GAsteroids.Asteroids.indexOf(this), 1);
    }
}

class GBullets extends GElement {
    angle: number
    onDeath: Function;
    constructor(x: number, y: number, angle: number, onDeath: Function = () => { }) {
        super(2, 10, x, y, { type: "square", color: "white" })
        this.angle = angle;
        this.onDeath = onDeath;
    }
    draw() {
        ctx.save()
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        ctx.rotate(this.angle);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
        GElement.prototype.draw.call(this);
        ctx.restore();
        ctx.fillStyle = "white"
    }
    move() {
        const speed = 10;
        const fx = cos(this.angle - pi / 2) * speed;
        const fy = sin(this.angle - pi / 2) * speed;
        this.x += fx;
        this.y += fy;
        for (let i of GAsteroids.Asteroids) {
            if (this.touch(i)) {
                this.kill();
                if (i.width / 2 > 50) {
                    const fx: number = Math.random() * 12 - 6;
                    const fy: number = Math.random() * 12 - 6;
                    new GAsteroids(i.x, i.y, i.width / 2, fx, fy);
                    new GAsteroids(i.x, i.y, i.width / 2, -fx, -fy);
                }
                i.kill();
                score += 100
            }
        }
    }
    kill() {
        this.onDeath(this);
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
const playerBullets: GBullets[] = [];
bg.draw();
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    bg.draw();
    player.draw();
    for (let i of GAsteroids.Asteroids) {
        i.draw();
    }
    for (let i of playerBullets) {
        i.draw();
    }
    ctx.fillStyle = 'white';
    ctx.font = '25px Arial'
    ctx.fillText(score.toString(), 25, 40);
}

function play() {
    if (subScore >= 30) {
        score += 10;
        subScore = 0;
    } else {
        subScore++;
    }
    a.move();
    for (let i of GAsteroids.Asteroids) {
        i.move();
    }
    for (let i of GAsteroids.Asteroids) {
        if (player.touch(i)) {
            clearInterval(play.interval)
            clearInterval(draw.interval)
            ctx.fillStyle = new rgb(0, 0, 0, 0.5).value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.save();
            ctx.font = '100px Arial'
            ctx.fillText('you lose', canvas.width / 2 - 170, canvas.height / 2 - 50);
            ctx.restore();
        }
    }
    for (let i of playerBullets) {
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
document.addEventListener('mousedown', e => {
    playerBullets.push(new GBullets((player.x + player.width / 2) + cos(player.d - pi / 2) * player.height / 2, (player.y + player.height / 2) + sin(player.d - pi / 2) * player.height / 2, player.d, (e: GBullets) => {
        playerBullets.splice(playerBullets.indexOf(e), 1)
    }));
});

let timeAS = 5000;

function newAsteroids() {
    let x = Math.floor(Math.random() * canvas.width + 1);
    let y = Math.floor(Math.random() * canvas.height + 1);
    if (Math.floor(Math.random() * 2) === 0) {
        if (Math.floor(Math.random() * 2) === 0) {
            x = 0;
        } else {
            x = canvas.width
        }
    } else {
        if (Math.floor(Math.random() * 2) === 0) {
            y = 0
        } else {
            y = canvas.height
        }
    }
    new GAsteroids(x, y);
    setTimeout(newAsteroids, Math.random() * timeAS);
    timeAS -= 100;
    timeAS = timeAS < 2000 ? 2000 : timeAS;
}

newAsteroids();
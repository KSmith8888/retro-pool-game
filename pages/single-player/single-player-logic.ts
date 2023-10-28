import Ball from "../../src/ball";
import Table from "../../src/table";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    table: Table;
    balls: Array<Ball>;
    lastTime: number;
    interval: number;
    timer: number;
    playerTurn: boolean;
    hit: void;
    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.ctx.fillStyle = "white";
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.table = new Table(this.ctx);
        this.balls = [];
        this.initializeBalls();
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0;
        this.playerTurn = true;
        this.hit = this.canvas.addEventListener("mousemove", (e) => {
            if (this.playerTurn) {
                this.cueCollision(e.clientX, e.clientY);
            }
        });
    }
    initializeBalls() {
        this.balls.push(new Ball(this, this.ctx, this.table));
        this.balls.push(new Ball(this, this.ctx, this.table));
    }
    updateBalls() {
        this.balls.forEach((ball) => {
            ball.updatePosition();
            ball.render();
        });
    }
    cueCollision(x: number, y: number) {
        this.balls.forEach((ball) => {
            if (
                x >= ball.x &&
                x < ball.x + ball.width &&
                y >= ball.y &&
                y < ball.y + ball.height
            ) {
                ball.isMoving = true;
                this.playerTurn = false;
            }
        });
    }
    animate(timeStamp: number) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.table.render();
            this.updateBalls();
            this.timer -= deltaTime;
        } else {
            this.timer += deltaTime;
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

const spGame = new Game();
spGame.animate(0);

import Ball from "../../src/ball";
import CueBall from "../../src/cue-ball";
import Table from "../../src/table";
import CueStick from "../../src/cue-stick";
import { areObjectsColliding } from "../../src/utils/collision";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    table: Table;
    cueBall: CueBall;
    balls: Array<Ball | CueBall>;
    cueStick: CueStick;
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
        this.cueBall = new CueBall(this, this.ctx, this.table, "Cue", 200, 200);
        this.balls = [];
        this.initializeBalls();
        this.cueStick = new CueStick(this, this.ctx);
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0;
        this.playerTurn = true;
        this.hit = this.canvas.addEventListener("mousemove", (e) => {
            if (this.playerTurn) {
                this.cueStick.circleX = e.clientX - 5;
                this.cueStick.circleY = e.clientY - 5;
                this.cueCollision();
            }
        });
    }
    initializeBalls() {
        const startingX = this.table.x + 300;
        const startingY = this.table.y + 200;
        const step = 30;
        const ballData = [
            { id: "1", x: startingX, y: startingY - step * 2 },
            { id: "2", x: startingX + step, y: startingY - step * 3 + 10 },
            { id: "3", x: startingX + step, y: startingY - step - 10 },
            { id: "4", x: startingX + step * 2, y: startingY - step * 4 + 20 },
            { id: "5", x: startingX + step * 2, y: startingY - step * 2 },
            { id: "6", x: startingX + step * 2, y: startingY - 20 },
            { id: "7", x: startingX + step * 3, y: startingY - step * 4 },
            { id: "9", x: startingX + step * 3, y: startingY - step * 2 },
            { id: "10", x: startingX + step * 3, y: startingY - step },
            { id: "11", x: startingX + step * 4, y: startingY - step * 4 },
            { id: "12", x: startingX + step * 4, y: startingY - step * 3 },
            { id: "13", x: startingX + step * 4, y: startingY - step * 2 },
            { id: "14", x: startingX + step * 4, y: startingY - step },
            { id: "15", x: startingX + step * 4, y: startingY },
        ];
        for (let i = 0; i < ballData.length; i++) {
            this.balls.push(
                new Ball(
                    this,
                    this.ctx,
                    this.table,
                    ballData[i].id,
                    ballData[i].x,
                    ballData[i].y
                )
            );
        }
        this.balls.push(this.cueBall);
    }
    updateBalls() {
        this.balls.forEach((ball) => {
            ball.updatePosition();
            ball.render();
        });
    }
    cueCollision() {
        const collisionData = areObjectsColliding(this.cueStick, this.cueBall);
        if (collisionData) {
            const newSpeedX = Math.floor(collisionData.angleX * 15);
            const newSpeedY = Math.floor(collisionData.angleY * 15);
            this.cueBall.speedX = newSpeedX;
            this.cueBall.speedY = newSpeedY;
            this.cueBall.isMoving = true;
            //this.playerTurn = false;
        }
    }
    animate(timeStamp: number) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.table.render();
            this.updateBalls();
            this.cueStick.render();
            this.timer -= deltaTime;
        } else {
            this.timer += deltaTime;
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

const spGame = new Game();
spGame.animate(0);

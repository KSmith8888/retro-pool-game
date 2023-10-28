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
    balls: Array<Ball>;
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
        this.cueBall = new CueBall(this, this.ctx, this.table, "Cue");
        this.balls = [];
        this.initializeBalls();
        this.cueStick = new CueStick(this, this.ctx);
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0;
        this.playerTurn = true;
        this.hit = this.canvas.addEventListener("mousemove", (e) => {
            if (this.playerTurn) {
                this.cueStick.circleX = e.clientX;
                this.cueStick.circleY = e.clientY;
                this.cueCollision();
            }
        });
    }
    initializeBalls() {
        const idArray = [
            "1",
            "2",
            "3",
            "4,",
            "5",
            "6",
            "7",
            "9",
            "10",
            "11",
            "12",
            "13",
            "15",
        ];
        for (let i = 0; i < idArray.length; i++) {
            this.balls.push(new Ball(this, this.ctx, this.table, idArray[i]));
        }
    }
    updateBalls() {
        this.cueBall.updatePosition();
        this.cueBall.render();
        this.balls.forEach((ball) => {
            ball.updatePosition();
            ball.render();
        });
    }
    cueCollision() {
        if (areObjectsColliding(this.cueStick, this.cueBall)) {
            this.cueBall.isMoving = true;
            this.cueBall.speedX = 15;
            this.cueBall.speedY = 15;
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

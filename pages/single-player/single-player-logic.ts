import Ball from "../../src/ball";
import CueBall from "../../src/cue-ball";
import Table from "../../src/table";
import CueStick from "../../src/cue-stick";
import Pocket from "../../src/pocket";
import { areObjectsColliding } from "../../src/utils/collision";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    table: Table;
    cueBall: CueBall;
    balls: Array<Ball | CueBall>;
    cueStick: CueStick;
    pockets: Array<Pocket>;
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
        this.pockets = [];
        this.initializePockets();
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
        const startingX = this.table.x + 175;
        const startingY = this.table.y + 125;
        const step = 20;
        const ballData = [
            { id: "1", x: startingX, y: startingY - step * 2 },
            { id: "2", x: startingX + step, y: startingY - step * 3 + 6 },
            { id: "3", x: startingX + step, y: startingY - step - 9 },
            { id: "4", x: startingX + step * 2, y: startingY - step * 4 + 12 },
            { id: "5", x: startingX + step * 2, y: startingY - step * 2 },
            { id: "6", x: startingX + step * 2, y: startingY - 12 },
            { id: "7", x: startingX + step * 3, y: startingY - step * 4 },
            { id: "9", x: startingX + step * 3, y: startingY - step * 2 + 12 },
            { id: "10", x: startingX + step * 3, y: startingY - step + 18 },
            { id: "11", x: startingX + step * 4, y: startingY - step * 4 - 12 },
            { id: "12", x: startingX + step * 4, y: startingY - step * 3 - 6 },
            { id: "13", x: startingX + step * 4, y: startingY - step * 2 },
            { id: "14", x: startingX + step * 4, y: startingY - step + 6 },
            { id: "15", x: startingX + step * 4, y: startingY + 12 },
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
        const activeBalls = this.balls.filter((ball) => ball.isActive);
        activeBalls.forEach((ball) => {
            ball.updatePosition();
            ball.render();
        });
    }
    cueCollision() {
        const collisionData = areObjectsColliding(this.cueStick, this.cueBall);
        if (collisionData) {
            const newSpeedX = Math.floor(collisionData.angleX * 15);
            const newSpeedY = Math.floor(collisionData.angleY * 15);
            this.cueStick.velocity = 15;
            this.cueBall.speedX = newSpeedX;
            this.cueBall.speedY = newSpeedY;
            this.cueBall.isMoving = true;
            //console.log(this.cueStick.velocity, this.cueBall.velocity);
            //this.playerTurn = false;
        }
    }
    initializePockets() {
        const cornerAdj = 14;
        const sideAdj = 5;
        this.pockets.push(
            new Pocket(this, this.table.x + cornerAdj, this.table.y + cornerAdj)
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + (this.table.width - cornerAdj),
                this.table.y + cornerAdj
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + cornerAdj,
                this.table.y + (this.table.height - cornerAdj)
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width - cornerAdj,
                this.table.y + this.table.height - cornerAdj
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width / 2,
                this.table.y + sideAdj
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width / 2,
                this.table.y + (this.table.height - sideAdj)
            )
        );
    }
    pocketCollision() {
        this.pockets.forEach((pocket) => {
            pocket.checkCollision();
            pocket.render();
        });
    }
    animate(timeStamp: number) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.table.render();
            this.updateBalls();
            this.pocketCollision();
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

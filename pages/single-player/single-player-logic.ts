import Ball from "../../src/ball";
import CueBall from "../../src/cue-ball";
import Table from "../../src/table";
import CueStick from "../../src/cue-stick";
import Pocket from "../../src/pocket";
import { areObjectsColliding } from "../../src/utils/collision";
import Player from "../../src/player";
import { EasyComputer } from "../../src/computer-players";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    table: Table;
    cueBall: CueBall;
    balls: Array<Ball | CueBall>;
    cueStick: CueStick;
    pockets: Array<Pocket>;
    lastTime: number;
    interval: number;
    timer: number;
    playerTurn: boolean;
    readyToHit: boolean;
    hit: void;
    opponent: EasyComputer;
    awaitNextTurn: boolean;
    playerScore: number;
    opponentScore: number;
    scratch: boolean;
    test: void;
    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.ctx.fillStyle = "white";
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.player = new Player(this);
        this.table = new Table(this.ctx);
        this.cueBall = new CueBall(
            this,
            this.ctx,
            this.table,
            "Cue",
            this.table.x + 155,
            this.table.y + this.table.height / 2
        );
        this.balls = [];
        this.initializeBalls();
        this.cueStick = new CueStick(this, this.ctx);
        this.pockets = [];
        this.initializePockets();
        this.lastTime = 0;
        this.interval = 1000 / 60;
        this.timer = 0;
        this.playerTurn = true;
        this.readyToHit = false;
        this.hit = this.canvas.addEventListener("mousemove", (e) => {
            if (this.playerTurn && !this.awaitNextTurn && this.readyToHit) {
                this.player.turn(e.clientX, e.clientY);
            }
        });
        this.opponent = new EasyComputer(this);
        this.awaitNextTurn = false;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.scratch = false;
        this.test = this.canvas.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                console.log(this.playerTurn, this.awaitNextTurn);
            } else if (e.button === 0 && this.playerTurn) {
                this.readyToHit = true;
            }
        });
    }
    initializeBalls() {
        const startingX = this.table.x + 500;
        const startingY = this.table.y + 250;
        const step = 27;
        const ballData = [
            {
                id: "1",
                type: "Solid",
                color: "red",
                x: startingX,
                y: startingY - step * 2,
            },
            {
                id: "2",
                type: "Solid",
                color: "red",
                x: startingX + step,
                y: startingY - step * 3 + 9,
            },
            {
                id: "3",
                type: "Solid",
                color: "red",
                x: startingX + step,
                y: startingY - step - 9,
            },
            {
                id: "4",
                type: "Solid",
                color: "red",
                x: startingX + step * 2,
                y: startingY - step * 4 + 18,
            },
            {
                id: "5",
                type: "Solid",
                color: "red",
                x: startingX + step * 2,
                y: startingY - step * 2,
            },
            {
                id: "6",
                type: "Solid",
                color: "red",
                x: startingX + step * 2,
                y: startingY - 18,
            },
            {
                id: "7",
                type: "Solid",
                color: "red",
                x: startingX + step * 3,
                y: startingY - step * 4,
            },
            {
                id: "9",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 3,
                y: startingY - step * 2 + 18,
            },
            {
                id: "10",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 3,
                y: startingY - step + 27,
            },
            {
                id: "11",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 4,
                y: startingY - step * 4 - 18,
            },
            {
                id: "12",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 4,
                y: startingY - step * 3 - 9,
            },
            {
                id: "13",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 4,
                y: startingY - step * 2,
            },
            {
                id: "14",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 4,
                y: startingY - step + 9,
            },
            {
                id: "15",
                type: "Stripe",
                color: "yellow",
                x: startingX + step * 4,
                y: startingY + 18,
            },
        ];
        for (let i = 0; i < ballData.length; i++) {
            this.balls.push(
                new Ball(
                    this,
                    this.ctx,
                    this.table,
                    ballData[i].id,
                    ballData[i].type,
                    ballData[i].color,
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
            const newSpeedX = Math.floor(
                collisionData.angleX * this.cueStick.power
            );
            const newSpeedY = Math.floor(
                collisionData.angleY * this.cueStick.power
            );
            this.cueBall.speedX = newSpeedX;
            this.cueBall.speedY = newSpeedY;
            this.cueBall.isMoving = true;
            this.cueStick.circleX = this.table.x;
            this.cueStick.circleY = this.table.y - this.cueStick.height;
            this.awaitNextTurn = true;
            this.readyToHit = false;
        }
    }
    updateScores() {
        if (this.playerTurn) {
            if (this.scratch) {
                this.playerTurn = false;
                this.scratch = false;
                this.cueBall.circleX = this.table.x + 155;
                this.cueBall.circleY = this.table.y + this.table.height / 2;
                this.cueBall.isActive = true;
                this.opponent.turn();
            } else if (this.playerScore !== this.player.pocketed.length) {
                this.playerScore = this.player.pocketed.length;
            } else if (this.opponentScore !== this.opponent.pocketed.length) {
                this.opponentScore = this.opponent.pocketed.length;
                this.playerTurn = false;
                this.opponent.turn();
            } else {
                this.playerTurn = false;
                this.opponent.turn();
            }
        } else {
            if (this.scratch) {
                this.cueBall.circleX = this.table.x + 155;
                this.cueBall.circleY = this.table.y + this.table.height / 2;
                this.cueBall.isActive = true;
                this.playerTurn = true;
                this.scratch = false;
            } else if (this.opponentScore !== this.opponent.pocketed.length) {
                this.opponentScore = this.opponent.pocketed.length;
                this.opponent.turn();
            } else if (this.playerScore !== this.player.pocketed.length) {
                this.playerScore = this.player.pocketed.length;
                this.playerTurn = true;
            } else {
                this.playerTurn = true;
            }
        }
        if (this.player.pocketed.length === 7) {
            this.player.canTargetEightBall = true;
        } else if (this.opponent.pocketed.length === 7) {
            this.opponent.canTargetEightBall = true;
        }
    }
    nextTurn() {
        if (this.awaitNextTurn) {
            let movementHasEnded = true;
            const activeBalls = this.balls.filter((ball) => ball.isActive);
            activeBalls.forEach((ball) => {
                if (ball.speedX !== 0 || ball.speedY !== 0) {
                    movementHasEnded = false;
                }
            });
            if (movementHasEnded) {
                this.awaitNextTurn = false;
                this.updateScores();
            }
        }
    }
    initializePockets() {
        const cornerAdj = 44;
        const sideAdj = 28;
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + cornerAdj,
                this.table.y + cornerAdj,
                1
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + (this.table.width - cornerAdj),
                this.table.y + cornerAdj,
                2
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + cornerAdj,
                this.table.y + (this.table.height - cornerAdj),
                3
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width - cornerAdj,
                this.table.y + this.table.height - cornerAdj,
                4
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width / 2,
                this.table.y + sideAdj,
                5
            )
        );
        this.pockets.push(
            new Pocket(
                this,
                this.table.x + this.table.width / 2 + 2,
                this.table.y + (this.table.height - sideAdj),
                6
            )
        );
    }
    pocketCollision() {
        this.pockets.forEach((pocket) => {
            pocket.checkCollision();
            //pocket.render();
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
            this.nextTurn();
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

import Game from "../pages/single-player/single-player-logic";
import Table from "./table";
import { areObjectsColliding } from "./utils/collision";

export default class Ball {
    game: Game;
    ctx: CanvasRenderingContext2D;
    table: Table;
    id: string;
    arcNum: number;
    x: number;
    y: number;
    width: number;
    height: number;
    circleX: number;
    circleY: number;
    radius: number;
    speedX: number;
    speedY: number;
    isMoving: boolean;
    velocityAdj: number;
    constructor(
        game: Game,
        ctx: CanvasRenderingContext2D,
        table: Table,
        id: string
    ) {
        this.game = game;
        this.ctx = ctx;
        this.table = table;
        this.id = id;
        this.x = this.table.x + Math.floor(Math.random() * 300);
        this.y = this.table.y + Math.floor(Math.random() * 250);
        this.width = 30;
        this.height = 30;
        this.radius = 15;
        this.circleX = this.x + this.radius;
        this.circleY = this.y + this.radius;
        this.speedX = 0;
        this.speedY = 0;
        this.arcNum = 2 * Math.PI;
        this.isMoving = false;
        this.velocityAdj = 0.1;
    }
    tableCollision() {
        if (this.circleX + this.radius >= this.table.rightEdge) {
            if (this.speedX > 0) {
                this.speedX = -this.speedX;
            }
            this.velocityAdj = this.velocityAdj + 0.01;
        } else if (this.circleX - this.radius <= this.table.x) {
            if (this.speedX < 0) {
                this.speedX = -this.speedX;
            }
            this.velocityAdj = this.velocityAdj + 0.01;
        } else if (this.circleY + this.radius >= this.table.bottomEdge) {
            if (this.speedY > 0) {
                this.speedY = -this.speedY;
            }
            this.velocityAdj = this.velocityAdj + 0.01;
        } else if (this.circleY - this.radius <= this.table.y) {
            if (this.speedY < 0) {
                this.speedY = -this.speedY;
            }
            this.velocityAdj = this.velocityAdj + 0.01;
        }
    }
    ballCollision() {
        const otherBalls = this.game.balls.filter(
            (other) => this.id !== other.id
        );
        otherBalls.forEach((ball) => {
            if (areObjectsColliding(this, ball)) {
                if (!ball.isMoving) {
                    ball.isMoving = true;
                    ball.speedX = this.speedX * 0.8;
                    ball.speedY = this.speedY * 0.8;
                }
            }
        });
    }
    updateVelocity() {
        if (this.speedX >= this.velocityAdj) {
            this.speedX -= this.velocityAdj;
        } else if (this.speedX <= -this.velocityAdj) {
            this.speedX += this.velocityAdj;
        } else {
            this.speedX = 0;
        }
        if (this.speedY >= this.velocityAdj) {
            this.speedY -= this.velocityAdj;
        } else if (this.speedY <= -this.velocityAdj) {
            this.speedY += this.velocityAdj;
        } else {
            this.speedY = 0;
        }
        if (this.speedX === 0 && this.speedY === 0) {
            this.isMoving = false;
            this.velocityAdj = 0.1;
        }
    }
    updatePosition() {
        if (this.isMoving) {
            this.ballCollision();
            this.tableCollision();
            this.updateVelocity();
            this.circleX += this.speedX;
            this.circleY += this.speedY;
        }
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.circleX, this.circleY, this.radius, 0, this.arcNum);
        this.ctx.fill();
    }
}

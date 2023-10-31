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
    velocity: number;
    drag: number;
    isActive: boolean;
    constructor(
        game: Game,
        ctx: CanvasRenderingContext2D,
        table: Table,
        id: string,
        x: number,
        y: number
    ) {
        this.game = game;
        this.ctx = ctx;
        this.table = table;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.radius = 15;
        this.circleX = this.x + this.radius;
        this.circleY = this.y + this.radius;
        this.speedX = 0;
        this.speedY = 0;
        this.arcNum = 2 * Math.PI;
        this.isMoving = false;
        this.velocity = 10;
        this.drag = 0.1;
        this.isActive = true;
    }
    tableCollision() {
        if (this.circleX + this.radius >= this.table.rightEdge) {
            if (this.speedX > 0) {
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleX - this.radius <= this.table.x) {
            if (this.speedX < 0) {
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY + this.radius >= this.table.bottomEdge) {
            if (this.speedY > 0) {
                this.speedY = this.speedY * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY - this.radius <= this.table.y) {
            if (this.speedY < 0) {
                this.speedY = this.speedY * -0.8;
            }
            this.drag = this.drag + 0.01;
        }
    }
    ballCollision() {
        const otherBalls = this.game.balls.filter(
            (other) => this.id !== other.id
        );
        otherBalls.forEach((ball) => {
            const collisionData = areObjectsColliding(this, ball);
            if (collisionData) {
                const newSpeedX = Math.floor(collisionData.angleX * 8);
                const newSpeedY = Math.floor(collisionData.angleY * 8);
                if (!ball.isMoving) {
                    //This ball was moving, other was still before collision
                    ball.isMoving = true;
                    ball.speedX = newSpeedX;
                    ball.speedY = newSpeedY;
                    this.drag = this.drag + 0.2;
                } else if (!this.isMoving) {
                    //Other ball was moving, this ball was still before collision
                    this.isMoving = true;
                    this.speedX = newSpeedX;
                    this.speedY = newSpeedY;
                    ball.drag = ball.drag + 0.2;
                } else {
                    //Both were already moving before collision
                }
            }
        });
    }
    updateVelocity() {
        if (this.velocity > 0.01) {
            this.velocity -= 0.01;
        } else {
            this.velocity = 0;
        }
        if (this.speedX >= this.drag) {
            this.speedX -= this.drag;
        } else if (this.speedX <= -this.drag) {
            this.speedX += this.drag;
        } else {
            this.speedX = 0;
        }
        if (this.speedY >= this.drag) {
            this.speedY -= this.drag;
        } else if (this.speedY <= -this.drag) {
            this.speedY += this.drag;
        } else {
            this.speedY = 0;
        }
        if (this.speedX === 0 && this.speedY === 0) {
            this.isMoving = false;
            this.drag = 0.1;
            this.velocity = 10;
        }
    }
    updatePosition() {
        if (this.isMoving) {
            this.tableCollision();
            this.ballCollision();
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

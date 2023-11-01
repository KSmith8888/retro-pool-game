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
            //this.circleX = this.table.rightEdge - this.radius;
            if (this.speedX > 0) {
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleX - this.radius <= this.table.x) {
            //this.circleX = this.table.x + this.radius;
            if (this.speedX < 0) {
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY + this.radius >= this.table.bottomEdge) {
            //this.circleY = this.table.bottomEdge - this.radius;
            if (this.speedY > 0) {
                this.speedY = this.speedY * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY - this.radius <= this.table.y) {
            //this.circleY = this.table.y + this.radius;
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
                const newSpeedX = Math.floor(collisionData.angleX);
                const newSpeedY = Math.floor(collisionData.angleY);
                if (!ball.isMoving) {
                    //This ball was moving, other was still before collision
                    ball.isMoving = true;
                    ball.speedX = this.speedX;
                    ball.speedY = this.speedY;
                    this.speedX = this.speedX * -0.2;
                    this.speedY = this.speedY * -0.2;
                    this.velocity -= 1;
                } else if (!this.isMoving) {
                    //Other ball was moving, this ball was still before collision
                    this.isMoving = true;
                    this.speedX = ball.speedX;
                    this.speedY = ball.speedY;
                    ball.speedX = ball.speedX * -0.2;
                    ball.speedY = ball.speedY * -0.2;
                    ball.velocity -= 1;
                } else {
                    //Both were already moving before collision
                    this.speedX = -newSpeedX * this.velocity;
                    this.speedY = -newSpeedY * this.velocity;
                    this.velocity -= 1;
                    ball.speedX = -newSpeedX * ball.velocity;
                    ball.speedY = -newSpeedY * ball.velocity;
                    ball.velocity -= 1;
                }
            }
        });
    }
    updateVelocity() {
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
        this.tableCollision();
        this.ballCollision();
        if (this.isMoving) {
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

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
    initVelocity: number;
    drag: number;
    initDrag: number;
    isActive: boolean;
    hasCollided: boolean;
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
        this.width = 16;
        this.height = 16;
        this.radius = 8;
        this.circleX = this.x + this.radius;
        this.circleY = this.y + this.radius;
        this.speedX = 0;
        this.speedY = 0;
        this.arcNum = 2 * Math.PI;
        this.isMoving = false;
        this.velocity = 1;
        this.initVelocity = 1;
        this.drag = 0.1;
        this.initDrag = 0.1;
        this.isActive = true;
        this.hasCollided = false;
    }
    tableCollision() {
        if (this.circleX + this.radius >= this.table.rightEdge) {
            if (this.speedX > 0) {
                this.circleX -= 1;
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleX - this.radius <= this.table.leftEdge) {
            if (this.speedX < 0) {
                this.circleX += 1;
                this.speedX = this.speedX * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY + this.radius >= this.table.bottomEdge) {
            if (this.speedY > 0) {
                this.circleY += 1;
                this.speedY = this.speedY * -0.8;
            }
            this.drag = this.drag + 0.01;
        } else if (this.circleY - this.radius <= this.table.topEdge) {
            if (this.speedY < 0) {
                this.circleY -= 1;
                this.speedY = this.speedY * -0.8;
            }
            this.drag = this.drag + 0.01;
        }
    }
    ballCollision() {
        const otherBalls = this.game.balls.filter(
            (other) => this.id !== other.id && other.isActive
        );
        otherBalls.forEach((ball) => {
            const collisionData = areObjectsColliding(ball, this);
            if (collisionData) {
                const newSpeedX = Math.floor(collisionData.angleX * 10);
                const newSpeedY = Math.floor(collisionData.angleY * 10);
                this.isMoving = true;
                ball.isMoving = true;
                if (this.velocity > ball.velocity) {
                    if (this.velocity >= 0.2) {
                        this.velocity -= 0.2;
                    } else {
                        this.velocity = 0;
                    }
                } else if (ball.velocity > this.velocity) {
                    if (ball.velocity >= 0.2) {
                        ball.velocity -= 0.2;
                    } else {
                        ball.velocity = 0;
                    }
                } else {
                    if (this.velocity >= 0.2) {
                        this.velocity -= 0.2;
                    } else {
                        this.velocity = 0;
                    }
                    if (ball.velocity >= 0.2) {
                        ball.velocity -= 0.2;
                    } else {
                        ball.velocity = 0;
                    }
                }
                if (collisionData.dx > 0) {
                    this.circleX += 1;
                    this.speedX = newSpeedX * ball.velocity;
                    ball.circleX -= 1;
                    ball.speedX = -newSpeedX * this.velocity;
                } else {
                    this.circleX -= 1;
                    this.speedX = newSpeedX * ball.velocity;
                    ball.circleX += 1;
                    ball.speedX = -newSpeedX * this.velocity;
                }
                if (collisionData.dy > 0) {
                    this.circleY += 1;
                    this.speedY = newSpeedY * ball.velocity;
                    ball.circleY -= 1;
                    ball.speedY = -newSpeedY * this.velocity;
                } else {
                    this.circleY -= 1;
                    this.speedY = newSpeedY * ball.velocity;
                    ball.circleY += 1;
                    ball.speedY = -newSpeedY * this.velocity;
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
    }
    reset() {
        this.isMoving = false;
        this.drag = this.initDrag;
        this.velocity = this.initVelocity;
    }
    updatePosition() {
        if (this.isMoving) {
            this.updateVelocity();
            this.circleX += this.speedX * this.velocity;
            this.circleY += this.speedY * this.velocity;
        }
        this.tableCollision();
        this.ballCollision();
        if (this.speedX === 0 && this.speedY === 0) {
            this.reset();
        }
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.circleX, this.circleY, this.radius, 0, this.arcNum);
        this.ctx.fill();
    }
}

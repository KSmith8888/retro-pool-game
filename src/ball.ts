import Game from "../pages/single-player/single-player-logic";
import Table from "./table";

export default class Ball {
    game: Game;
    ctx: CanvasRenderingContext2D;
    table: Table;
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
    constructor(game: Game, ctx: CanvasRenderingContext2D, table: Table) {
        this.game = game;
        this.ctx = ctx;
        this.table = table;
        this.x = this.table.x + Math.floor(Math.random() * 300);
        this.y = this.table.y + Math.floor(Math.random() * 250);
        this.width = 40;
        this.height = 40;
        this.radius = 20;
        this.circleX = this.x + this.radius;
        this.circleY = this.y + this.radius;
        this.speedX = 12;
        this.speedY = 12;
        this.arcNum = 2 * Math.PI;
        this.isMoving = false;
        this.velocityAdj = 0.1;
    }
    tableCollision() {
        if (
            this.x + this.width >= this.table.x + this.table.width ||
            this.x <= this.table.x
        ) {
            this.speedX = -this.speedX;
            this.velocityAdj = this.velocityAdj * 2;
        } else if (
            this.y + this.height >= this.table.y + this.table.height ||
            this.y <= this.table.y
        ) {
            this.speedY = -this.speedY;
            this.velocityAdj = this.velocityAdj + 0.01;
        }
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
        }
    }
    updatePosition() {
        if (this.isMoving) {
            this.tableCollision();
            this.updateVelocity();
            this.x += this.speedX;
            this.y += this.speedY;
            this.circleX += this.speedX;
            this.circleY += this.speedY;
        }
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.circleX, this.circleY, this.radius, 0, this.arcNum);
        this.ctx.fill();
        this.ctx.strokeRect(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}

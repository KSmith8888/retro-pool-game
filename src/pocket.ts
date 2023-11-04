import Game from "../pages/single-player/single-player-logic";
import { areObjectsColliding } from "./utils/collision";

export default class Pocket {
    game: Game;
    ctx: CanvasRenderingContext2D;
    arcNum: number;
    circleX: number;
    circleY: number;
    radius: number;
    speedX: number;
    speedY: number;
    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.arcNum = Math.PI * 2;
        this.circleX = x;
        this.circleY = y;
        this.radius = 20;
        this.speedX = 0;
        this.speedY = 0;
    }
    checkCollision() {
        this.game.balls.forEach((ball) => {
            if (areObjectsColliding(this, ball)) {
                ball.isActive = false;
            }
        });
    }
    render() {
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(this.circleX, this.circleY, this.radius, 0, this.arcNum);
        this.ctx.fill();
    }
}

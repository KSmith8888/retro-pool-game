import Game from "../pages/single-player/single-player-logic";
import { areObjectsColliding } from "./utils/collision";

export default class Pocket {
    game: Game;
    ctx: CanvasRenderingContext2D;
    arcNum: number;
    circleX: number;
    circleY: number;
    id: number;
    radius: number;
    speedX: number;
    speedY: number;
    constructor(game: Game, x: number, y: number, id: number) {
        this.game = game;
        this.ctx = this.game.ctx;
        this.arcNum = Math.PI * 2;
        this.circleX = x;
        this.circleY = y;
        this.id = id;
        this.radius = 20;
        this.speedX = 0;
        this.speedY = 0;
    }
    score(type: string, id: string) {
        if (this.game.playerTurn) {
            if (!this.game.player.target) {
                this.game.player.target = type;
                if (type === "Solid") {
                    this.game.opponent.target = "Stripe";
                } else {
                    this.game.opponent.target = "Solid";
                }
            }
            if (type === this.game.player.target) {
                if (!this.game.player.pocketed.includes(id)) {
                    this.game.player.pocketed.push(id);
                }
            } else {
                if (!this.game.opponent.pocketed.includes(id)) {
                    this.game.opponent.pocketed.push(id);
                }
            }
        } else {
            if (!this.game.opponent.target) {
                this.game.opponent.target = type;
                if (type === "Solid") {
                    this.game.player.target = "Stripe";
                } else {
                    this.game.player.target = "Solid";
                }
            }
            if (type === this.game.opponent.target) {
                if (!this.game.opponent.pocketed.includes(id)) {
                    this.game.opponent.pocketed.push(id);
                }
            } else {
                if (!this.game.player.pocketed.includes(id)) {
                    this.game.player.pocketed.push(id);
                }
            }
        }
    }
    checkCollision() {
        this.game.balls.forEach((ball) => {
            if (areObjectsColliding(this, ball)) {
                ball.isActive = false;
                this.score(ball.type, ball.id);
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

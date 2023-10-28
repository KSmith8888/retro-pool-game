import Game from "../pages/single-player/single-player-logic";

export default class CueStick {
    game: Game;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    circleX: number;
    circleY: number;
    radius: number;
    constructor(game: Game, ctx: CanvasRenderingContext2D) {
        this.game = game;
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = 5;
        this.height = 5;
        this.circleX = 0;
        this.circleY = 0;
        this.radius = 5;
    }
    render() {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.circleX, this.circleY, this.width, this.height);
        this.ctx.restore();
    }
}

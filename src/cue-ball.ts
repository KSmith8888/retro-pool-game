import Game from "../pages/single-player/single-player-logic";
import Table from "./table";
import Ball from "./ball";

export default class CueBall extends Ball {
    constructor(
        game: Game,
        ctx: CanvasRenderingContext2D,
        table: Table,
        id: string,
        x: number,
        y: number
    ) {
        super(game, ctx, table, id, x, y);
    }
    render() {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(this.circleX, this.circleY, this.radius, 0, this.arcNum);
        this.ctx.fill();
        this.ctx.restore();
    }
}

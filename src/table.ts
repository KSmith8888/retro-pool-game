export default class Table {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.x = 100;
        this.y = 100;
        this.width = 500;
        this.height = 300;
    }
    render() {
        this.ctx.save();
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();
    }
}

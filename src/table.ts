import tableImageUrl from "../assets/images/pool-table-v1.png";

export default class Table {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    collisionAdj: number;
    leftEdge: number;
    topEdge: number;
    rightEdge: number;
    bottomEdge: number;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.x = 100;
        this.y = 100;
        this.width = 400;
        this.height = 200;
        this.image = new Image();
        this.image.src = tableImageUrl;
        this.collisionAdj = 24;
        this.leftEdge = this.x + this.collisionAdj;
        this.topEdge = this.y + this.collisionAdj;
        this.rightEdge = this.x + this.width - this.collisionAdj;
        this.bottomEdge = this.y + this.height - this.collisionAdj;
    }
    render() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

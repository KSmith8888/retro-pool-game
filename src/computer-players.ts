import Game from "../pages/single-player/single-player-logic";

export class EasyComputer {
    game: Game;
    constructor(game: Game) {
        this.game = game;
    }
    turn() {
        const leftRight =
            Math.random() < 0.5
                ? -this.game.cueBall.radius
                : this.game.cueBall.radius;
        this.game.cueStick.circleX = this.game.cueBall.circleX + leftRight;
        this.game.cueStick.circleY = this.game.cueBall.circleY;
        this.game.cueCollision();
    }
}

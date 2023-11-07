import Game from "../pages/single-player/single-player-logic";

export class EasyComputer {
    game: Game;
    target: string | null;
    canTargetEightBall: boolean;
    pocketed: Array<string>;
    constructor(game: Game) {
        this.game = game;
        this.target = null;
        this.canTargetEightBall = false;
        this.pocketed = [];
    }
    turn() {
        const randomPower = Math.floor(Math.random() * 15) + 5;
        this.game.cueStick.power = randomPower;
        const randomX =
            Math.random() < 0.5
                ? Math.random() - 0.1
                : Math.random() * -1 + 0.1;
        const randomY =
            Math.random() < 0.5
                ? Math.random() - 0.1
                : Math.random() * -1 + 0.1;
        this.game.cueStick.circleX =
            this.game.cueBall.circleX + this.game.cueBall.radius * randomX;
        this.game.cueStick.circleY =
            this.game.cueBall.circleY + this.game.cueBall.radius * randomY;
        this.game.cueCollision();
    }
}

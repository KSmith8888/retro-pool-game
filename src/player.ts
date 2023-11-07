import Game from "../pages/single-player/single-player-logic";

export default class Player {
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
    turn(x: number, y: number) {
        this.game.cueStick.power = 15;
        this.game.cueStick.circleX = x - 5;
        this.game.cueStick.circleY = y - 5;
        this.game.cueCollision();
    }
}

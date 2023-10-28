import Ball from "../ball";
import CueBall from "../cue-ball";
import CueStick from "../cue-stick";

export function areObjectsColliding(
    ball1: Ball | CueBall | CueStick,
    ball2: Ball | CueBall | CueStick
) {
    const dx = ball2.circleX - ball1.circleX;
    const dy = ball2.circleY - ball1.circleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= ball1.radius + ball2.radius) {
        return true;
    } else {
        return false;
    }
}

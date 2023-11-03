import Ball from "../ball";
import CueBall from "../cue-ball";
import CueStick from "../cue-stick";
import Pocket from "../pocket";

export function areObjectsColliding(
    object1: Ball | CueBall | CueStick | Pocket,
    object2: Ball | CueBall | CueStick | Pocket
) {
    const dx = object2.circleX - object1.circleX;
    const dy = object2.circleY - object1.circleY;
    const distance = Math.hypot(dx, dy);
    const angleX = dx / distance;
    const angleY = dy / distance;
    if (distance <= object1.radius + object2.radius) {
        return { dx: dx, dy: dy, angleX: angleX, angleY: angleY };
    } else {
        return null;
    }
}

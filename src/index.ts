const singlePlayerButton = <HTMLButtonElement>(
    document.getElementById("single-player-button")
);

singlePlayerButton.addEventListener("click", () => {
    location.assign("/pages/single-player/single-player.html");
});

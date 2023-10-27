import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: ["es2021", "edge88", "firefox98", "chrome87", "safari15.4"],
        assetsInlineLimit: 0,
        rollupOptions: {
            input: {
                title: resolve(__dirname, "index.html"),
                singlePlayer: resolve(
                    `${__dirname}/pages/single-player/`,
                    "single-player.html"
                ),
            },
        },
    },
});

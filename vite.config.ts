import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: ["es2021", "edge88", "firefox98", "chrome87", "safari15.4"],
        assetsInlineLimit: 0,
    },
});

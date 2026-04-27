import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const appTitle = path
    .basename(__dirname)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: "genesis-html-title",
            transformIndexHtml: (html) => html.replace(/%APP_TITLE%/g, appTitle),
        },
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",
      },
    },
  },
  plugins: [react(), tailwindcss()],
});

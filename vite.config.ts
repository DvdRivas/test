import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // host: true -> necesario para que Codespaces pueda exponer el puerto
  server: { host: true },
});

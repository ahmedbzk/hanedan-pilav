import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command, isSsrBuild }) => ({
  plugins: [reactRouter()],
  // Tarayıcı paketinde console ve debugger çağrıları kaldırılır; prerender (SSR) derlemesi hataları göstermeye devam eder.
  esbuild: command === "build" && !isSsrBuild ? { drop: ["console", "debugger"] } : undefined,
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  define: {
    // Telif yılı derleme anında sabitlenir; prerender HTML'i ile istemci paketi aynı değeri görür, hidrasyon uyuşmazlığı olmaz.
    __YAPIM_YILI__: JSON.stringify(new Date().getFullYear()),
  },
  build: { sourcemap: false },
  css: {
    modules: { localsConvention: "camelCaseOnly" },
  },
  server: { port: 8780, strictPort: true },
  preview: { port: 8782, strictPort: true },
}));

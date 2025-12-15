import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // ✅ 개발 중엔 "/"가 안전, 배포 때만 base 적용
  base: mode === "production" ? "/PB_homework2/" : "/",
}));

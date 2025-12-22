import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginLess } from "@rsbuild/plugin-less";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = join(fileURLToPath(import.meta.url), '..');

export default defineConfig({
  source: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          target: "react",
          autoCodeSplitting: true,
          routeFileIgnorePattern:
            ".((hooks|const).ts)|components|const|services|types|hooks|modules|store|utils",
        }),
      ],
    },
  },
  html: {
    title: '时光储存库',
  },
  plugins: [pluginReact(), pluginLess()],
});

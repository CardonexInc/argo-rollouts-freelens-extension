import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import pluginExternal from "vite-plugin-external";
import sassDts from "vite-plugin-sass-dts";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, "src/main/index.ts"),
        formats: ["cjs"],
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/main/index.ts"),
        },
        output: {
          exports: "named",
          preserveModules: (process.env.VITE_PRESERVE_MODULES ?? "true") === "true",
          preserveModulesRoot: "src/main",
        },
      },
      sourcemap: true,
    },
    plugins: [
      react({
        babel: {
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                version: "2023-05",
              },
            ],
          ],
        },
      }),
      externalizeDepsPlugin({
        // do not bundle modules provided by the host app
        include: ["@freelensapp/extensions", "mobx"],
      }),
      pluginExternal({
        // the modules are provided by the host app as a global variable
        externals: {
          "@freelensapp/extensions": "global.LensExtensions",
          mobx: "global.Mobx",
        },
      }),
    ],
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, "src/renderer/index.tsx"),
        formats: ["cjs"],
      },
      outDir: "out/renderer",
      rollupOptions: {
        input: {
          renderer: resolve(__dirname, "src/renderer/index.tsx"),
        },
        output: {
          exports: "named",
          preserveModules: (process.env.VITE_PRESERVE_MODULES ?? "true") === "true",
          preserveModulesRoot: "src/renderer",
        },
      },
      sourcemap: true,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
    plugins: [
      sassDts({
        enabledMode: ["development", "production"],
      }),
      react({
        babel: {
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                version: "2023-05",
              },
            ],
          ],
        },
      }),
      externalizeDepsPlugin({
        // do not bundle modules provided by the host app
        include: [
          "@freelensapp/extensions",
          "electron",
          "mobx",
          "mobx-react",
          "react",
          "react-dom",
          "react-router-dom",
        ],
        // bundle all other modules
        exclude: [],
      }),
      pluginExternal({
        // the modules are provided by the host app as a global variable
        externals: {
          "@freelensapp/extensions": "global.LensExtensions",
          mobx: "global.Mobx",
          "mobx-react": "global.MobxReact",
          react: "global.React",
          "react-dom": "global.ReactDom",
          "react-router-dom": "global.ReactRouterDom",
          "react/jsx-runtime": "global.ReactJsxRuntime",
        },
      }),
    ],
  },
});

import { defineConfig } from "tsup"
import { sassPlugin, postcssModules } from "esbuild-sass-plugin"
import presetEnv from "postcss-preset-env"

export default defineConfig({
  entry: ["src"],
  format: ["esm"],
  sourcemap: true,
  esbuildPlugins: [
    sassPlugin({
      transform: postcssModules({}, [presetEnv]),
    }),
  ],
})

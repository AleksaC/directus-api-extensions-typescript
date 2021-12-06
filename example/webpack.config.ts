import { resolve } from "path";
import { readdirSync } from "fs";
import { spawn } from "child_process";

import { Configuration } from "webpack";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { merge } from "webpack-merge";
import nodeExternals from "webpack-node-externals";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

delete process.env.TS_NODE_PROJECT;

const externals = nodeExternals();

const config: Configuration = {
  mode: "production",
  target: "node",
  stats: "minimal",
  devtool: "inline-source-map",
  externalsPresets: { node: true },
  externals: [externals] as Configuration["externals"],
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  entry: () => {
    const hooks = readdirSync(resolve(__dirname, "./src/hooks"));

    const extensions = {};

    for (const hook of hooks) {
      extensions[hook] = {
        import: resolve(__dirname, "./src/hooks", hook, "./index.ts"),
        filename: "hooks/[name]/index.js",
      };
    }

    return extensions;
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: "babel-loader" },
          { loader: "ts-loader", options: { transpileOnly: true } },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  output: {
    libraryTarget: "commonjs2",
    path: resolve(__dirname, "extensions/"),
    clean: true,
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};

const directusRestartPlugin = () => {
  let subprocess;
  let prevHash;

  return {
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap(
        "RestartDirectusServerPlugin",
        (compilation) => {
          if (prevHash === compilation.fullHash) {
            return;
          }
          prevHash = compilation.fullHash;

          if (subprocess) {
            process.kill(subprocess.pid, "SIGINT");
          }
          // Used instead of npm start since it doesn't propagate signals correctly
          subprocess = spawn("node", ["node_modules/.bin/directus", "start"]);
          console.log(subprocess.pid);

          let stdout = Buffer.alloc(0);
          let stderr = Buffer.alloc(0);

          subprocess.stdout.on("data", (data) => {
            stdout = Buffer.concat([stdout, data]);
            process.stdout.write(data.toString());
          });

          subprocess.stderr.on("data", (data) => {
            stderr = Buffer.concat([stderr, data]);
            process.stderr.write(data.toString());
          });
        }
      );
    },
  };
};

export default function (env, args): Configuration {
  if (args.mode === "development") {
    return merge(config, {
      mode: "development",
      watch: true,
      watchOptions: {
        ignored: "**/node_module",
      },
      plugins: [directusRestartPlugin()],
    });
  } else {
    return config;
  }
}

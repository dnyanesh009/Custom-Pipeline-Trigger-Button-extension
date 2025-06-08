const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/workItemControl.ts",
  output: {
    filename: "workItemControl.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // ✅ This inlines the CSS to JS
      },      
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/styles.css", to: "styles.css" },
        { from: "src/workItemControl.html", to: "workItemControl.html" },
      ],
    }),
  ],
  mode: "production", // or "production"
};

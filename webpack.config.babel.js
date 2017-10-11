import path from "path";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";

export default {
  entry: "./index.js",
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  node:{
      fs: "empty"
  },
  plugins:[
    new CleanWebpackPlugin(["dist"]),
    new UglifyJSPlugin()
  ]
};

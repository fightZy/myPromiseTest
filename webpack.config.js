const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    devServer: {
        // contentBase: './dist', // # v4
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'] }),
        new HtmlWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    // Other options...
};
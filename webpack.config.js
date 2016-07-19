/**
 * Created by chief on 16/7/14.
 */

var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 产出html模板
var HtmlWebpackPlugin = require("html-webpack-plugin");

var htmlConfig = {
    filename: 'index.html',
    template: './static/page/index.html'
}


module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        contentBase: './build',
        port: 8080,
        stats: { colors: true }
    },
    entry: {
        app: './app/main.js'
    },
    output: {
        path: path.join(__dirname, "build/"),//文件输出目录
        filename: "index_bundle.js",//根据入口文件输出的对应多个文件名
        publicPath: "/build/"//用于配置文件发布路径，如CDN或本地服务器
    },
    resolve: {
        extension: ['', '.jsx', '.js', '.json','.css'],
        alias: {

        }
    },
    devtool: 'source-map',
    'display-error-details': true,
    // 使用externals可以将react分离，然后用<script>单独将react引入
    externals: [],
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                loaders: ['react-hot', 'babel'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000"
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin(htmlConfig),
        new ExtractTextPlugin("main.[hash:8].css", {
            allChunks: true,
            disable: false
        })
    ]
};

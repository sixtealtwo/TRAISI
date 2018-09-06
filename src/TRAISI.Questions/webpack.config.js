const path = require('path');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        a: path.join(process.cwd(), './src/traisi-questions.module.ts'),
        // b: path.join(process.cwd(), './src/traisi-questions.module.ts'),
    },

    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'traisi-questions.module.js',
        libraryTarget: 'amd'
    },
    devtool: 'source-map',

    resolve: {
        extensions: [
            '.ts',
            '.js'
        ],
        plugins: [
            new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false, // remove comments
                    },
                    test: ['*.js']
                }
            })
           
        ]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            },
            {
                test: /\.html?$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            }
        ]

    },
    /*externals: [
        function (context, request, callback) {
            if (/^@angular/.test(request)) {
                return callback(null, 'umd ' + request);
            }
            callback();
        }
    ],*/
    externals: /^@angular/,
    plugins: [
        /*
        new UglifyJsPlugin({
            uglifyOptions:{
                output: {
                    comments: false,
                }
            }
        })  */
    ]
};
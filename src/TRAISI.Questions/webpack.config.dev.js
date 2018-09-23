const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
    entry: {
        general: path.join(process.cwd(), './src/traisi-questions.module.ts'),
        map: path.join(process.cwd(), './src/map-question/traisi-map-question.module.ts'),

    },

    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'traisi-questions-[name].module.js',
        libraryTarget: 'amd'
    },
    mode: 'development',
    devtool: 'source-map',

    resolve: {
        extensions: [
            '.ts',
            '.js'
        ],
        plugins: [
            new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
            

        ]
    },


    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
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
            }, {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules/ngx-bootstrap")
                ],
                use: {
                    loader: "babel-loader"
                }
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
    externals: [/^@angular/, /^ngx-bootstrap/],
    plugins: [
        new CopyWebpackPlugin([
            { from: 'dist/', to: '../../TRAISI/development', toType: 'dir' },
        ], { debug: 'info' })
        /* new WebpackSystemRegister({
             systemjsDeps: [
                 /^ngx-bootstrap/, // any import that starts with react
             ],
             registerName: 'test-module', // optional name that SystemJS will know this bundle as.
         }), */
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
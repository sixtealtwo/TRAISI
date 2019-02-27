const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: path.join(process.cwd(), './src/TRAISI.SDK.module.ts'),
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'TRAISI.SDK.module.js',
				libraryTarget: 'amd'
		},
		devtool: 'source-map',
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.html?$/,
                loader: 'raw-loader'
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
							test: /\.png$/, 
							exclude: /node_modules/,
							loader: 'file-loader?name=images/[name].[ext]'
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
    externals: [/^@angular/, /^rxjs/],
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
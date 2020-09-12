const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',

	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsConfigPathsPlugin(/* { tsconfig, compiler } */)],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: [/node_modules/],
			},
			{
				test: /\.html?$/,
				use: 'raw-loader',
			},
			{
				test: /\.css$/,
				use: [
					'style-loader', // creates style nodes from JS strings
					'css-loader', // translates CSS into CommonJS
				],
			},
			{
				test: /\.scss$/,
				use: [
					'to-string-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,

							sassOptions: {
								data: '@import "_styles";',
								includePaths: [path.join(__dirname, 'assets'), '.assets/'],
							},
						},
					},
				],
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 12000, // Convert images < 8kb to base64 strings
							name: 'images/[hash]-[name].[ext]',
						},
					},
				],
			},
		],
	},
	/*externals: [
        function (context, request, callback) {
            if (/^@angular/.test(request)) {
                return callback(null, 'umd ' + request);
            }
            callback();
        }
    ],*/
	externals: [
		/^@angular\/platform-browser\/animations/,
		/^@angular\/animations/,
		/^@angular\/common/,
		/^@angular\/core/,
		/^@angular\/upgrade/,
		/^@angular\/upgrade/,
		/^@angular\/router/,
		/^@angular\/forms/,
		/^@angular\/platform-browser/,
		/^@angular/,
		/^ngx-bootstrap/,
		/^@fortawesome/,
		/^bootstrap/,
		/^bootswatch/,
		/^angular-calendar/,
		/^rxjs/,
		/^traisi-question-sdk/,
	],
};

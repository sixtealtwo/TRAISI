const path = require('path');
const WebpackSystemRegister = require('webpack-system-register');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
	entry: {
		general: path.join(process.cwd(), './src/traisi-questions.module.ts'),
		map: path.join(process.cwd(), './src/map-question/traisi-map-question.module.ts'),
		sp: path.join(process.cwd(), './src/stated-preference/viewer/traisi-sp-question-viewer.module.ts'),
		spbuilder: path.join(process.cwd(), './src/stated-preference/builder/traisi-sp-question-builder.module.ts')
	},

	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: 'traisi-questions-[name].module.js',
		libraryTarget: 'amd'
	},
	mode: 'development',
	devtool: 'source-map',

	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsConfigPathsPlugin /* { tsconfig, compiler } */()]
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loaders: ['angular2-template-loader?keepUrl=true', 'angular-router-loader'],
				exclude: [/node_modules/]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader'
			},
			{
				test: /\.html?$/,
				use: 'raw-loader'
			},
			{
				test: /\.svg$/,
				use: {
					loader: 'svg-url-loader',
					options: {
						limit: 10000000, // Convert images < 8kb to base64 strings
						name: 'images/[hash]-[name].[ext]'
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader', // creates style nodes from JS strings
					'css-loader' // translates CSS into CommonJS
				],
				include: [/node_modules/]
			},
			{
				test: /\.scss$/,
				use: [
					'to-string-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,

							sassOptions: {
								data: '@import "_styles";',
								includePaths: [path.join(__dirname, 'src/assets')]
							}
						}
					}
				]
			},
			{
				test: /\.(png|jp(e*)g)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8000, // Convert images < 8kb to base64 strings
							name: 'images/[hash]-[name].[ext]'
						}
					}
				]
			}
			/*{
        test: /\.js$/,
        include: [path.resolve(__dirname, 'node_modules/ngx-bootstrap')],
        use: {
          loader: 'babel-loader'
        }
      } */
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
	externals: [
		/^@angular\/common/,
		/^@angular\/core/,
		/^@angular\/upgrade/,
		/^@angular\/forms/,
		/^@angular\/platform-browser/,
		/^ngx-bootstrap/,
		/^@fortawesome/,
		/^bootstrap/,
		/^bootswatch/,
		/^rxjs/,
		/^traisi-question-sdk/
	],
	plugins: [
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

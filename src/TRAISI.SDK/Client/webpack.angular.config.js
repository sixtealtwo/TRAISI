const { AngularCompilerPlugin } = require('@ngtools/webpack');
const path = require('path');

module.exports = {
	/*entry: {
		main: './src/bootstrap.module.ts',
		styles: './src/styles.css'
	},

	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: '[name].js'
	}, */
	mode: 'development',
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
				loader: '@ngtools/webpack'
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			},
			{
				test: /\.scss$/,
				loader: ['raw-loader', 'sass-loader']
			},
			{ test: /\.css$/, loader: 'raw-loader' }
		]
	},

	plugins: [
		new AngularCompilerPlugin({
			tsConfigPath: 'tsconfig.json',
			entryModule: './src/traisi-sdk.module#TraisiSdkModule',
			sourceMap: true
		})
	],
	externals: [/^@angular/, /^rxjs/]
};

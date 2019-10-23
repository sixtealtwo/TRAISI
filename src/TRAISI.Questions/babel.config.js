module.exports = function(api) {
	api.cache(true);

	const presets = [
		[
			'@babel/preset-env',
			{
				exclude: ['node_modules/mapbox-gl/*']
			}
		]
	];
	const plugins = [];

	return {
		presets,
		plugins
	};
};

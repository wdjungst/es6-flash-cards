const path = require('path');
const env = process.env.NODE_ENV || 'development'

let config = {
	entry: './app/index.js',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},

	resolve: {
		modules: ['app', 'node_modules'],
		extensions: [".js"]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				include: [ path.join(__dirname, "app")]
			}
		]
	}
}

if (env === 'development')
  config.devtool = 'source-map'

module.exports = config;

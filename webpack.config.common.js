const glob = require('glob')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin') // JS Minify as like uglify

const generateHTMLPlugins = () =>
	glob.sync('./src/**/*.html').map(
		(dir) =>
			new HTMLWebpackPlugin({
				filename: path.basename(dir), // Output
				template: dir, // Input
				hash: true,
				favicon: `./src/images/favicon.ico`,
			})
	)

module.exports = {
	node: {
		fs: 'empty',
	},
	entry: ['./src/js/bundle.js', './src/sass/theme.scss'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: './js/bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						// ES6+ Support
						presets: ['@babel/env'],
						plugins: ['transform-class-properties'],
						// plugins: ['@babel/plugin-proposal-class-properties']
					},
				},
			},
			{
				test: /\.html$/,
				loader: 'raw-loader',
			},
			{
				test: /\.(pdf|gif|png|jpe?g|svg|ico)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'images/',
						},
					},
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
						},
					},
				],
			},
		],
	},
	plugins: [
		new TerserPlugin(),
		new CopyWebpackPlugin([
			{
				from: './src/images/',
				to: './images/',
			},
		]),
		...generateHTMLPlugins(),
	],
	stats: {
		colors: true,
	},
	devtool: 'source-map',
}

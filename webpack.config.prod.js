const path = require('path')
const cssnano = require('cssnano')
// const loader = require("sass-loader");
const merge = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const common = require('./webpack.config.common.js')

module.exports = merge(common, {
	mode: 'production',
	optimization: {
		minimize: true,
	},
	module: {
		rules: [
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['**/*', path.join(process.cwd(), 'dist/**/*')],
		}),
		new MiniCssExtractPlugin({
			// filename: "./css/theme.css",
			filename: './css/[name].css',
			chunkFilename: '[id].css',
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: cssnano,
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true,
		}),
	],
})

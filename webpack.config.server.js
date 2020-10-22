const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	// 在node环境下进行，target指定为node
	target: 'node',
	mode: 'development',
	entry: './server.js',
	output: {
		filename: 'server.js',
		// path 要指定绝对路径
		path: path.resolve(__dirname, 'build'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				// 排除 node_modules
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	// 不要打包 node_modules 模块的文件
	externals: [nodeExternals()],
}

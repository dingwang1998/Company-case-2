module.exports = (webpackConfig, env) => {
	// 别名配置
	webpackConfig.resolve.alias = {
		'components':`${__dirname}/src/components`,
		'utils':`${__dirname}/src/utils`,
		'routes':`${__dirname}/src/routes`,
		'models':`${__dirname}/src/models`,
		'services':`${__dirname}/src/services`,
		'@':`${__dirname}/src`
	}
	return webpackConfig
}
/*
 * @Author: Ricardo
 * @Date: 2021-06-30 11:04:56
 * @LastEditTime: 2021-07-01 09:53:58
 * @LastEditors: Ricardo
 * @Description:
 * @FilePath: \cesium-in-use\vue.config.js
 * 没有bug就没有伤害~
 */
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 9099,
      https: false,
      hotOnly: false,
      proxy: null, // 设置代理
      // before: app => {}
    },
    plugins: [
      new WebpackBar({
        name: 'cesium练手',
        color: '#f40',
      }),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/cesium/Build/Cesium/Workers',
          to: 'cesium/Workers',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/cesium/Build/Cesium/ThirdParty',
          to: 'cesium/ThirdParty',
        },
      ]),
      new CopyWebpackPlugin([
        { from: 'node_modules/cesium/Build/Cesium/Assets', to: 'cesium/Assets' },
      ]),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/cesium/Build/Cesium/Widgets',
          to: 'cesium/Widgets',
        },
      ]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('./cesium'),
      }),
    ],
    module: {
      unknownContextCritical: false,
    },
  },
}

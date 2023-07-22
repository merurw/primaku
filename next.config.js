/* eslint-disable */
// const webpack = require('webpack')
const { withSentryConfig } = require('@sentry/nextjs')
// const { parsed: myEnv } = require('dotenv').config({
//   path: `./src/core/environment/.env.${process.env.CDIC_ENV}`
// })
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  sentry: {
    // See the 'Configure Source Maps' and 'Configure Legacy Browser Support'
    // sections below for information on the following options:
    //   - disableServerWebpackPlugin
    //   - disableClientWebpackPlugin
    //   - hideSourceMaps
    //   - widenClientFileUpload
    //   - transpileClientSDK
    hideSourceMaps: true
  },
  reactStrictMode: true
  // webpack(config) {
  //   config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
  //   return config
  // }
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)

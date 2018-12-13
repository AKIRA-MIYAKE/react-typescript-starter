const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const craConfig = require('../config/webpack.config.dev');

module.exports = (baseConfig, env, config) => {
  const craConfigOneOf = craConfig.module.rules[2].oneOf;

  // Use rules of webpack.dev.config that created react-create-app,
  config.module.rules = [
    {
      oneOf: [
        craConfigOneOf[0], // url loader
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          // Include src and stories directories.
          include: path.resolve(appDirectory),
          exclude: path.resolve(appDirectory, 'node_modules'),
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),            
            plugins: [
              [
                require.resolve('babel-plugin-named-asset-import'),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                    },
                  },
                },
              ],
            ],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        // JS outside of the app with Babel
        craConfigOneOf[2], 
        // postcss loader
        craConfigOneOf[3], 
        // CSS Modules
        craConfigOneOf[4], 
        {
          // Add ejs to exclude params.
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.ejs$/],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        }
      ],
    },
  ];

  config.resolve.extensions = craConfig.resolve.extensions;

  return config;
};
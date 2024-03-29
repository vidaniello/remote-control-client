const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("./package.json");
const manifest = require("./assets/site.webmanifest.json");
manifest.id = packageJson.name;

module.exports = {
  
    mode: 'development',

    //entry: './src/index.ts',
    entry: {
      main: './src/index.ts',
      service_worker_append: './src/service_worker_append.ts'
    },

    devtool: 'inline-source-map',

    module: {
      rules:[
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        /*
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        }
        */
      ]
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'test/'),
      clean: true
    },

    devServer: {
      static: './test',
      https: true,
      port: 8989
     },

     plugins: [

      new HtmlWebpackPlugin({
        title: 'RemoteControl',
        template: 'src/template.index.html',
        favicon: 'assets/favicon.ico',
        manifest: 'site.webmanifest',
        //chunks: ['main'],
        excludeChunks: ['service_worker_append'],
        meta: {
          appleTouchIcon: {
            name: 'apple-touch-icon',
            content: 'apple-touch-icon.png'
          },
          appleMobileWebAppC: {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
          },
          appleMobileWebAppSBS: {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
          },
          appleMobileWebAppT: {
            name: 'apple-mobile-web-app-title',
            content: manifest.name
          },
          description: {
            name: 'description',
            content: 'Remote client'
          },
          themeColor: {
            name: 'theme-color',
            content: manifest.theme_color
          }
        },
      }),

      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        additionalManifestEntries: [
          {url: 'site.webmanifest', revision: '2'}
        ],
        importScripts: ['./service_worker_append.js']
      }),
      
      new WebpackManifestPlugin({
        fileName: 'site.webmanifest',
        publicPath: '',
        seed: manifest
      })

      ,
      new CopyPlugin({
        patterns: [
          { from: "assets/*.png", to: "[name][ext]" },
          { from: "assets/Remote control CA.cer", to: "certificate.cer"}
          //{ from: 'src/ht.js', to:'ht.js'}
        ],
      })

     ]
  };
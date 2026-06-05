---
title: Webpack 构建
---

# Webpack 构建

Webpack 是最流行的前端模块打包器，通过分析模块依赖关系，将各种资源打包成浏览器可用的静态文件。

## 核心概念

```
Entry（入口）→ Loaders（转换）→ Plugins（插件）→ Output（输出）
```

| 概念 | 说明 |
|------|------|
| Entry | 打包入口，Webpack 从此开始分析依赖 |
| Output | 输出配置，打包后的文件路径和命名 |
| Loaders | 文件转换器，处理非 JS 文件 |
| Plugins | 插件，扩展 Webpack 功能 |
| Mode | 模式，development / production |
| Resolve | 模块解析规则 |

## 基本配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 模式
  mode: 'development', // 'production' | 'development' | 'none'

  // 入口
  entry: {
    main: './src/main.js',
    admin: './src/admin.js',
  },

  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true, // 构建前清空 dist
  },

  // 模块解析
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 开发服务器
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
};
```

## Loaders

```javascript
module.exports = {
  module: {
    rules: [
      // Babel - ES6+ 转换
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
              '@babel/preset-react',
            ],
          },
        },
      },

      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

      // Sass/Less
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },

      // CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
        ],
      },

      // 图片
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 }, // 8kb 以下转 base64
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },

      // 字体
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
    ],
  },
};
```

## Plugins

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    // HTML 模板
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '我的应用',
      minify: true,
    }),

    // CSS 提取为独立文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),

    // 代码分割
    // （Webpack 5 已内置 SplitChunksPlugin）

    // 包分析
    new BundleAnalyzerPlugin(),
  ],

  optimization: {
    // 代码压缩
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin(),
    ],

    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
        },
      },
    },

    // 运行时代码单独提取
    runtimeChunk: 'single',
  },
};
```

## 开发优化

```javascript
// 开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // Source Map

  devServer: {
    port: 3000,
    hot: true,         // 热模块替换
    compress: true,    // gzip 压缩
    static: './dist',
  },

  // 缓存
  cache: {
    type: 'filesystem', // 文件系统缓存（Webpack 5）
  },

  module: {
    rules: [
      // 开发环境用 style-loader（CSS 注入 DOM，支持 HMR）
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
```

## 生产优化

```javascript
// 生产环境配置
module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',

  module: {
    rules: [
      // 生产环境提取 CSS 为独立文件
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 300000,
    maxEntrypointSize: 500000,
  },
});
```

## 下一步

- ⚡ [Vite 构建](/frontend/advanced/modules/vite) - 下一代构建工具
- 📮 [包管理与发布](/frontend/advanced/modules/package) - npm 包管理
- 🏢 [Monorepo 管理](/frontend/advanced/modules/monorepo) - 多包管理

const path = require(`path`);
const miniCss = require('mini-css-extract-plugin');
// var bodyParser = require('body-parser');

// let a = ``;

module.exports = {
    entry: `./js/main.js`,
    output: {
        filename: `bundle.js`,
        path: path.join(__dirname, `public`),
    },
    devServer: {
        static: path.join(__dirname, `public`),
        historyApiFallback: true,
        compress: false,
        open: true,
        port: 8080,
        host: '0.0.0.0',
        allowedHosts: 'all',
        client: {
            webSocketTransport: 'ws',
            webSocketURL: {
                hostname: '0.0.0.0',
                pathname: '/ws',
                password: 'dev-server',
                port: 8080,
                protocol: 'ws',
                username: 'webpack',
              },
        },
        webSocketServer: 'ws',
        // setupMiddlewares: (middlewares, devServer) => {
        //     if (!devServer) {
        //       throw new Error('webpack-dev-server is not defined');
        //     }
      
        //     devServer.app.get('/setup-middleware/some/path', (_, response) => {
        //       response.send('setup-middlewares option GET');
        //     });

        //     devServer.app.use(bodyParser.json());
      
        //     // Use the `unshift` method if you want to run a middleware before all other middlewares
        //     // or when you are migrating from the `onBeforeSetupMiddleware` option
        //     middlewares.unshift({
        //       name: 'fist-in-array',
        //       // `path` is optional
        //       path: '/foo/path',
        //       middleware: (req, res) => {
        //           console.log(req.body);
        //           a = req.body;
        //         res.send(JSON.stringify(a));
        //       },
        //     });
      
        //     // Use the `push` method if you want to run a middleware after all other middlewares
        //     // or when you are migrating from the `onAfterSetupMiddleware` option
        //     middlewares.push({
        //       name: 'hello-world-test-one',
        //       // `path` is optional
        //       path: '/foo/bar',
        //       middleware: (req, res) => {
        //         res.send(a);
        //       },
        //     });
      
        //     middlewares.push((req, res) => {
        //       res.send('Hello World!');
        //     });
      
        //     return middlewares;
        //   },
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                //   "style-loader",
                  // Translates CSS into CommonJS
                  miniCss.loader,
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: `babel-loader`,
                },
            }
        ]
    },
    plugins: [
        new miniCss({
           filename: 'style.css',
        }),
     ],
    resolve: {
        extensions: [`.ts`, `.tsx`, `.js`, `json`, `scss`]
    },
    devtool: `source-map`
};

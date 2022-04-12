const path = require(`path`);
const miniCss = require('mini-css-extract-plugin');

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
        port: 1337
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

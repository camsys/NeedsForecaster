const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3003,
    },
    target: 'web',
    output: {
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'ecmascript',
                                jsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic',
                                },
                            },
                        },
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'needs_forecaster',
            library: { type: 'var', name: 'needs_forecaster' },
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App',
            },
            // adds react as shared module
            // version is inferred from package.json
            // there is no version check for the required version
            // so it will always use the higher version found
            shared: {
                react: {
                    requiredVersion: deps.react,
                    import: 'react', // the "react" package will be used a provided and fallback module
                    shareKey: 'react', // under this name the shared module will be placed in the share scope
                    shareScope: 'default', // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    singleton: true, // only a single version of the shared module is allowed
                },
            },
        }),
    ],
};

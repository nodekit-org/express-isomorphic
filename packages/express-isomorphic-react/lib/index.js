"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@nodekit/logger");
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const log = logger_1.logger('[express-isomorphic-react]');
const defaultWebpackStats = {
    all: false,
    assets: true,
    builtAt: true,
    chunks: true,
    color: true,
    entrypoints: true,
    errors: true,
};
function createLocalDevMiddlewares({ serverState, webpackConfig, webpackStats = defaultWebpackStats, }) {
    const { devMiddleware, hotMiddleware } = createWebpackMiddlewares({
        webpackConfig,
    });
    const webpackBuildParserLocal = createWebpackBuildParserLocal(serverState, webpackStats);
    return [
        devMiddleware,
        hotMiddleware,
        webpackBuildParserLocal,
    ];
}
exports.createLocalDevMiddlewares = createLocalDevMiddlewares;
function createWebpackMiddlewares({ webpackConfig, webpackStats, }) {
    log('createWebpackMiddlewares(): webpack-client-local will be compiled with config:\n%j', webpackConfig);
    const clientWebpackCompiler = webpack_1.default(webpackConfig);
    const devMiddleware = webpack_dev_middleware_1.default(clientWebpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true,
        stats: webpackStats || defaultWebpackStats,
    });
    const hotMiddleware = webpack_hot_middleware_1.default(clientWebpackCompiler, {
        heartbeat: 2000,
        reload: true,
    });
    return { devMiddleware, hotMiddleware };
}
exports.createWebpackMiddlewares = createWebpackMiddlewares;
function createWebpackBuildParserLocal(serverState, webpackStats) {
    return (req, res, next) => {
        if (serverState.state.buildHash !== res.locals.webpackStats.hash) {
            const webpackBuild = res.locals.webpackStats.toJson(webpackStats);
            const { error, assets } = parseWebpackBuild(webpackBuild);
            serverState.update(Object.assign({}, error && {
                error: {
                    errorObj: error,
                    type: 'LOCAL_WEBPACK_BUILD_ERROR',
                },
            }, { state: {
                    assets,
                    buildHash: res.locals.webpackStats.hash,
                } }));
        }
        next();
    };
}
exports.createWebpackBuildParserLocal = createWebpackBuildParserLocal;
function parseWebpackBuild({ entrypoints, }) {
    log('parseWebpackBuildInfo(): entrypoints:\n%j', entrypoints);
    const assets = [];
    try {
        if (!entrypoints) {
            return {
                assets,
                error: 'entrypoints undefined',
            };
        }
        Object.values(entrypoints)
            .forEach((entrypoint) => {
            entrypoint.assets.forEach((asset) => {
                if (asset.match(/^.*\.(js|css)$/)) {
                    assets.push(asset);
                }
            });
        });
        return {
            assets,
        };
    }
    catch (err) {
        return {
            assets,
            error: 'error parsing webpack build info',
        };
    }
}

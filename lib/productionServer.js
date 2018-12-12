"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const createExpress_1 = require("./createExpress");
const serverUtils_1 = require("./utils/serverUtils");
const log_1 = require("./utils/log");
const tag = 'productionServer';
const productionServer = function ({ bundlePath, makeHtml, publicPath, universalAppPath, }) {
    return createExpress_1.default({
        enhance: (app, state) => {
            const bundleBuildJson = fs.readFileSync(`${bundlePath}/build.json`, 'utf-8');
            const buildInfo = JSON.parse(bundleBuildJson);
            log_1.log(`${tag} enhance(), build.json:\n%o`, buildInfo);
            const { error, assets } = serverUtils_1.parseWebpackBuildInfo(buildInfo);
            state.update(Object.assign({ assets }, error && { error }, { isLaunched: true, universalAppPath }));
        },
        makeHtml,
        publicPath,
    });
};
exports.default = productionServer;

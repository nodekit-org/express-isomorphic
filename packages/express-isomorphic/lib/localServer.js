"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("@nodekit/logger");
const nodemon_1 = __importDefault(require("nodemon"));
const path_1 = __importDefault(require("path"));
const createExpress_1 = __importDefault(require("./createExpress"));
const log = logger_1.logger('[express-isomorphic]');
const localServer = ({ extend, makeHtmlPath, }) => {
    return createExpress_1.default({
        bootstrap: () => {
            setupNodemon(makeHtmlPath);
        },
        extend,
        htmlGenerator: ({ requestUrl, serverState, }) => __awaiter(this, void 0, void 0, function* () {
            const makeHtmlPayload = {
                requestUrl,
                serverState,
            };
            const { data } = yield axios_1.default.post('http://localhost:10021/makeHtml', makeHtmlPayload);
            return data;
        }),
    });
};
exports.default = localServer;
function setupNodemon(makeHtmlPath) {
    log('setupNodemon(): parent pid: %s, makeHtmlPath: %s', process.pid, makeHtmlPath);
    const script = path_1.default.resolve(__dirname, 'htmlGeneratingServer.js');
    nodemon_1.default({
        args: [
            '--port',
            10021,
            '--makeHtmlPath',
            makeHtmlPath,
        ],
        ext: 'js json jsx ts tsx',
        script,
    })
        .on('quit', () => {
        log('setupNodemon(): quit');
        process.exit();
    })
        .on('restart', (files) => {
        log(`setupNodemon(): ${chalk_1.default.green('restarted')} by: %s`, files);
    });
}

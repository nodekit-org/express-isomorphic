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
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("@nodekit/logger");
const ServerState_1 = __importDefault(require("./ServerState"));
const log = logger_1.logger('[express-isomorphic]');
const createExpress = ({ bootstrap, extend, htmlGenerator, state, }) => __awaiter(this, void 0, void 0, function* () {
    log('createExpress(): NODE_ENV: %s', process.env.NODE_ENV);
    const serverState = new ServerState_1.default(state || {});
    const app = express_1.default();
    if (extend) {
        log('createExpress(): extend is defined thus registered');
        extend(app, serverState);
    }
    yield bootstrap(app, serverState);
    app.get('*', [
        serveHtml(serverState, htmlGenerator),
    ]);
    return {
        app,
        serverState,
    };
});
function serveHtml(serverState, htmlGenerator) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        try {
            const html = yield htmlGenerator({
                requestUrl: req.url,
                serverState,
            });
            res.end(html.toString());
        }
        catch (err) {
            log(`serveHtml(): ${chalk_1.default.red('failed')} to create html, error msg: %s`, err.message);
            res.end('Failed to create html');
        }
    });
}
exports.default = createExpress;

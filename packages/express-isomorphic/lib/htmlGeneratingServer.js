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
const yargs_1 = require("yargs");
const body_parser_1 = __importDefault(require("body-parser"));
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("@nodekit/logger");
const log = logger_1.logger('[express-isomorphic]');
log('htmlGeneratingServer(): command line arguments: %j', yargs_1.argv);
(function htmlGeneratingServer() {
    const app = express_1.default();
    const port = yargs_1.argv.port || 10021;
    const makeHtmlPath = requireNonEmpty(yargs_1.argv.makeHtmlPath, 'makeHtmlPath should be provided');
    const makeHtml = require(makeHtmlPath).default || require(makeHtmlPath);
    app.use(body_parser_1.default.json());
    app.post('/makeHtml', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { requestUrl, serverState, } = req.body;
        let html;
        try {
            html = (yield makeHtml({
                requestUrl,
                serverState,
            })).toString();
        }
        catch (err) {
            log('htmlGeneratingServer(): error making html: %o', err);
            html = err.toString();
        }
        res.send(html);
    }));
    app.listen(port, () => {
        log(`htmlGeneratingServer(): listening on port: ${chalk_1.default.yellow('%s')}`, port);
    });
    return app;
})();
function requireNonEmpty(obj, msg) {
    if (!obj || obj === '') {
        throw new Error(`requireNonEmpty(): ${msg}`);
    }
    else {
        return obj;
    }
}

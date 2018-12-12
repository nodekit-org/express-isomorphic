"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const tag = chalk_1.default.cyan('[express-isomorphic]');
exports.log = function (msg, ...args) {
    console.log(`${tag} ${msg}`, ...args);
};

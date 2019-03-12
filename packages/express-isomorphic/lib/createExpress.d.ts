import express, { Request } from "express";
import { State } from './state';
declare const createExpress: CreateExpress;
export default createExpress;
export interface ServerCreation {
    app: express.Application;
    state: State;
}
export interface MakeHtml {
    (arg: {
        assets: string[] | undefined;
        request?: Request;
        universalAppPath: string | undefined;
    }): Promise<string>;
}
export interface WebpackStats {
    chunks: boolean;
    entrypoints: boolean;
    [x: string]: boolean;
}
export interface Extend {
    (app: express.Application, state: State): any;
}
interface CreateExpress {
    (arg: {
        _extend: Extend;
        makeHtml: MakeHtml;
        publicPath: string;
    }): ServerCreation;
}

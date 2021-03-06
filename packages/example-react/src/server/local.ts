import ExpressIsomorphic, {
  Extend,
} from '@nodekit/express-isomorphic';
import { logger } from '@nodekit/logger';
import http from 'http';
import path from 'path';
import {
  NextFunction,
  Request,
} from 'express';
import { withReactLocal } from '@nodekit/express-isomorphic-react';

import State from './State';
import webpackConfig from '../webpack/webpack.config.client.local.web';

const log = logger('[example-react]');

const extend: Extend<State> = (app, serverState) => {
  app.use((req: Request, res, next: NextFunction) => {
    log('extend(): requestUrl: %s, serverState: %j', req.url, serverState);
    next();
  });

  withReactLocal({
    serverState,
    webpackConfig,
  })(app);

  serverState.update({
    state: {
      testProp1: 'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcv',
    },
  });

  serverState.update({
    state: {
      testProp2: 2,
    },
  });
};

(async function local() {
  const { app } = await ExpressIsomorphic.local({
    extend,
    makeHtmlPath: path.resolve(__dirname, './makeHtmlLaunch.js'),
    watchExt: 'js,jsx,ts,tsx,html,test',
    watchPaths: [
      path.resolve(__dirname, '../universal'),
      path.resolve(__dirname, 'html'),
    ],
  });

  const server = http.createServer(app);

  server.listen(6001, () => {
    log('local(): server is listening on: %s', 6001);
  });
})();

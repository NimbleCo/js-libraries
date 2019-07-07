import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import Repo from './lib/Repository';
// let repo = new Repo('https://github.com/twigjs/twig.js.git');

import getModule from '@nimbleco/common';
import {getRoot as getRootLogger} from './lib/Logger';

const rootLogger = getRootLogger();
const gitLogger = getModule('git');
const gitFsLogger = gitLogger.getModule('fs');

rootLogger.info('info from root logger');
gitLogger.warn('warning fro git logger');
gitFsLogger.debug('debug msg from git fs logger');
gitFsLogger.trace('debug msg from git fs logger');
gitFsLogger.error('debug msg from git fs logger');
gitFsLogger.error('Fucked up the ${url}', {url: 'https://obsrv.in', sth: 'elo', more: ['a', 'b', 'c']});
gitFsLogger.fatal('debug msg from git fs logger');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

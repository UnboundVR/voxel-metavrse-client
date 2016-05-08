// Based on CodeMirror Lint addon to use ESLint, copyright (c) by Angelo ZERR and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Depends on eslint.js from https://github.com/eslint/eslint

/* global eslint */

import config from './config.json';

export default {
  register() {
    CodeMirror.registerHelper('lint', 'javascript', text => {
      let errors = eslint.verify(text, config);
      return errors.map(error => ({
        message: error.message,
        severity: getSeverity(error),
        from: getPos(error, true),
        to: getPos(error, false)
      }));
    });
  }
};

function getPos(error, from) {
  var line = error.line-1, ch = from ? error.column : error.column+1;
  if (error.node && error.node.loc) {
    line = from ? error.node.loc.start.line -1 : error.node.loc.end.line -1;
    ch = from ? error.node.loc.start.column : error.node.loc.end.column;
  }
  return CodeMirror.Pos(line, ch);
}

function getSeverity(error) {
  switch(error.severity) {
    case 1:
      return 'warning';
    case 2:
      return 'error';
    default:
      return 'error';
  }
}

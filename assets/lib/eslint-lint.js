// CodeMirror Lint addon to use ESLint, copyright (c) by Angelo ZERR and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Depends on eslint.js from https://github.com/eslint/eslint

(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') // CommonJS
    mod(require('../../lib/codemirror'));
  else if (typeof define == 'function' && define.amd) // AMD
    define(['../../lib/codemirror'], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  'use strict';

  var defaultConfig = {
    'env': {
      'es6': true,
      'browser': true
    },
    'parserOptions': {
      'ecmaVersion': 6,
      'sourceType': 'module'
    },
    'rules': {
      'indent': [
        2,
        2,
        {'SwitchCase': 1}
      ],
      'quotes': [
        2,
        'single'
      ],
      'linebreak-style': [
        2,
        'unix'
      ],
      'semi': [
        2,
        'always'
      ],
      'brace-style': [
        2,
        '1tbs',
        { 'allowSingleLine': true }
      ],
      'no-console': 0
    },
    'extends': [
      'eslint:recommended'
    ]
  };

  function validator(text) {
    var result = [], config = defaultConfig;
    var errors = eslint.verify(text, config);
    console.log(eslint, errors, config)
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i];
      result.push({message: error.message,
                 severity: getSeverity(error),
                 from: getPos(error, true),
                   to: getPos(error, false)});
    }
    return result;
  }

  CodeMirror.registerHelper('lint', 'javascript', validator);

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
});

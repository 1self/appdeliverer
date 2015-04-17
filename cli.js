#!/usr/bin/env node
'use strict';
var meow = require('meow');
var appdeliverer = require('./');

var cli = meow({
  help: [
    'Usage',
    '  appdeliverer <input>',
    '',
    'Example',
    '  appdeliverer Unicorn'
  ].join('\n')
});

appdeliverer(cli.input[0]);

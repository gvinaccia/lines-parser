const path = require('path');
const { parse } = require('../src');

parse(
    path.join(__dirname, 'testnb/test.lines'), 
    path.join(__dirname, 'output')
).then(console.log);

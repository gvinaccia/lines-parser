const parseFile = require('./parser');
const render = require('./renderer');
const createStore = require('./storage'); 

/**
 * 
 * @param {string} inputFile 
 * @param {string} outdir 
 */
function parse(inputFile, outdir) {
  return parseFile(inputFile)
    .then(render)
    .then(createStore(outdir));
}

module.exports = { parse };
const path = require('path') ;

const PRO_DIR = process.cwd();

const JOIN = (...dir) => path.join(PRO_DIR, ...dir)

module.exports = {
  clientDir: JOIN('client', 'vues'),
  
}
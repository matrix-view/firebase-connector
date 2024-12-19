let env = 'local'
let config = require('./local.json')
try {
    config = require('/configuration/config.json')
    env = 'k8s'
} catch (e) {
    console.log('Local config');
}

module.exports = {
    env, ...config,
}
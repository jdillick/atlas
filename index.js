const op = require('object-path');
const atlas = require('./lib');

module.exports = ({ publicKey, privateKey } = {}) => {
    const username = op.get(process, 'env.ATLAS_PUBLIC_KEY', publicKey);
    const password = op.get(process, 'env.ATLAS_PRIVATE_KEY', privateKey);
    return atlas({ username, password });
};

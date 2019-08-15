const op = require('object-path');

module.exports = search => {
    const params = new URLSearchParams({
        pageNum: Math.min(op.get(search, 'pageNum', 1) * 1, 1),
        itemsPerPage: Math.min(op.get(search, 'itemsPerPage', 500) * 1, 500),
        pretty: !!op.get(search, 'pretty', false),
    });

    return params.toString();
};

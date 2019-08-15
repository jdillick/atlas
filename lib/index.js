global.baseURL = 'https://cloud.mongodb.com/api/atlas/v1.0/';

module.exports = ({ username, password }) => {
    const baseAxios = require('axios').create({
        baseURL,
        headers: {
            Accept: 'application/json',
        },
    });

    const AxiosDigest = require('./digest');
    const axiosDigest = new AxiosDigest(username, password, baseAxios);
    return {
        root: require('./root')(axiosDigest),
        dbUsers: require('./dbUsers')(axiosDigest),
        customRoles: require('./customRoles')(axiosDigest),
        projectIp: require('./projectIp')(axiosDigest),
    };
};

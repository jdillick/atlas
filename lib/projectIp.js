const validate = require('../schemas/validate');
const schema = require('../schemas/projectIp');
const op = require('object-path');

const projectIp = axios => {
    const api = {
        all: groupId => axios.get(`/groups/${groupId}/whitelist`),
        create: async (groupId, data) => {
            try {
                const valid = await validate(data, schema);
                return axios.post(`/groups/${groupId}/whitelist`, data);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        delete: (groupId, ipOrCidr) =>
            axios.delete(
                `/groups/${groupId}/whitelist/${ipOrCidr.replace('/', '%2F')}`,
            ),
    };
    api.update = api.create;

    return api;
};

module.exports = axios => projectIp(axios);

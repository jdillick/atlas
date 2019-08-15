const op = require('object-path');
const validate = require('../schemas/validate');
const schema = require('../schemas/dbUser');

const dbUsers = axios => {
    const api = {
        all: groupId => axios.get(`/groups/${groupId}/databaseUsers`),
        get: (groupId, username) =>
            axios.get(`/groups/${groupId}/databaseUsers/${username}`),
        create: async (groupId, data) => {
            try {
                // databaseName will always be admin
                op.set(data, 'databaseName', 'admin');
                const roles = op.get(data, 'roles', []);
                op.set(
                    data,
                    'roles',
                    roles.map(role => {
                        op.set(role, 'databaseName', 'admin');
                        return role;
                    }),
                );
                op.set(data, 'groupId', groupId);

                const valid = await validate(data, schema);

                return axios.post(`/groups/${groupId}/databaseUsers`, data);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        update: async (groupId, username, data) => {
            try {
                // databaseName will always be admin
                op.set(data, 'databaseName', 'admin');
                const roles = op.get(data, 'roles', []);
                op.set(
                    data,
                    'roles',
                    roles.map(role => {
                        op.set(role, 'databaseName', 'admin');
                        return role;
                    }),
                );
                op.set(data, 'groupId', groupId);
                op.set(data, 'username', username);

                const valid = await validate(data, schema);

                return axios.patch(
                    `/groups/${groupId}/databaseUsers/${username}`,
                    data,
                );
            } catch (error) {
                return Promise.reject(error);
            }
        },
        delete: (groupId, username) =>
            axios.delete(`/groups/${groupId}/databaseUsers/${username}`),
    };

    return api;
};

module.exports = axios => dbUsers(axios);

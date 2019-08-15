const validate = require('../schemas/validate');
const schema = require('../schemas/customRoles');

const customRoles = axios => {
    const api = {
        all: groupId => axios.get(`/groups/${groupId}/customDBRoles/roles`),
        get: (groupId, roleName) =>
            axios.get(`/groups/${groupId}/customDBRoles/roles/${roleName}`),
        create: async (groupId, data) => {
            try {
                const valid = await validate(data, schema);
                return axios.post(
                    `/groups/${groupId}/customDBRoles/roles`,
                    data,
                );
            } catch (errors) {
                return Promise.reject(errors);
            }
        },
        update: async (groupId, roleName, data) => {
            try {
                const valid = await validate(data, schema);
                return axios.patch(
                    `/groups/${groupId}/customDBRoles/roles/${roleName}`,
                    data,
                );
            } catch (errors) {
                return Promise.reject(errors);
            }
        },
        delete: async (groupId, roleName) =>
            axios.delete(`/groups/${groupId}/customDBRoles/roles/${roleName}`),
    };

    return api;
};

module.exports = axios => customRoles(axios);

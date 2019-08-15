const validate = require('../schemas/validate');
const schema = require('../schemas/customRoles');

const customRoles = axios => {
    const api = {
        all: groupId => axios.get(`/groups/${groupId}/customDBRoles/roles`),
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
    };

    return api;
};

module.exports = axios => customRoles(axios);

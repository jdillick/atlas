const dbUsers = axios => {
    const api = {
        all: groupId => axios.get(`/groups/${groupId}/databaseUsers`),
    };

    return api;
};

module.exports = axios => dbUsers(axios);

const root = axios => {
    const api = {
        default: () => axios.get('/'),
        apiKeys: async () => {
            const { data } = await api.default();
            const [url] = data.links
                .filter(({ rel }) => rel === 'http://mms.mongodb.com/apiKeys')
                .map(({ href, rel }) => href.replace(baseURL, ''));

            return axios.get(url);
        },
    };

    return api;
};

module.exports = axios => root(axios);

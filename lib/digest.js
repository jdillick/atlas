const axios = require('axios');
const md5 = require('js-md5');
const { sha256 } = require('js-sha256');
const { sha512, sha512_256 } = require('js-sha512');

class AxiosDigest {
    constructor(username, passwd, customAxios) {
        this.axios = customAxios !== undefined ? customAxios : axios;
        this.username = username;
        this.passwd = passwd;
    }
    set info(d) {
        this.username = d.username;
        this.passwd = d.passwd;
    }
    get info() {
        return { username: this.username, passwd: '***' };
    }
    get(path, config) {
        return this.axios
            .get(path, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'GET', path, config);
                return this.axios.get(path, c);
            });
    }
    post(path, data, config) {
        return this.axios
            .post(path, data, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'POST', path, config);
                return this.axios.post(path, data, c);
            });
    }
    put(path, data, config) {
        return this.axios
            .put(path, data, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'PUT', path, config);
                return this.axios.put(path, data, c);
            });
    }
    delete(path, config) {
        return this.axios
            .delete(path, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'DELETE', path, config);
                return this.axios.delete(path, c);
            });
    }
    head(path, config) {
        return this.axios
            .head(path, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'HEAD', path, config);
                return this.axios.head(path, c);
            });
    }
    patch(path, data, config) {
        return this.axios
            .patch(path, data, config)
            .catch(this.getWwwAuth)
            .then(wwwAuth => {
                const c = this.getAuthHeader(wwwAuth, 'PATCH', path, config);
                return this.axios.patch(path, data, c);
            });
    }
    getWwwAuth(r) {
        const { status } = r.response;
        if (status === 401) {
            return r.response.headers['www-authenticate'];
        }
        throw r;
    }
    getAuthHeader(authHeader, method, url, config) {
        const paramsString = authHeader
            .split(/\s*,?\s*Digest\s*/)
            .filter(v => v !== '');
        const paramsArray = paramsString.map(v =>
            v.split(/\s*,(?=(?:[^"]*"[^"]*")*)\s*/),
        );
        const paramsKvArray = paramsArray.map(v => {
            return v.map(value => {
                const ret = value
                    .split(/\s*=(?:(?=[^"]*"[^"]*")|(?!"))\s*/, 2)
                    .map(v2 => {
                        return v2.replace(/^"/, '').replace(/"$/, '');
                    });
                return [ret[0], ret[1]];
            });
        });
        const paramsMapArray = paramsKvArray.map(v => {
            const t = {};
            v.forEach(w => (t[w[0]] = w[1]));
            return t;
        });
        const calams = ['realm', 'nonce', 'qop', 'opaque'];
        const paramsCalamsOk = paramsMapArray
            .map(v => {
                if (!('algorithm' in v)) {
                    v['algorithm'] = 'MD5';
                }
                return v;
            })
            .filter(
                v =>
                    ['MD5', 'SHA-256', 'SHA-512-256', 'SHA-512'].findIndex(
                        i => i === v.algorithm,
                    ) >= 0,
            )
            .filter(
                v =>
                    v.qop.split(/\s*,\s*/).filter(v => v === 'auth').length !==
                    0,
            );

        if (paramsCalamsOk.length === 0) {
            throw new Error('Auth params error.');
        }
        paramsCalamsOk.sort((a, b) => {
            const [aEval, bEval] = [a.algorithm, b.algorithm].map(v => {
                if (v === 'MD5') return 0;
                if (v === 'SHA-256') return 1;
                if (v === 'SHA-512-256') return 2;
                return 3;
            });
            return bEval - aEval;
        });
        const params = paramsCalamsOk[0];
        const username = this.username;
        const passwd = this.passwd;
        const { realm, nonce, opaque, algorithm } = params;
        const uri = url.split(/^https?:\/\/[^\/]+/).filter(v => v !== '')[0];
        const cnonce = Math.random()
            .toString(32)
            .substring(2); // gaba
        const nc = '0001'; // gaba
        const qop = 'auth';
        const hashHex = (() => {
            if (algorithm === 'MD5') return md5;
            if (algorithm === 'SHA-256') return sha256;
            if (algorithm === 'SHA-512-256') return sha512_256;
            return sha512;
        })();
        const hashHexArray = data => {
            return hashHex(data.join(':'));
        };
        const a1 = [username, realm, passwd];
        const a1hash = hashHexArray(a1);
        const a2 = [method, uri];
        const a2hash = hashHexArray(a2);
        const a3 = [a1hash, nonce, nc, cnonce, qop, a2hash];
        const response = hashHexArray(a3);
        const dh = {
            realm,
            nonce,
            uri,
            username,
            cnonce,
            nc,
            qop,
            algorithm,
            response,
            opaque,
        };
        const auth = `Digest ${Object.keys(dh)
            .map(v => `${v}="${dh[v]}"`)
            .join(', ')}`;
        if (config === undefined) {
            return { headers: { Authorization: auth } };
        }
        config.headers.Authorization = auth;
        return config;
    }
}

module.exports = AxiosDigest;

# Usage

> With environment variables

```bash
export ATLAS_PUBLIC_KEY="<your atlas public key>"
export ATLAS_PRIVATE_KEY="<your atlas private key>"
```

> Import with environment variables

```js
const atlas = require('@atomic-reactor/atlas')();
```

> Import specifying credentials

```js
const atlas = require('@atomic-reactor/atlas')({
    publicKey: 'your public key',
    privateKey: 'your private key',
});
```

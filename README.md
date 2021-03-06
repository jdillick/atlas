# MongoDB Atlas API

This library seeks to implement a small subset of the [MongoDB Atlas API](https://docs.atlas.mongodb.com/reference/api-resources/).

## API Keys

> With environment variables (recommended)

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

## Limited Support

Current, this library only supports:

-   Getting the roles (groupId) associated with your api key
-   create, retrieve, update, and delete custom roles
-   create, retrieve, update, and delete db users
-   create/update, retrieve, and delete project IP whitelist entries

This is generally enough to be able to interact with your cluster meaningfully,
but let me know if you wish an API fleshed out some.

## Usage

> Using the API

```js
const atlas = require('@atomic-reactor/atlas')();

// apiKeys API
atlas.root
    .apiKeys()
    .then(({ data }) => {
        // get managing group id
        const { groupId } = data.roles.find(
            role => role.roleName === 'GROUP_CLUSTER_MANAGER',
        );
        return groupId;
    })
    .then(groupId => {
        // projectIp API

        // Get all project IP whitelist entries
        atlas.projectIp
            .all(groupId)
            .then(({ data }) => console.log({ whitelist: data }))
            .catch(error => console.error({ error }));

        // Get all project IP whitelist entries
        // page 2 (default 1), number of results 500 (max limit 500)
        atlas.projectIp
            .all(groupId, { pageNum: 2, itemsPerPage: 500 })
            .then(({ data }) => console.log({ whitelist: data }))
            .catch(error => console.error({ error }));

        // Use to create or update list of whitelist entries
        // by cidrBlock or IP Address (not both)
        atlas.projectIp
            .create(groupId, [
                {
                    cidrBlock: '167.99.160.1/20',
                    comment: 'my wan',
                },
                {
                    ipAddress: '167.99.162.12',
                    comment: 'server1',
                },
            ])
            .then(({ data }) => console.log({ whitelist: data }))
            .catch(error => console.error(error));

        // Delete a whitelist entry by ip address or cidr
        atlas.projectIp.delete(groupId, ipOrCidr).then(() => console.log('Success!'))
            .catch(error => console.error(error))

        // customRoles API

        // get all custom roles
        atlas.customRoles
            .all(groupId)
            .then(({ data }) => console.log({ roles: data }))
            .catch(error => console.error({ error }));

        // get all custom roles, page 2 (default 1), 10 results per page (maximum 500)
        atlas.customRoles
            .all(groupId, { pageNum: 2, itemsPerPage: 10 })
            .then(({ data }) => console.log({ roles: data }))
            .catch(error => console.error({ error }));

        // get a custom role
        atlas.customRoles
            .get(groupId, 'testRole')
            .then(({ data }) => console.log({ role: data }))
            .catch(error => console.error({ error }));

        // create custom role
        atlas.customRoles
            .create(groupId, {
                actions: [
                    {
                        action: 'ENABLE_PROFILER',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'DROP_DATABASE',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'RENAME_COLLECTION_SAME_DB',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'DB_STATS',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'LIST_COLLECTIONS',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                ],
                inheritedRoles: [
                    {
                        db: 'testDatabase',
                        role: 'read',
                    },
                    {
                        db: 'testDatabase',
                        role: 'dbAdmin',
                    },
                    {
                        db: 'testDatabase',
                        role: 'readWrite',
                    },
                ],
                roleName: 'testRole2',
            })
            .then(({ data }) => console.log({ role: data }))
            .catch(error => console.error(error));

        // update a custom role
        atlas.customRoles
            .update(groupId, 'testRole2', {
                actions: [
                    {
                        action: 'ENABLE_PROFILER',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'DROP_DATABASE',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'RENAME_COLLECTION_SAME_DB',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'DB_STATS',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                    {
                        action: 'LIST_COLLECTIONS',
                        resources: [
                            {
                                collection: '',
                                db: 'testDatabase',
                            },
                        ],
                    },
                ],
                inheritedRoles: [
                    {
                        db: 'testDatabase',
                        role: 'read',
                    },
                    {
                        db: 'testDatabase',
                        role: 'dbAdmin',
                    },
                    {
                        db: 'testDatabase',
                        role: 'readWrite',
                    },
                ],
                roleName: 'testRole2',
            })
            .then(({ data }) => console.log({ role: data }))
            .catch(error => console.error(error));

        // dbusers API

        // get all users
        atlas.dbUsers
            .all(groupId)
            .then(({ data }) => console.log({ users: data }))
            .catch(error => console.error({ error }));

        // get all users
        // page 2 (default 1), 500 results per page (max limit 500)
        atlas.dbUsers
            .all(groupId, { pageNum: 2, itemsPerPage = 500})
            .then(({ data }) => console.log({ users: data }))
            .catch(error => console.error({ error }));

        // get a users
        atlas.dbUsers
            .get(groupId, 'testUser2')
            .then(({ data }) => console.log({ user: data }))
            .catch(error => console.error({ error }));

        // create a user
        atlas.dbUsers
            .create(groupId, {
                username: 'testUser2',
                password: 'ljkdflkjdsflkjsdflkj',
                roles: [
                    {
                        roleName: 'testRole2',
                    },
                ],
            })
            .then(({ data }) => console.log({ user: data }))
            .catch(error => console.error(error));

        // update a user
        atlas.dbUsers
            .update(groupId, 'testUser2', {
                password: '@newpassword4testUser2',
                roles: [
                    {
                        roleName: 'testRole2',
                    },
                ],
            })
            .then(({ data }) => console.log({ user: data }))
            .catch(error => console.error(error));

        // delete a user
        atlas.dbUsers
            .delete(groupId, 'testUser2')
            .then(({ data }) => console.log({ user: data }))
            .catch(error => console.error(error));
    });
```

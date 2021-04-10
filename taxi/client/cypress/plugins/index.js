const knex = require('knex');

module.exports = (on, config) => {
    on('task', {
        async tableTruncate ({ table }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client.raw(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
        },

        async tableInsert ({ table, rows, truncate }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            if (truncate) {
                await client.raw(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
            }
            return client.insert(rows, ['id']).into(table);
        },

        async tableDeleteUser (username) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            const run = new Promise(function(resolve, reject) {
                client.raw(`DELETE FROM trips_user_groups WHERE user_id = 10`)
                client.raw(`DELETE FROM trips_user WHERE username = ${username}`)
                resolve(null)
            })


            return run.then(result => result)
        },

        async tableSelect ({ table }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client.select().table(table);
        },

        async tableSelectUser ({ table, username }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client.select().table(table);
        }
    });

}
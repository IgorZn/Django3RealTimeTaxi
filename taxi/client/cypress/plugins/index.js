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
            // knex('accounts')
            //   .where('activated', false)
            //   .del()
            // Outputs:
            // delete from `accounts` where `activated` = false

            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client('username').where('username', username).del();
        },

        async tableSelect ({ table }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client.select().table(table);
        }
    });

}
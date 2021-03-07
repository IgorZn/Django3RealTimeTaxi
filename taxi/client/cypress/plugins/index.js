const knex = require('knex');

const fs = require("fs-extra");
const path = require("path");

function getConfigurationByFile(file) {
    const pathToConfigFile = path.resolve(`cypress.cfg.${file}.json`);

    return fs.readJson(pathToConfigFile);
}


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
        async tableSelect ({ table }) {
            const client = await knex({
                client: 'pg',
                connection: config.env.database
            });
            return client.select().table(table);
        }
    });
    const file = config.env.configFile || 'docker';

    return getConfigurationByFile(file)

}
exports.up = async function(knex) {
    await knex.schema.table('incidents', (table) => {
        table.boolean('ai_verified').notNullable().defaultTo(true);
    });

    // Ensure spatial indexes exist for location and indoor_location
    await knex.raw('CREATE INDEX IF NOT EXISTS incidents_location_gist ON incidents USING GIST (location)');
    await knex.raw('CREATE INDEX IF NOT EXISTS incidents_indoor_location_gist ON incidents USING GIST (indoor_location)');
};

exports.down = async function(knex) {
    await knex.schema.table('incidents', (table) => {
        table.dropColumn('ai_verified');
    });

    await knex.raw('DROP INDEX IF EXISTS incidents_location_gist');
    await knex.raw('DROP INDEX IF EXISTS incidents_indoor_location_gist');
};
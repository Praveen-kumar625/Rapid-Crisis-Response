/**
 * Add AI Explainability and Fail-safe fields to Incidents
 */

exports.up = async function(knex) {
    await knex.schema.alterTable('incidents', (table) => {
        table.text('ai_reasoning');
        table.boolean('is_ai_verified').defaultTo(false);
        table.integer('latency_ms').defaultTo(0);
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable('incidents', (table) => {
        table.dropColumn('ai_reasoning');
        table.dropColumn('is_ai_verified');
        table.dropColumn('latency_ms');
    });
};

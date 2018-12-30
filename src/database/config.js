module.exports = {
    es_config: {
        host: 'esgotado.app/elasticsearch',
        auth: `${process.env.ES_USR}:${process.env.ES_PSS}`,
        protocol: 'https',
        log     : "trace",
    }
}
const {Client} = require('virtuoso-sparql-client')
const config = require('../../config/virtuoso')

const localClient = new Client('http://' + config.host + ':' + config.port + '/sparql')
localClient.setDefaultFormat('application/json')
localClient.setDefaultPrefixes(config.prefixes)
localClient.setDefaultGraph('http://' + config.host + ':' + config.port + '/' + config.defaultGraph)

module.exports = localClient
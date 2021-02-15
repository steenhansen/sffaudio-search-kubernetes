
 require('../common-node/global-require');

var express = require('express');
var graph_constants = rootAppRequire('common-node/graph-constants');
const program_variables = rootAppRequire('common-node/program-variables.js');
const serverResponse = rootAppRequire('common-node/check-start/server-responses');
var compression = require('compression');
var app = express();

app.use(express.static('public', {maxAge: '1y'}))
app.use(serverResponse.corsAll);
app.use(compression());

app.get(graph_constants.CRON_NEW_DB_VERSION, function (req, res, next) {
    console.log('\n  \033[92m  ***** CRON_NEW_DB_VERSION START !!!!  \033[0m  \n');
    var {cronBuildData} =rootAppRequire('update__db/cron-new-db-version-81');
    cronBuildData();
    res.send('Updating the Neo4j database to a new version');
   console.log('\n  \033[92m  ***** CRON_NEW_DB_VERSION END !!!!  \033[0m  \n');
})

app.get('*', function (req, res) {
    console.log('\n  \033[92m  ***** in cron-sever.js  \033[0m  \n');
    res.send('hi there from cron-server-81.js');
})

app.set('port', process.env.INSIDE_CRON_PORT_8181)  
var node_port = app.get('port')
app.listen(node_port).on('error', function (e) {
    console.log(e)
    process.exit()
})

console.log('\n  \033[92m  ***BOOT** cron-server ending  \033[0m  \n');
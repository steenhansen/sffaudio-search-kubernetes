

var express = require('express');


var graph_constants = rootAppRequire('common-node/graph-constants');


var graph_db = rootAppRequire('common-node/neo4j-graph-db')(graph_constants.NEO4J_VERSION);
var VersionRepository = rootAppRequire('common-node/build-nodes/graph-dbs/version-repository')(graph_db);
global.glb_current_db_version = -1;

function rebootOnNewVersion(){
    VersionRepository.currentDbVersion()
    .then((current_db_version)=> {
        serverResponse.clearFromReload();                          // erase the caches
        if (global.glb_current_db_version === -1) {
            global.glb_current_db_version =current_db_version;
        } else if (global.glb_current_db_version !== current_db_version) {
            if (process.env.DOCKER_RUN_ENVIRONMENT!='yes'){
                process.exit(1);        // we are in Kubernetes, let Kubernetes restart webserver
            }
        }
    })
}






const program_variables = rootAppRequire('common-node/program-variables.js');
const serverResponse = rootAppRequire('common-node/check-start/server-responses');
var compression = require('compression');

var app = express();

app.use(express.static('public', {maxAge: '1y'}))
app.use(serverResponse.corsAll);
app.use(compression());

global.gbl_restart_web_server = false;



// N.B. this route is called by nightly cron job to reset the author/book/default caches
app.get(graph_constants.ROUTE_ERASE_CACHES, function (req, res, next) {
    serverResponse.clearFromReload()
        .then((erase_response_arr)=> {
            var cache_clear_resp = erase_response_arr[0]
            res.send(cache_clear_resp);
        })
        .catch(next)
        .finally(function() { rebootOnNewVersion(); });
})


app.get(graph_constants.ROUTE_WAKE_UP, function (req, res, next) {
    serverResponse.wakeUpSleepingDb()
        .then((db_version)=> {
            var wake_up_message = "<h6>current db version = " + db_version +"</h6>"      // so Clojure's Enlive can count 
            res.send(wake_up_message)
        })
        .catch(next)
        .finally(function() { rebootOnNewVersion(); });
})


app.get(graph_constants.ROUTE_POST_PROXY, function (req, res, next) {
    const sff_url_post = req.query.absolute_url;
    serverResponse.sffAudioPostPiece(sff_url_post)
        .then((sff_post_html)=> {
            res.send(sff_post_html)
        })
        .catch(next)
        .finally(function() { rebootOnNewVersion(); });
})


app.get(program_variables.ROUTE_BOOK_JSON, function (req, res, next) {
    let {strip_author, under_title}=req.params
    serverResponse.bookJson(strip_author, under_title)
        .then((book_json)=> {
            res.json(book_json)
        })
        .catch(next)
        .finally(function() { rebootOnNewVersion(); });
})

app.get(program_variables.ROUTE_AUTHOR_JSON, function (req, res, next) {
    let {strip_author}=req.params;
    serverResponse.authorJson(strip_author)
        .then((author_json)=> {
            res.json(author_json)
        })
        .catch(next)
        .finally(function() { rebootOnNewVersion(); });
})


app.get('/', function (req, res, next) {
    var req_query = req.query;
///    localhost:5000/?wordpress-start=philip-k-dick
    if (typeof req_query['wordpress-start'] !== 'undefined') {
        let php_search = req_query['wordpress-start'];
        serverResponse.fromWordpress(php_search)
            .then((author_book_html)=> res.send(author_book_html))
            .catch(next)
            .finally(function() { rebootOnNewVersion(); });
    } else if (typeof req_query['author'] === 'undefined') {
        serverResponse.initialDefaultPage(req_query)
            .then((default_html)=> res.send(default_html))
            .catch(next)
            .finally(function() { rebootOnNewVersion(); });
    } else {
        serverResponse.bookOrAuthorPage(req_query)
            .then((author_book_html)=> res.send(author_book_html))
            .catch(next)       
            .finally(function() { rebootOnNewVersion(); });
    }
})

app.get('*', function (req, res) {
    console.log('\n  \033[92m  ***** in web-sever.js wildcard  \033[0m  \n');
    
    res.redirect('/');
})

console.log('port =========  ', process.env.INSIDE_HTML_PORT_8080)

app.set('port', process.env.INSIDE_HTML_PORT_8080)
var node_port = app.get('port')
app.listen(node_port).on('error', function (e) {
    console.log(e)
    process.exit()
})

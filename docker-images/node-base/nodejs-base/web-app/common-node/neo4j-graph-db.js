'use strict'

var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

var graph_constants = rootAppRequire('common-node/graph-constants')

var UNRESPONSIVE_DB_MESS = {
    "records": [{
        "keys": [
            "n_author",
            "v_db_version"
        ],
        "length": 2,
        "_fields": [
            {
                "identity": {},
                "labels": [
                    "L_AUTHOR"         // expected for all json calls
                ],
                "properties": {
                    "author_name": graph_constants.UNRESPONSIVE_DB_NAME,
                }
            },
            42
        ],
        "_fieldLookup": {
            "n_author": 0,
            "v_db_version": 1
        }
    }
    ]
};

var DELAY_AFTER_SQL_1 = 1000;
var DELAY_AFTER_SQL_2 = 2000;

module.exports = function (version_num) {

    const neo4j_session = rootAppRequire('common-node/neo4j-database');

    function sqlParams(sql, params) {
        var sql_1 = sql; // + ' make an error happen 1 ';
        var sql_2 = sql; // + ' make an error happen 2 ';
        var sql_3 = sql; // + ' make an error happen 3';

        return neo4j_session.run(sql_1, params)
            .then((result)=> {
                return result
            })
            .catch(async function (error) {
                console.log('NEO4J - 1 :', error.code, params, sql_1);
                await new Promise(done => setTimeout(done, DELAY_AFTER_SQL_1));
                return neo4j_session.run(sql_2, params)
                    .then((result)=> {
                        return result
                    })
                    .catch(async function (error) {
                        console.log('NEO4J - 2 :', error.code, params, sql_2);
                        await new Promise(done => setTimeout(done, DELAY_AFTER_SQL_2));
                        return neo4j_session.run(sql_3, params)
                            .then((result)=> {
                                return result
                            })
                            .catch(function (error) {
                                console.log('NEO4J - 3 :', error.code, params, sql_3);
                                var new_result = UNRESPONSIVE_DB_MESS;
                                return new_result
                            });
                    });
            });
    }

    function checkDbAlive() {
        var test_sql = ` WITH "neo4j is alive" AS alive_test
                       RETURN alive_test `;
       return neo4j_session.run(test_sql)
    }

    return {sqlParams, checkDbAlive};

}

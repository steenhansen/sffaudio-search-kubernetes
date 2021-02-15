'use strict'

    var {PKD_ADJUSTMENT_TEAM_DATA } = rootAppRequire('the-tests/test-locations')


function stringToObject(file_name) {
    var text_json = rootAppRequire(file_name);
    var no_tabs_json = text_json.replace(/\s/g, "");
    var json_object = JSON.parse(no_tabs_json);
    return json_object;
}
 function testResolve(test_json_results){  
        var pron = new Promise((resolve, reject) => {
                var json_object = stringToObject(test_json_results)
                resolve(json_object);
            });
            return pron;
    }

function sqlParams(test_sql, test_params) {         

    if (test_sql.includes(`adsfasdPostNode.saveBookPost`)) {
        let {strip_author, under_title}= test_params
        if (strip_author == 'philip_k_dick' && under_title == 'adjustment_team') {
            return testResolve(PKD_ADJUSTMENT_TEAM_DATA);
        } else {
        }
    } else if (test_sql.includes('AuthorNode.getAuthorsNodes_1')) {
       let {strip_author}= test_params
        if (strip_author == 'philip_k_dick') {
            var pron = new Promise((resolve, reject) => {
                var json_object = stringToObject(`the-tests/unit-test/mock-db-data/AuthorNode.getAuthorsNodes_1-philip_k_dick`)
                resolve(json_object);
            });
            return pron;
        } else {
        }
    }else if (test_sql.includes('PostNode.saveBookPost')) {
       let {strip_author}= test_params
        if (strip_author == 'philip_k_dick') {
            var pron = new Promise((resolve, reject) => {
                var json_object = stringToObject(`the-tests/unit-test/mock-db-data/AuthorNode.getAuthorsNodes_2-philip_k_dick`)
                resolve(json_object);
            });
            return pron;
        } else {
        }


    }else if (test_sql.includes('AuthorNode.getAuthorsNodes_3')) {
       let {strip_author}= test_params
        if (strip_author == 'philip_k_dick') {
            var pron = new Promise((resolve, reject) => {
                var json_object = stringToObject(`the-tests/unit-test/mock-db-data/AuthorNode.getAuthorsNodes_3-philip_k_dick`)
                resolve(json_object);
            });
            return pron;
        } else {
        }


    }
}

function deleteAll() {
}



function checkDbAlive() {
    console.log('in test')
}


module.exports = {sqlParams, deleteAll, checkDbAlive};

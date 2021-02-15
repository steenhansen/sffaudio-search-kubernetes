
 require('../common-node/global-require');

 console.log('\n  \033[92m  ***CRON** db-init started  \033[0m  \n');

var reload_db = rootAppRequire('common-node/build-nodes/graph-dbs/reload-url-db');

function cronBuildData(){
            reload_db.buildData() 
            .catch(function (error) {
                   console.log('##################################### - 1 :', error.code);
                  })
                }
console.log('\n  \033[92m  ***CRON** db-init end  \033[0m   \n');

module.exports = {
  
  cronBuildData
};
